import type { ShowcasePaper } from "@/lib/types";

export const SHOWCASE_PAPER: ShowcasePaper = {
  slug: "attention-is-all-you-need",
  title: "Attention Is All You Need",
  authors: [
    "Ashish Vaswani",
    "Noam Shazeer",
    "Niki Parmar",
    "Jakob Uszkoreit",
    "Llion Jones",
    "Aidan N. Gomez",
    "Łukasz Kaiser",
    "Illia Polosukhin",
  ],
  venue: "NeurIPS 2017 · Google Brain · Google Research",
  arxiv: "arXiv:1706.03762",
  readingTime: "12 min read",
  tldr: "Recurrence is dropped entirely. Stacked self-attention alone sets a new state of the art in translation — and becomes the blueprint for modern language models.",
  abstract:
    "The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.",
  sections: [
    {
      id: "introduction",
      number: "1",
      title: "Introduction",
      blocks: [
        {
          type: "explain",
          title: "Why this paper matters",
          text: "Before 2017, nearly every language model processed text word by word, in order, like reading through a straw. This paper showed that order isn't sacred — a network that sees all words at once, and learns which ones matter to each other, works better and trains faster. Almost every large language model since is a descendant of this idea.",
        },
        {
          type: "p",
          text: "Recurrent networks process language one token at a time, folding each word into a hidden state that carries the whole past. That sequential chain is elegant — and it is also the bottleneck. It forbids parallelism across a sequence, and long-range dependencies must survive dozens of hops through memory.",
        },
        {
          type: "p",
          text: "The Transformer removes the recurrence. Every position looks at every other position directly through self-attention, so the distance between any two tokens is one hop, and the entire sequence is processed in parallel.",
        },
        {
          type: "quote",
          text: "The Transformer allows for significantly more parallelization and can reach a new state of the art in translation quality after being trained for as little as twelve hours.",
          cite: "§1, abridged",
        },
      ],
    },
    {
      id: "background",
      number: "2",
      title: "Background",
      blocks: [
        {
          type: "p",
          text: "Prior work already used attention as an add-on to recurrent decoders. The Transformer's move is to keep attention and throw away the recurrent backbone it was attached to. Position information, which recurrence provided implicitly, is re-injected with positional encodings added to the input embeddings.",
        },
        {
          type: "bullets",
          items: [
            "Self-attention connects all positions with a constant number of operations.",
            "Layer computation is independent of sequence length, enabling full parallelism.",
            "Shorter paths between distant tokens make dependencies easier to learn.",
          ],
        },
      ],
    },
    {
      id: "architecture",
      number: "3",
      title: "Model Architecture",
      blocks: [
        {
          type: "p",
          text: "An encoder stack maps the input sequence to continuous representations; a decoder stack generates the output one token at a time. Both stacks are built from repeated blocks of multi-head self-attention and position-wise feed-forward layers, each wrapped in residual connections and layer normalization.",
        },
        {
          type: "explain",
          title: "Attention, explained simply",
          text: "Think of each word asking a question (a query) and every other word offering a label (a key) plus its content (a value). Attention scores how well each question matches each key, then blends the values by those scores. The result: every word's new representation is a weighted mix of the words it cares about.",
          points: [
            "Query — what this word is looking for",
            "Key — what each candidate word advertises",
            "Value — the content actually passed along",
          ],
        },
        {
          type: "callout",
          title: "Scaled dot-product attention",
          text: "Queries and keys dot-multiply, are scaled by √dₖ to keep softmax gradients healthy, and weight a mix of value vectors. It is one matrix multiplication away from being fully parallel hardware.",
        },
        {
          type: "figure",
          figure: "attention",
          label: "Fig. 1",
          caption:
            "Self-attention in the encoder's first layer — heads distribute weight across positions, letting every token consult every other token in a single step.",
        },
        {
          type: "h3",
          text: "Multi-head attention",
        },
        {
          type: "p",
          text: "Instead of one large attention operation, eight heads attend in parallel over lower-dimensional projections. Each head learns a different relational pattern — syntactic, positional, or semantic — and their concatenated outputs are mixed by a final linear layer.",
        },
        {
          type: "h3",
          text: "Positional encoding",
        },
        {
          type: "p",
          text: "Since no recurrence exists, order is injected with sinusoidal functions of position. The fixed sinusoids performed comparably to learned embeddings and extrapolate to longer sequences than those seen during training.",
        },
      ],
    },
    {
      id: "results",
      number: "4",
      title: "Results",
      blocks: [
        {
          type: "stats",
          items: [
            { value: "28.4", label: "BLEU · EN→DE (big)" },
            { value: "3.5 days", label: "Training · 8 GPUs" },
            { value: "8", label: "Attention heads" },
          ],
        },
        {
          type: "figure",
          figure: "bleu",
          label: "Fig. 2",
          caption:
            "BLEU on WMT 2014 English-to-German. Both Transformer variants surpass the best prior recurrent and convolutional systems at a fraction of the training cost.",
        },
        {
          type: "p",
          text: "On WMT 2014 English-to-German, the big Transformer reaches 28.4 BLEU, improving over the best previously reported ensembles by more than two points. On English-to-French it sets 41.8 BLEU in under four days on eight GPUs — a small fraction of the cost of prior state-of-the-art training runs.",
        },
        {
          type: "figure",
          figure: "loss",
          label: "Fig. 3",
          caption:
            "Training loss versus steps. Full parallelism lets the model converge in hours rather than weeks, even at base scale.",
        },
        {
          type: "explain",
          title: "Reading the numbers",
          text: "BLEU measures overlap between machine output and human reference translations — higher is better, and single-point gains are considered significant in this field. The base model beats prior systems while training on roughly a quarter of the compute; the big model pushes further at still modest cost.",
        },
      ],
    },
    {
      id: "conclusion",
      number: "5",
      title: "Conclusion",
      blocks: [
        {
          type: "p",
          text: "The Transformer is the first sequence transduction model built entirely on attention, replacing recurrence with parallelizable multi-head self-attention. It trains faster, scores higher, and generalizes cleanly to other tasks — the architecture underneath essentially every large language model since.",
        },
        {
          type: "quote",
          text: "Attention is all you need — the rest was scaffolding.",
          cite: "Folio editorial note",
        },
      ],
    },
  ],
};

export function buildPaperForSlug(slug: string, titleOverride?: string): ShowcasePaper {
  if (!titleOverride || slug === SHOWCASE_PAPER.slug) {
    return SHOWCASE_PAPER;
  }
  return {
    ...SHOWCASE_PAPER,
    slug,
    title: titleOverride,
    authors: ["Uploaded manuscript"],
    venue: "Private upload · pipeline preview",
    arxiv: "—",
    readingTime: "~10 min read",
    tldr: "This manuscript is running through the same beautification pipeline shown on this demo paper.",
  };
}
