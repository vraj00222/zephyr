import { Reveal } from "@/components/reveal";

/* How the press works — numbered like an atlas colophon, with real numbers
   from the editions actually pressed today. */

const STEPS = [
  {
    n: "01",
    title: "Receive the manuscript",
    text: "An arXiv link or your own PDF. The doorkeeper checks it is research — invoices and homework are turned away politely.",
  },
  {
    n: "02",
    title: "Read every page",
    text: "Text, figures, tables — nothing left behind. Every figure is cropped and kept so it can move back into the edition where it belongs.",
  },
  {
    n: "03",
    title: "Re-set in three cuts",
    text: "Folio, the whole argument. Octavo, half the length, the paper's own words kept in its ink. Pamphlet, the five-minute brief with a verdict.",
  },
  {
    n: "04",
    title: "Proofread & bind",
    text: "A second reading checks every claim against the original; hard contradictions are corrected in press before the edition is bound.",
  },
];

const NUMBERS = [
  { value: "5", label: "papers pressed today" },
  { value: "15", label: "editions bound" },
  { value: "435k", label: "characters read" },
  { value: "172", label: "claims proofread" },
  { value: "117", label: "figures re-set" },
];

export function PressRun() {
  return (
    <section className="px-4 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-[10px] tracking-[0.24em] text-mist uppercase">
            The press run
          </p>
          <h2 className="mt-4 max-w-2xl font-serif text-[clamp(1.9rem,3.6vw,2.8rem)] leading-[1.08] font-medium tracking-[-0.02em]">
            How a paper becomes{" "}
            <span className="text-cobalt italic">an edition.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08}>
              <div className="border-t border-ink/15 pt-5">
                <p className="font-mono text-[13px] text-cobalt">{s.n}</p>
                <h3 className="mt-3 text-[17px] font-medium tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-mist">
                  {s.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-14 grid grid-cols-2 gap-[1px] overflow-hidden rounded-2xl bg-ink/[0.08] sm:grid-cols-5">
            {NUMBERS.map((n) => (
              <div key={n.label} className="bg-panel px-4 py-6 text-center">
                <p className="font-serif text-[28px] leading-none tracking-tight text-cobalt">
                  {n.value}
                </p>
                <p className="mt-2 font-mono text-[9px] tracking-[0.16em] text-mist uppercase">
                  {n.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
