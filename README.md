# the un-write

A Hemingway-Editor-style web app that flags AI writing tells inline. Paste prose, get colour-coded highlights, click a highlight for a note written in a voice that is conspicuously not tool-speak. A visible "how AI does this read" score sits in the corner.

The joke it owns: a tool that rewrites your text to sound less like AI is an AI rewriting your text. Detection is obsolete by design — it wears that rather than hiding it.

## Status

**v3 live** — https://finnastle-lab.github.io/un-write/

- **v1** — cleanly-detectable tells (regex/string), exclusion gate, colour-coded highlights, hover notes in FA's voice, transparent score.
- **v2** — structural / rhythm tells via a sentence+paragraph tokenizer: staccato runs, "marching in formation", setup-then-list openers, negation→affirmation, rule-of-three, punchy two-word closers. These carry the durable **weight-3** end of the score.
- **v3 — durable tells + model attribution (live)** — a second view, "How it's identified," alongside the editor:
  - More durable structural/punctuation tells (mid-sentence colon, semicolon, double em-dash wrap, superficial `-ing` clauses, structure narration, false ranges, structural redundancy, too-tidy callbacks).
  - A **model-attribution classifier** — a small, fully local, trained multinomial logistic regression (`src/attribution/`) that names which house's *register* (Claude / Gemini / GPT / human) a paste resembles, from stylometric features the existing rules engine already computes. This is stylometry, not forensics: it can't read a real watermark (those keys are private), and "unknown" is a normal, correct answer. **v0's training corpus is curated and synthetic**, not scraped real transcripts — see `docs/SCOPE-v3.md` §1D for why and how to swap in real data later.
  - A **watermark-survival slider** (`src/watermark.ts`) — simulates editing a paste through 5 intensities and measures how much survives as unbroken n-gram windows, projecting that onto an open watermarking scheme (Kirchenbauer et al.'s KGW). A simulation, never a reading of a real mark.
  - An illustrative green/red "shadow key" token demo teaching the token-probability-biasing mechanism itself.
  - Whole app restyled onto the restrained FA identity — Instrument Serif / InterFA / Cousine (self-hosted), the FA sun signature as the primary mark, and the filmic dash-strip as a single structural spine.
- **v3a — the de-ai step (local, deterministic)** — where a tell has one safe, same-part-of-speech, drop-in replacement, clicking a highlight offers it as a tracked-changes-style swap ("un-write it →"). No LLM, nothing leaves the browser. Sourced from the `avoid-ai-writing` skill's replacement tables; each `Rule` in `src/rules/` can carry an optional `suggest(matchedText)` (see `src/rules/swaps.ts`). Most tells still need real rewriting, not a lookup, and stay flag-only on purpose — see `docs/SCOPE.md` §7.1.

Clean human prose scores ~0; AI slop pegs 100; structural tells move it hardest.

Theme toggle (light/dark, persisted) swaps the cloud mark, the yin-yang flourish, and the FA signature stamp. See [`docs/SCOPE.md`](docs/SCOPE.md) for the original phased plan and [`docs/SCOPE-v3.md`](docs/SCOPE-v3.md) for the v3 scope.

### How the engine is laid out

- `src/rules/` — one file per tell category (`structure`, `punctuation`, `phrases`, `transitions`, `vocab`, `figurative`), each exporting `Rule[]`. `index.ts` layers them, `exclusions.ts` is the do-not-flag gate + overlap resolver, `tokenize.ts` is the shared sentence/paragraph splitter with offsets, `swaps.ts` is the de-ai step's word/phrase swap dictionaries. Hot-swappable by design — the ruleset decays.
- `src/score.ts` — transparent score; every tuning knob is in `SCORE_CONFIG`.
- `src/stylometry.ts` — burstiness, em-dash/semicolon rate, function-word frequency, promoted to reusable numbers.
- `src/watermark.ts` — the survival estimator + the local, deterministic "simulated edit intensity" transform behind the slider.
- `src/attribution/` — the model-attribution classifier: `features.ts` (reuses the rules engine + stylometry as a feature vector), `corpus/samples.ts` (the v0 training data, with its honesty caveat), `train/train.ts` (offline trainer — run manually, never shipped to the browser), `weights.json` (trained output), `model.ts` (runtime dot-product + softmax).
- `src/AttributionView.tsx` — the "How it's identified" view.
- `src/editorExtensions.ts` — CodeMirror 6 decorations + hover tooltip. Highlights ride on top of plain text; they never enter the document model.
- `src/useTheme.ts` — light/dark toggle, overrides system, persisted.

## Docs

- [`docs/SCOPE.md`](docs/SCOPE.md) — original architecture & phasing proposal (v0–v2)
- [`docs/SCOPE-v3.md`](docs/SCOPE-v3.md) — v3 scope: durable tells, model attribution, watermark simulation
- [`docs/dev-brief-ai-tells-editor.md`](docs/dev-brief-ai-tells-editor.md) — the original brief
- [`docs/ai-tells-raw-list.md`](docs/ai-tells-raw-list.md) — the ruleset source of truth

## Stack

Vite + React + TypeScript, CodeMirror 6. Fully client-side — no backend, no text leaves the browser, no in-browser LLM. Hosted on GitHub Pages.
