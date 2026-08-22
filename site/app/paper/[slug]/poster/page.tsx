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
  return <PaperPoster paper={paper} />;
}
