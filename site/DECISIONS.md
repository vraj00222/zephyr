# Zéphyr — decision log

A running log of product/design/engineering decisions. Newest first.
(Working notes for agents live in AGENTS.md; this file is the human-readable record.)

## 2026-08-21 — Poster wall + new user imagery + Pinterest MCP

- **New "For readers, not reviewers." section** (`readers-strip.tsx`, after
  Why-Zéphyr): NASA-photo-essay rhythm — four of the user's "long" images as
  staggered posters at natural aspect with animated serif overlay type
  ("Refresh." / "Zéphyr." / "Look up." / "Think."), mono kickers, scrims that
  deepen and type that lifts/tracks on hover. long4 (statue at laptop) benched
  for later use.
- New reading-room images placed by measurement: readingroom.jpg (wide) is now
  the Interlude's full-bleed background; readingimage.jpeg + readingroom2.jpg
  joined the reading-rooms walk as "The sketchbook" / "The story shelf".
- **Pinterest MCP**: registered via `claude mcp add pinterest` (needs session
  restart to appear as native tools); meanwhile driven directly over stdio
  JSON-RPC from bash (`scratchpad/mcpcall.sh`). Two searches run (zephyrus wind
  god, Botticelli Primavera details); results reviewed and deliberately NOT
  used — painterly/kitsch, off the cobalt-engraving brand. The user's own
  images won.

## 2026-08-21 — Rename: Minerva → Zéphyr (final)

User didn't connect with Minerva; wanted something tied to Mistral / paper /
research / French / classical. **Zéphyr** — the gentle west wind (Greek
Zephyrus, French spelling), sibling of the Mistral wind: dense papers arrive on
the mistral, read like a zephyr. Applied site-wide; favicon is a cobalt tile
with a serif italic Z (`app/icon.svg`). Use plain "Zephyr" where diacritics
can't go (domains, slugs). Runners-up kept on file: Aldine, Scholia, Didot, Stoa.

## 2026-08-21 — Remaining-UI pass (processing + paper viewer)

- **Processing screen**: `mesh-field`/`mesh-orb` classes were never defined in
  CSS — the glow orb rendered as a giant unstyled block. Replaced with a
  proper absolute cobalt glow + grain. Error/expired states used white text on
  the (now cream) page — recolored to ink. Copy de-simulated ("demo timeline"
  removed; "Leave the tab open — we'll open it the moment it's bound.").
- **Paper viewer**: old "F" logo chip → serif italic "Z"; the citation footer
  was hardcoded to Vaswani 2017 — now derived from the paper's own metadata.
- **New `image` block** in the edition format ({ type: "image", src, caption,
  label? }) so backend-extracted figures render as framed images. The three
  canned animated figures (loss/bleu/attention) remain for showcase papers.
  Backend contract updated: emit real figures as `image` blocks.

## 2026-08-21 — Backend-ready frontend

**Decision: the frontend is fully wired for a real backend behind two env vars, with the simulation as automatic fallback.**
Set in `site/.env.local` (template in `.env.example`):

- `ZEPHYR_BACKEND_URL` — base URL of the backend (e.g. `http://localhost:8000`)
- `ZEPHYR_BACKEND_KEY` — optional; sent as `Authorization: Bearer <key>`

All browser traffic goes through Next API routes (the key never reaches the client). With the vars unset, the old timed simulation runs, so the demo never breaks.

**The contract the backend must implement (3 endpoints):**

```
POST {BACKEND}/jobs
  multipart/form-data:  file=<pdf bytes>  and/or  source=<arxiv url | title>
  → 200 { "jobId": "abc123", "title": "Attention Is All You Need" }

GET {BACKEND}/jobs/{jobId}
  → { "status": "running", "stageIndex": 0-3, "stagePct": 0-100,
      "overallPct": 0-100, "etaMs": 540000, "title": "..." }
  → { "status": "complete", "paperSlug": "attention-is-all-you-need", "title": "..." }
      (paperSlug | slug | paperId all accepted; or send a full "paperUrl")
  → { "status": "failed", "error": "human-readable reason" }
  stageIndex meaning (shown to users as press-craft, keep 4 stages):
    0 receive · 1 read/OCR · 2 restructure · 3 render

GET {BACKEND}/papers/{slug}
  → the edition document, shape = ShowcasePaper in site/lib/types.ts:
    { slug, title, authors[], venue, arxiv, readingTime, tldr, abstract,
      sections: [{ id, number, title, blocks: Block[] }] }
    Block types: p, h3, bullets, quote, callout, explain, figure, stats, image
    (see lib/types.ts for exact fields — this is what the viewer renders)
```

What was changed to support this: hero uploads real PDF bytes (multipart) instead
of just the filename; `/api/jobs` and `/api/jobs/[jobId]` proxy + normalize;
new server-side fetch in `/paper/[slug]` renders backend documents and falls
back to the showcase paper; processing screen handles `failed` with a retry
path; inline error line under the hero command bar.

**To test tomorrow:** put the URL/key in `.env.local`, restart `npm run dev`,
paste an arXiv link or drop a PDF. Everything else is already wired.

## 2026-08-21 — Layout fixes (user review round)

- **Why-Zéphyr bento**: three equal cards (the stretched wide middle card read
  as empty space); card content flows top-down, no vertical centering.
- **Accent image overlap**: the tilted plate no longer floats absolutely over
  the cards; it sits inline in the header row. It's now the "julius reading"
  retro-computing photo (cream console, cobalt sky — matches the palette),
  captioned "how we've been reading" — it illustrates *The issue*.
- **"Set like a book" wide card**: rebuilt as one compact row (title+body+quote
  left, plate right) — the tall empty middle is gone.
- **Page bottom**: CTA banner bottom padding halved; footer upgraded to a real
  SaaS footer (brand + tagline + CTA, Explore/Start link columns, colophon
  line) so the page ends with substance instead of blank cream.

## 2026-08-21 — Voice: issue → solution → magic

Never explain the mechanism. No vendor/stack names (Mistral, Modal, OCR,
LaTeX, "pipeline") anywhere user-facing. Why-Zéphyr runs The issue / The
solution / The magic. Processing stages read as press craft ("Receiving the
manuscript … Binding the edition"). We don't explain the magic trick.

## 2026-08-21 — Rename: Folio → Minerva (superseded same day)

Minerva, goddess of wisdom — she's literally the statue in the hero art.
Applied site-wide, then replaced by Zéphyr later the same evening (see top).

## 2026-08-21 — AUREA-style hero

Screen-wide classical art (user-supplied 1280×720 scenes) with components
overlaid: headline pushed up, compact command-bar form, principles strip along
the bottom. Two scenes crossfade every 9s — the temple becomes glass (classic ↔
modern), paused under reduced motion. Only a left cream wash for legibility;
the art stays clear. Portrait art is never stretched wide — placement follows
each image's measurements.

## 2026-08-21 — Type & system

Newsreader serif for all display type (cobalt italic accent + gold flourish);
Geist body, Geist Mono labels. White-glass nav pill. Cream `#F6F1E5`, cobalt
`#2440C9`, gold and flame accents. Risograph grain utility. Spring-smoothed
horizontal library walk.
