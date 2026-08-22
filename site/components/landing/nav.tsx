"use client";

import Link from "next/link";

const LINKS = [
  { href: "#how", label: "Why Zéphyr" },
  { href: "#features", label: "Details" },
  { href: "#gallery", label: "Gallery" },
  { href: "/library", label: "Library" },
];

export function Nav() {
  return (
    <header className="fixed top-4 left-1/2 z-50 w-max -translate-x-1/2">
      <nav className="flex items-center gap-6 rounded-full border border-ink/10 bg-white/65 py-2 pr-2 pl-5 shadow-[0_18px_50px_-24px_rgba(22,19,16,0.35)] backdrop-blur-xl">
        <Link
          href="/"
          className="flex items-center gap-2 font-serif text-[17px] font-medium tracking-tight text-ink italic"
        >
          <span className="flame-tile flex h-5 w-5 items-center justify-center rounded-[6px] font-serif text-[11px] font-semibold text-white italic">
            Z
          </span>
          Zéphyr
        </Link>
        <span className="hidden h-3 w-px bg-ink/15 sm:block" />
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="relative hidden text-[12.5px] font-medium text-ink/60 transition-colors duration-500 ease-out-expo after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-ink after:transition-transform after:duration-500 after:ease-out-expo hover:text-ink hover:after:origin-left hover:after:scale-x-100 sm:block"
          >
            {link.label}
          </a>
        ))}
        <a
          href="#beautify"
          className="group flex items-center gap-2 rounded-full bg-cobalt py-1.5 pr-1.5 pl-4 text-[12.5px] font-semibold text-paper transition-all duration-500 ease-out-expo hover:brightness-110 active:scale-[0.97]"
        >
          Typeset a paper
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-px">
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
        </a>
      </nav>
    </header>
  );
}
