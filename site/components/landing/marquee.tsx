const TITLES = [
  "Attention Is All You Need",
  "Language Models are Few-Shot Learners",
  "Deep Residual Learning",
  "GPT-4 Technical Report",
  "Denoising Diffusion Probabilistic Models",
  "Scaling Laws for Neural Language Models",
  "Chain-of-Thought Prompting",
  "Constitutional AI",
];

export function Marquee() {
  const row = [...TITLES, ...TITLES];
  return (
    <section
      aria-label="Papers set by Zéphyr"
      className="relative overflow-hidden py-6"
    >
      <div className="marquee-track flex w-max items-center gap-10 pr-10">
        {row.map((title, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="font-mono text-[11px] tracking-[0.18em] whitespace-nowrap text-mist uppercase">
              {title}
            </span>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden>
              <path
                d="M5 0v10M0 5h10M1.5 1.5l7 7M8.5 1.5l-7 7"
                stroke={i % 2 === 0 ? "#2440c9" : "#d6481f"}
                strokeWidth="1"
              />
            </svg>
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-paper to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-paper to-transparent" />
    </section>
  );
}
