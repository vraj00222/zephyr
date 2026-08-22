"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/* Le Chat — the Mistral mascot lives bottom-right on every page, perched on
   the flame. On a paper he opens the reading companion (click or ⌃⌥);
   elsewhere he just meows. */
const FLAME = ["#ffaf01", "#ff8204", "#fa500f", "#e61300", "#c4001d"];

export function CatCompanion() {
  const pathname = usePathname();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const onPaper = pathname?.startsWith("/paper/");

  const summon = () => {
    if (onPaper) {
      window.dispatchEvent(new CustomEvent("zephyr:ask"));
    }
    try {
      (audioRef.current ??= new Audio("/mistral/meow.m4a")).play();
    } catch {
      /* no sound, still a cat */
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && !e.metaKey && !e.shiftKey) {
        e.preventDefault();
        summon();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onPaper]);

  return (
    <button
      type="button"
      aria-label="Le Chat — talk to the paper (⌃⌥)"
      title={onPaper ? "Talk to this paper — or press ⌃ ⌥" : "Le Chat"}
      onClick={summon}
      className={`no-print group fixed right-5 z-40 flex cursor-pointer flex-col items-center transition-transform duration-300 ease-out-expo hover:-translate-y-1 ${
        onPaper ? "bottom-[4.6rem]" : "bottom-2"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/mistral/cat.gif"
        alt=""
        className="h-11 w-auto [image-rendering:pixelated] drop-shadow-[0_2px_5px_rgba(22,19,16,0.25)]"
      />
      {/* he sits on the mistral flame */}
      <span className="flex h-[5px] w-12 overflow-hidden rounded-full opacity-90">
        {FLAME.map((c) => (
          <span key={c} className="h-full flex-1" style={{ background: c }} />
        ))}
      </span>
    </button>
  );
}
