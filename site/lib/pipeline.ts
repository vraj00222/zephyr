import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { mistralChatJson, mistralOcr } from "@/lib/mistral";
import { buildPressPrompt } from "@/lib/press-prompt";
import { deriveTitle, slugify, STAGES } from "@/lib/jobs";
import type { Block, Section, ShowcasePaper } from "@/lib/types";

/* The real press: Mistral OCR -> Mistral chat restructure -> edition JSON on
   disk. Jobs live in memory (globalThis survives dev hot-reload); editions in
   data/papers/, figure crops in public/figures/{jobId}/. */

interface RealJob {
  title: string;
  status: "running" | "complete" | "failed";
  stageIndex: number;
  stageStartedAt: number;
  slug?: string;
  error?: string;
}

// ponytail: in-memory job store — restart loses progress, disk keeps editions
const jobs: Map<string, RealJob> = ((
  globalThis as { __zephyrJobs?: Map<string, RealJob> }
).__zephyrJobs ??= new Map());

const STAGE_BUDGET_MS = [4000, 45000, 150000, 35000];

const PAPERS_DIR = path.join(process.cwd(), "data", "papers");
const FIGURES_DIR = path.join(process.cwd(), "public", "figures");

export function startRealJob(input: {
  source?: string;
  pdfBase64?: string;
}): { jobId: string; title: string } {
  const jobId = `press-${randomBytes(6).toString("hex")}`;
  const title = deriveTitle(input.source || "Uploaded manuscript");
  jobs.set(jobId, {
    title,
    status: "running",
    stageIndex: 0,
    stageStartedAt: Date.now(),
  });
  void runPipeline(jobId, input).catch((err: unknown) => {
    const job = jobs.get(jobId);
    if (!job) return;
    job.status = "failed";
    const stage = STAGES[job.stageIndex]?.label.toLowerCase() ?? "working";
    const detail = err instanceof Error ? err.message : String(err);
    job.error = `The press jammed while ${stage}. (${detail.slice(0, 160)})`;
  });
  return { jobId, title };
}

function enterStage(jobId: string, stageIndex: number) {
  const job = jobs.get(jobId);
  if (!job) return;
  job.stageIndex = stageIndex;
  job.stageStartedAt = Date.now();
}

async function runPipeline(
  jobId: string,
  input: { source?: string; pdfBase64?: string },
) {
  // stage 0 — receive: resolve a document URL Mistral OCR can read
  let documentUrl: string;
  const source = (input.source ?? "").trim();
  const arxivId =
    source.match(/arxiv\.org\/(?:abs|pdf)\/([^\s?#]+?)(?:\.pdf)?$/i)?.[1] ??
    (/^\d{4}\.\d{4,5}(v\d+)?$/.test(source) ? source : null);
  if (input.pdfBase64) {
    documentUrl = `data:application/pdf;base64,${input.pdfBase64}`;
  } else if (arxivId) {
    documentUrl = `https://arxiv.org/pdf/${arxivId}`;
  } else if (/^https?:\/\//i.test(source)) {
    documentUrl = source;
  } else {
    throw new Error(
      "Give me an arXiv link or a PDF — title search isn't wired yet.",
    );
  }

  // stage 1 — read: OCR to markdown + figure crops
  enterStage(jobId, 1);
  const pages = (await mistralOcr(documentUrl)) ?? [];
  const markdown = pages
    .map((p) => p.markdown)
    .join("\n\n")
    .slice(0, 120_000); // ponytail: hard cap instead of chunking; fine <60pp

  const figureIds: string[] = [];
  const figDir = path.join(FIGURES_DIR, jobId);
  await mkdir(figDir, { recursive: true });
  for (const page of pages) {
    for (const img of page.images ?? []) {
      const b64 = img.image_base64?.split(",")[1];
      if (!b64 || !img.id || !/^[\w.-]+$/.test(img.id)) continue;
      await writeFile(path.join(figDir, img.id), Buffer.from(b64, "base64"));
      figureIds.push(img.id);
    }
  }

  // stage 2 — restructure: Mistral chat -> edition JSON (one retry: it's demo day)
  enterStage(jobId, 2);
  const system = buildPressPrompt(figureIds, jobId);
  type Draft = Omit<ShowcasePaper, "slug" | "readingTime">;
  let draft: Draft;
  try {
    draft = await mistralChatJson<Draft>(system, markdown);
  } catch {
    draft = await mistralChatJson<Draft>(system, markdown);
  }

  // stage 3 — bind: normalize, proofread, slug, persist
  enterStage(jobId, 3);
  const paper = bindEdition(draft, jobId, figureIds, arxivId ?? "");
  await proofreadAndRepair(paper, markdown, jobId, figureIds, arxivId ?? "");
  await mkdir(PAPERS_DIR, { recursive: true });
  await writeFile(
    path.join(PAPERS_DIR, `${paper.slug}.json`),
    JSON.stringify(paper, null, 2),
  );

  const job = jobs.get(jobId);
  if (job) {
    job.slug = paper.slug;
    job.title = paper.title;
    job.status = "complete";
  }
}

/* second model cross-checks the edition's factual claims against the OCR
   text, then a repair pass fixes what it flags — the anti-hallucination loop.
   Non-fatal throughout: a failed proofread never blocks the edition. */
async function proofreadAndRepair(
  paper: ShowcasePaper,
  markdown: string,
  jobId: string,
  figureIds: string[],
  arxivId: string,
) {
  let checked: number;
  let discrepancies: { claim: string; issue: string }[];
  try {
    const result = await mistralChatJson<{
      checked: number;
      discrepancies: { claim: string; issue: string }[];
    }>(
      `You are a press proofreader. Compare a typeset edition of a research paper
against the original OCR text. Verify every checkable factual claim in the
edition (numbers, results, names, datasets, methods) against the original.
Flag ONLY hard factual contradictions: a number that differs from the original,
a wrong name/dataset/method attribution, or a claim the original states
oppositely. Do NOT flag paraphrase, simplification, omitted detail, reordering,
or formatting differences — the edition is a deliberate rewrite.
Respond with ONLY JSON: {"checked": <number of claims you verified>,
"discrepancies": [{"claim": "...", "issue": "..."}]} — empty array if faithful.`,
      `ORIGINAL (OCR):\n${markdown.slice(0, 60_000)}\n\nEDITION:\n${JSON.stringify(paper.sections).slice(0, 40_000)}`,
      "mistral-small-latest",
    );
    if (typeof result?.checked !== "number") return;
    checked = result.checked;
    discrepancies = Array.isArray(result.discrepancies)
      ? result.discrepancies
      : [];
  } catch {
    return;
  }

  if (discrepancies.length === 0) {
    paper.proofread = { checked, flagged: 0 };
    return;
  }

  try {
    const fixed = await mistralChatJson<{ sections: Section[] }>(
      `You are the press corrector. You receive the sections of a typeset edition,
a list of factual discrepancies against the original text, and an excerpt of
the original. Return ONLY JSON {"sections": [...]} — the FULL sections array
in the exact same schema, with ONLY the listed discrepancies corrected to
match the original. Change nothing else.`,
      `DISCREPANCIES:\n${JSON.stringify(discrepancies)}\n\nORIGINAL (OCR):\n${markdown.slice(0, 50_000)}\n\nEDITION SECTIONS:\n${JSON.stringify(paper.sections).slice(0, 40_000)}`,
    );
    const rebound = bindEdition(
      { ...paper, sections: fixed.sections },
      jobId,
      figureIds,
      arxivId,
    );
    paper.sections = rebound.sections;
    paper.proofread = { checked, flagged: 0, corrected: discrepancies.length };
  } catch {
    paper.proofread = { checked, flagged: discrepancies.length };
  }
}

const BLOCK_TYPES = new Set([
  "p",
  "h3",
  "bullets",
  "quote",
  "callout",
  "explain",
  "image",
  "stats",
]);

function bindEdition(
  draft: Omit<ShowcasePaper, "slug" | "readingTime">,
  jobId: string,
  figureIds: string[],
  arxivId: string,
): ShowcasePaper {
  const sections: Section[] = (draft.sections ?? [])
    .filter((s) => s && Array.isArray(s.blocks))
    .map((s, i) => ({
      id: slugify(s.id || s.title || `section-${i + 1}`),
      number: s.number || String(i + 1),
      title: s.title || "Untitled section",
      blocks: s.blocks.filter((b): b is Block => {
        if (!b || !BLOCK_TYPES.has(b.type)) return false;
        if (b.type === "image") {
          const id = b.src?.split("/").pop() ?? "";
          if (!figureIds.includes(id)) return false;
          b.src = `/figures/${jobId}/${id}`; // re-anchor whatever path the model wrote
        }
        return true;
      }),
    }))
    .filter((s) => s.blocks.length > 0);
  if (sections.length === 0) {
    throw new Error("the restructured edition came back empty");
  }

  const words = JSON.stringify(sections).split(/\s+/).length;
  const title = draft.title || "Untitled edition";
  let slug = slugify(title);
  if (slug === "attention-is-all-you-need") slug = `${slug}-live`; // keep canned showcase intact

  return {
    slug,
    title,
    authors: Array.isArray(draft.authors) ? draft.authors : [],
    venue: draft.venue || "arXiv preprint",
    arxiv: draft.arxiv || arxivId,
    readingTime: `${Math.max(3, Math.round(words / 220))} min read`,
    tldr: draft.tldr || "",
    abstract: draft.abstract || "",
    sections,
  };
}

export function getRealJob(jobId: string) {
  const job = jobs.get(jobId);
  if (!job) return null;
  if (job.status === "failed") {
    return { status: "failed" as const, error: job.error ?? "Unknown fault." };
  }
  if (job.status === "complete") {
    return {
      status: "complete" as const,
      title: job.title,
      paperUrl: `/paper/${job.slug}`,
    };
  }
  const budget = STAGE_BUDGET_MS[job.stageIndex];
  const inStage = Date.now() - job.stageStartedAt;
  const stagePct = Math.min(95, Math.round((inStage / budget) * 100));
  const spent = STAGE_BUDGET_MS.slice(0, job.stageIndex).reduce(
    (a, b) => a + b,
    0,
  );
  const total = STAGE_BUDGET_MS.reduce((a, b) => a + b, 0);
  return {
    status: "running" as const,
    stageIndex: job.stageIndex,
    stagePct,
    overallPct: Math.min(
      97,
      Math.round(((spent + Math.min(inStage, budget)) / total) * 100),
    ),
    etaMs: Math.max(total - spent - inStage, 15_000),
    title: job.title,
  };
}

export function isRealJobId(jobId: string): boolean {
  return jobId.startsWith("press-");
}

export async function loadLocalPaper(
  slug: string,
): Promise<ShowcasePaper | null> {
  if (!/^[\w-]+$/.test(slug)) return null;
  try {
    const raw = await readFile(path.join(PAPERS_DIR, `${slug}.json`), "utf8");
    return JSON.parse(raw) as ShowcasePaper;
  } catch {
    return null;
  }
}
