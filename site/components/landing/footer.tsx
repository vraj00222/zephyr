import Image from "next/image";
import Link from "next/link";

const EXPLORE = [
  { href: "#how", label: "Why Zéphyr" },
  { href: "#features", label: "Details" },
  { href: "#gallery", label: "Gallery" },
  { href: "/library", label: "Library" },
];

const START = [
  { href: "#beautify", label: "Typeset a paper" },
  { href: "/paper/attention-is-all-you-need", label: "Read a sample edition" },
  { href: "#beautify", label: "Download for Mac — soon" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-ink/10 bg-panel/60 px-4 pt-14 pb-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-12 sm:flex-row">
          <div className="max-w-xs">
            <p className="font-serif text-[24px] font-medium tracking-tight text-ink italic">
              Zéphyr
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-mist">
              Beautiful editions of brilliant papers. Bring an arXiv link
              tonight, come back to a first edition.
            </p>
            <a
              href="#beautify"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-cobalt px-5 py-2.5 text-[12.5px] font-semibold text-paper transition-all duration-500 ease-out-expo hover:brightness-110 active:scale-[0.97]"
            >
              Typeset your first paper
            </a>
          </div>

          <div className="flex gap-16 sm:gap-20">
            <div>
              <p className="mono-label text-mist">Explore</p>
              <ul className="mt-5 space-y-3 text-[13px]">
                {EXPLORE.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="text-ink/70 transition-colors duration-300 hover:text-ink"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mono-label text-mist">Start</p>
              <ul className="mt-5 space-y-3 text-[13px]">
                {START.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-ink/70 transition-colors duration-300 hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-ink/10 pt-6 sm:flex-row">
          <p className="text-[11px] text-mist">
            Set in Newsreader &amp; Geist, on cream № F6F1E5.
          </p>
          <a
            href="https://mistral.ai"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 opacity-70 transition-opacity duration-500 ease-out-expo hover:opacity-100"
          >
            <span className="font-mono text-[10px] tracking-widest text-mist uppercase">
              Pressed by
            </span>
            <Image
              src="/mistral/logo-mistral-orange.png"
              alt="Mistral AI"
              width={74}
              height={20}
              className="h-5 w-auto"
            />
          </a>
          <p className="font-mono text-[10px] tracking-widest text-mist uppercase">
            © 2026 Zéphyr · set with care
          </p>
        </div>
      </div>
    </footer>
  );
}
