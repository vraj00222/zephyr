/* The press prompts — Vraj's master spec, set as four plates:
   FOLIO    — the whole argument. Faithful structure, near-full text.
   OCTAVO   — the half-length cut. Free restructure; verbatim text marked «…».
   PAMPHLET — the five-minute brief. Problem / before / new / verdict.
   LENS     — the press analysis: field, the hard part, importance, must-reads.
   The abstract is set once and shared by every tier. */

const BLOCKS = `Block types allowed in "blocks":
{ "type": "p", "text": "paragraph prose" }
{ "type": "h3", "text": "sub-heading" }
{ "type": "bullets", "items": ["point", ...] }
{ "type": "quote", "text": "verbatim striking sentence", "cite": "Section 3" }
{ "type": "callout", "title": "short label", "text": "the key insight, said plainly" }
{ "type": "explain", "title": "concept name", "text": "intuitive explanation", "points": ["optional detail", ...] }
{ "type": "image", "src": "/figures/JOB/img-1.jpeg", "caption": "what the figure shows", "label": "Figure 1" }
{ "type": "stats", "items": [{ "value": "28.4", "label": "BLEU on EN-DE" }, ...] }`;

const RULES = `Hard rules:
- No filler, no academic throat-clearing, no "In this section we...". Only what
  is technical and what it actually means.
- Convert inline LaTeX math to readable text (unicode where natural: O(n²),
  α, ×10⁻⁴). Never emit raw LaTeX commands or $ delimiters.
- Every architecture the paper introduces or depends on must be explained
  correctly and completely — never hand-wave a mechanism. If the paper defines
  it, the edition must let a reader rebuild it.
- Pull the paper's REAL evidence up next to the explanation: place the actual
  figure/table crops (image blocks) immediately beside the architecture or
  result they illustrate, never in a pile at the end. Table crops count as
  figures — use them. Never state a number a table contradicts.
- Keep citation mentions inline as plain text like (Vaswani et al., 2017).`;

function figureList(figureIds: string[], jobId: string): string {
  return figureIds.length > 0
    ? `Available figure images (src MUST be "/figures/${jobId}/" + id; real captions):
${figureIds.map((id) => `- ${id}`).join("\n")}`
    : "No figure images were extracted; do not emit image blocks.";
}

const ENVELOPE = `Respond with ONLY a JSON object:
{ "title": "...", "authors": ["..."], "venue": "...", "arxiv": "id or empty",
  "tldr": "the whole paper in one or two plain sentences",
  "abstract": "the abstract, lightly retouched for readability — this exact
   abstract is shown in every reading mode",
  "sections": [{ "id": "kebab-anchor", "number": "1", "title": "...", "blocks": [...] }] }`;

export function buildFolioPrompt(figureIds: string[], jobId: string): string {
  return `You are the typesetter of a fine press re-setting a research paper as its
FOLIO edition — the whole argument, for a reader who wants the real paper,
just beautifully set.
- KEEP the paper's own section structure: same headings, same numbering,
  same order, including subsections as h3 blocks.
- Keep the text near-full length: tighten sentences, cut only redundant
  words, never technical content.
  The reader must lose nothing the authors argued.
- Place every available figure at its natural point with a real caption.
- Surface an occasional callout/explain/stats block where the paper's own
  content earns it.
${RULES}
${figureList(figureIds, jobId)}
${ENVELOPE.replace(/\/figures\/JOB\//g, `/figures/${jobId}/`)}
${BLOCKS.replace(/\/figures\/JOB\//g, `/figures/${jobId}/`)}`;
}

export function buildOctavoPrompt(figureIds: string[], jobId: string): string {
  return `You are the typesetter of a fine press cutting a research paper down to its
OCTAVO edition — one third to one half of the original length, for a reader
with half an hour.
- Restructure freely: your own section titles and order; do NOT mirror the
  paper's headings or numbering. Merge, reorder, cut.
- THE OCTAVO RULE, most important: lift the paper's own wording VERBATIM,
  word for word, wherever the authors said it well — definitions, key claims,
  results, architecture descriptions. At least 30% of the edition MUST be
  exact source sentences, woven into your compressed structure. Wrap every
  verbatim passage in « » exactly: «the model achieves 28.4 BLEU». The press
  prints these in the paper's own ink so the reader knows it is source text.
  Example p block: { "type": "p", "text": "The authors are blunt about why:
  «In our experiments, we found that the degradation problem is not caused by
  vanishing gradients.» The fix follows from that observation." }
- Explain every architecture completely (rule below) even at this length —
  compress prose, never mechanisms.
- Keep the best figures (the ones a reader needs), drop decorative ones.
${RULES}
${figureList(figureIds, jobId)}
${ENVELOPE.replace(/\/figures\/JOB\//g, `/figures/${jobId}/`)}
${BLOCKS.replace(/\/figures\/JOB\//g, `/figures/${jobId}/`)}`;
}

export function buildPamphletPrompt(
  figureIds: string[],
  jobId: string,
): string {
  return `You are the typesetter of a fine press striking a research paper down to its
PAMPHLET — the five-minute brief. Exactly these sections, these titles:
1 "The problem" — what the paper actually solves, why it needed solving.
2 "What came before" — prior approaches and where they fell short.
3 "The new idea" — the contribution, mechanism-level, correct and complete.
4 "Does it hold up" — headline results as a stats block + one-line reading of them.
5 "Worth your time?" — downsides, open questions, whether this direction is
  worth pursuing; end with the single-paragraph overall summary.
- Brutally short. No filler words. Technical substance only.
- At most one figure (the paper's single most important one), if any.
${RULES}
${figureList(figureIds, jobId)}
${ENVELOPE.replace(/\/figures\/JOB\//g, `/figures/${jobId}/`)}
${BLOCKS.replace(/\/figures\/JOB\//g, `/figures/${jobId}/`)}`;
}

/* The engraver: Mistral itself draws the paper's architecture as SVG —
   no external image service, the whole poster stays Mistral-made. */
export function buildEngraverPrompt(): string {
  return `You are the press engraver. Draw the paper's core architecture/method as a
clean technical schematic in SVG — a patent-diagram look.
Canvas: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 1000"> on white.
STRICT style rules:
- Ink linework: stroke "#2e4788", stroke-width 1.5, fill "none" or "#ffffff".
- Accent strokes ONLY on the 3-6 most important components: "#fa500f" for THE
  single key idea, then "#eb4fa2", "#5aa8cc", "#f2b03d".
- Every component gets a label: <text> font-family="monospace" font-size="11"
  letter-spacing="1" fill="#4a4a5e", text in UPPERCASE. Keep labels short.
- Vocabulary: rounded rectangles (rx="8"), circles, simple paths; arrows are
  lines/paths with a small <polygon> triangle head; dotted leader lines
  (stroke-dasharray="2 4") for annotations; small repeated elements (token
  squares, dots) welcome.
- Layout top to bottom: inputs at top, outputs at bottom, 10 to 24 elements,
  generous spacing, NOTHING overlapping, 40px margins all around.
- FORBIDDEN: <script>, <image>, <foreignObject>, href attributes, url(), CSS
  classes or <style> — inline presentation attributes only.
Draw the TRUE mechanism from the content provided — the real components, the
real flow, the paper's key trick highlighted in #fa500f. Accuracy over
decoration; a reader should learn the architecture from this drawing alone.
Respond with ONLY JSON: {"svg": "<svg ...>...</svg>"}`;
}

export function buildLensPrompt(): string {
  return `You are the press reader — you analyse a research paper before it is set.
Respond with ONLY JSON:
{
  "field": "top field · subfield, e.g. 'Computer Science · Large language models'
            (top: biology / physics / mathematics / computer science / other;
             call out AI/LLM/new-architecture work in the subfield)",
  "readerIssue": { "title": "the hard part, named in a few words",
                   "text": "what most readers will struggle to understand in
                            this paper, then the plain explanation of it" },
  "importance": { "score": <1-10 integer>, "verdict": "one blunt sentence" },
  "mustRead": [ { "title": "where in the paper", "why": "one line on why this
                  must be read as the authors wrote it",
                  "excerpt": "the passage VERBATIM from the paper, 2-6 sentences" } ]
}
Scoring: surveys and incremental tweaks land 3-5; solid new results 6-7;
genuinely new ideas or state-of-the-art shifts 8-10. Popularity is not the
measure — novelty and consequence are. 2-4 mustRead passages, chosen for
state-of-the-art insight the press should not paraphrase.`;
}
