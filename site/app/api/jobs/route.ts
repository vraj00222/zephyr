import { NextResponse } from "next/server";
import { deriveTitle, encodeJob } from "@/lib/jobs";
import { BACKEND_URL, backendHeaders, hasBackend } from "@/lib/backend";

/* Accepts JSON {source} for links/titles, or multipart form-data with a
   `file` (PDF) and optional `source`. With MINERVA_BACKEND_URL set the job is
   forwarded to the backend; otherwise the built-in simulation runs. */
export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  let source = "";
  let file: File | null = null;

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const f = form.get("file");
    if (f instanceof File) file = f;
    const s = form.get("source");
    if (typeof s === "string") source = s;
  } else {
    try {
      const body = await request.json();
      if (typeof body?.source === "string") source = body.source;
    } catch {
      source = "";
    }
  }

  if (hasBackend) {
    const form = new FormData();
    if (file) form.append("file", file, file.name);
    if (source) form.append("source", source);
    try {
      const res = await fetch(`${BACKEND_URL}/jobs`, {
        method: "POST",
        headers: backendHeaders(),
        body: form,
      });
      if (!res.ok) {
        return NextResponse.json(
          { error: `The press could not accept this paper (${res.status}).` },
          { status: 502 },
        );
      }
      const data = (await res.json()) as { jobId?: string; title?: string };
      if (!data.jobId) {
        return NextResponse.json(
          { error: "The press replied without a job id." },
          { status: 502 },
        );
      }
      return NextResponse.json({
        jobId: String(data.jobId),
        title: data.title ?? deriveTitle(source || file?.name),
      });
    } catch {
      return NextResponse.json(
        { error: "The press is unreachable. Is the backend running?" },
        { status: 502 },
      );
    }
  }

  const title = deriveTitle(
    source || (file ? file.name.replace(/\.pdf$/i, "") : ""),
  );
  const jobId = encodeJob({ title, createdAt: Date.now() });
  return NextResponse.json({ jobId, title });
}
