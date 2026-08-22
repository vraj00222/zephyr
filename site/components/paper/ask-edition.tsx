"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* Ask the edition — a reading companion bound into every paper. */

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED = [
  "What's the key result?",
  "Explain the method simply",
  "What are the limitations?",
];

export function AskEdition({ slug, title }: { slug: string; title: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  // le chat (and ⌃⌥) summons the companion
  useEffect(() => {
    const onSummon = () => setOpen((o) => !o);
    window.addEventListener("zephyr:ask", onSummon);
    return () => window.removeEventListener("zephyr:ask", onSummon);
  }, []);

  async function ask(question: string) {
    if (!question.trim() || busy) return;
    setInput("");
    setBusy(true);
    const history = messages;
    setMessages([
      ...history,
      { role: "user", content: question },
      { role: "assistant", content: "" },
    ]);
    try {
      const res = await fetch(`/api/papers/${slug}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, history }),
      });
      if (!res.ok || !res.body) {
        throw new Error(await res.text().catch(() => "no answer"));
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const delta = decoder.decode(value, { stream: true });
        setMessages((m) => {
          const next = [...m];
          next[next.length - 1] = {
            role: "assistant",
            content: next[next.length - 1].content + delta,
          };
          return next;
        });
      }
    } catch {
      setMessages((m) => {
        const next = [...m];
        next[next.length - 1] = {
          role: "assistant",
          content: "The companion lost its train of thought. Ask again?",
        };
        return next;
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="no-print fixed right-5 bottom-5 z-50 flex flex-col items-end">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
            className="mb-3 flex max-h-[70vh] w-[min(92vw,390px)] flex-col overflow-hidden rounded-3xl border border-ink/10 bg-panel shadow-[0_24px_80px_rgba(22,19,16,0.18)]"
          >
            <div className="flex items-start justify-between gap-3 border-b border-ink/[0.07] px-5 py-4">
              <div className="min-w-0">
                <p
                  className="font-mono text-[9px] tracking-[0.22em] uppercase"
                  style={{ color: "var(--accent)" }}
                >
                  Reading companion
                </p>
                <p className="mt-1 truncate text-[12.5px] text-ink/70">{title}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-full p-1 text-ink/40 transition-colors duration-300 hover:text-ink"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div ref={scrollRef} className="min-h-[120px] flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {messages.length === 0 && (
                <div className="space-y-2 py-2">
                  <p className="text-[12.5px] leading-relaxed text-mist">
                    Ask anything — answers come from this edition alone.
                  </p>
                  {SUGGESTED.map((q) => (
                    <button
                      key={q}
                      onClick={() => void ask(q)}
                      className="block w-full rounded-xl border border-ink/10 bg-white/60 px-3.5 py-2 text-left text-[12.5px] text-ink/75 transition-all duration-300 ease-out-expo hover:border-[var(--accent)] hover:text-ink"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <p
                    key={i}
                    className="ml-8 rounded-2xl rounded-br-md bg-white px-3.5 py-2.5 text-[13px] leading-relaxed text-ink shadow-sm"
                  >
                    {m.content}
                  </p>
                ) : (
                  <p
                    key={i}
                    className="text-[13.5px] leading-[1.75] whitespace-pre-wrap text-ink/85"
                  >
                    {m.content}
                    {busy && i === messages.length - 1 && (
                      <span className="ml-0.5 inline-block h-3.5 w-[2px] animate-pulse align-middle" style={{ background: "var(--accent)" }} />
                    )}
                  </p>
                ),
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void ask(input);
              }}
              className="flex items-center gap-2 border-t border-ink/[0.07] px-4 py-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask this paper…"
                className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-mist/70"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cobalt text-white transition-all duration-300 ease-out-expo disabled:opacity-30"
              >
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                  <path d="M7 12V2M7 2L2.5 6.5M7 2l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        className="flex items-center gap-2.5 rounded-full bg-cobalt px-5 py-3 text-[13px] font-medium text-white shadow-[0_12px_32px_rgba(22,19,16,0.25)]"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path
            d="M7 1l1.4 3.6L12 6l-3.6 1.4L7 11 5.6 7.4 2 6l3.6-1.4L7 1z"
            fill="currentColor"
          />
        </svg>
        {open ? "Keep reading" : "Ask this edition"}
      </motion.button>
    </div>
  );
}
