"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Block, ShowcasePaper } from "@/lib/types";

/* accent series — dots and small labels only, never large fills */
const ACCENTS = ["#fa500f", "#2e4788", "#5aa8cc", "#f2b03d"];
const INDIGO = "#2e4788";
const HAIRLINE = "#e5e0d5";

function Dot({ color = ACCENTS[0], size = 3.5 }: { color?: string; size?: number }) {
  return (
    <span
      className="inline-block shrink-0 rounded-full"
      style={{ width: size, height: size, background: color }}
    />
  );
}

/* hairline rule with dot terminals */
function Rule() {
  return (
    <div className="flex items-center gap-2.5">
      <Dot size={3} />
      <span className="h-px flex-1" style={{ background: HAIRLINE }} />
      <Dot size={3} />
    </div>
  );
}

export function PaperPoster({
  paper,
  posterArt,
}: {
  paper: ShowcasePaper;
  posterArt?: string;
}) {
  const blocks = paper.sections.flatMap((s) => s.blocks);
  const image = blocks.find(
    (b): b is Extract<Block, { type: "image" }> => b.type === "image",
  );
  const statsBlocks = blocks.filter(
    (b): b is Extract<Block, { type: "stats" }> => b.type === "stats",
  );
  // prefer real result numbers over formula-shaped stats
  const stats =
    statsBlocks.find((b) =>
      b.items.every((i) => /\d/.test(i.value) && i.value.length <= 12),
    ) ?? statsBlocks[0];
  const meta = paper.meta;
  const fieldShort = meta?.field.split("·")[0]?.trim() || "Research";
  const hardPart =
    meta && meta.readerIssue.text
      ? meta.readerIssue.text.slice(0, 100).trimEnd() +
        (meta.readerIssue.text.length > 100 ? "…" : "")
      : null;
  const art = posterArt ?? paper.posterArt;

  return (
    <div className="min-h-dvh bg-paper px-4 py-16 font-serif text-ink">
      <div aria-hidden className="desk-grid pointer-events-none fixed inset-0" />
      <Link
        href={`/paper/${paper.slug}`}
        className="fixed top-6 left-6 z-10 rounded-full border border-ink/10 bg-white px-4 py-2 font-mono text-[10px] tracking-[0.18em] text-mist uppercase transition-colors duration-500 ease-out-expo hover:text-ink"
      >
        ← Back to the edition
      </Link>

      <motion.article
        initial={{ opacity: 0, rotateY: -68, x: -40 }}
        animate={{ opacity: 1, rotateY: 0, x: 0 }}
        transition={{ duration: 1.1, ease: [0.32, 0.72, 0, 1] }}
        className="mx-auto origin-left border bg-white p-7 shadow-[0_16px_60px_rgba(0,0,0,0.09)] sm:p-14"
        style={{
          maxWidth: "min(92vw, 880px)",
          borderColor: HAIRLINE,
          transformPerspective: 1400,
          transformStyle: "preserve-3d",
        }}
      >
        {/* 1 — kicker */}
        <p
          className="text-center font-mono text-[12px] tracking-[0.2em] uppercase"
          style={{ color: INDIGO }}
        >
          {meta?.field ?? paper.venue}
        </p>

        {/* 2 — title block */}
        <h1 className="mt-7 text-center text-[clamp(40px,6vw,64px)] leading-[1.05] font-medium tracking-[-0.02em] text-balance">
          {paper.title}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-center text-[18px] leading-[1.55] text-ink/70 text-balance">
          {paper.tldr}
        </p>
        <p className="mt-6 truncate text-center font-mono text-[10px] tracking-[0.12em] text-mist uppercase">
          {paper.authors.join(" · ")}
        </p>

        {/* meta strip */}
        <div
          className="mt-8 grid grid-cols-3 divide-x border-y"
          style={{ borderColor: HAIRLINE }}
        >
          {[
            ["Published", paper.venue],
            ["Field", fieldShort],
            ["Read time", paper.readingTime],
          ].map(([label, value]) => (
            <div
              key={label}
              className="px-3 py-3 text-center"
              style={{ borderColor: HAIRLINE }}
            >
              <p className="font-mono text-[9px] tracking-[0.2em] text-mist uppercase">
                {label}
              </p>
              <p className="mt-1 truncate text-[14px] text-ink/85">{value}</p>
            </div>
          ))}
        </div>

        {/* 3 — hero art */}
        <div className="mt-10">
          {art ? (
            <figure>
              {/* generated art carries its own (garbled) title band up top —
                  crop it; our typeset title above is the real one */}
              <div className="overflow-hidden">
                <Image
                  src={art}
                  alt={paper.posterCaption ?? paper.tldr}
                  width={1600}
                  height={1200}
                  unoptimized
                  priority
                  className="h-auto w-full"
                />
              </div>
              <p className="mx-auto mt-4 max-w-md text-center text-[11.5px] leading-relaxed text-mist">
                {paper.posterCaption ?? paper.tldr}
              </p>
            </figure>
          ) : image ? (
            <figure
              className="rounded-lg border px-6 pt-5 pb-5"
              style={{ borderColor: HAIRLINE }}
            >
              <figcaption className="text-center font-mono text-[10px] tracking-[0.2em] text-mist uppercase">
                {image.label ?? "The figure"}
              </figcaption>
              <Image
                src={image.src}
                alt={image.caption}
                width={760}
                height={500}
                unoptimized
                className="mx-auto mt-4 h-auto rounded-sm"
                style={{
                  width: "min(100%, 560px)",
                  /* engraving-ink duotone, 1kpapers style */
                  filter:
                    "grayscale(1) sepia(0.45) hue-rotate(190deg) saturate(1.5) contrast(1.05)",
                }}
              />
              <p className="mx-auto mt-4 max-w-md text-center text-[11.5px] leading-relaxed text-mist">
                {image.caption}
              </p>
            </figure>
          ) : (
            <blockquote className="mx-auto max-w-xl px-4 py-6 text-center text-[18px] leading-[1.7] text-ink/80 italic">
              “{paper.abstract}”
            </blockquote>
          )}
        </div>

        {/* 4 — findings strip */}
        <div className="mt-10 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          <div className="rounded-lg border p-4" style={{ borderColor: HAIRLINE }}>
            <p className="font-mono text-[8.5px] tracking-[0.2em] text-mist uppercase">
              Key numbers
            </p>
            {stats ? (
              <div className="mt-3 space-y-2.5">
                {stats.items.slice(0, 3).map((item, i) => (
                  <div key={i}>
                    <p className="text-[20px] leading-none tracking-tight text-ink">
                      {item.value}
                    </p>
                    <p className="mt-1 truncate font-mono text-[8.5px] tracking-[0.12em] text-mist uppercase">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-[10.5px] leading-relaxed text-mist">
                {paper.tldr}
              </p>
            )}
          </div>

          <div
            className="rounded-lg border p-4 text-center"
            style={{ borderColor: HAIRLINE }}
            title="The press's importance score — novelty and consequence, not popularity"
          >
            <p className="font-mono text-[8.5px] tracking-[0.2em] text-mist uppercase">
              Importance
            </p>
            {meta ? (
              <>
                <p className="mt-3 text-[20px] leading-none font-medium">
                  {meta.importance.score}
                  <span className="text-[13px] text-mist">/10</span>
                </p>
                <p className="mt-2.5 text-[10.5px] leading-relaxed text-mist">
                  {meta.importance.verdict}
                </p>
              </>
            ) : (
              <p className="mt-3 text-left text-[10.5px] leading-relaxed text-mist">
                {paper.tldr}
              </p>
            )}
          </div>

          <div className="rounded-lg border p-4" style={{ borderColor: HAIRLINE }}>
            <p
              className="font-mono text-[8.5px] tracking-[0.2em] uppercase"
              style={{ color: ACCENTS[0] }}
            >
              The hard part
            </p>
            {meta && hardPart ? (
              <>
                <p className="mt-3 text-[12px] leading-snug font-medium text-ink/85">
                  {meta.readerIssue.title}
                </p>
                <p className="mt-1.5 text-[10.5px] leading-relaxed text-mist">
                  {hardPart}
                </p>
              </>
            ) : (
              <p className="mt-3 text-[10.5px] leading-relaxed text-mist">
                {paper.abstract.slice(0, 140).trimEnd()}…
              </p>
            )}
          </div>
        </div>

        {/* 5 — brand footer */}
        <div className="mt-12">
          <Rule />
          <p className="mt-6 text-center font-mono text-[10px] tracking-[0.24em] text-ink/70 uppercase">
            Zéphyr — Papers people actually read
          </p>
          <p className="mt-2 text-center font-mono text-[9px] tracking-[0.2em] text-mist uppercase">
            Pressed by Mistral
          </p>
          {paper.proofread &&
            paper.proofread.flagged <= paper.proofread.checked * 0.4 && (
              <p className="mt-1.5 text-center font-mono text-[9px] tracking-[0.18em] text-mist uppercase">
                Proofread · {paper.proofread.checked} claims checked
              </p>
            )}
        </div>
      </motion.article>
    </div>
  );
}
