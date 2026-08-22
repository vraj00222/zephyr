"use client";

import { createContext, useContext } from "react";
import { motion } from "framer-motion";
import type { PaperMode } from "@/lib/types";

const MODES: { id: PaperMode; label: string; hint: string }[] = [
  { id: "folio", label: "Folio", hint: "The whole argument, beautifully set" },
  {
    id: "octavo",
    label: "Octavo",
    hint: "The half-hour cut — highlighted text is the paper's own words",
  },
  {
    id: "pamphlet",
    label: "Pamphlet",
    hint: "The five-minute brief — problem, prior art, verdict",
  },
];

interface ModeContextValue {
  mode: PaperMode;
  animate: boolean;
}

const ModeContext = createContext<ModeContextValue>({
  mode: "folio",
  animate: true,
});

export function usePaperMode() {
  return useContext(ModeContext);
}

export const modeContextValue = (mode: PaperMode): ModeContextValue => ({
  mode,
  animate: true,
});

export { ModeContext };

export function ModeSwitcher({
  mode,
  onChange,
}: {
  mode: PaperMode;
  onChange: (m: PaperMode) => void;
}) {
  return (
    <div className="flex items-center rounded-full border border-ink/10 bg-white p-[3px] shadow-[0_2px_12px_rgba(23,21,18,0.06)]">
      {MODES.map((m) => {
        const active = m.id === mode;
        return (
          <button
            key={m.id}
            type="button"
            title={m.hint}
            onClick={() => onChange(m.id)}
            className={`relative rounded-full px-3 py-1.5 text-[11px] font-medium tracking-wide transition-colors duration-500 ease-out-expo sm:px-3.5 ${
              active ? "text-paper" : "text-ink/45 hover:text-ink/75"
            }`}
          >
            {active && (
              <motion.span
                layoutId="mode-pill"
                className="absolute inset-0 rounded-full bg-ink"
                transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
              />
            )}
            <span className="relative">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}
