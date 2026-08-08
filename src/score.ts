import type { Category, Match } from "./rules";
import { sentenceSpans } from "./rules/tokenize";

// --- text stats -----------------------------------------------------------

export function wordCount(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}

/** Sentence word-counts, from the shared tokeniser. */
export function sentenceLengths(text: string): number[] {
  return sentenceSpans(text).map((s) => s.words);
}

/** Coefficient of variation of sentence lengths. High = varied = human. */
export function coeffVar(lengths: number[]): number {
  if (lengths.length < 2) return 0.5; // not enough to judge; treat as neutral
  const mean = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  if (mean === 0) return 0.5;
  const variance =
    lengths.reduce((a, b) => a + (b - mean) ** 2, 0) / lengths.length;
  return Math.sqrt(variance) / mean;
}

// --- the score ------------------------------------------------------------

// All tuning lives here, on purpose. The score is meant to be inspectable, not
// a black box — every number below is a knob, not a verdict from on high.
export const SCORE_CONFIG = {
  k: 7, // how hard weighted flag-density pushes the score
  minWords: 5, // below this there isn't enough to judge
  // uniform sentence lengths ("marching in formation") add up to this penalty;
  // varied, high-friction writing gets none of it
  varTarget: 0.5,
  varSlope: 55,
  varCap: 22,
};

const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, n));

export interface ScoreBreakdown {
  score: number; // 0–100, higher = reads more like AI
  words: number;
  flagCount: number;
  flagLoad: number; // weighted flags per 100 words
  cv: number; // sentence-length variation
  varPenalty: number;
  byCategory: Record<Category, number>;
}

export function score(text: string, matches: Match[]): ScoreBreakdown {
  const words = wordCount(text);
  const cv = coeffVar(sentenceLengths(text));
  const byCategory: Record<Category, number> = {
    structure: 0,
    punctuation: 0,
    phrase: 0,
    transition: 0,
    vocab: 0,
  };
  for (const m of matches) byCategory[m.category]++;

  const c = SCORE_CONFIG;
  if (words < c.minWords) {
    return {
      score: 0,
      words,
      flagCount: matches.length,
      flagLoad: 0,
      cv,
      varPenalty: 0,
      byCategory,
    };
  }

  const weightSum = matches.reduce((s, m) => s + m.weight, 0);
  const flagLoad = weightSum / (words / 100);
  const varPenalty = clamp((c.varTarget - cv) * c.varSlope, 0, c.varCap);
  const raw = flagLoad * c.k + varPenalty;

  return {
    score: Math.round(clamp(raw, 0, 100)),
    words,
    flagCount: matches.length,
    flagLoad: Math.round(flagLoad * 10) / 10,
    cv: Math.round(cv * 100) / 100,
    varPenalty: Math.round(varPenalty),
    byCategory,
  };
}
