export const STAGES = [
  {
    id: "fetch",
    label: "Receiving the manuscript",
    blurb: "Your paper arrives at the press",
    ms: 6000,
  },
  {
    id: "extract",
    label: "Reading every page",
    blurb: "Text, figures, tables — nothing left behind",
    ms: 10000,
  },
  {
    id: "structure",
    label: "Re-setting the argument",
    blurb: "Sections and citations find their places",
    ms: 18000,
  },
  {
    id: "render",
    label: "Binding the edition",
    blurb: "Type, figures and motion, set with care",
    ms: 12000,
  },
] as const;

export const TOTAL_MS = STAGES.reduce((acc, s) => acc + s.ms, 0);

interface JobSeed {
  title: string;
  createdAt: number;
}

export function encodeJob(seed: JobSeed): string {
  const raw = JSON.stringify(seed);
  return btoa(encodeURIComponent(raw))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function decodeJob(jobId: string): JobSeed | null {
  try {
    const b64 = jobId.replace(/-/g, "+").replace(/_/g, "/");
    const raw = decodeURIComponent(atob(b64));
    const parsed = JSON.parse(raw);
    if (typeof parsed?.title === "string" && typeof parsed?.createdAt === "number") {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function deriveTitle(source?: string): string {
  const value = (source ?? "").trim();
  if (!value) return "Untitled manuscript";
  const arxivMatch = value.match(/arxiv\.org\/(?:abs|pdf)\/([^\s?#]+)/i);
  if (arxivMatch) return `arXiv:${arxivMatch[1]}`;
  if (/^\d{4}\.\d{4,5}(v\d+)?$/.test(value)) return `arXiv:${value}`;
  return value.length > 120 ? `${value.slice(0, 117)}…` : value;
}

export function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/^arxiv:/, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60)
    .replace(/-+$/, "");
  return base || "paper";
}

export interface JobProgress {
  status: "running" | "complete";
  stageIndex: number;
  stagePct: number;
  overallPct: number;
  etaMs: number;
  title: string;
  paperUrl: string;
}

export function getProgress(jobId: string): JobProgress | null {
  const seed = decodeJob(jobId);
  if (!seed) return null;

  const elapsed = Date.now() - seed.createdAt;

  let stageIndex = STAGES.length - 1;
  let consumed = 0;
  for (let i = 0; i < STAGES.length; i++) {
    if (elapsed < consumed + STAGES[i].ms) {
      stageIndex = i;
      break;
    }
    consumed += STAGES[i].ms;
  }

  const done = elapsed >= TOTAL_MS;
  const inStage = Math.min(Math.max(elapsed - consumed, 0), STAGES[stageIndex].ms);
  const stagePct = done ? 100 : Math.round((inStage / STAGES[stageIndex].ms) * 100);
  const overallPct = done
    ? 100
    : Math.round(((consumed + inStage) / TOTAL_MS) * 100);

  const title = deriveTitle(seed.title);
  const slug = slugify(title);

  return {
    status: done ? "complete" : "running",
    stageIndex,
    stagePct,
    overallPct,
    etaMs: Math.max(TOTAL_MS - elapsed, 0),
    title,
    paperUrl: `/paper/${slug}?t=${encodeURIComponent(title)}`,
  };
}
