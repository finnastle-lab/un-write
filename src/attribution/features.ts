import { analyse, CATEGORY_META, type Category } from "../rules";
import { wordCount } from "../score";
import { FUNCTION_WORDS, stylometricProfile } from "../stylometry";

// Feature extraction for model attribution. Deliberately reuses the
// existing rules engine and stylometric meters rather than building a
// parallel analysis pass — the tells that already flag "this reads like
// AI" are exactly the raw material for "which house's AI." One pass over
// the text produces both the highlight overlay and the attribution vector.

const CATEGORIES = Object.keys(CATEGORY_META) as Category[];

/** Canonical, ordered feature names — index order matches `values` and
 *  must match what the trainer (`train/`) and shipped `weights.json` used. */
export const FEATURE_NAMES: string[] = [
  ...CATEGORIES.map((c) => `cat:${c}`),
  "burstiness",
  "emDashPer300",
  "semicolonPer300",
  ...FUNCTION_WORDS.map((w) => `fw:${w}`),
];

export interface FeatureVector {
  words: number;
  values: number[];
}

export function extractFeatures(text: string): FeatureVector {
  const words = wordCount(text);
  const matches = analyse(text);
  const byCategory: Record<Category, number> = {
    structure: 0,
    figurative: 0,
    punctuation: 0,
    phrase: 0,
    transition: 0,
    vocab: 0,
  };
  for (const m of matches) byCategory[m.category]++;

  const per100 = (n: number) => (words > 0 ? (n / words) * 100 : 0);
  const style = stylometricProfile(text);

  const values = [
    ...CATEGORIES.map((c) => per100(byCategory[c])),
    style.burstiness,
    style.emDashPer300,
    style.semicolonPer300,
    ...FUNCTION_WORDS.map((w) => style.functionWordFreq[w] ?? 0),
  ];

  return { words, values };
}
