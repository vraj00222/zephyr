<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project status

Last updated: 2026-08-21

**START HERE after a restart: `../HANDOFF.md` (repo root) — full project map, image inventory, backend pipeline spec, and remaining-work list. Decision log: `DECISIONS.md` (same folder). Keep all three updated.**

## What this is

**Zéphyr** (Folio → Minerva → Zéphyr, all 2026-08-21; Zéphyr = the Mistral wind's gentle sibling — final) — landing page for a SaaS that re-typesets arXiv papers/PDFs into readable "editions". Cream/editorial design, cobalt accent, Next.js 16 + Tailwind v4 + framer-motion.

## Voice rule (user-set)

Never explain the mechanism. No vendor/stack names (Mistral, Modal, OCR, LaTeX, pipeline) anywhere user-facing. Narrative is **issue → solution → magic**: the "Why Zéphyr" section runs The issue / The solution / The magic cards; processing stages are press-craft flavor ("Receiving the manuscript … Binding the edition"), not tech steps. `--color-folio-blue` token name kept internally (invisible to users).

## Landing page structure (`app/page.tsx`)

Nav → Hero → Marquee → HowItWorks → Features → LibraryScroll → Gallery → CtaBanner → Footer → BackgroundSwitcher (fixed, bottom-right). Everything lives inside `BackgroundProvider`.

## Background system

- `lib/backgrounds.ts` — 21 plates (plain cobalt + images incl. lib1–6, underscore.jpeg, aesthetic1–3, bg1–8, platoreading, backgroundtest).
- `components/landing/background-context.tsx` — provider; supports `?bg=<id>` and `?shuffle` URL params (applied via deferred timeout to satisfy react-hooks/set-state-in-effect), auto-shuffle every 5s.
- `components/landing/background-switcher.tsx` — thumbnail panel + auto-shuffle toggle.
- Hero `Backdrop`: all plates stay mounted; switching is a pure 1.2s crossfade. Images are `unoptimized` next/image, full quality. Slow Ken Burns zoom via `.ken-burns` (globals.css). Container has a bottom CSS mask fade (~85%→100%) so the photo blends seamlessly into the cream page — no hard border. Scrims render only when an image plate is active; "plain" = pure cobalt inside the masked layer.
- LibraryScroll plates are clickable — they set the site background through the context.

## In progress / TODO

- Source JPGs are low-res (512–1200px); user wants crisp look — currently mitigated with unoptimized originals + Ken Burns. Real fix = higher-res assets.

## Polish pass v3 (2026-08-21, night) — AUREA-style hero

Hero respun to match the user's AUREA references (screen-wide classical art, components overlaid, pushed up).

- **Hero** (`components/landing/hero.tsx`): full-viewport (`min-h-svh`) with two user-supplied 1280×720 scenes as screen-wide backgrounds — `herowide.jpg` (all-classical) and `herowide2.jpg` (classical + modern glass building). They crossfade every 9s ("the temple becomes glass"; skipped under reduced motion). Kept CLEAR per user: only a left→right cream wash (solid→0.82@28%→0.35@52%→transparent@74%) for type, a bottom fade into page cream, grain at 0.07 multiply. Mobile adds a vertical `from-paper/85` wash (figure sits behind copy there). `object-[70%_center]` keeps the philosopher in frame.
- Copy block pushed up (pt-28/32): eyebrow → 2-line serif headline (whitespace-nowrap ≥sm; gold flourish under cobalt italic "first edition.") → sub → **compact command-bar form** (pill: input + cobalt "Typeset it", drag-drop PDF onto the pill, ring-cobalt while dragging) → mono "…or drop a PDF" file-picker link.
- **Principles strip** at hero bottom (AUREA-style): 4 items (Set like a book / Figures that move / Citations resolve / Print-ready A4) with inline SVG glyphs, hairline dividers on lg, `bg-paper/75 backdrop-blur`.
- **Background-plate system retired from the page**: page.tsx no longer mounts BackgroundProvider/BackgroundSwitcher; LibraryScroll plates are now static gallery cards (no select). Files background-context/background-switcher/lib/backgrounds.ts remain but are unmounted (backgrounds.ts still documents plate measurements: PLATE_BACKGROUNDS portrait vs WIDE_BACKGROUNDS).
- Kept from v2: white-glass nav (ink links, cobalt CTA), Newsreader serif headlines everywhere, Interlude (wide bg3 full-bleed quote band), aesthetic3 accent in how-it-works, aesthetic1 in features wide card, spring-smoothed LibraryScroll, grain utility, borderless marquee.
- Rule that still stands: tall/portrait art is never stretched wide; placement follows image measurements.

## v5 (2026-08-21, late) — layout fixes + backend-ready

- Why-Zéphyr: 3 equal cards (no stretched middle), julius1.jpg retro plate inline in header row (was absolutely-positioned aesthetic3, which overlapped cards). julius1.jpg came from the "julius reading" saved X page in screenshots/.
- Features wide card: compact single-row layout (title+quote left, aesthetic1 right) — no more dead vertical space.
- CTA pb halved; Footer is now a full SaaS footer (brand+CTA, Explore/Start columns, colophon).
- **Backend-ready** (contract + env vars in DECISIONS.md): `lib/backend.ts`; /api/jobs accepts JSON or multipart (real PDF bytes now uploaded from hero via fileObj ref); /api/jobs/[id] proxies + normalizes paperUrl, emits {status:"failed"}; new server fetch in /paper/[slug] renders backend ShowcasePaper JSON with showcase fallback; processing-client renders failed state; hero shows inline errors. Simulation runs whenever ZEPHYR_BACKEND_URL is unset.

## Conventions

- Design tokens in `app/globals.css` @theme (paper/panel/ink/cobalt/flame/gold/mist). Easing: `.ease-out-expo` utility.
- Scroll-reveal via `components/reveal.tsx`. Print styles target `.print-sheet`, switcher is `.no-print`.
- Verify with `npm run lint && npx tsc --noEmit`; dev server runs on :3000.

