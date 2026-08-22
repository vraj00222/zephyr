"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import type { Block, PaperMode, ShowcasePaper } from "@/lib/types";
import { EditionText } from "@/components/paper/cite-text";
import { AskEdition } from "@/components/paper/ask-edition";
import {
  ModeSwitcher,
  ModeContext,
  modeContextValue,
  usePaperMode,
} from "@/components/paper/mode";
import { AttentionFigure, BleuFigure, LossFigure } from "@/components/paper/figures";
import { RelatedEditions } from "@/components/paper/related-editions";
import { SelectionAsk } from "@/components/paper/selection-ask";

/* real compression numbers, measured against the manuscript's OCR text */
function pressStatLine(
  mode: PaperMode,
  stats: ShowcasePaper["pressStats"],
): string | null {
  if (!stats || !stats.originalChars) return null;
  const pct = (n: number) => Math.round((n / stats.originalChars) * 100);
  if (mode === "folio")
    return stats.folioChars
      ? `The whole argument · re-set from a ${Math.round(stats.originalChars / 1000)}k-character manuscript`
      : null;
  if (mode === "octavo")
    return stats.octavoChars
      ? `${100 - pct(stats.octavoChars)}% shorter than the manuscript`
      : null;
  return stats.briefChars
    ? `${100 - pct(stats.briefChars)}% shorter — the five-minute brief`
    : null;
}

const FIGURES = {
  loss: LossFigure,
  bleu: BleuFigure,
  attention: AttentionFigure,
} as const;

function FigureBlock({ block }: { block: Extract<Block, { type: "figure" }> }) {
  const Figure = FIGURES[block.figure];
  const { animate } = usePaperMode();

  return (
    <figure className="group my-10">
      <div
        className="rounded-[1.4rem] bg-white p-[1px] ring-1 ring-ink/[0.08] transition-shadow duration-700 ease-out-expo group-hover:shadow-[0_24px_60px_-30px_rgba(23,21,18,0.25)]"
      >
        <div className="rounded-[calc(1.4rem-1px)] bg-paper px-6 pt-7 pb-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.18em] text-mist uppercase">
              {block.label}
            </span>
            <span className="h-px flex-none px-8">
              <span
                className={`block h-px w-full ${animate ? "flourish-line" : ""}`}
                style={{ background: "var(--accent)" }}
              />
            </span>
          </div>
          <Figure />
          <figcaption className="mx-auto mt-4 max-w-md text-center text-[12.5px] leading-relaxed text-mist">
            {block.caption}
          </figcaption>
        </div>
      </div>
    </figure>
  );
}

function Blocks({ blocks }: { blocks: Block[] }) {
  const { mode, animate: ornate } = usePaperMode();
  /* the first paragraph of each section opens with a drop cap (not in the brief) */
  const dropCapIndex =
    mode === "pamphlet" ? -1 : blocks.findIndex((b) => b.type === "p");

  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p
                key={i}
                className={`mt-6 text-[16.5px] leading-[1.85] text-[#161310] first:mt-0 ${
                  i === dropCapIndex
                    ? "first-letter:float-left first-letter:mt-1 first-letter:pr-2 first-letter:font-serif first-letter:text-[52px] first-letter:leading-[0.85] first-letter:text-(--accent)"
                    : ""
                }`}
              >
                <EditionText text={block.text} />
              </p>
            );
          case "h3":
            return (
              <h3 key={i} className="mt-12 text-[21px] font-medium tracking-tight text-ink">
                {block.text}
              </h3>
            );
          case "bullets":
            return (
              <ul key={i} className="mt-6 space-y-3">
                {block.items.map((item, j) => (
                  <li key={j} className="flex gap-3 text-[15.5px] leading-relaxed text-[#161310]">
                    <span
                      className="mt-[0.72em] h-1 w-1 shrink-0 rounded-full"
                      style={{ background: "var(--accent)" }}
                    />
                    <span><EditionText text={item} /></span>
                  </li>
                ))}
              </ul>
            );
          case "quote":
            return ornate ? (
              <blockquote key={i} className="my-10 pl-6" style={{ borderLeft: "2px solid var(--accent)" }}>
                <p className="font-serif text-[22px] leading-snug italic text-ink/90">
                  “{block.text}”
                </p>
                {block.cite && (
                  <cite className="mt-3 block font-mono text-[10.5px] tracking-widest text-mist not-italic uppercase">
                    {block.cite}
                  </cite>
                )}
              </blockquote>
            ) : (
              <blockquote
                key={i}
                className="my-8 border-l-2 border-ink/20 pl-5 text-[15px] leading-relaxed text-ink/65 italic"
              >
                “{block.text}”{block.cite ? ` — ${block.cite}` : ""}
              </blockquote>
            );
          case "callout":
            return ornate ? (
              <aside
                key={i}
                className="my-9 rounded-2xl p-6"
                style={{ background: "var(--accent-soft)", border: "1px solid var(--accent-soft)" }}
              >
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--accent)" }}>
                  {block.title}
                </p>
                <p className="mt-2.5 text-[14.5px] leading-relaxed text-ink/75">{block.text}</p>
              </aside>
            ) : (
              <aside key={i} className="my-8 border-y border-ink/10 py-5">
                <p className="text-[11px] font-semibold tracking-[0.14em] text-ink/60 uppercase">
                  {block.title}
                </p>
                <p className="mt-2 text-[14px] leading-relaxed text-ink/70">{block.text}</p>
              </aside>
            );
          case "figure":
            return <FigureBlock key={i} block={block} />;
          case "image":
            return (
              <figure key={i} className="group my-10">
                <div className="rounded-[1.4rem] bg-white p-[1px] ring-1 ring-ink/[0.08] transition-shadow duration-700 ease-out-expo group-hover:shadow-[0_24px_60px_-30px_rgba(23,21,18,0.25)]">
                  <div className="rounded-[calc(1.4rem-1px)] bg-paper px-6 pt-7 pb-5">
                    {block.label && (
                      <span className="mb-4 block font-mono text-[10px] tracking-[0.18em] text-mist uppercase">
                        {block.label}
                      </span>
                    )}
                    {/* backend-served figure — arbitrary host, so a plain img */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={block.src}
                      alt={block.caption}
                      loading="lazy"
                      className="mx-auto h-auto max-w-full rounded-lg"
                    />
                    <figcaption className="mx-auto mt-4 max-w-md text-center text-[12.5px] leading-relaxed text-mist">
                      {block.caption}
                    </figcaption>
                  </div>
                </div>
              </figure>
            );
          case "stats":
            return (
              <div key={i} className="mt-9 grid grid-cols-1 gap-[1px] overflow-hidden rounded-2xl bg-ink/[0.08] sm:grid-cols-3">
                {block.items.map((stat, j) => (
                  <div key={j} className="bg-white px-6 py-6 text-center sm:bg-paper">
                    <p className="font-serif text-[30px] leading-none tracking-tight" style={{ color: "var(--accent)" }}>
                      {stat.value}
                    </p>
                    <p className="mt-2 font-mono text-[10px] tracking-[0.16em] text-mist uppercase">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            );
          default:
            return null;
        }
      })}
    </>
  );
}

export function PaperViewer({
  paper,
  artPlate,
}: {
  paper: ShowcasePaper;
  artPlate?: string;
}) {
  const [mode, setMode] = useState<PaperMode>("folio");
  const [activeSection, setActiveSection] = useState(paper.sections[0]?.id);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });

  /* each mode reads a different cut of the edition; older editions
     fall back to the folio for all three */
  const sections =
    mode === "octavo" && paper.condensed?.length
      ? paper.condensed
      : mode === "pamphlet" && paper.brief?.length
        ? paper.brief
        : paper.sections;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sections]);

  return (
    <ModeContext.Provider value={modeContextValue(mode)}>
      <div data-mode={mode} className="min-h-dvh bg-paper font-serif text-ink">
        <div aria-hidden className="desk-grid pointer-events-none fixed inset-0" />
        <motion.div
          className="fixed top-0 right-0 left-0 z-40 h-[2px] origin-left"
          style={{ scaleX: progress, background: "var(--accent)" }}
        />

        <header className="sticky top-0 z-30 border-b border-ink/[0.07] bg-paper/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <Link href="/" className="flex items-center gap-2 text-[13px] font-sans font-medium text-ink/70 transition-colors duration-500 ease-out-expo hover:text-ink">
              <span className="flame-tile flex h-5 w-5 items-center justify-center rounded-[6px] font-serif text-[11px] font-semibold text-white italic">
                Z
              </span>
              Zéphyr
            </Link>
            <p className="hidden min-w-0 flex-1 truncate text-center text-[13px] italic text-mist md:block">
              {paper.title}
            </p>
            <div className="flex items-center gap-2.5">
              <Link
                href={`/paper/${paper.slug}/poster`}
                title="The edition as a single poster sheet"
                className="hidden rounded-full border border-ink/10 bg-white px-3.5 py-[7px] text-[11px] font-medium tracking-wide text-ink/45 shadow-[0_2px_12px_rgba(23,21,18,0.06)] transition-colors duration-500 ease-out-expo hover:text-ink/75 sm:block"
              >
                Poster
              </Link>
              <ModeSwitcher mode={mode} onChange={setMode} />
            </div>
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 pt-16 pb-28 sm:px-6 xl:grid-cols-[200px_minmax(0,1fr)_40px] xl:gap-14">
          <aside className="hidden xl:block">
            <nav className="sticky top-24 space-y-1">
              <p className="mb-4 font-sans font-mono text-[9.5px] tracking-[0.22em] text-mist uppercase">
                Contents
              </p>
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className={`block rounded-lg px-3 py-2 text-left text-[13px] leading-snug transition-colors duration-500 ease-out-expo ${
                    activeSection === section.id
                      ? "bg-[var(--accent-soft)] font-medium"
                      : "text-mist hover:text-ink"
                  }`}
                  style={
                    activeSection === section.id
                      ? { color: "var(--accent)" }
                      : undefined
                  }
                >
                  <span className="mr-2 font-mono text-[10px] opacity-60">{section.number}</span>
                  {section.title}
                </a>
              ))}
              <div className="mt-6 border-t border-ink/[0.07] pt-5">
                <p className="px-3 font-mono text-[10px] tracking-wide text-mist">{paper.readingTime}</p>
              </div>
            </nav>
          </aside>

          <article className="min-w-0">
            {/* the white sheet — the edition set like a printed page on the cream desk */}
            <div className="mx-auto w-full max-w-[820px] rounded-sm border border-[#e8e4da] bg-white px-10 py-14 shadow-[0_12px_48px_rgba(22,19,16,0.07)] sm:px-16">
            <header>
              <p className="font-sans font-mono text-[10.5px] tracking-[0.22em] uppercase" style={{ color: "var(--accent)" }}>
                Beautified edition · {paper.arxiv}
              </p>
              <h1 className="mt-5 text-[clamp(2.1rem,4.6vw,3.4rem)] leading-[1.04] font-medium tracking-[-0.02em] text-balance">
                {paper.title}
              </h1>
              <p className="mt-6 max-w-xl text-[13.5px] leading-relaxed text-mist">
                {paper.authors.length > 10
                  ? `${paper.authors.slice(0, 10).join(" · ")} · et al. (${paper.authors.length} authors)`
                  : paper.authors.join(" · ")}
              </p>
              <p className="mt-1.5 text-[12px] text-mist/80">{paper.venue}</p>
              {/* an inconclusive proofread (math-heavy papers) stays silent */}
              {paper.proofread &&
                paper.proofread.flagged <= paper.proofread.checked * 0.4 && (
                <p
                  className="mt-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[9.5px] tracking-[0.18em] uppercase"
                  style={{
                    color: "var(--accent)",
                    borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)",
                    background: "color-mix(in srgb, var(--accent) 6%, transparent)",
                  }}
                  title="A second model verified this edition's claims against the original text"
                >
                  ✓ Proofread against the original · {paper.proofread.checked}{" "}
                  claims checked
                  {(paper.proofread.corrected ?? 0) > 0 &&
                    ` · ${paper.proofread.corrected} corrected in press`}
                  {paper.proofread.flagged > 0 &&
                    ` · ${paper.proofread.flagged} flagged`}
                </p>
              )}

              {(pressStatLine(mode, paper.pressStats) || paper.arxiv) && (
                <div className="mt-4 flex flex-wrap items-baseline gap-x-5 gap-y-1.5">
                  {pressStatLine(mode, paper.pressStats) && (
                    <p className="font-mono text-[10px] tracking-[0.16em] text-mist uppercase">
                      {pressStatLine(mode, paper.pressStats)}
                    </p>
                  )}
                  {paper.arxiv && (
                    <a
                      href={`https://arxiv.org/abs/${paper.arxiv}`}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-[10px] tracking-[0.12em] hover:underline"
                      style={{ color: "var(--accent)" }}
                    >
                      Read the original ↗
                    </a>
                  )}
                </div>
              )}

              <div className="mt-9 rounded-2xl border border-ink/[0.08] bg-paper/50 px-7 py-6">
                <p className="font-sans font-mono text-[9.5px] tracking-[0.22em] text-mist uppercase">
                  TL;DR
                </p>
                <p className="mt-2.5 text-[16px] leading-relaxed text-ink/80">{paper.tldr}</p>
              </div>

              {paper.meta && (
                <div className="mt-5 rounded-2xl border border-ink/[0.08] bg-paper/35 px-7 py-6">
                  <div className="flex flex-wrap items-start justify-between gap-5">
                    <div className="min-w-0">
                      <p className="font-sans font-mono text-[9.5px] tracking-[0.22em] text-mist uppercase">
                        Press notes
                      </p>
                      <p
                        className="mt-2.5 font-sans font-mono text-[10.5px] tracking-[0.14em] uppercase"
                        style={{ color: "var(--accent)" }}
                      >
                        {paper.meta.field}
                      </p>
                      {paper.meta.importance.verdict && (
                        <p className="mt-2 max-w-md text-[13.5px] leading-relaxed text-ink/70">
                          {paper.meta.importance.verdict}
                        </p>
                      )}
                    </div>
                    <div
                      className="text-right"
                      title="The press's importance score — novelty and consequence, not popularity"
                    >
                      <p className="font-serif text-[38px] leading-none font-medium">
                        {paper.meta.importance.score}
                        <span className="text-[17px] text-mist">/10</span>
                      </p>
                      <p className="mt-1 font-sans font-mono text-[8.5px] tracking-[0.22em] text-mist uppercase">
                        Importance
                      </p>
                    </div>
                  </div>

                  {paper.meta.readerIssue.text && (
                    <div
                      className="mt-5 rounded-xl px-5 py-4"
                      style={{ background: "var(--accent-soft)" }}
                    >
                      <p
                        className="font-sans font-mono text-[9px] tracking-[0.2em] uppercase"
                        style={{ color: "var(--accent)" }}
                      >
                        The hard part · {paper.meta.readerIssue.title}
                      </p>
                      <p className="mt-2 text-[13.5px] leading-relaxed text-ink/75">
                        {paper.meta.readerIssue.text}
                      </p>
                    </div>
                  )}

                  {paper.meta.mustRead.length > 0 && (
                    <div className="mt-5">
                      <p className="font-sans font-mono text-[9px] tracking-[0.2em] text-mist uppercase">
                        Read these as written
                      </p>
                      <div className="mt-2 divide-y divide-ink/[0.06]">
                        {paper.meta.mustRead.map((m, i) => (
                          <details key={i} className="group py-2.5">
                            <summary className="flex cursor-pointer list-none items-baseline gap-2.5 text-[13.5px] text-ink/80 transition-colors duration-300 hover:text-ink [&::-webkit-details-marker]:hidden">
                              <span
                                className="font-mono text-[10px] transition-transform duration-300 group-open:rotate-90"
                                style={{ color: "var(--accent)" }}
                              >
                                ▸
                              </span>
                              <span className="font-medium">{m.title}</span>
                              <span className="min-w-0 flex-1 truncate text-[12px] text-mist">
                                {m.why}
                              </span>
                            </summary>
                            <blockquote
                              className="mt-3 mb-1 ml-5 border-l-2 pl-4 font-serif text-[14.5px] leading-relaxed text-ink/75 italic"
                              style={{ borderColor: "var(--accent)" }}
                            >
                              “{m.excerpt}”
                            </blockquote>
                          </details>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-10">
                <p className="text-[13px] font-semibold tracking-wide">Abstract</p>
                <p className="mt-3 text-[15.5px] leading-[1.8] text-ink/70 italic">{paper.abstract}</p>
              </div>

              {artPlate && mode !== "pamphlet" && (
                <figure className="mt-10">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] tracking-[0.18em] uppercase" style={{ color: "var(--accent)" }}>
                      The architecture · press engraving
                    </span>
                    <span className="font-mono text-[8.5px] tracking-[0.14em] text-mist uppercase">
                      Illustrative — the paper&rsquo;s own figures follow
                    </span>
                  </div>
                  <div className="mt-4 overflow-hidden rounded-lg border border-[#e8e4da]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={artPlate}
                      alt="The press's engraving of the paper's architecture"
                      className="h-auto w-full"
                    />
                  </div>
                </figure>
              )}
            </header>

            <div className="my-12 h-px bg-gradient-to-r from-transparent via-ink/15 to-transparent" />

            {sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24 pb-4 last:pb-0">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-[13px]" style={{ color: "var(--accent)" }}>
                    {section.number}
                  </span>
                  <h2 className="text-[27px] leading-tight font-medium tracking-tight">
                    {section.title}
                  </h2>
                </div>
                <div className="mt-5">
                  <Blocks blocks={section.blocks} />
                </div>
              </section>
            ))}

            <footer className="mt-20 border-t border-ink/[0.08] pt-8">
              <div className="rounded-xl bg-ink/[0.035] px-6 py-5">
                <p className="font-sans font-mono text-[9.5px] tracking-[0.22em] text-mist uppercase">
                  Cite the original
                </p>
                <p className="mt-2.5 font-mono text-[12px] leading-relaxed text-ink/65">
                  {(paper.authors.length > 6
                    ? `${paper.authors.slice(0, 6).join(", ")} et al.`
                    : paper.authors.join(", ")) || "Unknown"}
                  . {paper.title}. {paper.venue}. {paper.arxiv}
                </p>
              </div>
              <p className="mt-6 text-center font-sans text-[11.5px] text-mist">
                Typeset by Zéphyr — always verify against the original manuscript.
              </p>
            </footer>
            </div>

            <RelatedEditions currentSlug={paper.slug} />
          </article>

          <div className="hidden xl:block" />
        </div>
      </div>
      <SelectionAsk />
      <AskEdition slug={paper.slug} title={paper.title} />
    </ModeContext.Provider>
  );
}
