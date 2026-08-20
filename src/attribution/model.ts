import weightsData from "./weights.json";
import { extractFeatures } from "./features";
import type { House } from "./corpus/samples";

// Runtime side of the Tier-2 classifier: dot product + softmax against the
// weights trained offline by `train/train.ts`. No ML library, no
// in-browser LLM — just arithmetic over a JSON file, so this stays exactly
// as local and instant as the rest of the rules engine.
//
// HONESTY GATE, load-bearing: this names a REGISTER, not a source. "Reads
// like Claude's register, 62% confidence" is a real, measured stylometric
// signal — it is never a reading of a cryptographic watermark, which no
// client-side tool can access (see docs/SCOPE-v3.md §0). Style isn't
// provenance: a human can write in any of these registers, and staying at
// "unknown" is the correct, expected answer for a lot of real text.

const WORD_FLOOR = 40; // below this, there isn't enough signal to say anything
const CLEAR_CONFIDENCE = 0.55;
const UNKNOWN_CONFIDENCE = 0.35; // below this, stay quiet rather than guess

export interface AttributionResult {
  scores: Partial<Record<House, number>>;
  best: House | null;
  confidence: number;
  verdict: "not-enough-text" | "unknown" | "faint" | "clear";
  words: number;
}

function softmax(z: number[]): number[] {
  const max = Math.max(...z);
  const exps = z.map((v) => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

export function classifyHouse(text: string): AttributionResult {
  const { words, values } = extractFeatures(text);
  const { classes, mean, std, weights, bias } = weightsData as {
    classes: House[];
    mean: number[];
    std: number[];
    weights: number[][];
    bias: number[];
  };

  if (words < WORD_FLOOR) {
    return { scores: {}, best: null, confidence: 0, verdict: "not-enough-text", words };
  }

  const x = values.map((v, i) => (std[i] > 1e-6 ? (v - mean[i]) / std[i] : 0));
  const z = weights.map((w, c) => w.reduce((s, wj, j) => s + wj * x[j], bias[c]));
  const probs = softmax(z);

  const scores: Partial<Record<House, number>> = {};
  classes.forEach((c, i) => {
    scores[c] = Math.round(probs[i] * 1000) / 1000;
  });

  let bestIdx = 0;
  probs.forEach((p, i) => {
    if (p > probs[bestIdx]) bestIdx = i;
  });
  const confidence = Math.round(probs[bestIdx] * 1000) / 1000;

  if (confidence < UNKNOWN_CONFIDENCE) {
    return { scores, best: null, confidence, verdict: "unknown", words };
  }

  return {
    scores,
    best: classes[bestIdx],
    confidence,
    verdict: confidence >= CLEAR_CONFIDENCE ? "clear" : "faint",
    words,
  };
}
