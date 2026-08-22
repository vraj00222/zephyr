import Image from "next/image";
import { Reveal } from "@/components/reveal";

const STEPS = [
  {
    n: "The issue",
    title: "Reading papers hurts",
    body: "Two columns of nine-point type, figures stranded pages from their mention, citations like [47]. Brilliant work, brutal to read.",
  },
  {
    n: "The solution",
    title: "Zéphyr re-sets them",
    body: "Hand us the arXiv link or the PDF. Minutes later you're holding a first edition — the same paper, finally set with care.",
  },
  {
    n: "The magic",
    title: "You just read",
    body: "Margins breathe, figures move when they matter, references resolve under your cursor. The science is untouched; the reading is transformed.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative px-4 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl">
        {/* header row — heading left, "julius reading" plate inline right (no overlap) */}
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
          <Reveal className="max-w-xl">
            <span className="font-mono text-[10px] tracking-[0.22em] text-mist uppercase">
              Why Zéphyr
            </span>
            <h2 className="mt-4 font-serif text-[clamp(2rem,4.2vw,3.2rem)] leading-[1.08] font-medium tracking-[-0.01em] text-ink text-balance">
              Papers deserve better than a{" "}
              <em className="text-cobalt italic">two-column PDF.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.12} className="hidden md:block">
            <figure className="w-44 rotate-[2deg] transition-transform duration-700 ease-out-expo hover:rotate-0 xl:w-52">
              <div className="overflow-hidden rounded-2xl shadow-[0_30px_70px_-30px_rgba(22,19,16,0.45)] ring-1 ring-ink/10">
                <Image
                  src="/backgrounds/julius1.jpg"
                  alt="A reader hunched over a 1970s machine"
                  width={992}
                  height={1200}
                  unoptimized
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="mt-2 text-center font-mono text-[9px] tracking-[0.2em] text-mist uppercase">
                how we&rsquo;ve been reading
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.08}>
              <div className="group h-full rounded-[1.75rem] bg-white p-6 shadow-[0_20px_60px_-30px_rgba(22,19,16,0.3)] ring-1 ring-ink/8 transition-all duration-700 ease-out-expo hover:-translate-y-1 hover:shadow-[0_30px_70px_-30px_rgba(36,64,201,0.35)]">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-[11px] tracking-widest text-cobalt">
                    {step.n}
                  </span>
                  <span className="h-8 w-8 rounded-full border border-dashed border-ink/15 transition-transform duration-700 ease-out-expo group-hover:rotate-45 group-hover:border-cobalt/50" />
                </div>
                <h3 className="mt-4 text-[17px] font-medium tracking-tight text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-mist">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
