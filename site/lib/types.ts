/* Three content tiers of one edition:
   folio — the whole argument, faithful structure, near-full text
   octavo — the half-length cut; verbatim passages carry an orange hue
   pamphlet — the five-minute brief: problem, prior work, what's new, verdict */
export type PaperMode = "folio" | "octavo" | "pamphlet";

/* press analysis of the paper itself */
export interface PaperMeta {
  /* e.g. "Computer Science · Large language models" */
  field: string;
  /* what most readers will struggle with, and the plain explanation of it */
  readerIssue: { title: string; text: string };
  /* 1-10; surveys/incremental low, genuinely new research high */
  importance: { score: number; verdict: string };
  /* passages worth reading verbatim from the paper (state-of-the-art bits) */
  mustRead: { title: string; why: string; excerpt: string }[];
}

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
  /* set by the press proofreader: claims cross-checked against the OCR text;
     corrected = discrepancies the press fixed in a repair pass */
  proofread?: { checked: number; flagged: number; corrected?: number };
  authors: string[];
  venue: string;
  arxiv: string;
  readingTime: string;
  tldr: string;
  /* identical across all three modes */
  abstract: string;
  /* folio — the full edition */
  sections: Section[];
  /* octavo/pamphlet tiers + press analysis; absent on older editions */
  condensed?: Section[];
  brief?: Section[];
  meta?: PaperMeta;
  /* engraving-style generated hero art for the poster (public path) */
  posterArt?: string;
  /* the engraver's own explanation of its diagram */
  posterCaption?: string;
  /* measured against the manuscript's own OCR text — real numbers, no vibes */
  pressStats?: {
    originalChars: number;
    folioChars: number;
    octavoChars: number;
    briefChars: number;
  };
}
