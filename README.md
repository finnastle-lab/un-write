# the un-write

A Hemingway-Editor-style web app that flags AI writing tells inline. Paste prose, get colour-coded highlights, click a highlight for a note written in a voice that is conspicuously not tool-speak. A visible "how AI does this read" score sits in the corner.

The joke it owns: a tool that rewrites your text to sound less like AI is an AI rewriting your text. Detection is obsolete by design — it wears that rather than hiding it.

## Status

**v1 live** — https://finnastle-lab.github.io/un-write/

Cleanly-detectable tells (regex/string), the exclusion gate, colour-coded inline highlights, click/hover notes in FA's voice, and the transparent score with visible working. Clean human prose scores ~0, AI slop pegs 100. See [`docs/SCOPE.md`](docs/SCOPE.md) for the full phased plan.

Next: **v2** — structural tells (sentence-length variance, staccato runs, rule-of-three, all-fragment lists) via a tokenizer, feeding the durable (weight-3) end of the score.

### How the engine is laid out

- `src/rules/` — one file per tell category (`punctuation`, `phrases`, `transitions`, `vocab`), each exporting `Rule[]`. `index.ts` runs them, `exclusions.ts` is the do-not-flag gate + overlap resolver. Hot-swappable by design — the ruleset decays.
- `src/score.ts` — transparent score; every tuning knob is in `SCORE_CONFIG`.
- `src/editorExtensions.ts` — CodeMirror 6 decorations + hover tooltip. Highlights ride on top of plain text; they never enter the document model.

## Docs

- [`docs/SCOPE.md`](docs/SCOPE.md) — architecture & phasing proposal
- [`docs/dev-brief-ai-tells-editor.md`](docs/dev-brief-ai-tells-editor.md) — the original brief
- [`docs/ai-tells-raw-list.md`](docs/ai-tells-raw-list.md) — the ruleset source of truth

## Stack (proposed)

Vite + React + TypeScript, CodeMirror 6. Client-side only in v1–v2 — no backend, no text leaves the browser. Hosted on GitHub Pages.
