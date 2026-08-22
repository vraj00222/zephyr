import { loadLocalPaper } from "@/lib/pipeline";
import { buildPaperForSlug } from "@/lib/showcase-paper";
import { hasMistral } from "@/lib/mistral";

/* Ask the edition: grounded chat over one paper. Streams plain text back. */

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  if (!hasMistral) {
    return new Response("The reading companion is asleep (no press key set).", {
      status: 503,
    });
  }

  const body = (await request.json().catch(() => null)) as {
    question?: string;
    history?: { role: "user" | "assistant"; content: string }[];
  } | null;
  const question = body?.question?.trim();
  if (!question) return new Response("Ask me something.", { status: 400 });

  const paper = (await loadLocalPaper(slug)) ?? buildPaperForSlug(slug);
  const context = JSON.stringify({
    title: paper.title,
    authors: paper.authors,
    venue: paper.venue,
    tldr: paper.tldr,
    abstract: paper.abstract,
    sections: paper.sections,
  }).slice(0, 60_000);

  const history = (body?.history ?? []).slice(-6);

  const upstream = await fetch("https://api.mistral.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: "mistral-medium-latest",
      stream: true,
      temperature: 0.3,
      messages: [
        {
          role: "system",
          content: `You are the reading companion bound into a typeset edition of a research
paper. Answer ONLY from the edition below. If the answer is not in the paper,
say so plainly. Be concise and direct — plain text, short paragraphs, no
markdown syntax. Explain like a sharp colleague, not a textbook.

THE EDITION:
${context}`,
        },
        ...history,
        { role: "user", content: question },
      ],
    }),
  });

  if (!upstream.ok || !upstream.body) {
    return new Response("The companion lost its train of thought. Try again.", {
      status: 502,
    });
  }

  // SSE -> plain text: forward only the delta content
  const decoder = new TextDecoder();
  let buffer = "";
  const stream = upstream.body.pipeThrough(
    new TransformStream<Uint8Array, string>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const data = line.replace(/^data: ?/, "").trim();
          if (!data || data === "[DONE]" || !line.startsWith("data:")) continue;
          try {
            const delta = JSON.parse(data)?.choices?.[0]?.delta?.content;
            if (typeof delta === "string") controller.enqueue(delta);
          } catch {
            /* partial frame — ignored */
          }
        }
      },
    }),
  );

  return new Response(stream.pipeThrough(new TextEncoderStream()), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
