import Image from "next/image";
import { Reveal } from "@/components/reveal";

/* the wide plates are the only ones that go full-bleed —
   portrait plates stay framed elsewhere */
export function Interlude() {
  return (
    <section aria-label="The reading hall" className="relative overflow-hidden">
      <Image
        src="/backgrounds/readingroom.jpg"
        alt=""
        fill
        unoptimized
        sizes="100vw"
        className="ken-burns object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/35 to-ink/65" />
      <div className="grain pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay" />

      <div className="relative mx-auto flex min-h-[46vh] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
        <Reveal>
          <span className="font-mono text-[10px] tracking-[0.22em] text-paper/70 uppercase">
            From the pressroom
          </span>
          <p className="mt-6 font-serif text-[clamp(1.7rem,3.4vw,2.8rem)] leading-snug text-paper italic">
            &ldquo;A paper you can actually read
            <br className="hidden sm:block" /> is a paper you actually
            finish.&rdquo;
          </p>
        </Reveal>
      </div>
    </section>
  );
}
