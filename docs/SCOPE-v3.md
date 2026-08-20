# the un-write — v3 scope: durable tells + model attribution

Response to two inputs: the "Structural Fingerprints of AI-Generated Writing" research
note, and a deep-dive brief on 2026-era invisible watermarking (SynthID-Text, Anthropic's
statistical mark, KGW green/red-list schemes). This is the scope that was agreed before
building; see git history for what actually shipped against it.

---

## 0. The constraint that shapes everything

Watermark **keys are secret**. Nothing running in a browser can cryptographically read
SynthID or Anthropic's mark — those live behind private provider APIs, and any tool
claiming to "detect the watermark" client-side is lying. C2PA metadata only rides on
file exports and is stripped the moment text is pasted as plain text.

So this feature is **stylometric attribution + honest simulation**, not forensics:

- "Reads like Claude's register, 74% confidence" — a real, measurable signal, always
  hedged, never "this IS Claude." Style ≠ provenance; a human can write in any register,
  and "unknown" is a first-class, non-failure result.
- The watermark-survival slider **simulates** an open scheme (Kirchenbauer KGW) — it
  estimates how much editing it'd take to kill a mark like that, on invented text. It
  does not read a real mark, because it can't.
- The market stats in the brief (SEO ranking deltas, "60% jump in searches") are
  motivation for *why this matters*, not facts to hardcode into the product.

Every UI surface built on this carries that hedge in its copy. No "✓ Verified Gemini"
badges, ever.

---

## 1. Engine additions

### 1A — new structural/punctuation/phrase rules
Durable tells from the Fingerprints doc not yet covered by `src/rules/`:
mid-sentence colon, semicolon-joined clauses, double-em-dash wrap, superficial `-ing`
clause ("...reflecting the growing importance of..."), structure narration ("taking
those in order"), structural redundancy (paragraph restates its own topic sentence),
too-tidy callback (ending mirrors the opening line), false range ("from X to Y" posing
narrow as broad), plus `tapestry` / `pivotal` / `vibrant` added to the vocab watchlist.
"Build-and-crescendo paragraphs" deferred — too fuzzy to catch without false-firing on
good human writing.

### 1B — stylometric meters
Promote burstiness (already computed for the score), em-dash rate/300w, semicolon
rate, and function-word distribution from "buried in the score" to first-class
computed stats, so the new view has real numbers to show. POS-bigram uniformity is
deferred — needs a POS tagger, real dependency/perf cost for a nudge-level signal.

### 1C — watermark survival estimator
`z ≈ f · √N · z₁` computed for real from edit-distance/run-length between an original
paste and an edited version: **f** = surviving fraction of untouched n-gram windows,
**N** = document length, **z₁** = a constant for the illustrative open scheme. Drives
the slider from the uploaded reference image. Labelled throughout as simulation.

### 1D — model attribution (Tier 2: trained classifier)
`voice.ts`'s single document-level verdict is replaced by a proper classifier:

- **Features** (`src/attribution/features.ts`): reuses the existing rules engine's
  per-category match density (structure/figurative/punctuation/phrase/transition/vocab)
  plus the 1B stylometric numbers — one feature vector, per 100 words.
- **Model** (`src/attribution/model.ts`): a small multinomial logistic regression —
  dot product + softmax, no runtime dependency, weights shipped as a static JSON file.
  No in-browser LLM (TinyLlama was considered and rejected — a 100s-of-MB download
  breaks the fully-local, no-backend promise the whole tool is built on).
- **Training** (`src/attribution/train/`): a dependency-free Node script that reads the
  labelled corpus, extracts features via the same code path, trains the weights, writes
  `weights.json`.
- **Corpus** (`src/attribution/corpus/`): **real, scraped multi-model transcripts were
  the first choice** (e.g. LMSYS Chatbot Arena conversations, which label responses by
  model) but HuggingFace is blocked at this sandbox's network gateway (403 on
  `huggingface.co` and `datasets-server.huggingface.co`). The shipped v0 corpus is
  **curated and synthetic** — samples written to faithfully reflect each house's
  documented, publicly-known register (Claude's measured hedging/em-dash/"here's the
  thing"; Gemini's structured-then-literary swing; GPT's "Firstly.../In conclusion/It's
  important to note" formality; a human baseline deliberately varied in burstiness and
  register). This is a real limitation, not a hidden one — flagged in the UI as "v0,
  trained on a curated sample set" and in this doc for anyone auditing later. The
  pipeline is built so swapping in real transcripts later is a data change, not a code
  change.

Houses modelled: **Gemini, Claude, OpenAI/GPT, Human**, plus an honest **"unknown /
not enough signal"** floor when no class clears a confidence threshold — matching the
existing `classifyVoice` philosophy of staying quiet rather than inventing a verdict.

---

## 2. The "how it's identified" surface

### 2.1 Delivery
An **in-app view toggle** ("Editor ↔ How it's identified") sharing the one pasted
text — not a second route. No router, no GitHub Pages refresh-404 problem, and it's
what "a 2nd page or element" actually wants: one paste, two lenses on it.

### 2.2 Modules
1. **Attribution map** — the pasted text re-rendered with spans shaded by which
   house-register they resemble, a confidence bar per house (including Human and
   Unknown), and the evidence list per span.
2. **Watermark-survival slider** — the uploaded mock: drag from "fix typos" to "full
   rewrite," watch the highlighted surviving-fraction shrink, read the projected
   survival percentage against a 1,500-word document.
3. **Shadow-key demo** — an illustrative green/red token visualisation teaching how
   token-probability-biasing watermarks work, on a toy vocabulary. Explicitly labelled
   as education, not a reading of a real mark.

### 2.3 Design
Whole app adopts `fa-design-system` tokens: `Instrument Serif` (display/verdicts),
`InterFA` (body), `Cousine` (mono — used for the stat meters and token demo), accent
`#d9360f` light / `#e5451a` dark, paper `#faf9f6` / `#121211`, sage `#c9d0c0` as a
second accent for attribution-map shading.

---

## 3. Out of scope for this pass

- Real Anthropic/Google detector API hooks (both are unreleased/restricted — future
  integration points, not live in v3).
- POS-bigram stylometry (needs a tagger).
- Any accounts, saving, or server-side component — the whole feature stays
  client-side; nothing pasted ever leaves the browser.
