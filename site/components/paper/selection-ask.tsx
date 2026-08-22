"use client";

import { useEffect, useState } from "react";

/* Wikipedia-style: select any passage in the edition and ask Le Chat about
   it. A small popover appears over the selection; clicking it hands the
   passage to the reading companion. */
export function SelectionAsk() {
  const [sel, setSel] = useState<{ x: number; y: number; text: string } | null>(
    null,
  );

  useEffect(() => {
    const onMouseUp = () => {
      // let the selection settle before reading it
      setTimeout(() => {
        const s = window.getSelection();
        const text = s?.toString().trim() ?? "";
        if (text.length >= 8 && text.length <= 600 && s && s.rangeCount > 0) {
          const r = s.getRangeAt(0).getBoundingClientRect();
          if (r.width > 0)
            setSel({ x: r.left + r.width / 2, y: r.top, text });
        } else {
          setSel(null);
        }
      }, 10);
    };
    const onHide = () => setSel(null);
    document.addEventListener("mouseup", onMouseUp);
    window.addEventListener("scroll", onHide, { passive: true });
    return () => {
      document.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("scroll", onHide);
    };
  }, []);

  if (!sel) return null;
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()} // keep the selection alive
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent("zephyr:ask-selection", { detail: sel.text }),
        );
        setSel(null);
        window.getSelection()?.removeAllRanges();
      }}
      className="no-print fixed z-[60] flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 font-sans text-[11.5px] font-medium text-paper shadow-[0_10px_28px_rgba(22,19,16,0.35)] transition-transform duration-200 ease-out-expo hover:-translate-y-0.5 hover:-translate-x-1/2"
      style={{ left: sel.x, top: Math.max(8, sel.y - 44) }}
    >
      <span style={{ color: "var(--accent, #fa500f)" }}>✦</span>
      Ask Le Chat
    </button>
  );
}
