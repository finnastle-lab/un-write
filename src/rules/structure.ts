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

// Small stopword set for the topic-sentence-overlap heuristics below — enough
// to keep "the" and "and" from inflating a match, not a full list.
const STOP = new Set([
  "the", "a", "an", "and", "or", "but", "of", "in", "on", "at", "to", "for",
  "with", "is", "are", "was", "were", "be", "been", "being", "it", "its",
  "this", "that", "these", "those", "as", "by", "from", "into", "not", "so",
  "than", "then", "there", "their", "they", "we", "you", "your", "our",
]);

function keywords(s: string): Set<string> {
  return new Set(
    s
      .toLowerCase()
      .match(/[a-z']{4,}/g)
      ?.filter((w) => !STOP.has(w)) ?? [],
  );
}

/** Overlap coefficient: shared keywords / smaller set size. */
function overlap(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let shared = 0;
  for (const w of a) if (b.has(w)) shared++;
  return shared / Math.min(a.size, b.size);
}

/** A paragraph whose closing sentence restates its own opening sentence — the
 *  circular "repeat the premise as the conclusion" habit. Needs both
 *  sentences to carry real content (3+ keywords) so short paragraphs don't
 *  trip it on a shared name or two. */
function topicRestatement(text: string): RawSpan[] {
  const out: RawSpan[] = [];
  for (const p of paragraphSpans(text)) {
    if (p.sentences.length < 3) continue;
    const first = keywords(p.sentences[0].text);
    const last = keywords(p.sentences[p.sentences.length - 1].text);
    if (first.size < 3 || last.size < 3) continue;
    if (overlap(first, last) >= 0.5) out.push({ from: p.from, to: p.to });
  }
  return out;
}

/** The whole piece's closing sentence mechanically calling back to its
 *  opening line — a stronger, rarer version of the paragraph-level tell
 *  above, so it needs a higher bar and more of the document to judge. */
function tooTidyCallback(text: string): RawSpan[] {
  const sents = sentenceSpans(text);
  if (sents.length < 6) return [];
  const first = keywords(sents[0].text);
  const last = keywords(sents[sents.length - 1].text);
  if (first.size < 4 || last.size < 4) return [];
  if (overlap(first, last) < 0.6) return [];
  return [{ from: sents[sents.length - 1].from, to: sents[sents.length - 1].to }];
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
  {
    id: "topic-restatement",
    label: "structural redundancy",
    category: "structure",
    note: "The paragraph's last sentence is its first sentence again, dressed differently. Restating the premise isn't the same as concluding it. Say something new or stop.",
    detect: topicRestatement,
  },
  {
    id: "too-tidy-callback",
    label: "too-tidy callback",
    category: "structure",
    weight: 2,
    note: "The last line loops back to the opening line, word for word almost. Neat, and that's the problem — real endings don't usually know where they started.",
    detect: tooTidyCallback,
  },
];
