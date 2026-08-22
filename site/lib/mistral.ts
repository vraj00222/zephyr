const API = 'https://api.mistral.ai/v1';

export const hasMistral = Boolean(process.env.MISTRAL_API_KEY);

export interface OcrPage {
  index: number;
  markdown: string;
  images: { id: string; image_base64?: string }[];
}

export async function mistralOcr(documentUrl: string): Promise<OcrPage[]> {
  const res = await fetch(`${API}/ocr`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'mistral-ocr-latest',
      document: { type: 'document_url', document_url: documentUrl },
      include_image_base64: true,
    }),
  });
  if (!res.ok) {
    const text = (await res.text()).slice(0, 300);
    throw new Error(`${res.status} ${text}`);
  }
  return (await res.json()).pages;
}

export async function mistralChatJson<T>(system: string, user: string, model = 'mistral-medium-latest'): Promise<T> {
  const res = await fetch(`${API}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
    }),
  });
  if (!res.ok) {
    const text = (await res.text()).slice(0, 300);
    throw new Error(`${res.status} ${text}`);
  }
  const json = await res.json();
  return JSON.parse(json.choices[0].message.content);
}
