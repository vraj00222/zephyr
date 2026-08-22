"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type DragEvent,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import { useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/reveal";
import { Typewriter } from "@/components/landing/typewriter";

/* two takes on the same scene — the temple slowly becomes glass */
const SCENES = ["/backgrounds/herowide2.jpg", "/backgrounds/herowide.jpg"];

/* engraved Roman glyphs — hairline double-stroke, currentColor */
const PRINCIPLES = [
  {
    title: "Set like a book",
    body: "Real margins, real leading, serif italics.",
    icon: (
      // Roman column with capital
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
        <path
          d="M5 25.5h18M6.5 23h15M8 20.5h12"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path d="M8.75 20.5v-11m10.5 11v-11" stroke="currentColor" strokeWidth="1.25" />
        <path
          d="M11.4 20v-10m2.6 10v-10m2.6 10v-10"
          stroke="currentColor"
          strokeWidth="0.75"
        />
        <path
          d="M7.5 9.5h13M6.5 7h15"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M6.5 7c1.5-2.6 4-3.8 7.5-3.8S20 4.4 21.5 7"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Figures that move",
    body: "Plots redraw themselves as you reach them.",
    icon: (
      // rising chart wrapped in laurel branches
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
        <path
          d="M5 22.5c-2.2-4.2-2.2-9.3.7-13.5M23 22.5c2.2-4.2 2.2-9.3-.7-13.5"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path
          d="M4.7 18.6c-1.5-.4-2.4-1.3-2.8-2.6 1.4-.2 2.5.2 3.3 1.1M5 13.9c-1.4-.7-2-1.7-2.1-3.1 1.4.1 2.4.8 3 1.9M23.3 18.6c1.5-.4 2.4-1.3 2.8-2.6-1.4-.2-2.5.2-3.3 1.1M23 13.9c1.4-.7 2-1.7 2.1-3.1-1.4.1-2.4.8-3 1.9"
          stroke="currentColor"
          strokeWidth="0.75"
          strokeLinejoin="round"
        />
        <path d="M9 22h10" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" />
        <path
          d="m9 19 3.3-4.2 2.9 2.3 4.3-5.6"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19.7 14.6v-3.3h-3.3"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Citations resolve",
    body: "Hover to preview, click to jump.",
    icon: (
      // wax-seal asterisk rosette
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
        <circle
          cx="14"
          cy="14"
          r="10.75"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeDasharray="2.3 1.7"
          strokeLinecap="round"
        />
        <circle cx="14" cy="14" r="8" stroke="currentColor" strokeWidth="0.75" />
        <path
          d="M14 8.5v11M9.24 11.25l9.52 5.5M9.24 16.75l9.52-5.5"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <circle cx="14" cy="14" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Print-ready A4",
    body: "One keystroke to a clean, pinnable PDF.",
    icon: (
      // codex scroll, rolled top and bottom
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden>
        <rect
          x="4.75"
          y="3.75"
          width="18.5"
          height="3.5"
          rx="1.75"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <rect
          x="4.75"
          y="20.75"
          width="18.5"
          height="3.5"
          rx="1.75"
          stroke="currentColor"
          strokeWidth="1.25"
        />
        <path d="M8 7.25v13.5m12-13.5v13.5" stroke="currentColor" strokeWidth="1.25" />
        <path
          d="M11 11.25h6m-6 3h6m-6 3h4"
          stroke="currentColor"
          strokeWidth="0.75"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export function Hero() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const fileObj = useRef<File | null>(null);
  const [source, setSource] = useState("");
  const [fileLabel, setFileLabel] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scene, setScene] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setScene((s) => (s + 1) % SCENES.length), 9000);
    return () => clearInterval(t);
  }, [reduced]);

  async function launch() {
    if (submitting) return;
    if (!fileObj.current && !source.trim()) {
      setError("Paste an arXiv link or drop a PDF first.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      // a real PDF ships its bytes as multipart; links go as JSON
      const res = fileObj.current
        ? await fetch("/api/jobs", {
            method: "POST",
            body: (() => {
              const form = new FormData();
              form.append("file", fileObj.current, fileObj.current.name);
              return form;
            })(),
          })
        : await fetch("/api/jobs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ source }),
          });
      const data = (await res.json()) as { jobId?: string; error?: string };
      if (res.ok && data.jobId) {
        router.push(`/processing/${data.jobId}`);
        return;
      }
      setError(data.error ?? "The press could not accept this paper. Try again.");
    } catch {
      setError("The press could not be reached. Try again.");
    }
    setSubmitting(false);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void launch();
  }

  function acceptFile(file: File | null | undefined) {
    if (file && file.name.toLowerCase().endsWith(".pdf")) {
      fileObj.current = file;
      setFileLabel(file.name.replace(/\.pdf$/i, ""));
      setSource("");
      setError(null);
    }
  }

  function onDrop(e: DragEvent<HTMLFormElement>) {
    e.preventDefault();
    setDragging(false);
    acceptFile(e.dataTransfer.files?.[0]);
  }

  return (
    <section
      id="beautify"
      className="relative flex min-h-svh flex-col overflow-hidden"
    >
      {/* screen-wide backdrop — the art stays clear, only a soft cream wash
          on the left so type sits on calm ground */}
      <div aria-hidden className="absolute inset-0">
        {SCENES.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-[1800ms] ease-out-expo ${
              scene === i ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={src}
              alt=""
              fill
              priority={i === 0}
              unoptimized
              sizes="100vw"
              className="object-cover object-[70%_center]"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--paper-bg)_0%,rgba(246,241,229,0.82)_28%,rgba(246,241,229,0.35)_52%,transparent_74%)]" />
        {/* small screens: the figure sits behind the copy, so wash harder */}
        <div className="absolute inset-0 bg-gradient-to-b from-paper/85 via-paper/60 to-paper/20 lg:hidden" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-paper to-transparent" />
        <div className="grain absolute inset-0 opacity-[0.07] mix-blend-multiply" />
      </div>

      {/* copy block — pushed up, overlaid on the art */}
      <div className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-5 pt-28 sm:px-8 sm:pt-32">
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.24em] text-mist uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            Papers people actually read
          </span>
          <h1 className="mt-5 font-serif text-[clamp(2.5rem,4.6vw,4.3rem)] leading-[1.05] font-medium tracking-[-0.02em] whitespace-nowrap text-ink max-sm:whitespace-normal">
            Dense papers, typeset
            <br />
            like a{" "}
            <span className="relative inline-block pb-1">
              <em className="text-cobalt italic">first edition.</em>
              <svg
                aria-hidden
                viewBox="0 0 300 12"
                fill="none"
                preserveAspectRatio="none"
                className="flourish-line absolute -bottom-1 left-0 h-[0.09em] w-full"
                style={{ animationDelay: "0.9s" }}
              >
                <path
                  d="M2 9C60 2.5 240 2.5 298 8"
                  stroke="var(--gold)"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-mist">
            Hand Zéphyr an arXiv link or a PDF. Twelve minutes later you get a
            living edition — clean margins, moving figures, prose that finally
            breathes.
          </p>

          {/* compact command bar */}
          <form
            onSubmit={onSubmit}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`mt-9 flex w-full max-w-xl items-center gap-2 rounded-full bg-white/90 p-1.5 pl-5 shadow-[0_25px_70px_-30px_rgba(22,19,16,0.45)] ring-1 backdrop-blur-sm transition-all duration-500 ease-out-expo ${
              dragging ? "ring-2 ring-cobalt" : "ring-ink/10"
            }`}
          >
            {fileLabel ? (
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cobalt/10 text-cobalt">
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M9.5 1.5H4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V5L9.5 1.5Z"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinejoin="round"
                    />
                    <path d="M9.5 1.5V5H13" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                  </svg>
                </span>
                <p className="truncate text-[14px] text-ink">{fileLabel}</p>
                <button
                  type="button"
                  aria-label="Remove PDF"
                  onClick={() => {
                    fileObj.current = null;
                    setFileLabel(null);
                  }}
                  className="rounded-full px-2 py-1 text-[11px] text-mist transition-colors duration-300 hover:text-ink"
                >
                  ✕
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  title="Drop a PDF — no account needed"
                  aria-label="Upload a PDF"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink/40 transition-colors duration-300 hover:bg-ink/5 hover:text-cobalt"
                >
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M13.5 7.5 8.6 12.4a3.4 3.4 0 0 1-4.8-4.8l5-5a2.3 2.3 0 0 1 3.2 3.2l-4.9 4.9a1.1 1.1 0 0 1-1.6-1.6l4.5-4.5"
                      stroke="currentColor"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <input
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="Paste an arXiv URL or search a title…"
                  className="min-w-0 flex-1 bg-transparent text-[14.5px] text-ink caret-cobalt outline-none placeholder:text-ink/40"
                />
              </>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="group flex shrink-0 items-center gap-2 rounded-full bg-cobalt py-2.5 pr-2 pl-5 text-[13.5px] font-medium text-paper transition-all duration-500 ease-out-expo hover:brightness-110 active:scale-[0.97] disabled:opacity-60"
            >
              {submitting ? "Starting…" : "Typeset it"}
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-transform duration-500 ease-out-expo group-hover:translate-x-0.5">
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M1.5 6h9m0 0L7 2.5M10.5 6 7 9.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          </form>

          {error && (
            <p className="mt-3 text-[12.5px] text-flame" role="alert">
              {error}
            </p>
          )}

          <div className="mt-4">
            <Typewriter />
          </div>

          <div className="mt-5">
            <a
              href="#beautify"
              title="The Mac app is on its way — the press works right here meanwhile"
              className="group inline-flex items-center gap-3 rounded-xl bg-ink px-6 py-3.5 text-[14.5px] font-semibold text-white shadow-[0_14px_36px_-14px_rgba(22,19,16,0.55)] transition-all duration-300 ease-out-expo hover:bg-cobalt active:scale-[0.98]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/mistral/logo-mistral-orange.png"
                alt="Mistral"
                className="h-5 w-auto [image-rendering:pixelated]"
              />
              Download for macOS
            </a>
            <p className="mt-2 font-mono text-[9px] tracking-[0.2em] text-mist uppercase">
              macOS 14+ · Apple Silicon · Free
            </p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            hidden
            onChange={(e) => acceptFile(e.target.files?.[0])}
          />
        </Reveal>
      </div>

      {/* principles strip — AUREA-style baseline band */}
      <div className="relative z-10 mt-auto border-t border-ink/10 bg-paper/75 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-5 px-5 py-5 sm:px-8 lg:grid-cols-4">
          {PRINCIPLES.map((p, i) => (
            <div
              key={p.title}
              className={`flex items-center gap-3.5 px-2 lg:px-6 ${
                i > 0 ? "lg:border-l lg:border-ink/10" : ""
              }`}
            >
              <span className="shrink-0 text-cobalt/80">{p.icon}</span>
              <div>
                <p className="text-[12.5px] font-semibold tracking-tight text-ink">
                  {p.title}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-mist">
                  {p.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
