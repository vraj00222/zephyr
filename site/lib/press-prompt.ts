/* The restructuring prompt — the heart of the press. PLACEHOLDER tier system:
   Vraj is writing the real "big prompt"; when it lands, slot it into FULL and
   derive LITE from it. The schema contract below must survive any rewrite. */

const SCHEMA = `Respond with ONLY a JSON object of this exact shape:
{
  "title": "paper title, plain text",
  "authors": ["Full Name", ...],
  "venue": "venue or 'arXiv preprint' if unknown",
  "arxiv": "arXiv id like 2401.12345, or empty string",
  "tldr": "one to two sentences, the whole paper in plain words",
  "abstract": "the abstract rewritten to be readable, 2-4 sentences",
  "sections": [
    {
      "id": "kebab-case-anchor",
      "number": "1",
      "title": "Section title",
      "blocks": [
        { "type": "p", "text": "paragraph prose" },
        { "type": "h3", "text": "sub-heading" },
        { "type": "bullets", "items": ["point", ...] },
        { "type": "quote", "text": "verbatim striking sentence from the paper", "cite": "Section 3" },
        { "type": "callout", "title": "short label", "text": "the key insight, said plainly" },
        { "type": "explain", "title": "concept name", "text": "intuitive explanation", "points": ["optional detail", ...] },
        { "type": "image", "src": "/figures/JOB/img-1.jpeg", "caption": "what the figure shows", "label": "Figure 1" },
        { "type": "stats", "items": [{ "value": "28.4", "label": "BLEU on EN-DE" }, ...] }
      ]
    }
  ]
}`;

const VOICE = `You are the typesetter of a small fine press that re-sets dense research
papers into beautiful, readable editions. Work like an editor, not a summarizer:
- Keep the paper's full argument and structure; merge only trivial subsections.
- Rewrite prose to be direct and readable. Short sentences. No academic filler.
- Convert inline LaTeX math to readable text (use unicode where natural, e.g.
  "O(n^2)" -> "O(n²)"). Never emit raw LaTeX commands or $ delimiters.
- Every 2-3 sections, surface one "callout" (the key insight) or "explain"
  (a concept a smart non-specialist needs) or "stats" block (headline numbers).
- Use "quote" sparingly - only genuinely striking sentences, quoted verbatim.
- Keep citation mentions inline in prose as plain text like (Vaswani et al., 2017).`;

export function buildPressPrompt(figureIds: string[], jobId: string): string {
  const figures =
    figureIds.length > 0
      ? `\nAvailable figure images (place each at its natural point in the text as an
"image" block; src MUST be "/figures/${jobId}/" + the id; write a real caption):
${figureIds.map((id) => `- ${id}`).join("\n")}`
      : "\nNo figure images were extracted; do not emit image blocks.";

  return `${VOICE}\n${figures}\n\n${SCHEMA.replace(/\/figures\/JOB\//g, `/figures/${jobId}/`)}`;
}
