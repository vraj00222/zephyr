import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/reveal";

/* real editions off the press — bento cover cards that open the edition */
const EDITIONS = [
  {
    slug: "attention-is-all-you-need-live",
    title: "Attention Is All You Need",
    meta: "Vaswani et al. · NeurIPS 2017",
    art: "/posters/attention-is-all-you-need-live.svg",
  },
  {
    slug: "deep-residual-learning-for-image-recognition",
    title: "Deep Residual Learning for Image Recognition",
    meta: "He et al. · CVPR 2016",
    art: "/posters/deep-residual-learning-for-image-recognition.svg",
  },
  {
    slug: "deepseek-r1-incentivizing-reasoning-capability-in-llms-via-r",
    title: "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning",
    meta: "DeepSeek-AI · 2025",
    art: "/posters/deepseek-r1-incentivizing-reasoning-capability-in-llms-via-r.svg",
  },
  {
    slug: "mistral-7b",
    title: "Mistral 7B",
    meta: "Jiang et al. \u00b7 2023",
    art: null,
  },
  {
    slug: "mixtral-of-experts",
    title: "Mixtral of Experts",
    meta: "Jiang et al. · 2024",
    art: "/posters/mixtral-of-experts.svg",
  },
];

export function Gallery() {
  return (
    <section id="gallery" className="relative px-4 pt-6 pb-24 sm:pb-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
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

        {/* bento wall of real covers — click one and the edition opens */}
        <div className="grid grid-cols-2 gap-5">
          {EDITIONS.map((item, i) => (
            <Reveal key={item.slug} delay={i * 0.09}>
              <Link
                href={`/paper/${item.slug}`}
                className={`group block ${i % 2 === 0 ? "rotate-1" : "-rotate-1"} transition-transform duration-700 ease-out-expo hover:rotate-0 hover:-translate-y-1.5`}
              >
                <div className="rounded-2xl border border-[#e5e0d5] bg-white p-3 shadow-[0_20px_60px_-30px_rgba(22,19,16,0.35)] transition-shadow duration-700 ease-out-expo group-hover:shadow-[0_30px_70px_-30px_rgba(36,64,201,0.4)]">
                  <div className="aspect-[3/4] overflow-hidden rounded-xl bg-paper">
                    {item.art ? (
                      <Image
                        src={item.art}
                        alt={`Poster cover for ${item.title}`}
                        width={768}
                        height={1376}
                        unoptimized
                        className="h-full w-full object-cover object-top transition-transform duration-1000 ease-out-expo group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="font-serif text-6xl font-medium text-ink/70 italic">
                          M
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="mt-3 line-clamp-2 px-1 font-serif text-[14.5px] leading-snug font-medium text-ink">
                    {item.title}
                  </p>
                  <p className="mt-1 truncate px-1 pb-1 font-mono text-[9.5px] tracking-wide text-mist uppercase">
                    {item.meta}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
