"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import type { Block, ShowcasePaper } from "@/lib/types";
import {
  ModeSwitcher,
  ModeContext,
  modeContextValue,
  usePaperMode,
} from "@/components/paper/mode";
import { AttentionFigure, BleuFigure, LossFigure } from "@/components/paper/figures";

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
  const { mode } = usePaperMode();
  const ornate = mode !== "faithful";

  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p key={i} className="mt-6 text-[16.5px] leading-[1.85] text-ink/85 first:mt-0">
                {block.text}
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
                  <li key={j} className="flex gap-3 text-[15.5px] leading-relaxed text-ink/80">
                    <span
                      className="mt-[0.72em] h-1 w-1 shrink-0 rounded-full"
                      style={{ background: "var(--accent)" }}
                    />
                    {item}
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

export function PaperViewer({ paper }: { paper: ShowcasePaper }) {
  const [mode, setMode] = useState<"faithful" | "elevated" | "vivid">("elevated");
  const [activeSection, setActiveSection] = useState(paper.sections[0]?.id);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 26 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    for (const section of paper.sections) {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [paper.sections]);

  return (
    <ModeContext.Provider value={modeContextValue(mode)}>
      <div data-mode={mode} className="min-h-dvh bg-paper font-serif text-ink">
        <motion.div
          className="fixed top-0 right-0 left-0 z-40 h-[2px] origin-left"
          style={{ scaleX: progress, background: "var(--accent)" }}
        />

        <header className="sticky top-0 z-30 border-b border-ink/[0.07] bg-paper/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <Link href="/" className="flex items-center gap-2 text-[13px] font-sans font-medium text-ink/70 transition-colors duration-500 ease-out-expo hover:text-ink">
              <span className="flex h-5 w-5 items-center justify-center rounded-[6px] bg-folio-blue font-serif text-[11px] font-semibold text-white italic">
                Z
              </span>
              Zéphyr
            </Link>
            <p className="hidden min-w-0 flex-1 truncate text-center text-[13px] italic text-mist md:block">
              {paper.title}
            </p>
            <ModeSwitcher mode={mode} onChange={setMode} />
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 pt-16 pb-28 sm:px-6 xl:grid-cols-[200px_minmax(0,1fr)_40px] xl:gap-14">
          <aside className="hidden xl:block">
            <nav className="sticky top-24 space-y-1">
              <p className="mb-4 font-sans font-mono text-[9.5px] tracking-[0.22em] text-mist uppercase">
                Contents
              </p>
              {paper.sections.map((section) => (
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
            <header>
              <p className="font-sans font-mono text-[10.5px] tracking-[0.22em] uppercase" style={{ color: "var(--accent)" }}>
                Beautified edition · {paper.arxiv}
              </p>
              <h1 className="mt-5 text-[clamp(2.1rem,4.6vw,3.4rem)] leading-[1.04] font-medium tracking-[-0.02em] text-balance">
                {paper.title}
              </h1>
              <p className="mt-6 max-w-xl text-[13.5px] leading-relaxed text-mist">
                {paper.authors.join(" · ")}
              </p>
              <p className="mt-1.5 text-[12px] text-mist/80">{paper.venue}</p>

              <div className="mt-9 rounded-2xl border border-ink/[0.08] bg-white/60 px-7 py-6">
                <p className="font-sans font-mono text-[9.5px] tracking-[0.22em] text-mist uppercase">
                  TL;DR
                </p>
                <p className="mt-2.5 text-[16px] leading-relaxed text-ink/80">{paper.tldr}</p>
              </div>

              <div className="mt-10">
                <p className="text-[13px] font-semibold tracking-wide">Abstract</p>
                <p className="mt-3 text-[15.5px] leading-[1.8] text-ink/70 italic">{paper.abstract}</p>
              </div>
            </header>

            <div className="my-12 h-px bg-gradient-to-r from-transparent via-ink/15 to-transparent" />

            {paper.sections.map((section) => (
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
                  {paper.authors.join(", ")}. {paper.title}. {paper.venue}.{" "}
                  {paper.arxiv}
                </p>
              </div>
              <p className="mt-6 text-center font-sans text-[11.5px] text-mist">
                Typeset by Zéphyr — always verify against the original manuscript.
              </p>
            </footer>
          </article>

          <div className="hidden xl:block" />
        </div>
      </div>
    </ModeContext.Provider>
  );
}
