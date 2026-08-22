"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { PLATE_BACKGROUNDS, getBackground } from "@/lib/backgrounds";

type BackgroundState = {
  current: string;
  select: (id: string) => void;
  auto: boolean;
  toggleAuto: () => void;
};

const BackgroundContext = createContext<BackgroundState | null>(null);

export function BackgroundProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState("collage");
  const [auto, setAuto] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get("bg");
    if (!fromUrl) return;
    const id = getBackground(fromUrl).id;
    if (!PLATE_BACKGROUNDS.some((b) => b.id === id)) return;
    const shuffle = params.has("shuffle");
    // defer so this reads as an external-system sync, not a render-phase update
    const t = setTimeout(() => {
      setCurrent(id);
      setAuto(shuffle);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  const select = useCallback((id: string) => {
    setCurrent(id);
    setAuto(false);
  }, []);

  useEffect(() => {
    if (!auto) return;
    const t = setInterval(() => {
      setCurrent((cur) => {
        const idx = PLATE_BACKGROUNDS.findIndex((b) => b.id === cur);
        return PLATE_BACKGROUNDS[(idx + 1) % PLATE_BACKGROUNDS.length].id;
      });
    }, 5000);
    return () => clearInterval(t);
  }, [auto]);

  return (
    <BackgroundContext.Provider
      value={{
        current,
        select,
        auto,
        toggleAuto: () => setAuto((a) => !a),
      }}
    >
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const ctx = useContext(BackgroundContext);
  if (!ctx) throw new Error("useBackground outside provider");
  const bg = getBackground(ctx.current);
  return { ...ctx, bg };
}
