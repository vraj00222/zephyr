import Image from "next/image";
import { Reveal } from "@/components/reveal";

function FigureVisual() {
  return (
    <div className="flex h-20 items-end gap-2">
      {[34, 58, 42, 74, 52, 88].map((h, i) => (
        <div
          key={i}
          className="w-6 rounded-t-sm bg-cobalt/85 transition-all duration-700 ease-out-expo group-hover:bg-flame"
          style={{ height: `${h}%`, transitionDelay: `${i * 40}ms` }}
        />
      ))}
    </div>
  );
}

function CitationVisual() {
  return (
    <div className="space-y-2">
      {[
        { t: "Vaswani et al. 2017", w: "w-3/4" },
        { t: "Brown et al. 2020", w: "w-1/2" },
        { t: "He et al. 2016", w: "w-2/3" },
      ].map((c) => (
        <span
          key={c.t}
          className={`inline-flex items-center gap-1.5 rounded-full border border-cobalt/25 bg-cobalt/[0.06] px-3 py-1 font-mono text-[10px] tracking-wide text-cobalt ${c.w}`}
        >
          <span className="h-1 w-1 rounded-full bg-cobalt" />
          {c.t}
        </span>
      ))}
    </div>
  );
}

function SheetVisual() {
  return (
    <div className="relative mx-auto h-24 w-16 rotate-[-4deg] rounded-sm bg-white shadow-[0_10px_30px_-12px_rgba(22,19,16,0.35)] ring-1 ring-ink/10 transition-transform duration-700 ease-out-expo group-hover:rotate-0">
      <div className="absolute top-2.5 left-2 h-1.5 w-8 rounded-full bg-cobalt" />
      <div className="mt-6 space-y-1 px-2">
        <div className="h-1 w-full rounded-full bg-ink/15" />
        <div className="h-1 w-[85%] rounded-full bg-ink/12" />
        <div className="h-1 w-[92%] rounded-full bg-ink/12" />
        <div className="h-1 w-[70%] rounded-full bg-ink/12" />
      </div>
    </div>
  );
}

const FEATURES = [
  {
    title: "Figures that move",
    body: "Plots re-draw themselves as you reach them. Static PNGs become living charts.",
    visual: <FigureVisual />,
    span: "md:col-span-4",
  },
  {
    title: "Citations resolve",
    body: "Every reference becomes a chip — hover to preview, click to jump. No more [47] archaeology.",
    visual: <CitationVisual />,
    span: "md:col-span-4",
  },
  {
    title: "Print-ready A4",
    body: "One keystroke and the edition folds into a clean PDF you'd pin to a wall.",
    visual: <SheetVisual />,
    span: "md:col-span-4",
  },
];

export function Features() {
  return (
    <section id="features" className="relative px-4 pb-32 sm:pb-40">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="font-mono text-[10px] tracking-[0.22em] text-mist uppercase">
            What the press adds
          </span>
          <h2 className="mt-5 max-w-xl font-serif text-[clamp(2rem,4.2vw,3.2rem)] leading-[1.08] font-medium tracking-[-0.01em] text-ink text-balance">
            Small touches that turn a preprint into an{" "}
            <em className="text-cobalt italic">artifact</em>.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-12">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.07} className={f.span}>
              <article className="group flex h-full flex-col justify-between gap-8 rounded-[1.75rem] bg-white p-7 shadow-[0_20px_60px_-30px_rgba(22,19,16,0.3)] ring-1 ring-ink/8 transition-all duration-700 ease-out-expo hover:-translate-y-1 hover:shadow-[0_30px_70px_-30px_rgba(36,64,201,0.35)] min-h-[240px]">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h3 className="text-[17px] font-medium tracking-tight text-ink">
                      {f.title}
                    </h3>
                    <p className="mt-2 max-w-xs text-[13px] leading-relaxed text-mist">
                      {f.body}
                    </p>
                  </div>
                  <span className="font-mono text-[10px] tracking-widest text-ink/25">
                    0{i + 1}
                  </span>
                </div>
                <div>{f.visual}</div>
              </article>
            </Reveal>
          ))}

          {/* wide card — one compact row, quote + plate, no dead middle */}
          <Reveal delay={0.2} className="md:col-span-12">
            <article className="group flex flex-wrap items-center justify-between gap-x-10 gap-y-8 rounded-[1.75rem] bg-white p-7 shadow-[0_20px_60px_-30px_rgba(22,19,16,0.3)] ring-1 ring-ink/8 transition-all duration-700 ease-out-expo hover:-translate-y-1 hover:shadow-[0_30px_70px_-30px_rgba(36,64,201,0.35)]">
              <div className="max-w-md">
                <div className="flex items-start justify-between gap-6">
                  <h3 className="text-[17px] font-medium tracking-tight text-ink">
                    Set like a book, not a memo
                  </h3>
                  <span className="font-mono text-[10px] tracking-widest text-ink/25">
                    04
                  </span>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-mist">
                  Real margins, real leading, serif italics where the authors
                  meant them.
                </p>
                <p className="mt-7 font-serif text-[19px] leading-snug text-ink italic">
                  &ldquo;The attention mechanism weighs every token&hellip;&rdquo;
                  <span className="mt-1.5 block font-mono text-[9.5px] tracking-[0.18em] text-mist not-italic uppercase">
                    set in Newsreader · 9.5/14
                  </span>
                </p>
              </div>
              <div className="w-40 shrink-0 rotate-[1.5deg] overflow-hidden rounded-xl ring-1 ring-ink/10 transition-transform duration-700 ease-out-expo group-hover:rotate-0 sm:w-48">
                <Image
                  src="/backgrounds/aesthetic1.jpg"
                  alt="Classical reading scene"
                  width={736}
                  height={920}
                  unoptimized
                  className="h-auto w-full"
                />
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
