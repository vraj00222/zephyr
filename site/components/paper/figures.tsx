"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePaperMode } from "@/components/paper/mode";

function accentMix(alpha: number) {
  return `color-mix(in srgb, var(--accent) ${Math.round(alpha * 100)}%, transparent)`;
}

/* 1kpapers-style confetti series: one saturated star (Mistral orange) among
   ink-adjacent companions — never two saturated fills fighting */
const SERIES = ["#2e4788", "#5aa8cc", "#f2b03d", "#fa500f"];

/* Mistral flame ramp for heat: amber -> orange -> deep red */
function flameMix(v: number) {
  const base =
    v < 0.5
      ? `color-mix(in srgb, #fa500f ${Math.round(v * 200)}%, #f7ca79)`
      : `color-mix(in srgb, #d2321f ${Math.round((v - 0.5) * 200)}%, #fa500f)`;
  return `color-mix(in srgb, ${base} ${Math.round((0.2 + 0.8 * v) * 100)}%, transparent)`;
}

export function LossFigure() {
  const { animate } = usePaperMode();
  const reduced = useReducedMotion();
  const draw = animate && !reduced;

  return (
    <svg viewBox="0 0 340 170" className="w-full" role="img" aria-label="Training loss curve">
      <defs>
        <linearGradient id="lossFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accentMix(0.22)} />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
      {[30, 70, 110].map((y) => (
        <line key={y} x1="34" y1={y} x2="326" y2={y} stroke="#171512" strokeOpacity="0.07" strokeWidth="1" />
      ))}
      <motion.path
        d="M34 22 C 100 28, 140 62, 190 84 S 272 100, 326 106"
        fill="none"
        stroke="#2e4788"
        strokeWidth="1.6"
        strokeDasharray="5 4"
        strokeLinecap="round"
        initial={draw ? { pathLength: 0 } : false}
        whileInView={draw ? { pathLength: 1 } : undefined}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.8, ease: [0.32, 0.72, 0, 1] }}
      />
      <text x="300" y="98" fontSize="7.5" fill="#2e4788" fontFamily="var(--font-geist-mono)">
        baseline
      </text>
      <text x="304" y="140" fontSize="7.5" fill="var(--accent)" fontFamily="var(--font-geist-mono)">
        ours
      </text>
      <motion.path
        d="M34 26 C 90 30, 120 78, 170 100 S 260 122, 326 128"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="2.2"
        strokeLinecap="round"
        initial={draw ? { pathLength: 0 } : false}
        whileInView={draw ? { pathLength: 1 } : undefined}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.8, ease: [0.32, 0.72, 0, 1] }}
      />
      <motion.path
        d="M34 26 C 90 30, 120 78, 170 100 S 260 122, 326 128 L 326 150 L 34 150 Z"
        fill="url(#lossFill)"
        initial={draw ? { opacity: 0 } : false}
        whileInView={draw ? { opacity: 1 } : undefined}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.2, delay: draw ? 0.7 : 0, ease: "easeOut" }}
      />
      <text x="180" y="164" textAnchor="middle" fontSize="8" fill="#6f6a60" fontFamily="var(--font-geist-mono)">
        training steps
      </text>
      <text x="12" y="80" fontSize="8" fill="#6f6a60" fontFamily="var(--font-geist-mono)" transform="rotate(-90 12 80)">
        loss
      </text>
    </svg>
  );
}

const BARS = [
  { label: "GNMT+RL", value: 26.3 },
  { label: "ConvS2S", value: 25.2 },
  { label: "Base", value: 27.3 },
  { label: "Big", value: 28.4 },
];

export function BleuFigure() {
  const { animate } = usePaperMode();
  const reduced = useReducedMotion();
  const grow = animate && !reduced;
  const max = 30;

  return (
    <div className="flex h-[190px] items-end gap-8 px-2 pt-4">
      {BARS.map((bar, i) => {
        const scaled = ((bar.value - 18) / (max - 18)) * 100;
        const isTransformer = i >= 2;
        return (
          <div key={bar.label} className="flex flex-1 flex-col items-center gap-2">
            <span className="font-mono text-[10px] text-ink/60">{bar.value.toFixed(1)}</span>
            <div className="flex w-full flex-1 items-end">
              <motion.div
                className={`w-full rounded-t-md ${isTransformer ? "" : "opacity-70"}`}
                style={{
                  height: `${scaled}%`,
                  background:
                    i === BARS.length - 1
                      ? `linear-gradient(to top, ${accentMix(0.55)}, var(--accent))`
                      : SERIES[i % SERIES.length],
                  transformOrigin: "bottom",
                }}
                initial={grow ? { scaleY: 0 } : false}
                whileInView={grow ? { scaleY: 1 } : undefined}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 1,
                  delay: grow ? i * 0.14 : 0,
                  ease: [0.32, 0.72, 0, 1],
                }}
              />
            </div>
            <span className="font-mono text-[9.5px] tracking-wide text-mist">{bar.label}</span>
          </div>
        );
      })}
    </div>
  );
}

const MATRIX = [
  [0.9, 0.5, 0.15, 0.05, 0.1, 0.05, 0.02, 0.01],
  [0.5, 0.85, 0.45, 0.08, 0.06, 0.04, 0.02, 0.01],
  [0.15, 0.45, 0.95, 0.5, 0.12, 0.06, 0.03, 0.02],
  [0.05, 0.08, 0.5, 0.9, 0.48, 0.1, 0.05, 0.03],
  [0.1, 0.06, 0.12, 0.48, 0.92, 0.52, 0.09, 0.04],
  [0.05, 0.04, 0.06, 0.1, 0.52, 0.88, 0.46, 0.12],
  [0.02, 0.02, 0.03, 0.05, 0.09, 0.46, 0.86, 0.55],
  [0.01, 0.01, 0.02, 0.03, 0.04, 0.12, 0.55, 0.94],
];

export function AttentionFigure() {
  const { mode, animate } = usePaperMode();
  const reduced = useReducedMotion();
  const bloom = animate && !reduced;

  return (
    <div className="flex justify-center py-2">
      <div className="inline-grid grid-cols-8 gap-[3px] rounded-lg bg-ink/[0.04] p-3">
        {MATRIX.flatMap((row, r) =>
          row.map((v, c) => (
            <motion.div
              key={`${r}-${c}`}
              className="h-6 w-6 rounded-[3px] sm:h-7 sm:w-7"
              style={{ background: flameMix(v) }}
              initial={bloom ? { opacity: 0, scale: 0.4 } : false}
              whileInView={bloom ? { opacity: 1, scale: 1 } : undefined}
              viewport={{ once: true, margin: "-40px" }}
              transition={
                mode === "pamphlet"
                  ? { duration: 0.7, delay: (r + c) * 0.045, ease: [0.32, 0.72, 0, 1] }
                  : { duration: 0.9, delay: r * 0.05, ease: [0.32, 0.72, 0, 1] }
              }
            />
          ))
        )}
      </div>
    </div>
  );
}
