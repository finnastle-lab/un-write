import type { RawSpan } from "./rules/types";
import { paragraphSpans } from "./rules/tokenize";

// --- the watermark-survival slider ------------------------------------
//
// Honesty gate, load-bearing: this does NOT read a real SynthID or
// Anthropic mark — those keys are private, so nothing client-side can.
// It SIMULATES an open scheme (Kirchenbauer et al.'s KGW green/red-list
// watermark) against a synthetic edit, so it can only ever teach how
// robust that *kind* of mark is to editing — never diagnose a real one.
//
// Two local, deterministic, dependency-free pieces:
//  1. simulateEdit(text, level) — a canned, seeded text mutation (word
//     swaps, filler drops, sentence merges/shuffles) standing in for "the
//     user edited this much." Not an LLM rewrite; on-brand with the
//     tool's existing canned-swap philosophy for local-only transforms.
//  2. estimateWatermarkSurvival(original, edited) — measures the REAL
//     surviving fraction of unchanged n-gram windows between the two
//     texts, then projects it through the brief's residual model
//     z ≈ f · √N · z₁ to a reference document length.

export const EDIT_LEVELS = [
  { id: "typos", label: "fix typos", intensity: 0.06 },
  { id: "light", label: "light touch", intensity: 0.24 },
  { id: "tighten", label: "tighten sentences", intensity: 0.48 },
  { id: "heavy", label: "heavy edit", intensity: 0.72 },
  { id: "rewrite", label: "full rewrite", intensity: 0.95 },
] as const;

export type EditLevelId = (typeof EDIT_LEVELS)[number]["id"];

// --- deterministic PRNG — same text + same slider position always
// produces the same simulated edit, so dragging doesn't flicker. -------
function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return function rand() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A small, generic illustrative synonym table — enough to demonstrate
// word-swap dilution on arbitrary prose, not a real thesaurus.
const SYNONYMS: Record<string, string[]> = {
  very: ["quite", "pretty", "fairly"],
  really: ["genuinely", "truly"],
  just: ["simply", "only"],
  said: ["mentioned", "noted", "put it"],
  showed: ["revealed", "made clear"],
  small: ["little", "modest"],
  large: ["big", "sizeable"],
  good: ["solid", "decent"],
  bad: ["poor", "rough"],
  important: ["significant", "key"],
  changed: ["shifted", "moved", "turned"],
  slowly: ["gradually", "steadily"],
  quickly: ["fast", "in a hurry"],
  began: ["started", "kicked off"],
  before: ["ahead of", "prior to"],
  after: ["once", "following"],
  many: ["a lot of", "plenty of"],
  most: ["the bulk of"],
  new: ["fresh", "recent"],
  old: ["longstanding", "long-established"],
  always: ["consistently", "invariably"],
  never: ["at no point"],
  because: ["since", "given that"],
  but: ["yet", "though"],
  and: ["plus"],
  also: ["as well", "too"],
  however: ["that said", "even so"],
  almost: ["nearly", "close to"],
  turned: ["became", "grew"],
  opened: ["kicked off", "began"],
  moment: ["point", "beat"],
};

const FILLERS = ["very", "really", "just", "actually", "basically", "honestly"];

function tokenizeWords(text: string): { word: string; from: number; to: number }[] {
  const out: { word: string; from: number; to: number }[] = [];
  const re = /\S+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    out.push({ word: m[0], from: m.index, to: m.index + m[0].length });
  }
  return out;
}

function normalizeWord(w: string): string {
  return w.replace(/^[^\w']+|[^\w']+$/g, "").toLowerCase();
}

/** Deterministic, local, canned mutation standing in for "edited this much."
 *  Not a real rewrite — a simulation for teaching watermark decay. */
export function simulateEdit(text: string, level: EditLevelId): string {
  const cfg = EDIT_LEVELS.find((l) => l.id === level) ?? EDIT_LEVELS[0];
  const rand = mulberry32(hashString(text + "::" + level));

  const words = tokenizeWords(text);
  let result = text;

  // Apply word-level swaps back-to-front so earlier offsets stay valid.
  const edits: { from: number; to: number; text: string }[] = [];
  for (const { word, from, to } of words) {
    const norm = normalizeWord(word);
    if (!norm) continue;
    if (FILLERS.includes(norm) && rand() < cfg.intensity * 0.8) {
      edits.push({ from, to, text: "" });
      continue;
    }
    const options = SYNONYMS[norm];
    if (options && rand() < cfg.intensity) {
      const pick = options[Math.floor(rand() * options.length)];
      const cased = word[0] === word[0]?.toUpperCase() ? pick[0].toUpperCase() + pick.slice(1) : pick;
      edits.push({ from, to, text: word.replace(norm, cased) });
    }
  }
  for (const e of edits.sort((a, b) => b.from - a.from)) {
    result = result.slice(0, e.from) + e.text + result.slice(e.to);
  }
  result = result.replace(/\s{2,}/g, " ").trim();

  // Structural rewrite at higher intensity. Reordering whole sentences
  // alone barely touches survival — every n-gram *inside* a sentence
  // still matches somewhere in the edited text, since the n-gram check is
  // a set membership test, not positional. Breaking interior windows
  // needs word order to actually change within the sentence, which is
  // what real rephrasing does.
  if (cfg.intensity >= 0.4) {
    const scramble = Math.min(1, (cfg.intensity - 0.4) / 0.55); // 0 at 0.4, 1 at 0.95
    const paras = paragraphSpans(result);
    const rebuilt = paras
      .map((p) => {
        let sents = p.sentences.map((s) => shuffleWords(s.text, scramble, rand));
        if (sents.length > 1 && cfg.intensity >= 0.6) {
          const reorderChance = (cfg.intensity - 0.6) / 0.4;
          sents = [...sents];
          for (let i = sents.length - 1; i > 0; i--) {
            if (rand() < reorderChance) {
              const j = Math.floor(rand() * (i + 1));
              [sents[i], sents[j]] = [sents[j], sents[i]];
            }
          }
        }
        return sents.join(" ");
      })
      .join("\n\n");
    result = rebuilt || result;
  }

  return result;
}

/** Partial in-place word shuffle, strength 0–1. Scaled swap count so this
 *  reads as "increasingly reworded," not an instant scramble at any
 *  non-zero intensity. */
function shuffleWords(sentence: string, strength: number, rand: () => number): string {
  if (strength <= 0) return sentence;
  const words = sentence.split(/\s+/);
  if (words.length < 4) return sentence;
  const swaps = Math.round(words.length * strength * 0.8);
  for (let s = 0; s < swaps; s++) {
    const i = Math.floor(rand() * words.length);
    const j = Math.floor(rand() * words.length);
    [words[i], words[j]] = [words[j], words[i]];
  }
  return words.join(" ");
}

// --- the real, measured survival estimate ------------------------------

const NGRAM = 5; // matches the doc's "1 to 5 token" n-gram seeding window
const REFERENCE_WORDS = 1500; // the mock's projection target
// Kirchenbauer et al.'s KGW detection z-score, fully unedited, scales as
// roughly delta * sqrt(gamma * (1 - gamma) * N). At gamma = 0.5, delta = 2
// (typical published settings), that's ~1.0 * sqrt(N) — so z1 = 1 keeps
// this illustrative constant grounded in the real scheme's order of
// magnitude rather than picked to make the slider "look right."
const Z1 = 1;
const DETECT_Z = 4; // conventional high-confidence threshold in the literature (~p < 3e-5)
const BORDERLINE_Z = 2;

export interface WatermarkEstimate {
  survivingFraction: number; // 0–1
  survivingWords: number;
  totalWords: number;
  projectedZ: number;
  referenceWords: number;
  verdict: "still plainly detectable" | "borderline" | "evidence dies here";
  survivingRanges: RawSpan[]; // spans in the ORIGINAL text still standing
}

/** Real, local measurement: what fraction of the original's n-gram windows
 *  still appear unchanged in the edited text, and what that would project
 *  to on an open watermark scheme at a reference document length. This is
 *  a simulation input/output pair — see file header — never a reading of
 *  an actual mark. */
export function estimateWatermarkSurvival(
  original: string,
  edited: string,
): WatermarkEstimate {
  const origWords = tokenizeWords(original);
  const totalWords = origWords.length;
  if (totalWords === 0) {
    return {
      survivingFraction: 0,
      survivingWords: 0,
      totalWords: 0,
      projectedZ: 0,
      referenceWords: REFERENCE_WORDS,
      verdict: "evidence dies here",
      survivingRanges: [],
    };
  }

  const editWords = tokenizeWords(edited);
  const n = Math.max(1, Math.min(NGRAM, totalWords));
  const editGrams = new Set<string>();
  for (let i = 0; i + n <= editWords.length; i++) {
    editGrams.add(
      editWords
        .slice(i, i + n)
        .map((w) => normalizeWord(w.word))
        .join(" "),
    );
  }

  const survived = new Array(totalWords).fill(false);
  for (let i = 0; i + n <= totalWords; i++) {
    const gram = origWords
      .slice(i, i + n)
      .map((w) => normalizeWord(w.word))
      .join(" ");
    if (editGrams.has(gram)) {
      for (let k = i; k < i + n; k++) survived[k] = true;
    }
  }

  const survivingWords = survived.filter(Boolean).length;
  const survivingFraction = survivingWords / totalWords;

  const survivingRanges: RawSpan[] = [];
  let runStart = -1;
  for (let i = 0; i < totalWords; i++) {
    if (survived[i]) {
      if (runStart === -1) runStart = i;
    } else if (runStart !== -1) {
      survivingRanges.push({ from: origWords[runStart].from, to: origWords[i - 1].to });
      runStart = -1;
    }
  }
  if (runStart !== -1) {
    survivingRanges.push({
      from: origWords[runStart].from,
      to: origWords[totalWords - 1].to,
    });
  }

  const projectedZ = survivingFraction * Math.sqrt(REFERENCE_WORDS) * Z1;
  const verdict =
    projectedZ >= DETECT_Z
      ? "still plainly detectable"
      : projectedZ >= BORDERLINE_Z
        ? "borderline"
        : "evidence dies here";

  return {
    survivingFraction: Math.round(survivingFraction * 1000) / 1000,
    survivingWords,
    totalWords,
    projectedZ: Math.round(projectedZ * 10) / 10,
    referenceWords: REFERENCE_WORDS,
    verdict,
    survivingRanges,
  };
}

export { tokenizeWords };
