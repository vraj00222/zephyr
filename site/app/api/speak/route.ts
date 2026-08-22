import { NextResponse } from "next/server";
import { hasMistral } from "@/lib/mistral";

/* Le Chat speaks: Voxtral TTS reads the companion's answer aloud. */
export async function POST(request: Request) {
  if (!hasMistral) {
    return NextResponse.json({ error: "no voice" }, { status: 503 });
  }
  const body = (await request.json().catch(() => null)) as {
    text?: string;
  } | null;
  const text = body?.text?.trim().slice(0, 900);
  if (!text) return NextResponse.json({ error: "nothing to say" }, { status: 400 });

  const res = await fetch("https://api.mistral.ai/v1/audio/speech", {
    method: "POST",
    signal: AbortSignal.timeout(60_000),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: "voxtral-mini-tts-latest",
      input: text,
      voice: "en_paul_confident",
    }),
  });
  if (!res.ok) {
    return NextResponse.json({ error: "voice cracked" }, { status: 502 });
  }
  const { audio_data } = (await res.json()) as { audio_data: string };
  return new NextResponse(Buffer.from(audio_data, "base64"), {
    headers: { "Content-Type": "audio/mpeg" },
  });
}
