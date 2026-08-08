# Dev brief — "the un-write" (working title)

A Hemingway-Editor-style web app that flags AI writing tells inline. Same interaction model as hemingwayapp.com: paste text, get coloured inline highlights, click a highlight for the note. The twist is the voice of the feedback and one deliberate contradiction the tool owns rather than hides.

This is a brief for Claude Code to **scope and propose an architecture**, not a spec to build blind. Push back on anything below that's wrong.

## What it is
A single-page editor. The user writes or pastes prose into a central pane. The tool highlights spans that match known AI tells, colour-coded by category. Hovering or clicking a span opens a small note explaining the tell and suggesting a fix. A running "how AI does this sound" score sits in a corner.

Reference product for interaction and layout: Hemingway Editor. We are not cloning its rules (readability, adverbs, passive voice); we're swapping in the AI-tells ruleset. The *feel* is the reference: calm, inline, coloured highlights, a score, click-to-expand notes.

## The rules engine
Source of truth is `ai-tells-raw-list.md` (delivered alongside this brief). It's grouped by category, each item a pattern to detect. Not all are equally detectable:

- **Cleanly detectable (regex / string / simple heuristics):** em/en dashes, exclamation marks, specific banned phrases ("it's not X it's Y", "in today's threat landscape", stiff transitions, hedge stacks, vocabulary watchlist words, pseudo-cleft openers like "what matters here is"). Start here. High precision, low effort.
- **Structurally detectable (needs light NLP):** sentences marching in formation (sentence-length variance across a paragraph), staccato runs (N consecutive short sentences), rule-of-three, all-fragment lists. Doable with a sentence tokenizer and length maths. Second phase.
- **Hard / semantic (probably out of v1):** arguments that teleport, faux balance, metaphors that almost land, superficial -ing analysis clauses, trait-caricature, performed warmth. These need an LLM judgment call. Flag as a stretch goal, possibly a "deep pass" button that sends the text to a model rather than running locally. Note the privacy tradeoff of sending text off-device.

The **do-not-flag list** in the source file (Oxford comma, AU English, "earn", second-person you, contractions, structured lists) must be respected as hard exclusions or the tool will be infuriating.

## The score
A single headline number, "how AI does this read". Keep the maths visible/inspectable, not a black box. Weight **structural tells higher than vocabulary tells**, because the source file notes vocabulary tells decay every model release and structural ones are durable. The score should reward variance and friction, not punish every flagged word equally.

## The two twists (these are the point, don't cut them)

### 1. Feedback in FA's voice (the easter egg)
The suggestion notes are written in Finn's voice, not neutral tool-speak. This is the easter egg: the tool that detects AI tells does not itself sound like a tool. Instead of "Consider varying sentence length here," it says something with deflation, edge, a digression. The voice spec lives in the `write-like-finn` skill / `finn-writing-style.md` — Claude Code should read that file and route all user-facing suggestion copy through it. Neutral UI chrome (buttons, labels) stays plain; only the *feedback* carries the voice.

Design decision to raise: is the voice always on, or does it unlock (a toggle, a konami-style reveal, after N flags)? "Easter egg" implies discovery. Propose an option.

### 2. The tool suggests *in* the text, using its own highlights
Rather than only annotating in a sidebar, the tool should be able to drop suggested rewrites inline, as its own highlighted spans layered over the user's text (accept/reject per span, like tracked changes). Note the honest contradiction here, and surface it in the UI rather than burying it: **a tool that rewrites your text to sound less like AI is, itself, an AI rewriting your text.** The suggestions it inserts will carry the exact tells it flags. This is not a bug to fix; it's the joke to own. Consider a line in the UI that admits it. The whole philosophy behind this (from the essays it accompanies) is that tells decay on arrival and detection is futile, so a detector is *obsolete by design* — the tool should wear that, not pretend otherwise.

## Suggested stack (propose alternatives)
- Frontend: React + a contenteditable or a proper editor lib (Slate/ProseMirror/CodeMirror) for span decoration. Recommend one and say why.
- Rules: plain TS modules, one per tell category, each returning matched spans + note. Keep the ruleset hot-swappable since it decays.
- Local-first: v1 runs entirely client-side (regex + tokenizer), no backend, no text leaves the browser. The "deep pass" LLM feature, if built, is opt-in and clearly flagged.
- No analytics that store user text.

## Scope proposal wanted
Come back with: a phased plan (v1 cleanly-detectable + score + Finn-voice notes; v2 structural; v3 inline rewrites + optional deep pass), an editor-library recommendation with reasoning, the score algorithm, and a flag on anything here that fights itself technically. Don't start building until the phasing is agreed.

## Out of scope for now
Accounts, saving, collaboration, browser-extension packaging (the essays mention an extension; treat that as a later port of the same engine, not v1). Ship the web app first.
