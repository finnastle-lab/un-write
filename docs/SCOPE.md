# the un-write — scope & architecture proposal

Response to `dev-brief-ai-tells-editor.md`. This proposes a build; it does not start one. Sign off on the phasing before code.

---

## 1. Editor library — recommendation

**Recommend: CodeMirror 6 for v1–v2. Re-evaluate ProseMirror/TipTap only if v3 inline rewrites become the centre of gravity.**

Why CM6:

- Highlights are a **view concern, not document content**. CM6's decoration system (`Decoration.mark` for coloured spans, `hoverTooltip`/widgets for notes) overlays styling on ranges without mutating the text. That's exactly the Hemingway model — plain prose underneath, colour on top, recomputed every keystroke.
- The ruleset operates on **plain text**. We don't need rich-text nodes, marks, or a schema in v1. CM6 hands us the raw string and precise offsets; regex and a sentence tokenizer do the rest.
- Small, fast, well-documented decoration + tooltip APIs. Less ceremony than ProseMirror for this shape.

Why not the others (for v1):
- **ProseMirror / TipTap** — the gold standard for *tracked-changes*, and genuinely better for v3. But it's a rich-text document model we don't need yet, and a steeper build. It's the right tool the day inline accept/reject rewrites become primary.
- **Slate** — flexible, but historically fragile around selection and large-doc performance. Risky for the core surface.
- **Lexical** — modern and capable; viable alternative to CM6. CM6 wins on plain-text ergonomics and decoration maturity.
- **Raw contenteditable** — don't. Selection/undo/IME handling is a tar pit.

**The honest catch (flagged):** if v3 (inline tracked-changes rewrites) turns out to be the soul of the product, ProseMirror is the better host and a mid-project migration is painful. CM6 *can* do v3 via replace-decorations + widgets, but it's swimming upstream. Decision point lands at the top of v3 — see §6.

---

## 2. The rules engine — architecture

```
src/rules/
  types.ts            # Flag, Rule, Category, Match{from,to,ruleId,note}
  registry.ts         # array of rules; hot-swappable; versioned
  exclusions.ts       # the do-NOT-flag gate — runs last, wins always
  punctuation.ts      # em/en dash, exclamation, curly quotes, ...
  phrases.ts          # banned phrases, contrast-reframe family, openers
  vocab.ts            # watchlist (+ check-the-sentence higher-FP subset)
  transitions.ts      # stiff transitions, hedge stacks, prepositional clichés
  structure.ts        # v2: sentence-length variance, staccato, rule-of-three
```

Each rule: `{ id, category, weight, detect(text, sentences) => Match[], note }`. Pure TS, one concern each, so the set stays hot-swappable as it decays.

**Detectability tiers (map straight onto phases):**

| Tier | Examples | Method | Phase |
|---|---|---|---|
| Clean | em/en dashes, exclamation, banned phrases, contrast-reframe, vocab watchlist, pseudo-cleft openers | regex / string | v1 |
| Structural | sentence-length variance, staccato runs (N short in a row), rule-of-three, all-fragment lists | sentence tokenizer + length maths | v2 |
| Semantic | teleporting arguments, faux balance, near-miss metaphors, -ing analysis, trait-caricature, performed warmth | LLM judgment | v3 "deep pass" (opt-in, off-device) |

**Exclusions are a hard gate, not a rule.** Oxford comma, AU/British English, "earn" as verb, "signal" literal, second-person "you", natural contractions, uniform *lists* (the bullets' uniformity is the tell, not the list). Runs after all detectors; any match it covers is dropped. Get this wrong and the tool is infuriating — the brief is right to bold it.

**False-positive reality (flagged):** rule-of-three, contractions, and "you" are *normal English*. Detectors must be conservative and lean on the exclusion gate, or v1 lights up every human sentence. Precision over recall in v1.

---

## 3. The score — transparent algorithm

Headline 0–100, "how AI does this read" (higher = more AI). Inspectable, not a black box. A panel shows the working.

```
weights:  vocab = 1,  phrase/transition = 1.5,  structural = 3
          (structural weighted highest — it's durable; vocab decays per release)

flagLoad   = Σ (weight of each flag)  /  (words / 100)      // weighted flags per 100 words
varPenalty = structural signal from sentence-length spread:
             CV = stdev(sentenceLengths) / mean
             low CV (uniform, "marching in formation") → penalty up
             high CV (varied, human friction)          → penalty down
             e.g. penalty = clamp(0, 25, (0.5 - CV) * 60)

raw   = flagLoad * k  +  varPenalty          // k ~ tuning constant
score = clamp(0, 100, raw)
```

- **Length-normalised** (per 100 words) so long clean prose isn't punished for volume.
- **Rewards variance and friction** rather than punishing every flagged word equally — uniformity is the penalty, not word count.
- **Ruleset is versioned** so a score means something across time; the panel shows the ruleset version, the flag counts by category, and the variance term. All numbers are tuning constants in one config file, not magic.

---

## 4. The two twists (kept, not cut)

### Twist 1 — feedback in FA's voice

Notes are **hand-authored per rule, once, in Finn's voice**, stored on each rule. This keeps v1 fully local (no LLM to generate copy) and deterministic. Route all note copy through the `write-like-finn` skill / `finn-writing-style.md` at authoring time. UI chrome (buttons, labels) stays plain; only the *note* carries the voice.

**Always-on vs unlock — proposal:** voice is **on by default but never advertised** — that alone satisfies "easter egg" (you discover the tool has a mouth by clicking a flag). Add optional escalation: notes get drier / more unhinged as the flag count on a document climbs, so a heavily-AI paste earns a different register than a clean one. A settings toggle can flatten it back to neutral tool-speak for anyone who wants a boring editor. *Decision needed from you: default-on-subtle (my rec) vs a deliberate reveal after N flags.*

### Twist 2 — the tool rewrites, and owns the contradiction

Inline suggested rewrites as accept/reject spans (tracked-changes model). Surfaced honesty line in the UI, not buried: **a tool that rewrites your text to sound less like AI is an AI rewriting your text — the suggestions carry the exact tells it flags.** Detection is obsolete by design; the tool wears it.

**The technical fight this creates (flagged, important):** you can *detect* tells locally, but you cannot *rewrite* well locally. Anything past canned swaps ("delve" → "look at") needs an LLM. So **v3 inline rewrites effectively depend on the off-device deep pass** — they break the local-first promise. Two honest options:
- **3a — canned/deterministic swaps only**, fully local: shallow but keeps the privacy promise. Genuinely on-brand as a joke (obsolete-by-design rewrites that are themselves tells).
- **3b — LLM-backed rewrites**, opt-in, clearly flagged, text leaves device. Better rewrites, real privacy tradeoff stated in the UI.

Recommend shipping **3a first** (it's funnier and honest), offer 3b as the labelled "deep pass."

---

## 5. Stack

- **Vite + React + TypeScript**, CodeMirror 6 for the editor surface.
- Rules as plain TS modules (§2). Zero backend in v1–v2.
- **Local-first:** v1/v2 run entirely client-side, no text leaves the browser. Deep pass (v3b) is opt-in and labelled.
- **No analytics that store user text.** (No analytics at all in v1 is simplest.)
- Hosting: static build → **GitHub Pages via GitHub Actions** (free, from this repo). Alternatives: Netlify / Vercel / Cloudflare Pages, all fine; Pages is the closest to "attach to a GitHub repo and host."

---

## 6. Phased plan

- **v0 — scaffold** *(this repo, ready to build)*: Vite+React+TS, CM6 mounted, empty rule registry, CI + Pages workflow. Deploys a blank editor to prove the pipe.
- **v1 — cleanly-detectable + score + Finn-voice notes**: regex/string rules, exclusion gate, coloured decorations, click-to-note, headline score with visible breakdown. **This is the MVP; it stands alone.**
- **v2 — structural**: sentence tokenizer, length-variance, staccato, rule-of-three, all-fragment lists. Feeds the variance term into the score.
- **v3 — inline rewrites (+ optional deep pass)**: tracked-changes accept/reject. Start 3a (local canned swaps). Editor-library decision point re-opens here (CM6 widgets vs ProseMirror migration). 3b LLM deep pass optional, opt-in, off-device.

**Out of scope now:** accounts, saving, collaboration, browser-extension packaging (later port of the same engine, not v1).

---

## 7. Things that fight themselves (consolidated)

1. **Detect-local vs rewrite-local** — detection is local; good rewrites need an LLM. v3 rewrites break local-first unless kept to canned swaps. (§4)
2. **False positives** — half the "tells" are normal English (rule-of-three, contractions, "you"). Conservative detectors + hard exclusion gate, precision over recall. (§2)
3. **Score drift** — as vocab tells decay, an unversioned score becomes meaningless. Version the ruleset; show it. (§3)
4. **Voice cost** — dynamic per-instance voice needs an LLM; static hand-authored per-rule notes keep v1 local. Chose static. (§4)
5. **The owned joke** — the rewriter is the thing it detects. Not a bug; surfaced in UI. (§4)
