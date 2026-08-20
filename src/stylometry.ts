import { coeffVar, sentenceLengths, wordCount } from "./score";

// Stylometric meters promoted to first-class, reusable numbers. Burstiness
// already drove the score; this exposes it (and a few siblings) as plain
// stats the "how it's identified" view and the attribution feature vector
// can both read, instead of leaving them buried inside score maths.

/** Words that shift measurably in frequency between hand-written and
 *  model-written prose. Small and fixed on purpose — a stylometric nudge,
 *  not a full function-word taxonomy. */
export const FUNCTION_WORDS = [
  "the", "of", "and", "a", "to", "in", "is", "that", "it", "for", "on",
  "with", "as", "was", "but",
] as const;

export interface StylometricProfile {
  words: number;
  /** coefficient of variation of sentence length — low = metronomic/AI, high = human friction */
  burstiness: number;
  emDashPer300: number;
  semicolonPer300: number;
  /** per-100-words frequency for each tracked function word */
  functionWordFreq: Record<string, number>;
}

function per300(count: number, words: number): number {
  if (words === 0) return 0;
  return Math.round(((count / words) * 300) * 10) / 10;
}

export function stylometricProfile(text: string): StylometricProfile {
  const words = wordCount(text);
  const burstiness = Math.round(coeffVar(sentenceLengths(text)) * 100) / 100;
  const emDashes = (text.match(/[—–]/g) ?? []).length;
  const semicolons = (text.match(/;/g) ?? []).length;

  const tokens = text.toLowerCase().match(/[a-z']+/g) ?? [];
  const total = tokens.length || 1;
  const counts = new Map<string, number>(FUNCTION_WORDS.map((w) => [w, 0]));
  for (const t of tokens) {
    if (counts.has(t)) counts.set(t, counts.get(t)! + 1);
  }
  const functionWordFreq: Record<string, number> = {};
  for (const w of FUNCTION_WORDS) {
    functionWordFreq[w] = Math.round(((counts.get(w) ?? 0) / total) * 1000) / 10;
  }

  return {
    words,
    burstiness,
    emDashPer300: per300(emDashes, words),
    semicolonPer300: per300(semicolons, words),
    functionWordFreq,
  };
}
