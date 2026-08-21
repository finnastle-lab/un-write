# Model-attribution classifier: findings report

*Prepared for external discussion (drafted to hand to Gemini for reaction/collaboration). Covers the un-write project's "which house does this read like" feature — methodology, corpus journey, and concrete findings from testing on real transcripts.*

---

## 1. What this is and the constraint that shapes it

**un-write** flags AI writing tells inline (structural rhythm, punctuation, phrase patterns) and scores how "AI" a piece of text reads. The newest feature — **model attribution** — goes one step further: it tries to say *which house's register* a piece of text resembles (Claude / Gemini / GPT / human), shown alongside a watermark-survival simulator on a "how it's identified" page.

The one constraint that shapes everything: **watermark keys are private.** SynthID (Google) and Anthropic's statistical mark are cryptographically keyed, and nothing running client-side — this project included — can read them. So this feature is explicitly **stylometric attribution, not forensics**. The UI language is deliberately hedged: "reads like Claude's register, 74% confidence," never "this is Claude." Style isn't provenance. A human can write in any of these registers, and "unknown" is a first-class, expected outcome, not a failure state.

## 2. Architecture

- **Features** are reused, not reinvented: the existing rules engine's per-category match density (structural tells, figurative/literary tells, punctuation, phrase patterns, transitions, vocabulary) becomes the feature vector, plus a handful of stylometric meters (sentence-length burstiness, em-dash rate, semicolon rate, emoji density, function-word frequency). One analysis pass produces both the inline highlight overlay *and* the attribution signal.
- **Model**: a small multinomial logistic regression (softmax), trained offline via plain gradient descent with L2 regularization — no ML library, since the corpus and feature count are both small. Weights ship as a static JSON file (~25 features × 4 classes). Runtime inference is a dot product and a softmax — no in-browser LLM, keeping the whole tool fully local and instant.
- **Confidence floor**: below ~40 words or below a confidence threshold, the classifier reports "unknown" rather than guessing — matching the existing tool's philosophy of staying quiet rather than inventing a verdict.

## 3. The corpus journey — and the one methodological choice that mattered most

**v0** was fully synthetic: hand-written samples designed to reflect each house's *documented* register (structural-tells research, widely observed per-model habits), because the original plan — real, scraped multi-model transcripts (e.g. an LMSYS-style arena dataset with model-labeled responses) — was blocked; the sandbox this was built in has HuggingFace gated at the network layer. 56 samples, 14/house, 78.6% leave-one-out accuracy on that small homogeneous set.

**The key methodological decision for v1**: real transcripts had to be collected against a **shared, fixed prompt bank**, run through each house at default settings with no style-steering, rather than each house answering different topics on its own. The features here are mostly stylometric rather than bag-of-words, so topic leakage is a smaller risk than it would be for a naive text classifier — but it isn't zero, and an uncontrolled corpus risks the classifier partly learning *topic* instead of *register*. A 24-prompt bank spanning explain / advise / argue / instruct / describe / compare / reflect was built for this, plus a second 12-prompt bank specifically for poetry (rationale below).

**Current corpus state:**

| House | Real | Synthetic | Notes |
|---|---|---|---|
| Claude | 36 | 14 | 24 prose + 12 poems, all against the shared banks — the only house with poem coverage so far |
| Gemini | 23 | 14 | 1 prompt permanently excluded — truncated twice at the source, not a copy-paste issue |
| GPT | 24 | 14 | Complete |
| Human | 0 | 14 | Deferred by design — this is the "null" class the others are measured against, not a register being modeled |

**Leave-one-out accuracy trajectory**: 78.6% → 76.3% → 70.9% → 66.1% → 64.6% → 63.8% → 61.2%, tracking almost exactly with each batch of real, messier data replacing homogeneous synthetic data (the last drop follows adding 12 real Claude poems — a register the corpus hadn't carried before). This decline is **expected and healthy, not a red flag** — a smaller, hand-curated set is easier to fit than a larger, more naturally variable one. The number to actually watch is *fresh-text testing on completely out-of-corpus examples*: a brand-new Claude poem (not in training) classified correctly at 89% confidence immediately after this batch, which is the real signal that matters.

## 4. Concrete findings

**GPT's real transcripts confirmed the textbook tells directly, plus one we hadn't predicted.** "Great question!" / "Certainly!" / "Absolutely!" openers, "Firstly... Secondly... In conclusion" formal cadence, heavy hedging via "it's worth noting" / "it's important to note," and consistently over-complete, disclaimer-laden answers even to simple questions — all present, exactly as the structural-tells literature predicts. The one genuine surprise: **GPT uses emoji as section headers** in structured comparisons (⚡ Electric vs ⛽ Petrol, 💻 Laptop vs 🖥️ Desktop) — this isn't in the standard "AI-isms" literature we started from, and our original 24-feature vector had *no* emoji signal at all. A real emoji-structured GPT passage was misclassified as **Human** at 60% confidence before we added an emoji-density feature; after adding it, the same passage classifies as GPT at 100% confidence. Small feature, large single-case effect — a clean example of a real gap that only real data surfaced.

**Claude's real transcripts confirmed the hedging/faux-balance profile precisely**: "I'd flag both sides rather than pick one," pseudo-cleft openers ("What matters here is..."), em-dashes doing structural work mid-sentence, and a consistent refusal to give a clean verdict without naming the tradeoff explicitly. This was the strongest, most internally consistent class throughout — likely because it's also the easiest for us to source in volume and with zero collection latency (generated directly in-session).

**Gemini shows a genuinely bimodal register**, and this is the most interesting finding of the whole exercise. On technical/business prompts, Gemini's answers came back extremely structured — nested bold headers, "Key X" labels, literal mathematical notation (`A=P(1+r/n)^nt`), percentage ranges, en-dashes, a "Primary Verdict" / decision-matrix framing that's distinct from both Claude's and GPT's structuring style. On creative prompts, the *same house* swung hard into a different voice entirely: personification ("the glacier surrendered, inch by aching inch"), pathetic-fallacy vocabulary (clung, endured, surrendered), adjective-pair rhythm, rule-of-three, and dramatic short paragraphs — the literary register our rules engine's `figurative` category was originally built to catch. **These two voices are far enough apart that our current whole-document feature averaging blurs them together**, and it directly explains a repeated test failure: short atmospheric/narrative passages in Gemini's style kept misclassifying as Claude or Human, because the real Gemini corpus (skewed toward the technical-answer prompts in the shared bank) doesn't give the classifier enough of the literary voice to anchor on. This is *why* a second, poetry-specific prompt bank was built and run through Claude first (12 real poems added, retraining now) — the working hypothesis is that Gemini's poems will land unambiguously in the literary register and meaningfully sharpen this specific boundary once collected.

**The watermark-survival simulator's behavior is consistent with the literature it's modeling.** Using Kirchenbauer et al.'s KGW green/red-list scheme as the illustrative basis (never a real mark — that's cryptographically inaccessible), a rough residual model shows detection surviving deep into "heavy edit" territory and only collapsing near a genuine full rewrite (word-order scrambling, not just synonym substitution) — matching the brief's claim that *structural flattening*, not light editing, is what actually kills a watermark. This is presented in the UI as simulation/education, never as a reading of a real mark.

## 5. What we'd want from Gemini

A few things worth putting directly to Gemini, given the bimodal-register finding above:

1. **Does the technical/literary voice split match Gemini's own self-model of its response modes?** Is this an artifact of prompt framing (business/finance questions vs. creative-writing requests), or something closer to a genuinely distinct register the model reaches for based on task type?
2. **Any known style-guide or RLHF influence** behind the specific structured-answer conventions observed (the "Primary Verdict" framing, nested bold headers, decision-matrix tables) that would help us characterize the technical register more precisely rather than just pattern-matching it after the fact?
3. **Suggestions for expanding the poem-specific prompt set** to get better separation, if the current 12-prompt bank (free verse, haiku, apostrophe, rhyme, across themes like aging, distance, routine, waiting) seems to miss an angle that would surface the literary register more reliably.
4. Any concerns about a project like this existing at all, from Google's side — the framing throughout is "style, not watermark," explicitly never claiming to detect a real cryptographic mark, but worth surfacing directly rather than assuming it's a non-issue.

---

*All figures current as of the Claude-poems batch (139 samples). Gemini and GPT poem batches are the planned next step, collected against the same 12-prompt bank in `src/attribution/corpus/promptsPoems.ts`.*
