import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";

const SHOWCASE = [
  {
    slug: "attention-is-all-you-need",
    title: "Attention Is All You Need",
    authors: "Vaswani et al.",
    venue: "NeurIPS 2017",
    tag: "Transformers",
    rotate: "-2deg",
  },
  {
    slug: "attention-is-all-you-need",
    title: "Language Models are Few-Shot Learners",
    authors: "Brown et al.",
    venue: "NeurIPS 2020",
    tag: "In-context learning",
    rotate: "1.6deg",
  },
  {
    slug: "attention-is-all-you-need",
    title: "Deep Residual Learning for Image Recognition",
    authors: "He et al.",
    venue: "CVPR 2016",
    tag: "ResNets",
    rotate: "-1deg",
  },
];

function MiniPreview() {
  return (
    <div className="rounded-xl bg-panel px-5 py-5 ring-1 ring-ink/8">
      <div className="h-2 w-3/5 rounded-full bg-cobalt" />
      <div className="mt-2 h-2 w-2/5 rounded-full bg-ink/25" />
      <div className="mt-4 space-y-1.5">
        <div className="h-1.5 w-full rounded-full bg-ink/15" />
        <div className="h-1.5 w-[92%] rounded-full bg-ink/12" />
        <div className="h-1.5 w-[97%] rounded-full bg-ink/12" />
      </div>
      <div className="mt-4 flex items-end gap-1.5">
        {[38, 62, 30, 74].map((h, i) => (
          <div
            key={i}
            className={`w-4 rounded-t-sm ${i === 3 ? "bg-flame" : "bg-ink/20"}`}
            style={{ height: `${h * 0.55}px` }}
          />
        ))}
      </div>
    </div>
  );
}

export function Gallery() {
  return (
    <section id="gallery" className="relative px-4 pt-10 pb-32 sm:pb-40">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <Reveal>
          <span className="font-mono text-[10px] tracking-[0.22em] text-mist uppercase">
            Before / after the press
          </span>
          <h2 className="mt-5 font-serif text-[clamp(2.1rem,4.5vw,3.5rem)] leading-[1.06] font-medium tracking-[-0.01em] text-ink text-balance">
            One paper.
            <br />
            Two <em className="text-cobalt italic">very different</em> reads.
          </h2>
          <p className="mt-6 max-w-md text-[14.5px] leading-relaxed text-mist">
            The left column is what reviewers tolerate. The right is what Zéphyr
            ships back — same science, set with the care of a small press.
          </p>
          <div className="relative mt-8 w-full max-w-sm overflow-hidden rounded-2xl shadow-[0_25px_70px_-30px_rgba(22,19,16,0.5)] ring-1 ring-ink/10">
            <Image
              src="/backgrounds/platoreading.jpg"
              alt="Plato reading a manuscript"
              width={640}
              height={800}
              className="h-auto w-full object-cover sepia-[0.25]"
            />
            <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1 font-mono text-[9px] tracking-[0.2em] text-paper uppercase backdrop-blur-sm">
              est. 360 BC · first edition
            </span>
          </div>
          <Link
            href="/paper/attention-is-all-you-need"
            className="group mt-9 inline-flex items-center gap-3 rounded-lg border border-ink/15 py-2 pr-2 pl-6 text-[13.5px] font-medium text-ink transition-all duration-500 ease-out-expo hover:border-cobalt hover:bg-cobalt hover:text-paper active:scale-[0.98]"
          >
            Flip through an edition
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-ink/5 transition-transform duration-500 ease-out-expo group-hover:translate-x-1 group-hover:-translate-y-0.5 group-hover:bg-white/20">
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 9.5L9.5 2.5M9.5 2.5H4M9.5 2.5V8"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </Reveal>

        <div className="flex flex-col gap-6">
          {SHOWCASE.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.09}>
              <Link
                href={`/paper/${item.slug}`}
                style={{ rotate: item.rotate }}
                className={`group block w-full transition-transform duration-700 ease-out-expo hover:scale-[1.03] md:max-w-md ${
                  i === 1 ? "md:self-end" : i === 2 ? "md:self-center" : ""
                }`}
              >
                <div className="rounded-[1.6rem] bg-white p-4 shadow-[0_20px_60px_-30px_rgba(22,19,16,0.35)] ring-1 ring-ink/8 transition-shadow duration-700 ease-out-expo group-hover:shadow-[0_30px_70px_-30px_rgba(36,64,201,0.4)]">
                  <MiniPreview />
                  <div className="mt-4 flex items-center justify-between px-1 pb-1">
                    <div className="min-w-0 pr-3">
                      <p className="truncate text-[13.5px] font-medium text-ink">
                        {item.title}
                      </p>
                      <p className="mt-0.5 truncate font-mono text-[10.5px] tracking-wide text-mist">
                        {item.authors} · {item.venue}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border border-ink/12 px-3 py-1 font-mono text-[9.5px] tracking-wide text-mist uppercase transition-colors duration-500 ease-out-expo group-hover:border-cobalt/50 group-hover:text-cobalt">
                      {item.tag}
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
