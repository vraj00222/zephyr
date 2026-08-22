import type { Metadata } from "next";
import { existsSync } from "node:fs";
import path from "node:path";
import { cache } from "react";
import { buildPaperForSlug } from "@/lib/showcase-paper";
import { PaperViewer } from "@/components/paper/paper-viewer";
import { BACKEND_URL, backendHeaders, hasBackend } from "@/lib/backend";
import { loadLocalPaper } from "@/lib/pipeline";
import type { ShowcasePaper } from "@/lib/types";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ t?: string }>;
}

/* real editions come from the local press (data/papers) or the backend;
   unknown slugs fall back to the showcase document so the demo always renders */
const fetchPaper = cache(async (slug: string): Promise<ShowcasePaper | null> => {
  const local = await loadLocalPaper(slug);
  if (local) return local;
  if (!hasBackend) return null;
  try {
    const res = await fetch(
      `${BACKEND_URL}/papers/${encodeURIComponent(slug)}`,
      { headers: backendHeaders(), cache: "no-store" },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as ShowcasePaper;
    if (!data?.title || !Array.isArray(data?.sections)) return null;
    return data;
  } catch {
    return null;
  }
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const paper = (await fetchPaper(slug)) ?? buildPaperForSlug(slug);
  return {
    title: `${paper.title} — Zéphyr`,
    description: paper.tldr,
  };
}

export default async function PaperPage({ params, searchParams }: Props) {
  const [{ slug }, { t }] = await Promise.all([params, searchParams]);
  const paper = (await fetchPaper(slug)) ?? buildPaperForSlug(slug, t);
  // the press's own architecture engraving, when one has been struck
  const artPlate = existsSync(
    path.join(process.cwd(), "public", "posters", "art", `${slug}.png`),
  )
    ? `/posters/art/${slug}.png`
    : undefined;
  return <PaperViewer paper={paper} artPlate={artPlate} />;
}
