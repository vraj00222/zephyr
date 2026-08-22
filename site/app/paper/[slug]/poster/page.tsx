import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { buildPaperForSlug } from "@/lib/showcase-paper";
import { loadLocalPaper } from "@/lib/pipeline";
import { PaperPoster } from "@/components/paper/poster";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const paper = (await loadLocalPaper(slug)) ?? buildPaperForSlug(slug);
  return {
    title: `${paper.title} — Poster · Zéphyr`,
    description: paper.tldr,
  };
}

export default async function PosterPage({ params }: Props) {
  const { slug } = await params;
  const paper = (await loadLocalPaper(slug)) ?? buildPaperForSlug(slug);
  /* hand-generated Vibe art beats the SVG plate */
  const artFile = `/posters/art/${slug}.png`;
  const posterArt = existsSync(join(process.cwd(), "public", artFile))
    ? artFile
    : undefined;
  return <PaperPoster paper={paper} posterArt={posterArt} />;
}
