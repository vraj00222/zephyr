import { NextResponse } from "next/server";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { engraveArchitecture, loadLocalPaper } from "@/lib/pipeline";
import { hasMistral } from "@/lib/mistral";

/* dev tool: re-engrave an existing edition's architecture plate */
export async function POST(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!hasMistral) {
    return NextResponse.json({ error: "no press key" }, { status: 503 });
  }
  const paper = await loadLocalPaper(slug);
  if (!paper) {
    return NextResponse.json({ error: "unknown edition" }, { status: 404 });
  }
  const art = await engraveArchitecture(paper);
  if (!art) {
    return NextResponse.json({ error: "engraving failed" }, { status: 502 });
  }
  paper.posterArt = art;
  await writeFile(
    path.join(process.cwd(), "data", "papers", `${slug}.json`),
    JSON.stringify(paper, null, 2),
  );
  return NextResponse.json({ posterArt: art });
}
