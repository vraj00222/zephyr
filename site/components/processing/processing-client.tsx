"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { STAGES, TOTAL_MS } from "@/lib/jobs";

interface JobStatus {
  status: "running" | "complete" | "failed";
  stageIndex: number;
  stagePct: number;
  overallPct: number;
  etaMs: number;
  title: string;
  paperUrl: string;
  error?: string;
}

export function ProcessingClient({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<JobStatus | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);
  const navigated = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(`/api/jobs/${jobId}`, { cache: "no-store" });
        if (res.status === 404) {
          if (!cancelled) setNotFound(true);
          return;
        }
        const data = (await res.json()) as JobStatus;
        if (cancelled) return;
        if (data.status === "failed") {
          setFailed(data.error ?? "The press hit a snag with this paper.");
          return;
        }
        setStatus(data);
        if (data.status === "complete" && !navigated.current) {
          navigated.current = true;
          setTimeout(() => router.replace(data.paperUrl), 900);
        }
      } catch {
        if (!cancelled) setNotFound(true);
      }
    }

    void poll();
    const id = setInterval(poll, 600);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [jobId, router]);

  const etaSec = status ? Math.ceil(status.etaMs / 1000) : Math.ceil(TOTAL_MS / 1000);

  if (failed) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-background px-4 text-center">
        <p className="max-w-md text-[15px] leading-relaxed text-ink/75">
          {failed}
        </p>
        <Link
          href="/"
          className="rounded-full border border-ink/20 px-6 py-2.5 text-[13px] text-ink transition-colors duration-500 ease-out-expo hover:border-cobalt hover:text-cobalt"
        >
          Try another paper
        </Link>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-5 bg-background px-4 text-center">
        <p className="text-[15px] text-ink/75">This job has expired or never existed.</p>
        <Link
          href="/"
          className="rounded-full border border-ink/20 px-6 py-2.5 text-[13px] text-ink transition-colors duration-500 ease-out-expo hover:border-cobalt hover:text-cobalt"
        >
          Back home
        </Link>
      </div>
    );
  }

  const done = status?.status === "complete";

  return (
    <div className="relative min-h-dvh overflow-x-clip bg-background">
      {/* soft cobalt glow behind the press card */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-60 left-1/2 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-cobalt/10 blur-[110px]" />
        <div className="grain absolute inset-0 opacity-[0.06] mix-blend-multiply" />
      </div>

      <div className="relative mx-auto flex min-h-dvh max-w-xl flex-col items-center justify-center px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.32, 0.72, 0, 1] }}
          className="w-full rounded-[2rem] bg-white/[0.05] p-[1px] ring-1 ring-white/10"
        >
          <div className="rounded-[calc(2rem-0.375rem)] bg-[#0a0a0b] px-7 py-10 sm:px-10">
            <div className="flex items-center gap-6">
              <div className="relative h-20 w-20 shrink-0">
                <span className="spin-slow absolute inset-0 rounded-full border border-dashed border-folio-blue/40" />
                <span className="spin-reverse absolute inset-2 rounded-full border border-white/15 border-t-folio-blue/80" />
                <span
                  className={`pulse-core absolute inset-[26px] rounded-full ${
                    done ? "bg-emerald-400" : "bg-folio-blue"
                  }`}
                />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[10.5px] tracking-[0.25em] text-white/35 uppercase">
                  {done ? "Edition ready" : "Beautifying"}
                </p>
                <h1 className="mt-2 truncate text-[17px] font-medium tracking-tight text-white/95">
                  {status?.title ?? "Your manuscript"}
                </h1>
                <p className="mt-1 font-mono text-[11px] text-white/40">
                  {done ? "opening your paper…" : `${etaSec}s remaining`}
                </p>
              </div>
            </div>

            <div className="mt-9 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.07]">
              <motion.div
                className={`h-full rounded-full ${done ? "bg-emerald-400" : "bg-folio-blue"}`}
                animate={{ width: `${status?.overallPct ?? 0}%` }}
                transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
              />
            </div>

            <ul className="mt-9 space-y-1">
              {STAGES.map((stage, i) => {
                const current = status?.stageIndex ?? 0;
                const isDone = done || i < current;
                const isActive = !done && i === current;
                return (
                  <li
                    key={stage.id}
                    className={`flex items-start gap-3.5 rounded-xl px-3 py-3 transition-colors duration-700 ease-out-expo ${
                      isActive ? "bg-white/[0.05]" : ""
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px] transition-all duration-700 ease-out-expo ${
                        isDone
                          ? "border-emerald-400/60 bg-emerald-400/15 text-emerald-300"
                          : isActive
                            ? "border-folio-blue/70 bg-folio-blue/15 text-folio-blue"
                            : "border-white/12 text-white/25"
                      }`}
                    >
                      {isDone ? "✓" : isActive ? "•" : i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-[13.5px] font-medium transition-colors duration-700 ease-out-expo ${
                          isDone || isActive ? "text-white/90" : "text-white/30"
                        }`}
                      >
                        {stage.label}
                      </p>
                      <p
                        className={`mt-0.5 truncate text-[11.5px] transition-colors duration-700 ease-out-expo ${
                          isActive ? "text-white/45" : "text-white/22"
                        }`}
                      >
                        {isActive ? stage.blurb : isDone ? "Complete" : "Queued"}
                      </p>
                    </div>
                    {isActive && (
                      <span className="mt-1 font-mono text-[10.5px] text-folio-blue/90">
                        {status?.stagePct ?? 0}%
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>

            {/* le chat crosses the press floor while the edition is set */}
            <div aria-hidden className="relative mt-6 h-9 overflow-hidden">
              <img
                src="/mistral/cat-walking-white.gif"
                alt=""
                className="cat-walk absolute bottom-0 h-8 w-auto"
              />
              <span className="absolute right-0 bottom-1 font-mono text-[9px] tracking-[0.22em] text-white/25 uppercase">
                Pressed by Mistral
              </span>
            </div>

            <p className="mt-4 text-center text-[11px] leading-relaxed text-white/25">
              A full edition takes ten to fifteen minutes.
              <br />
              Leave the tab open — we&rsquo;ll open it the moment it&rsquo;s bound.
            </p>
          </div>
        </motion.div>

        <Link
          href="/"
          className="mt-8 text-[12px] text-ink/50 transition-colors duration-500 ease-out-expo hover:text-ink"
        >
          ← Typeset another paper
        </Link>
      </div>
    </div>
  );
}
