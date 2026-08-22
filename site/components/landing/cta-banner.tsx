import Image from "next/image";
import { Reveal } from "@/components/reveal";

export function CtaBanner() {
  return (
    <section className="relative px-4 pb-16 sm:pb-20">
      <Reveal className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-cobalt px-8 py-16 text-center sm:px-16 sm:py-20">
          <Image
            src="/backgrounds/bg2.jpg"
            alt=""
            fill
            unoptimized
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="ken-burns object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/40 to-ink/70" />
          <div className="grain pointer-events-none absolute inset-0 opacity-[0.14] mix-blend-overlay" />

          <div className="relative">
            <span className="font-mono text-[10px] tracking-[0.22em] text-paper/70 uppercase">
              No account · No queue-jumping
            </span>
            <h2 className="mx-auto mt-6 max-w-2xl font-serif text-[clamp(2.1rem,4.5vw,3.5rem)] leading-[1.06] font-medium tracking-[-0.01em] text-paper text-balance">
              Run one paper through the press <em className="italic">tonight.</em>
            </h2>
            <p className="mx-auto mt-6 max-w-md text-[14.5px] leading-relaxed text-paper/80">
              Bring an arXiv link, keep the tab open, come back to a first
              edition. That&rsquo;s the whole ritual.
            </p>
            <a
              href="#beautify"
              className="group mt-10 inline-flex items-center gap-3 rounded-lg bg-paper py-3 pr-3 pl-6 text-[14px] font-semibold text-cobalt shadow-[0_20px_50px_-20px_rgba(0,0,20,0.6)] transition-all duration-500 ease-out-expo hover:-translate-y-0.5 hover:bg-white active:scale-[0.98]"
            >
              Back to the input tray
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-cobalt/10 transition-transform duration-500 ease-out-expo group-hover:translate-x-1 group-hover:-translate-y-0.5">
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M1.5 6h9m0 0L7 2.5M10.5 6 7 9.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
