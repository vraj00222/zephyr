import { NextResponse } from "next/server";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { loadLocalPaper, measureEdition } from "@/lib/pipeline";
import { hasMistral } from "@/lib/mistral";

/* dev tool: backfill pressStats for an existing edition (re-OCRs the source) */
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
  const stats = await measureEdition(paper);
  if (!stats) {
    return NextResponse.json({ error: "measure failed" }, { status: 502 });
  }
  paper.pressStats = stats;
  await writeFile(
    path.join(process.cwd(), "data", "papers", `${slug}.json`),
    JSON.stringify(paper, null, 2),
  );
  return NextResponse.json(stats);
}
