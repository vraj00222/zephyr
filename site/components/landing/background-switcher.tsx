"use client";

import Image from "next/image";
import { useState } from "react";
import { PLATE_BACKGROUNDS } from "@/lib/backgrounds";
import { useBackground } from "@/components/landing/background-context";

export function BackgroundSwitcher() {
  const { current, select, auto, toggleAuto } = useBackground();
  const [open, setOpen] = useState(false);

  return (
    <div className="no-print fixed right-4 bottom-4 z-[80] hidden sm:block">
      <div
        className={`overflow-hidden rounded-2xl border border-ink/10 bg-white/95 shadow-[0_20px_60px_-20px_rgba(22,19,16,0.5)] backdrop-blur-xl transition-all duration-500 ease-out-expo ${
          open
            ? "w-[264px] opacity-100"
            : "w-[132px] opacity-90 hover:opacity-100"
        }`}
      >
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between px-3 py-2.5"
        >
          <span className="font-mono text-[9px] tracking-[0.2em] text-mist uppercase">
            {open ? "Backdrop plates" : "Plates"}
          </span>
          <span
            className={`text-mist transition-transform duration-500 ease-out-expo ${open ? "" : "rotate-180"}`}
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
              <path d="M2 7.5 6 3.5l4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>

        {open && (
          <div className="border-t border-ink/8 p-2.5">
            <div className="grid grid-cols-4 gap-1.5">
              {PLATE_BACKGROUNDS.map((b) => (
                <button
                  key={b.id}
                  title={b.label}
                  onClick={() => select(b.id)}
                  className={`relative aspect-square overflow-hidden rounded-md ring-1 transition-all duration-300 ease-out-expo ${
                    current === b.id
                      ? "ring-2 ring-cobalt"
                      : "ring-ink/10 hover:ring-cobalt/50"
                  }`}
                >
                  {b.src ? (
                    <Image
                      src={b.src}
                      alt={b.label}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  ) : (
                    <span className="block h-full w-full bg-cobalt" />
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={toggleAuto}
              className={`mt-2.5 w-full rounded-lg py-2 font-mono text-[9.5px] tracking-[0.18em] uppercase transition-colors duration-300 ${
                auto
                  ? "bg-cobalt text-paper"
                  : "bg-paper text-mist ring-1 ring-ink/10 hover:text-ink"
              }`}
            >
              {auto ? "Auto-shuffling · on" : "Auto-shuffle plates"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
