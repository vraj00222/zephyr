import Image from "next/image";
import { Reveal } from "@/components/reveal";

/* poster wall — NASA-photo-essay rhythm: the images carry the section and the
   type sits on them like a print. Natural aspect always, never widened. */
const POSTERS = [
  {
    src: "/backgrounds/long.jpg",
    w: 816,
    h: 1456,
    kicker: "01 · The reader",
    word: "Refresh.",
    alt: "Classical statue in gold sunglasses sipping a drink",
  },
  {
    src: "/backgrounds/long2.jpg",
    w: 735,
    h: 1040,
    kicker: "02 · The west wind",
    word: "Zéphyr.",
    alt: "Blue angel collage among clouds and gold suns",
  },
  {
    src: "/backgrounds/long3.jpg",
    w: 1152,
    h: 2048,
    kicker: "03 · From the page",
    word: "Look up.",
    alt: "Looking up at a cathedral spire and a winged figure",
  },
  {
    src: "/backgrounds/long6.jpg",
    w: 500,
    h: 939,
    kicker: "04 · Marginalia",
    word: "Think.",
    alt: "Thinking statue with an anatomical brain collage",
  },
];

export function ReadersStrip() {
  return (
    <section
      aria-label="For readers"
      className="relative overflow-hidden px-4 py-24 sm:py-28"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal className="max-w-xl">
          <span className="font-mono text-[10px] tracking-[0.22em] text-mist uppercase">
            The reading culture
          </span>
          <h2 className="mt-5 font-serif text-[clamp(2rem,4.2vw,3.2rem)] leading-[1.08] font-medium tracking-[-0.01em] text-ink text-balance">
            For readers, <em className="text-cobalt italic">not reviewers.</em>
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-2 gap-5 sm:gap-7 lg:grid-cols-4">
          {POSTERS.map((p, i) => (
            <Reveal
              key={p.src}
              delay={i * 0.09}
              className={i % 2 === 1 ? "lg:mt-14" : ""}
            >
              <figure className="group relative overflow-hidden rounded-2xl shadow-[0_30px_80px_-40px_rgba(22,19,16,0.55)] ring-1 ring-ink/10 transition-all duration-700 ease-out-expo hover:-translate-y-1.5 hover:shadow-[0_40px_90px_-40px_rgba(36,64,201,0.5)]">
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={p.w}
                  height={p.h}
                  unoptimized
                  className="h-auto w-full transition-transform duration-1000 ease-out-expo group-hover:scale-[1.04]"
                />
                {/* poster scrim — deepens on hover so the type lifts */}
                <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/75 via-ink/30 to-transparent transition-opacity duration-700 ease-out-expo group-hover:from-ink/85" />
                <figcaption className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <p className="font-mono text-[8.5px] tracking-[0.22em] text-paper/70 uppercase transition-transform duration-700 ease-out-expo group-hover:-translate-y-1">
                    {p.kicker}
                  </p>
                  <p className="mt-1 font-serif text-[clamp(1.3rem,1.8vw,1.8rem)] leading-none font-medium text-paper italic transition-all duration-700 ease-out-expo group-hover:-translate-y-1 group-hover:tracking-wide">
                    {p.word}
                  </p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
