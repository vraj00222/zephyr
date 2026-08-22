# ZÉPHYR — DEMO KIT (Mistral Vibe hackathon, 2026-08-22)

> Submission 5:30 PM with mandatory video → private 5-min judge demo (with Q&A)
> from your laptop → finalists demo again. The site at **localhost:3000 IS the demo.**
> Slogan everywhere: **"Papers people actually read."**

---

## 1. Video script (90–120 seconds)

Record at 1440×900, Chrome app-mode, cursor visible. The live press takes ~2–3 min —
**press Mistral 7B BEFORE recording**, then re-enact the paste and jump-cut to a
pre-recorded press clip (or timelapse the stages). Speak slow; the lines are short on purpose.

| Time | On screen | Voiceover |
|---|---|---|
| 0:00–0:08 | An arXiv PDF of Mistral 7B, two-column, tiny type. Scroll it painfully. | "This is how we read research. Two columns. Ten pages. Nobody finishes." |
| 0:08–0:16 | Cut to `localhost:3000`. Hero. Pause a beat on the headline. | "Zéphyr is a printing press for papers." |
| 0:16–0:24 | Paste `https://arxiv.org/abs/2310.06825` into the command bar. Click **Typeset it**. | "Give it an arXiv link — this is Mistral's own paper — and hit typeset." |
| 0:24–0:38 | `/processing/…` press screen. Stages tick: reading every page → re-setting the argument. The cat is on screen. Timelapse. | "The press reads every page, then re-sets the whole argument. The cat supervises." |
| 0:38–0:52 | `/paper/mistral-7b`. Scroll slowly. Flip the three tiers: Folio → Octavo → Pamphlet. | "Out comes an edition. Three cuts: the whole paper, the half-hour version, and a five-minute brief." |
| 0:52–1:04 | Stay on Octavo. Hover an orange passage. Then point at the proofread badge + the stats line. | "Everything in orange is the authors' exact words — verified against the source, character for character. And the edition proofreads itself before you see it." |
| 1:04–1:16 | Open Ask-the-edition. Type: "Why sliding window attention?" Answer streams in. | "Got a question? Ask the edition. It answers from this paper — nothing else." |
| 1:16–1:26 | `/paper/mixtral-of-experts/poster`. Let the flip-in play. | "Every paper gets a poster. Print it. Put it on the lab wall." |
| 1:26–1:42 | Back to the hero. Drop `fw9.pdf` onto the command bar. The press rejects it — hold on the quip for 2 full seconds. | "And it knows what a paper is. I fed it a tax form. The doorkeeper had opinions." |
| 1:42–1:55 | Hero, slow zoom on the headline. End card: **Zéphyr — Papers people actually read.** | "Zéphyr. Papers people actually read." |

Do-not-say list for the video: pipeline, OCR, LLM, prompt, JSON. The site never says it; neither do you.

---

## 2. Five-minute judge demo runbook

**Golden rule: start the live press in the first 30 seconds.** It takes ~2–3 min;
everything else you show is the intermission act, and it lands right when it finishes.

| Minute | Do | Say / note |
|---|---|---|
| **0:00–0:30** | Hero at `localhost:3000`. Paste `arxiv.org/abs/2310.06825` (or better: **ask a judge to name any arXiv paper** — riskier, bigger wow). Click Typeset. | "Reading papers is miserable, so I built a printing press. This is Mistral's own paper going in — it'll be ready in about two minutes. While it prints, let me show you finished editions." Leave the press tab running. |
| **0:30–2:30** | New tab → `/paper/attention-is-all-you-need-live`. Flip **Folio → Octavo → Pamphlet**. On Octavo: point at orange verbatim text, the proofread badge, the stats line ("X% shorter" — measured, not vibes). | **Wow #1: the tier flip.** **Wow #2: orange = the authors' literal words, verified deterministically — string match against the source text, no model involved.** Mention: proofreader cross-checks every claim; badge shows checked/flagged counts honestly. |
| **2:30–3:15** | Same page: **Ask the edition** — "What did they compare against?" Then hit Ctrl+Option — **Le Chat pops up.** Then `/paper/mixtral-of-experts/poster`. | **Wow #3: grounded chat, answers only from this paper.** Poster wow: "hero art is FLUX Kontext I self-host on Modal; every word on the page is Mistral." |
| **3:15–4:00** | Check the press tab — it should be binding or done. Land on the fresh `/paper/mistral-7b`. Scroll it live. Then the kicker: drag the **W-9** onto the hero. Read the doorkeeper's quip out loud. | **Wow #4: the paper they watched go in comes out re-set.** **Wow #5: the joke.** "It rejects non-papers with commentary. This is a real IRS form." |
| **4:00–5:00** | Stop driving. One closing line, then Q&A (use §3). | "Mistral OCR reads, Mistral models re-set, proofread, and analyze — and Mistral Vibe co-wrote the code; it's in the git log. Zéphyr: papers people actually read." |

**If the live press dies mid-demo** (wifi, API, anything): don't debug on stage. Say
"the press jammed — good thing the morning run is on the shelf," and carry on with the six
pre-pressed editions; the whole demo works without a single API call except doorkeeper +
Ask. If those die too, skip them — tiers, orange verbatim, badge, stats, and posters are
all served from disk. Total network loss: switch to the Vercel URL (demo mode, simulated
press, showcase edition still renders).

Pre-pressed shelf (all local, all instant):
`/paper/mistral-7b` · `/paper/attention-is-all-you-need-live` ·
`/paper/deep-residual-learning-for-image-recognition` ·
`/paper/deepseek-r1-incentivizing-reasoning-capability-in-llms-via-r` ·
`/paper/mixtral-of-experts` · `/paper/denoising-diffusion-probabilistic-models`
Best posters: `mixtral-of-experts` and `deep-residual-…` (FLUX hero art); others use the audited SVG engraving or a duotone real figure.

---

## 3. Q&A ammunition

**1. How do you prevent hallucination?**
Three layers. A proofreader model cross-checks every factual claim in the edition against the OCR'd source and a corrector applies surgical find/replace fixes; the verbatim-orange passages in Octavo are verified **deterministically** — a literal normalized string match against the source, no model in that loop; and poster diagrams go through a separate auditor that rejects and redraws wrong schematics (a plate that fails twice is discarded). And we're honest about the residue: the badge shows checked/flagged counts, and if too much is flagged the badge hides itself rather than lie.

**2. What's Mistral doing here vs other tools?**
Mistral is the entire text pipeline: `mistral-ocr-latest` reads the PDF and extracts figures; `mistral-medium` strikes all four plates (Folio, Octavo, Pamphlet, press-notes lens) plus the corrector and Ask-the-edition chat; `mistral-small` runs the doorkeeper gate and the proofreader; `mistral-large` draws the SVG architecture engravings. The only non-Mistral piece is poster hero art — FLUX Kontext self-hosted on Modal, and it's a swappable provider behind one function.

**3. How did you use Mistral Vibe?**
Vibe co-authored commits — `git log` shows `Co-authored-by: Mistral Vibe`, verifiable right now. It reviewed code and caught real bugs before they shipped, and it drafted and iterated the press prompts with me. It wasn't a demo checkbox; it was the pair programmer.

**4. Business model — who pays?**
Readers, not authors: free tier for a few pressings a month, subscription for unlimited pressing plus your personal library. Then teams — labs, reading groups, and companies whose researchers share a shelf of editions. Print-ready posters and editions are a natural physical upsell.

**5. What's next?**
Figure Q&A — ask questions about a specific plot and get answers grounded in it. Cross-paper colloquy: press two papers and have them argue. A persistent library with collections and sharing, and a native Mac reading app. The press itself already generalizes; it's shelving and conversation from here.

**6. Why three tiers?**
Because "summarize this" is a lie about how reading works — sometimes you owe a paper an hour, sometimes five minutes, and you don't know which until you start. Folio keeps the full argument, Octavo halves it while keeping the authors' own words visible in orange, Pamphlet answers "should I care?" in five minutes. Same abstract, same facts, three honest depths.

**7. How long does a paper take? What does it cost?**
Two to three minutes: OCR, then all four plates struck in parallel, then proofread and bind. Cost is pennies to roughly a dime per paper — OCR runs about a dollar per thousand pages and the plates run on mistral-medium. Cheap enough that the free tier isn't charity.

**8. What breaks it?**
Honestly: very long papers truncate at 120k characters of source text, so a 100-page monograph loses its tail — chunking is the known fix. Heavily mathematical papers can make the proofread inconclusive; when flagged claims exceed 40% of checked, the badge hides itself instead of claiming confidence it doesn't have. And scanned/ancient PDFs are only as good as the OCR.

**9. Why not just paste the PDF into a chatbot?**
A chat summary is one disposable answer with no guarantees; an edition is a typeset artifact — three depths, real extracted figures placed next to the results they support, deterministically verified quotes, a proofread badge, a poster, and grounded chat on top. You keep it, share it, print it. Chat is a feature of Zéphyr, not a substitute for it.

**10. Where do the figures come from? Are they real?**
Real crops extracted by Mistral OCR from the actual PDF — never generated. The pipeline whitelists image references against the extracted set, so the model can't invent a figure that doesn't exist; the plates are instructed to place each one beside the claim it supports.

---

## 4. Pre-demo checklist

- [ ] `cd site && npm run dev` — confirm `localhost:3000` renders the hero (server is usually already up).
- [ ] `site/.env.local` has `MISTRAL_API_KEY=...` — if missing, live press silently falls to simulation.
- [ ] Smoke-test the shelf: `/paper/mistral-7b`, `/paper/attention-is-all-you-need-live`, `/paper/deep-residual-learning-for-image-recognition`, `/paper/deepseek-r1-incentivizing-reasoning-capability-in-llms-via-r`, `/paper/mixtral-of-experts`, `/paper/denoising-diffusion-probabilistic-models` — plus `/paper/mixtral-of-experts/poster`.
- [ ] W-9 PDF on the Desktop (grab: `curl -o ~/Desktop/fw9.pdf https://www.irs.gov/pub/irs-pdf/fw9.pdf`).
- [ ] Copy `https://arxiv.org/abs/2310.06825` to the clipboard.
- [ ] Browser zoom 100%; close every other tab and window; hide bookmarks bar.
- [ ] Notifications OFF: macOS Focus/Do Not Disturb on, Slack/iMessage quit.
- [ ] Clean frame: `open -na "Google Chrome" --args --app=http://localhost:3000`
- [ ] Laptop plugged in; screen sleep off (`System Settings → Lock Screen`).
- [ ] Backup if localhost dies: `https://zephyr-swart-phi.vercel.app` (demo mode — simulated press, showcase edition; don't demo doorkeeper there).

---

## Le Chat — the voice companion (added 2:15 PM, try all of this)

**Where he lives:** bottom-right of every page, black pixel cat on the Mistral flame. Silent by default.

**Summon him (on any /paper/ page):**
- Click the cat → the speech bubble opens above him (no sound)
- Press **⌘ + ⌥** (or ⌃ + ⌥) → bubble opens AND he meows once

**What to try in the bubble:**
1. Click "Three things to remember from this paper" — answer streams in, then **Voxtral TTS reads it aloud** in Paul's voice (model: voxtral-mini-tts-latest, via /api/speak — pure Mistral)
2. Ask "why was this needed?" / "what's the key result?" — grounded only in the edition
3. The speaker icon in the bubble header toggles the voice; muting also stops playback mid-sentence
4. Asking a new question hushes the previous answer automatically

**The full Mistral voice story for judges:** Mistral OCR reads the paper → Mistral chat re-sets and answers → **Voxtral speaks the answer**. Input-to-voice, one vendor, end to end.

**Poster art note:** generated via self-hosted FLUX Kontext on Modal (swappable provider, ~13s/poster on H100); the site crops the art's title/footer bands automatically — your typeset title is the real one. Regenerate any poster: `cd ~/dev/modal-kontext && ./batch_posters.sh 768 --force` (or delete one png and re-run without --force).

---

## FINAL DEMO ORDER (v2 — gallery first, then the live press)

0:00–0:20  Intro + name/Mistral line (unchanged)
0:20–0:45  Problem (unchanged)
0:45–1:20  Homepage scroll with the per-section lines — END the scroll at the
           bento gallery and CLICK DeepSeek-R1 there.
1:20–2:10  THE FINISHED ARTIFACT (DeepSeek-R1):
           - Edition opens: "This is what a pressed paper looks like." Point:
             proofread badge, press notes, importance 9/10, drop caps, real
             figures beside the ideas.
           - Click "Poster": "Every edition gets a cover." (flip-in, engraving,
             findings strip). Back to the edition.
           - One tier flip on DeepSeek (Folio→Pamphlet) to plant the concept.
2:10–2:30  "That took the press about three minutes. Watch it happen." →
           Home → paste arxiv.org/abs/2310.06825 → "Mistral's own paper."
           15s press with the cat: "Receive, read, re-set, bind."
2:30–3:20  DEEP DIVE on the fresh Mistral 7B edition:
           - Octavo: orange verbatim highlights ("provably the paper's own
             sentences, verified character-for-character")
           - Architecture plate
           - Select a sentence → Ask Le Chat
           - ⌘⌥ → mic → "three things to remember" → answer READ ALOUD
3:20–3:40  Edge case: upload the W-9 → doorkeeper's joke. Then the dock:
           Zephyr.app. Library one-beat: "the shelf grows with every press."
3:40–4:00  Close (Mistral end-to-end line, Vibe co-authorship, honest API
           note, SaaS roadmap, slogan). ~1 min Q&A.

Why this order: the poster only appears via the Poster button, so it gets its
moment on the ALREADY-pressed paper; the live paste then lands exactly where
the feature deep-dive happens. If wifi/API dies mid-paste, the artifact was
already shown — nothing is lost.
