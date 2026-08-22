import { NextResponse } from "next/server";
import { hasMistral } from "@/lib/mistral";

/* Le Chat listens: Voxtral turns the reader's voice into a question. */
export async function POST(request: Request) {
  if (!hasMistral) {
    return NextResponse.json({ error: "no ears" }, { status: 503 });
  }
  const audio = Buffer.from(await request.arrayBuffer());
  if (audio.length < 200 || audio.length > 8_000_000) {
    return NextResponse.json({ error: "say that again?" }, { status: 400 });
  }
  const form = new FormData();
  form.append("model", "voxtral-mini-latest");
  form.append(
    "file",
    new Blob([new Uint8Array(audio)], { type: "audio/webm" }),
    "question.webm",
  );
  const res = await fetch("https://api.mistral.ai/v1/audio/transcriptions", {
    method: "POST",
    signal: AbortSignal.timeout(60_000),
    headers: { Authorization: `Bearer ${process.env.MISTRAL_API_KEY}` },
    body: form,
  });
  if (!res.ok) {
    return NextResponse.json({ error: "didn't catch that" }, { status: 502 });
  }
  const { text } = (await res.json()) as { text: string };
  return NextResponse.json({ text: text?.trim() ?? "" });
}
