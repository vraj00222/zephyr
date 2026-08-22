"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Block, ShowcasePaper } from "@/lib/types";

/* accent series — dots and small labels only, never large fills */
const ACCENTS = ["#fa500f", "#2e4788", "#5aa8cc", "#f2b03d"];
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

export function PaperPoster({ paper }: { paper: ShowcasePaper }) {
  const blocks = paper.sections.flatMap((s) => s.blocks);
  const image = blocks.find(
    (b): b is Extract<Block, { type: "image" }> => b.type === "image",
  );
  const stats = blocks.find(
    (b): b is Extract<Block, { type: "stats" }> => b.type === "stats",
  );
  const meta = paper.meta;
  const chips = meta?.mustRead.slice(0, 4) ?? [];
  const fieldShort = meta?.field.split("·")[0]?.trim() || "Research";
  const hardPart =
    meta && meta.readerIssue.text
      ? meta.readerIssue.text.slice(0, 100).trimEnd() +
        (meta.readerIssue.text.length > 100 ? "…" : "")
      : null;

  return (
    <div className="min-h-dvh bg-paper px-4 py-10 font-serif text-ink sm:py-14">
      <div className="mx-auto max-w-[720px]">
        <Link
          href={`/paper/${paper.slug}`}
          className="font-mono text-[10px] tracking-[0.18em] text-mist uppercase transition-colors duration-500 ease-out-expo hover:text-ink"
        >
          ← Back to the edition
        </Link>

        <motion.article
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
          className="mt-5 flex min-h-[1000px] flex-col border bg-white p-7 shadow-[0_12px_40px_rgba(0,0,0,0.08)] sm:p-12"
          style={{ borderColor: HAIRLINE }}
        >
          {/* 1 — kicker */}
          <p
            className="text-center font-mono text-[11px] tracking-[0.2em] uppercase"
            style={{ color: ACCENTS[0] }}
          >
            {meta?.field ?? paper.venue}
          </p>
          <div className="mt-5">
            <Rule />
          </div>

          {/* 2 — title block */}
          <h1 className="mt-9 text-center text-[clamp(34px,5vw,56px)] leading-[1.06] font-medium tracking-[-0.02em] text-balance">
            {paper.title}
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-center font-mono text-[10px] leading-relaxed tracking-[0.12em] text-mist uppercase">
            {paper.authors.join(" · ")}
          </p>
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
                className="px-3 py-4 text-center"
                style={{ borderColor: HAIRLINE }}
              >
                <p className="font-mono text-[9px] tracking-[0.2em] text-mist uppercase">
                  {label}
                </p>
                <p className="mt-1.5 truncate text-[15px] text-ink/85">{value}</p>
              </div>
            ))}
          </div>

          {/* 3 — hero */}
          <div className="mt-9 flex-1">
            {image ? (
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
                  style={{ width: "min(100%, 360px)" }}
                />
                <p className="mx-auto mt-4 max-w-md text-center text-[11px] leading-relaxed text-mist">
                  {image.caption}
                </p>
              </figure>
            ) : (
              <blockquote className="mx-auto max-w-xl px-4 py-6 text-center text-[18px] leading-[1.7] text-ink/80 italic">
                “{paper.abstract}”
              </blockquote>
            )}

            {chips.length > 0 && (
              <div
                className="mt-5 ml-1 border-l border-dotted pl-4"
                style={{ borderColor: "rgba(250, 80, 15, 0.5)" }}
              >
                <p className="font-mono text-[9px] tracking-[0.2em] text-mist uppercase">
                  Read these as written
                </p>
                <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {chips.map((m, i) => (
                    <div
                      key={i}
                      className="flex min-w-0 items-start gap-2.5 rounded-lg border px-3.5 py-2.5"
                      style={{ borderColor: HAIRLINE }}
                    >
                      <span className="mt-[5px]">
                        <Dot color={ACCENTS[i % ACCENTS.length]} />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-mono text-[10px] font-medium text-ink/80">
                          {m.title}
                        </p>
                        <p className="mt-0.5 truncate font-sans text-[10px] text-mist">
                          {m.why}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4 — findings strip */}
          <div className="mt-9 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            <div className="rounded-lg border px-4 py-4" style={{ borderColor: HAIRLINE }}>
              <p className="font-mono text-[8.5px] tracking-[0.2em] text-mist uppercase">
                Key numbers
              </p>
              {stats ? (
                <div className="mt-3 space-y-3">
                  {stats.items.slice(0, 3).map((item, i) => (
                    <div key={i}>
                      <p className="text-[22px] leading-none tracking-tight text-ink">
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
              className="rounded-lg border px-4 py-4 text-center"
              style={{ borderColor: HAIRLINE }}
              title="The press's importance score — novelty and consequence, not popularity"
            >
              <p className="font-mono text-[8.5px] tracking-[0.2em] text-mist uppercase">
                Importance
              </p>
              {meta ? (
                <>
                  <p className="mt-3 text-[40px] leading-none font-medium">
                    {meta.importance.score}
                    <span className="text-[17px] text-mist">/10</span>
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

            <div className="rounded-lg border px-4 py-4" style={{ borderColor: HAIRLINE }}>
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

          {/* 5 — footer */}
          <div className="mt-10">
            <div className="h-px" style={{ background: HAIRLINE }} />
            <div className="mt-[3px] h-px" style={{ background: HAIRLINE }} />
            <p className="mt-6 flex items-center justify-center gap-2.5 font-mono text-[9px] tracking-[0.24em] text-ink/70 uppercase">
              Zéphyr
              <Dot size={3} />
              Pressed by Mistral
            </p>
            {paper.proofread && (
              <p className="mt-2 text-center font-mono text-[9px] tracking-[0.18em] text-mist uppercase">
                Proofread · {paper.proofread.checked} claims checked
              </p>
            )}
          </div>
        </motion.article>
      </div>
    </div>
  );
}
