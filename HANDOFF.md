# ZÉPHYR — FULL HANDOFF DOC

> **If you are a fresh agent: read this file top to bottom before touching anything.**
> It survives session restarts and even a `rm -rf .git` + re-init. Companion docs:
> `site/AGENTS.md` (agent working notes) and `site/DECISIONS.md` (decision log +
> backend API contract). Keep all three updated as you work.

---

## 1. What this project is

**Zéphyr** — a SaaS that re-typesets dense research papers (arXiv links or
uploaded PDFs) into beautiful, readable "editions". Think 1kpapers.com but the
paper itself is re-set: real typography, moving figures, resolving citations,
white-paper/black-ink reading surface. The magic under the hood is Mistral OCR +
LLM restructuring — **but we never say that on the site** (see Voice, §4).

- Name history: Folio → Minerva → **Zéphyr** (final). Zéphyr = the gentle west
  wind, sibling of the Mistral wind. Use "Zephyr" (no accent) for slugs/domains.
- Stack: Next.js 16 (App Router) + Tailwind v4 + framer-motion. Dev on :3000.
- Owner: Vraj (vrajpatel00222@gmail.com). Backend is being built by Vraj
  separately — frontend must stay plug-and-play against the contract in §7.

## 2. Repo layout — what to touch, what not

```
paper/
├── HANDOFF.md            ← this file. Keep current.
├── .gitignore            ← root ignores (junk + saved-webpage clutter)
├── background/           ← IMAGE SOURCE LIBRARY (user-curated; see §5)
├── screenshots/          ← inspiration refs + QA screenshots (v2-…v7-*.jpeg)
│   └── julius reading_files/  ← saved X page; GITIGNORED clutter. The one
│                                useful photo was extracted already (julius1).
└── site/                 ← THE APP (everything happens here)
    ├── AGENTS.md         ← agent working notes (auto-header from next dev)
    ├── DECISIONS.md      ← decision log + BACKEND CONTRACT (§7 mirrors it)
    ├── .env.example      ← backend env template (committed; .env.local is not)
    ├── app/
    │   ├── layout.tsx    ← fonts (Geist, Geist Mono, Newsreader) + metadata
    │   ├── globals.css   ← design tokens, grain/flourish/marquee utilities
    │   ├── icon.svg      ← favicon (cobalt tile, serif italic Z)
    │   ├── page.tsx      ← landing: section order lives here
    │   ├── api/jobs/…    ← job create + status (backend proxy w/ sim fallback)
    │   ├── processing/[jobId]/ ← press progress screen
    │   └── paper/[slug]/ ← edition viewer page (backend fetch w/ showcase fallback)
    ├── components/
    │   ├── landing/      ← nav, hero, marquee, how-it-works, readers-strip,
    │   │                    features, interlude, library-scroll, gallery,
    │   │                    cta-banner, footer
    │   │                    (background-context/background-switcher = UNMOUNTED
    │   │                     leftovers; safe to delete or revive)
    │   ├── processing/processing-client.tsx
    │   └── paper/        ← paper-viewer, mode switcher, canned figures
    └── lib/
        ├── types.ts      ← ShowcasePaper + Block union (THE edition schema)
        ├── jobs.ts       ← simulation engine + press-stage labels
        ├── backend.ts    ← ZEPHYR_BACKEND_URL/KEY wiring
        ├── backgrounds.ts← image measurements table (PLATE vs WIDE) — mostly
        │                    reference now; LibraryScroll has its own PLATES list
        └── showcase-paper.ts ← the demo "Attention Is All You Need" edition
```

**Do NOT:**
- Stretch/crop tall (portrait) images into wide slots — hard user rule. Wide
  images go full-bleed; portrait images go in frames/plates at natural aspect.
- Name the tech (Mistral/Modal/OCR/LaTeX/pipeline) in ANY user-facing copy.
- Bring back the cobalt navbar — nav is white glass, always.
- Re-verify by trusting a fullPage Playwright screenshot — scroll-reveal
  sections capture mid-animation; verify per-viewport instead.

**Verify with:** `cd site && npm run lint && npx tsc --noEmit`, then Playwright
against `npm run dev` (server usually already running on :3000).

## 3. Design system (locked)

- **Colors** (globals.css `:root` + `@theme`): cream paper `#F6F1E5`, panel
  `#FBF8F0`, ink `#161310`, cobalt `#2440C9` (accent + CTAs), flame `#D6481F`
  (errors/small accents), gold `#E8A93C` (flourish, badge dot), mist `#6F6A60`.
  (`--color-folio-blue` is a legacy alias for cobalt — internal only.)
- **Type**: Newsreader (serif) for ALL display/headlines — medium weight,
  tracking −0.01/−0.02em, cobalt italic accent word per headline, gold SVG
  flourish under the hero's "first edition." Geist = body/UI. Geist Mono =
  kickers/labels (10px, tracked 0.18–0.24em, uppercase).
- **Texture**: `.grain` utility (inline SVG turbulence) at 0.06–0.14 opacity on
  image surfaces. `.ease-out-expo` for all transitions (500–700ms).
- **Motion**: Reveal (whileInView, once) for sections; spring-smoothed
  horizontal library walk; hero scenes crossfade 9s (paused for reduced motion);
  hover = lift + shadow + small transforms. Subtle > flashy.
- **Nav**: fixed white-glass pill (`bg-white/65 backdrop-blur`), ink links with
  underline-draw hover, cobalt "Typeset a paper" pill.

## 4. Voice (user-set, strict)

Issue → solution → magic. **We never explain the magic trick.** Processing
stages read as press craft: "Receiving the manuscript → Reading every page →
Re-setting the argument → Binding the edition". Errors are plain and directive
("The press is unreachable. Is the backend running?"). Register: small-press
letterpress romance; short sentences; no filler; sentence case.

## 5. Image library (measurement-driven placement)

Rule: **placement follows the image's own measurements.** Portrait/square →
framed plates/components at natural aspect. Wide/landscape → full-bleed
backgrounds. Never widen a tall image.

Currently placed (all in `site/public/backgrounds/`, sources in `background/`):

| File | Size | Where it's used |
|---|---|---|
| herowide.jpg / herowide2.jpg | 1280×720 | Hero full-bleed scenes (classic ↔ modern glass, 9s crossfade) |
| long.jpg | 816×1456 | Poster wall "Refresh." (statue w/ gold sunglasses) |
| long2.jpg | 735×1040 | Poster wall "Zéphyr." (blue angel = the west wind) |
| long3.jpg | 1152×2048 | Poster wall "Look up." (cathedral look-up) |
| long6.jpg | 500×939 | Poster wall "Think." (brain-collage thinker) |
| long4.jpg | 1152×2048 | **BENCHED** — statue at laptop on green; use for empty/error states or a future band |
| julius1.jpg | 992×1200 | Why-Zéphyr header plate "how we've been reading" (retro console, cobalt sky) |
| readingroom.jpg | 1030×575 | Interlude full-bleed (sunlit study under the pull-quote) |
| readingimage.jpeg | 736×1308 | Reading-rooms walk "The sketchbook" |
| readingroom2.jpg | 1080×2330→resized | Reading-rooms walk "The story shelf" |
| aesthetic1.jpg | 736×920 | Features wide card plate |
| collage.jpeg / underscore.jpeg | 736×1308 | Collage family; collage was the old hero plate, both still in walk/available |
| lib1–6, platoreading, bg5–8 | portrait/square | Reading-rooms walk plates / available |
| bg2.jpg | 900×679 wide | CTA banner full-bleed |
| bg1/bg3/bg4/backgroundtest | wide | Available for full-bleed use (bg3 was the old interlude) |

Inspiration refs live in `screenshots/` (`insp*.jpeg` = cobalt risograph;
AUREA refs; `v2–v7-*.jpeg` = QA states after each pass). The
`screenshots/julius reading_files/` folder is a saved X page — gitignored
clutter; its one useful photo is already extracted as julius1.

**Pinterest MCP**: `pinterest-mcp-server` was registered via `claude mcp add
pinterest -- npx pinterest-mcp-server` — after a session restart its tools
(pinterest_search / pinterest_get_image_info / pinterest_search_and_download)
appear natively. Fallback: drive it over stdio JSON-RPC (helper existed at the
old scratchpad as `mcpcall.sh`; trivial to recreate — init, initialized,
tools/call). Prior searches (zephyr wind god, Botticelli) were reviewed and
rejected — off-brand. The bar: cobalt-engraving/riso classical, cream ground.

## 6. What's DONE (don't redo)

Landing page (order in `page.tsx`): Nav → Hero (AUREA-style full-bleed, 2-scene
crossfade, command-bar form w/ real PDF upload, principles strip) → Marquee →
Why Zéphyr (issue/solution/magic cards + julius plate) → **Poster wall** ("For
readers, not reviewers." — 4 posters, animated type overlays) → Features (3
cards + compact wide card) → Interlude (readingroom full-bleed quote) →
Reading-rooms walk (spring-smoothed horizontal scroll, 9 plates) → Gallery
(before/after + showcase cards) → CTA banner → SaaS footer. Plus: processing
screen (dark press card, 4 stages, failed state), paper viewer (serif edition,
TOC, 3 modes, image-block support, derived citation), favicon, rename
everywhere, lint/tsc clean, all verified in Playwright desktop + 390px mobile.

Frontend↔backend plumbing is DONE and tested in simulation: multipart PDF
upload, JSON link submit, proxy routes, status polling incl. `failed`, paper
fetch w/ fallback. See §7.

## 7. Backend contract + env (hackathon: building INSIDE the Next API routes)

> 2026-08-22 decision: no separate backend server. The pipeline (Mistral OCR →
> chat restructure → edition JSON) runs directly in the Next API routes, keyed
> off `MISTRAL_API_KEY` in `site/.env.local`. `lib/mistral.ts` is the client.
> The external-backend contract below still works if `ZEPHYR_BACKEND_URL` is set.
>
> HACKATHON DAY STATE (2026-08-22 midday):
> - Press = 4 parallel plates per paper (lib/press-prompt.ts): FOLIO (full,
>   paper's structure) / OCTAVO (½ length, verbatim passages «» verified
>   deterministically vs OCR, printed on orange wash) / PAMPHLET (5 fixed
>   analysis sections) / LENS (field, hard-part, 1-10 importance, must-reads).
>   Then proofread (mistral-small, contradictions only) + surgical find/replace
>   repair. Viewer hides the badge when flagged > 40% of checked (inconclusive).
> - Editions on disk (data/papers/): attention-live, resnet, deepseek-r1,
>   mixtral-of-experts, ddpm. Figures in public/figures/{jobId}/.
> - Poster: /paper/[slug]/poster — fits one screen (measured scale), flip-in,
>   generated engraving hero art in public/posters/ (attention, resnet,
>   deepseek; art generated via Constants create_image — credits exhausted
>   until Sept 9, Mixtral/DDPM fall back to ink-duotone real figure).
> - Ask-the-edition streaming companion on every paper page (mistral-medium).
> - Accent = Mistral orange #fa500f (cobalt #2440c9 kept in globals comment).
>   Cat gifs + logo in public/mistral/.
> - Live: https://zephyr-swart-phi.vercel.app (demo mode, no key on Vercel).
>   Deploy: cd site && vercel deploy --prod --yes (project "zephyr").
> - Mistral Vibe CLI installed (`vibe`); co-authored commits in history.
> - POSTER ART is a swappable provider (lib/pipeline.ts generatePosterArt,
>   env POSTER_ART_PROVIDER: none | mistral-svg). External generator lives at
>   ~/dev/modal-kontext: FLUX.1-Kontext-dev self-hosted on Modal (H100, weights
>   in volume zephyr-kontext-cache, secret huggingface-secret). Batch:
>   ~/dev/modal-kontext/batch_posters.sh -> writes site/public/posters/art/
>   {slug}.png, which the poster page auto-prefers over everything else.
>   Division: Mistral = OCR + all text + Vibe; FLUX-on-Modal = images.

Frontend env (`site/.env.local`, template in `.env.example`):

```
ZEPHYR_BACKEND_URL=http://localhost:8000    # unset → simulation mode
ZEPHYR_BACKEND_KEY=optional-bearer-token
```

All browser calls go through Next API routes; the key never reaches the client.

**Three endpoints to implement:**

```
POST {BACKEND}/jobs
  multipart/form-data: file=<pdf bytes> AND/OR source=<arxiv url | title>
  → 200 { "jobId": "abc123", "title": "…" }

GET {BACKEND}/jobs/{jobId}
  → { "status":"running", "stageIndex":0-3, "stagePct":0-100,
      "overallPct":0-100, "etaMs":540000, "title":"…" }
  → { "status":"complete", "paperSlug":"…" }   (slug|paperId|paperUrl also ok)
  → { "status":"failed", "error":"human-readable reason" }

GET {BACKEND}/papers/{slug}
  → edition JSON, shape = ShowcasePaper in site/lib/types.ts:
    { slug, title, authors[], venue, arxiv, readingTime, tldr, abstract,
      sections:[{ id, number, title, blocks: Block[] }] }
  Block: p | h3 | bullets | quote | callout | explain
       | figure (canned demo charts) | image { src, caption, label? } | stats
  → REAL figures should be emitted as `image` blocks (URL the frontend can
    load; serve extracted figure crops from the backend, e.g. /figures/{id}.png)
```

**Suggested pipeline (maps 1:1 to the 4 UI stages):**

1. **stage 0 — receive**: accept upload or resolve arXiv (download PDF from
   arxiv.org/pdf/{id}). Create job (id, title guess). Store PDF.
2. **stage 1 — read**: Mistral OCR (Document AI / `mistral-ocr-latest`) over
   the PDF → markdown + extracted images. Save figure images to serve later.
3. **stage 2 — restructure**: Mistral chat model over the OCR markdown with a
   structured-output prompt → the ShowcasePaper JSON (sections, tldr, abstract,
   to-the-point rewritten prose, callouts/stats where present, `image` blocks
   referencing the extracted figures, citations kept inline).
4. **stage 3 — render/bind**: validate JSON against the Block schema, compute
   readingTime, slugify title, persist (SQLite or JSON-on-disk is fine),
   mark complete with paperSlug.

Progress: keep per-job stageIndex/stagePct in memory or DB; etaMs can be a
rough estimate (10–15 min budget). Failures → `status:"failed"` with a human
message (frontend renders it verbatim). Auth: check `Authorization: Bearer`
iff you set a key. CORS: not needed (server→server via the Next proxy).
Test flow: `.env.local` → restart `npm run dev` → paste an arXiv link → watch
the press → land on `/paper/{slug}`.

## 8. Remaining work (in priority order)

**Frontend (small, optional-polish tier):**
1. When first real paper renders: QA the viewer against real content (long
   sections, many image blocks, long titles, missing tldr/venue) and harden
   empty states. `explain` block has a defined type but no bespoke styling pass.
2. Mobile pass for the poster wall at very narrow widths (2-col currently).
3. Hero form: maybe surface upload progress for big PDFs (currently spinner text).
4. Consider using benched long4.jpg (empty/error state or a band).
5. Print stylesheet exists (`.print-sheet`) — QA the print/PDF path.
6. Optional: revive plate-switching as a paper-viewer theme picker (the old
   background-context files are still in the repo, unmounted).

**Backend (the actual tomorrow-work): §7 is the whole spec.**

**If git gets nuked / re-init:** `git init` at repo root; both .gitignore files
are already written (root ignores the saved-webpage clutter, site ignores
node_modules/.next/.env*, keeps `.env.example`). Commit everything else,
including background/, screenshots/*.jpeg refs, and all three docs. No secrets
exist in the tree; `.env.local` (if present) stays ignored.

## 9. Session bootstrap for the next agent

1. Read this file, then `site/DECISIONS.md`, then `site/AGENTS.md`.
2. `cd site && npm run dev` (check :3000 first — often already running).
3. Ask Vraj: is the backend up? If yes → wire `.env.local`, run 1–2 real
   papers, fix what breaks in the viewer. If no → pick from §8 frontend list.
4. Verify every change: lint + tsc + Playwright viewport screenshots
   (desktop 1440×900 and mobile 390×844). Save QA shots to `screenshots/`.
5. Log decisions in DECISIONS.md; update this file if the map changes.
