import type { ReactNode } from "react";

/* Citations resolve: arXiv ids, DOIs and bare URLs in edition prose become
   real links. Author-year mentions stay plain text (no reference map yet). */

const CITE_RE =
  /(arXiv[:\s]?\d{4}\.\d{4,5}(?:v\d+)?)|(\b10\.\d{4,9}\/[^\s)\],;]+)|(https?:\/\/[^\s)\]]+)/gi;

function hrefFor(match: string): string {
  if (/^arxiv/i.test(match)) {
    return `https://arxiv.org/abs/${match.replace(/^arxiv[:\s]?/i, "")}`;
  }
  if (/^10\./.test(match)) return `https://doi.org/${match}`;
  return match;
}

export function CiteText({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(CITE_RE)) {
    const idx = m.index ?? 0;
    if (idx > last) parts.push(text.slice(last, idx));
    parts.push(
      <a
        key={idx}
        href={hrefFor(m[0])}
        target="_blank"
        rel="noreferrer"
        className="underline decoration-dotted underline-offset-[3px] transition-colors duration-300"
        style={{ color: "var(--accent)" }}
      >
        {m[0]}
      </a>,
    );
    last = idx + m[0].length;
  }
  if (parts.length === 0) return text;
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
