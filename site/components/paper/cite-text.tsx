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

/* Octavo tier: passages the press lifted verbatim arrive wrapped in «…» and
   print on a wash of the press ink so the reader knows it is source text. */
export function EditionText({ text }: { text: string }) {
  const segs = text.split(/«([^»]*)»/g); // odd indices are verbatim passages
  if (segs.length === 1) return <CiteText text={text} />;
  return (
    <>
      {segs.map((s, i) =>
        !s ? null : i % 2 === 1 ? (
          <mark
            key={i}
            title="The paper's own words"
            className="rounded-[3px] px-[3px] py-[1px] text-inherit"
            style={{
              background: "color-mix(in srgb, var(--accent) 13%, transparent)",
            }}
          >
            <CiteText text={s} />
          </mark>
        ) : (
          <CiteText key={i} text={s} />
        ),
      )}
    </>
  );
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
