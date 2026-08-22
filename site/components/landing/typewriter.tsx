"use client";

import { useEffect, useState } from "react";

/* Vibe-Buddy-style typewriter: orange mono phrases, typed and retyped. */
const PHRASES = [
  "We make papers people actually read.",
  "It re-sets the argument.",
  "It proofreads itself.",
  "It reads the answers aloud.",
  "It makes research readable.",
  "It typesets for humans.",
];

export function Typewriter() {
  const [text, setText] = useState("");

  useEffect(() => {
    let phrase = 0;
    let i = 0;
    let deleting = false;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const full = PHRASES[phrase];
      i += deleting ? -1 : 1;
      setText(full.slice(0, i));
      let delay = deleting ? 22 : 46;
      if (!deleting && i === full.length) {
        deleting = true;
        delay = 2200;
      } else if (deleting && i === 0) {
        deleting = false;
        phrase = (phrase + 1) % PHRASES.length;
        delay = 350;
      }
      t = setTimeout(tick, delay);
    };
    t = setTimeout(tick, 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <p className="font-mono text-[14px] font-semibold tracking-tight text-cobalt sm:text-[15px]">
      {text}
      <span className="ml-0.5 inline-block h-[1em] w-[7px] translate-y-[2px] animate-pulse bg-cobalt" />
    </p>
  );
}
