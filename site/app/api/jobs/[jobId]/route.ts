import { NextResponse } from "next/server";
import { getProgress } from "@/lib/jobs";
import { BACKEND_URL, backendHeaders, hasBackend } from "@/lib/backend";
import { getRealJob, isRealJobId } from "@/lib/pipeline";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ jobId: string }> },
) {
  const { jobId } = await params;

  if (isRealJobId(jobId)) {
    const real = getRealJob(jobId);
    if (!real) {
      return NextResponse.json({ error: "Unknown job" }, { status: 404 });
    }
    return NextResponse.json(real);
  }

  if (hasBackend) {
    try {
      const res = await fetch(
        `${BACKEND_URL}/jobs/${encodeURIComponent(jobId)}`,
        { headers: backendHeaders(), cache: "no-store" },
      );
      if (res.status === 404) {
        return NextResponse.json({ error: "Unknown job" }, { status: 404 });
      }
      if (!res.ok) {
        return NextResponse.json(
          { status: "failed", error: `The press reported ${res.status}.` },
          { status: 200 },
        );
      }
      const data = (await res.json()) as Record<string, unknown>;
      // normalize: a complete job needs a paperUrl the client can navigate to
      if (data.status === "complete" && !data.paperUrl) {
        const slug = data.paperSlug ?? data.slug ?? data.paperId;
        data.paperUrl = slug ? `/paper/${slug}` : "/";
      }
      return NextResponse.json(data);
    } catch {
      return NextResponse.json(
        { status: "failed", error: "The press is unreachable." },
        { status: 200 },
      );
    }
  }

  const progress = getProgress(jobId);
  if (!progress) {
    return NextResponse.json({ error: "Unknown job" }, { status: 404 });
  }
  return NextResponse.json(progress);
}
