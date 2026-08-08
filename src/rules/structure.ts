import type { RawSpan, Rule } from "./types";
import { spans } from "./util";
import { paragraphSpans, sentenceSpans } from "./tokenize";

// v2. Structural / rhythm tells — the durable ones. Vocabulary decays every
// model release; a paragraph that marches in formation gives itself away for
// years. These carry the category's weight-3, so they move the score hardest.

const SHORT = 5; // words: a "short" sentence
const MIN_RUN = 3; // consecutive short sentences that count as staccato

/** Three or more short sentences in a row. */
function staccato(text: string): RawSpan[] {
  const sents = sentenceSpans(text);
  const out: RawSpan[] = [];
  let run: typeof sents = [];
  const flush = () => {
    if (run.length >= MIN_RUN)
      out.push({ from: run[0].from, to: run[run.length - 1].to });
    run = [];
  };
  for (const s of sents) {
    if (s.words > 0 && s.words <= SHORT) run.push(s);
    else flush();
  }
  flush();
  return out;
}

/** A paragraph whose sentences are all mid-length and near-identical: the
 *  "marching in formation" tell. Needs 3+ sentences and low length spread. */
function marching(text: string): RawSpan[] {
  const out: RawSpan[] = [];
  for (const p of paragraphSpans(text)) {
    const lens = p.sentences.map((s) => s.words);
    if (lens.length < 3) continue;
    const allMid = lens.every((n) => n >= 11 && n <= 22);
    if (!allMid) continue;
    const mean = lens.reduce((a, b) => a + b, 0) / lens.length;
    const cv =
      Math.sqrt(lens.reduce((a, b) => a + (b - mean) ** 2, 0) / lens.length) /
      mean;
    if (cv < 0.18) out.push({ from: p.from, to: p.to });
  }
  return out;
}

export const structure: Rule[] = [
  {
    id: "staccato",
    label: "staccato run",
    category: "structure",
    note: "Three short sentences in a row, breathing hard. It reads as punchy. It's actually just uniform. Like this. See?",
    detect: staccato,
  },
  {
    id: "marching",
    label: "marching in formation",
    category: "structure",
    note: "Every sentence the same mid-length, lockstep down the paragraph. Nobody writes like this by accident — it's the metronome under the machine. Let one sentence run long and one stop short.",
    detect: marching,
  },
  {
    id: "setup-then-list",
    label: "setup-then-list opener",
    category: "structure",
    note: "\"Three things surprised me…\" The counted-list opener. It promises tidiness, which life and good writing rarely have. Just say the thing without numbering it first.",
    detect: (t) =>
      spans(
        t,
        /\b(?:here are |there are )?(?:two|three|four|five|several|a few|a handful of|a number of) (?:things|reasons|ways|lessons|takeaways|points|steps|rules|principles|questions|factors|trends)\b/gi,
      ),
  },
  {
    id: "negation-affirmation",
    label: "negation → affirmation",
    category: "structure",
    note: "\"Not a discovery project. A formalisation project.\" The fragment that negates, then the fragment that corrects. A rhythm the model loves and people almost never reach for cold.",
    detect: (t) =>
      spans(
        t,
        /\bNot (?:a|an|just|only|about|the)\b[^.?!\n]{2,50}[.?!]\s+[A-Z][^.?!\n]{2,50}[.?!]/g,
      ),
  },
  {
    id: "two-word-closer",
    label: "punchy two-word closer",
    category: "structure",
    weight: 2,
    note: "\"Use it.\" \"Read it.\" The imperative mic-drop. One is fine. They travel in packs, and the pack is the tell.",
    detect: (t) =>
      spans(
        t,
        /\b(?:Use|Read|Try|Do|Ship|Buy|Watch|Notice|Remember|Consider|Trust|Embrace|Own) (?:it|them|this|that|more|less)\./g,
      ),
  },
  {
    id: "rule-of-three",
    label: "rule of three",
    category: "structure",
    weight: 2,
    note: "Three parallel beats in a row — tripled adjectives, tripled clauses. Once, it lands. As a habit it's a crutch, and the machine leans on it hard. (A nudge to check, not a verdict — real lists are fine.)",
    detect: (t) =>
      spans(t, /\b([a-z]{3,}), ([a-z]{3,}),? and ([a-z]{3,})\b/gi),
  },
];
