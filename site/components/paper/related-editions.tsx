import Link from "next/link";

/* other editions already pressed — static shelf for the showcase */
const EDITIONS = [
  {
    slug: "attention-is-all-you-need-live",
    title: "Attention Is All You Need",
    meta: "Vaswani et al. · NeurIPS 2017",
  },
  {
    slug: "deep-residual-learning-for-image-recognition",
    title: "Deep Residual Learning for Image Recognition",
    meta: "He et al. · CVPR 2016",
  },
  {
    slug: "deepseek-r1-incentivizing-reasoning-capability-in-llms-via-r",
    title: "DeepSeek-R1: Incentivizing Reasoning Capability in LLMs",
    meta: "DeepSeek-AI · 2025",
  },
  {
    slug: "mixtral-of-experts",
    title: "Mixtral of Experts",
    meta: "Jiang et al. · 2024",
  },
  {
    slug: "denoising-diffusion-probabilistic-models",
    title: "Denoising Diffusion Probabilistic Models",
    meta: "Ho et al. · NeurIPS 2020",
  },
];

export function RelatedEditions({ currentSlug }: { currentSlug: string }) {
  const editions = EDITIONS.filter((e) => e.slug !== currentSlug).slice(0, 3);
  if (editions.length === 0) return null;

  return (
    <section className="mx-auto mt-14 w-full max-w-[820px]">
      <p className="font-mono text-[9.5px] tracking-[0.22em] text-mist uppercase">
        More from the press
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {editions.map((e) => (
          <Link
            key={e.slug}
            href={`/paper/${e.slug}`}
            className="group rounded-sm border border-[#e8e4da] bg-white px-5 py-5 shadow-[0_4px_18px_rgba(22,19,16,0.05)] transition-all duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(22,19,16,0.1)]"
          >
            <p className="font-serif text-[15px] leading-snug text-ink transition-colors duration-500 ease-out-expo group-hover:text-(--accent)">
              {e.title}
            </p>
            <p className="mt-2.5 font-mono text-[9.5px] leading-relaxed tracking-[0.12em] text-mist uppercase">
              {e.meta}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
