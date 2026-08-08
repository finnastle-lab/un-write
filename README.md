# the un-write

A Hemingway-Editor-style web app that flags AI writing tells inline. Paste prose, get colour-coded highlights, click a highlight for a note written in a voice that is conspicuously not tool-speak. A visible "how AI does this read" score sits in the corner.

The joke it owns: a tool that rewrites your text to sound less like AI is an AI rewriting your text. Detection is obsolete by design — it wears that rather than hiding it.

## Status

**v2 live** — https://finnastle-lab.github.io/un-write/

- **v1** — cleanly-detectable tells (regex/string), exclusion gate, colour-coded highlights, hover notes in FA's voice, transparent score.
- **v2** — structural / rhythm tells via a sentence+paragraph tokenizer: staccato runs, "marching in formation", setup-then-list openers, negation→affirmation, rule-of-three, punchy two-word closers. These carry the durable **weight-3** end of the score.
- **v3 — deep pass (live, opt-in)** — the semantic layer (teleporting arguments, faux balance, near-miss metaphors, superficial -ing analysis, performed warmth). Model-judged, so it runs **off-device**: the user brings their own Anthropic API key (`claude-sonnet-5`), stored only in their browser, and text is sent to Anthropic only when they click *deep pass*. The honest break in the local-first promise, surfaced in the UI. `src/deepPass.ts` is the browser-direct call; `src/rules/semantic.ts` holds the types.

Clean human prose scores ~0; AI slop pegs 100; structural tells move it hardest.

Theme toggle (light/dark, persisted) swaps the cloud mark, the yin-yang flourish, and the FA signature stamp. See [`docs/SCOPE.md`](docs/SCOPE.md) for the phased plan.

### How the engine is laid out

- `src/rules/` — one file per tell category (`structure`, `punctuation`, `phrases`, `transitions`, `vocab`), each exporting `Rule[]`; `semantic.ts` is the v3 layer. `index.ts` layers them, `exclusions.ts` is the do-not-flag gate + overlap resolver, `tokenize.ts` is the shared sentence/paragraph splitter with offsets. Hot-swappable by design — the ruleset decays.
- `src/score.ts` — transparent score; every tuning knob is in `SCORE_CONFIG`.
- `src/editorExtensions.ts` — CodeMirror 6 decorations + hover tooltip. Highlights ride on top of plain text; they never enter the document model.
- `src/useTheme.ts` — light/dark toggle, overrides system, persisted.

## Docs

- [`docs/SCOPE.md`](docs/SCOPE.md) — architecture & phasing proposal
- [`docs/dev-brief-ai-tells-editor.md`](docs/dev-brief-ai-tells-editor.md) — the original brief
- [`docs/ai-tells-raw-list.md`](docs/ai-tells-raw-list.md) — the ruleset source of truth

## Stack (proposed)

Vite + React + TypeScript, CodeMirror 6. Client-side only in v1–v2 — no backend, no text leaves the browser. Hosted on GitHub Pages.
