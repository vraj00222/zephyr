export type PaperMode = "faithful" | "elevated" | "vivid";

export type Block =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "quote"; text: string; cite?: string }
  | { type: "callout"; title: string; text: string }
  | {
      type: "explain";
      title: string;
      text: string;
      points?: string[];
    }
  | {
      type: "figure";
      figure: "loss" | "bleu" | "attention";
      label: string;
      caption: string;
    }
  | {
      /* real figures from the backend: an image URL + caption */
      type: "image";
      src: string;
      caption: string;
      label?: string;
    }
  | { type: "stats"; items: { value: string; label: string }[] };

export interface Section {
  id: string;
  number: string;
  title: string;
  blocks: Block[];
}

export interface ShowcasePaper {
  slug: string;
  title: string;
  authors: string[];
  venue: string;
  arxiv: string;
  readingTime: string;
  tldr: string;
  abstract: string;
  sections: Section[];
}
