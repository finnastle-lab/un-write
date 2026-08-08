# the un-write

A Hemingway-Editor-style web app that flags AI writing tells inline. Paste prose, get colour-coded highlights, click a highlight for a note written in a voice that is conspicuously not tool-speak. A visible "how AI does this read" score sits in the corner.

The joke it owns: a tool that rewrites your text to sound less like AI is an AI rewriting your text. Detection is obsolete by design — it wears that rather than hiding it.

## Status

Scoping / scaffold. Not yet built. See [`docs/SCOPE.md`](docs/SCOPE.md) for the architecture proposal and phased plan.

## Docs

- [`docs/SCOPE.md`](docs/SCOPE.md) — architecture & phasing proposal
- [`docs/dev-brief-ai-tells-editor.md`](docs/dev-brief-ai-tells-editor.md) — the original brief
- [`docs/ai-tells-raw-list.md`](docs/ai-tells-raw-list.md) — the ruleset source of truth

## Stack (proposed)

Vite + React + TypeScript, CodeMirror 6. Client-side only in v1–v2 — no backend, no text leaves the browser. Hosted on GitHub Pages.
