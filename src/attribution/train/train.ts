// Offline trainer for the model-attribution classifier. NOT shipped to the
// browser — run manually (`npx tsx src/attribution/train/train.ts`) whenever
// the corpus or feature set changes, to regenerate `weights.json`.
//
// Multinomial logistic regression (softmax), dependency-free: plain
// gradient descent with L2 regularization. The corpus is tiny (dozens of
// samples, ~24 features), so this trains in well under a second — there's
// no case for pulling in a real ML library for something this small.

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { extractFeatures, FEATURE_NAMES } from "../features";
import { CORPUS, type House } from "../corpus/samples";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = join(HERE, "..", "weights.json");

const CLASSES: House[] = ["gemini", "claude", "openai", "human"];
const EPOCHS = 3000;
const LR = 0.3;
const L2 = 0.08;

function standardize(rows: number[][]): { x: number[][]; mean: number[]; std: number[] } {
  const n = rows.length;
  const d = rows[0].length;
  const mean = new Array(d).fill(0);
  for (const r of rows) for (let j = 0; j < d; j++) mean[j] += r[j] / n;
  const std = new Array(d).fill(0);
  for (const r of rows) for (let j = 0; j < d; j++) std[j] += (r[j] - mean[j]) ** 2 / n;
  for (let j = 0; j < d; j++) std[j] = Math.sqrt(std[j]) || 1;
  const x = rows.map((r) => r.map((v, j) => (v - mean[j]) / std[j]));
  return { x, mean, std };
}

function softmax(z: number[]): number[] {
  const max = Math.max(...z);
  const exps = z.map((v) => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

/** Train weights (classes x features) + bias (per class) via batch
 *  gradient descent on softmax cross-entropy with L2. */
function trainLogReg(
  x: number[][],
  yIdx: number[],
  numClasses: number,
): { weights: number[][]; bias: number[] } {
  const n = x.length;
  const d = x[0].length;
  const weights: number[][] = Array.from({ length: numClasses }, () => new Array(d).fill(0));
  const bias: number[] = new Array(numClasses).fill(0);

  for (let epoch = 0; epoch < EPOCHS; epoch++) {
    const gradW = weights.map((row) => row.map(() => 0));
    const gradB = new Array(numClasses).fill(0);

    for (let i = 0; i < n; i++) {
      const z = weights.map((w, c) => w.reduce((s, wj, j) => s + wj * x[i][j], bias[c]));
      const probs = softmax(z);
      for (let c = 0; c < numClasses; c++) {
        const err = probs[c] - (yIdx[i] === c ? 1 : 0);
        for (let j = 0; j < d; j++) gradW[c][j] += (err * x[i][j]) / n;
        gradB[c] += err / n;
      }
    }

    for (let c = 0; c < numClasses; c++) {
      for (let j = 0; j < d; j++) {
        weights[c][j] -= LR * (gradW[c][j] + L2 * weights[c][j]);
      }
      bias[c] -= LR * gradB[c];
    }
  }

  return { weights, bias };
}

function predict(x: number[], weights: number[][], bias: number[]): number {
  const z = weights.map((w, c) => w.reduce((s, wj, j) => s + wj * x[j], bias[c]));
  const probs = softmax(z);
  let best = 0;
  for (let c = 1; c < probs.length; c++) if (probs[c] > probs[best]) best = c;
  return best;
}

function leaveOneOutAccuracy(rawRows: number[][], yIdx: number[]): number {
  let correct = 0;
  for (let holdout = 0; holdout < rawRows.length; holdout++) {
    const trainRows = rawRows.filter((_, i) => i !== holdout);
    const trainY = yIdx.filter((_, i) => i !== holdout);
    const { x, mean, std } = standardize(trainRows);
    const { weights, bias } = trainLogReg(x, trainY, CLASSES.length);
    const testX = rawRows[holdout].map((v, j) => (v - mean[j]) / std[j]);
    const pred = predict(testX, weights, bias);
    if (pred === yIdx[holdout]) correct++;
  }
  return correct / rawRows.length;
}

/** Counts by house and by real/synthetic split — printed so a v0→v1 corpus
 *  swap is visible in the training log, not just claimed in prose. */
function sourceCounts(): Record<string, { real: number; synthetic: number }> {
  const out: Record<string, { real: number; synthetic: number }> = {};
  for (const c of CLASSES) out[c] = { real: 0, synthetic: 0 };
  for (const s of CORPUS) out[s.house][s.source]++;
  return out;
}

function main() {
  const rawRows = CORPUS.map((s) => extractFeatures(s.text).values);
  const yIdx = CORPUS.map((s) => CLASSES.indexOf(s.house));

  console.log(`Training on ${CORPUS.length} samples, ${rawRows[0].length} features, ${CLASSES.length} classes.`);
  const counts = sourceCounts();
  for (const c of CLASSES) {
    console.log(`  ${c}: ${counts[c].real} real, ${counts[c].synthetic} synthetic`);
  }

  const loo = leaveOneOutAccuracy(rawRows, yIdx);
  console.log(`Leave-one-out accuracy: ${(loo * 100).toFixed(1)}%`);

  const { x, mean, std } = standardize(rawRows);
  const { weights, bias } = trainLogReg(x, yIdx, CLASSES.length);

  const out = {
    version: "v1-mixed-2026.08",
    trainedOn: CORPUS.length,
    sourceCounts: counts,
    leaveOneOutAccuracy: Math.round(loo * 1000) / 1000,
    classes: CLASSES,
    featureNames: FEATURE_NAMES,
    mean,
    std,
    weights,
    bias,
  };

  writeFileSync(OUT_PATH, JSON.stringify(out, null, 2));
  console.log(`Wrote ${OUT_PATH}`);
}

main();
