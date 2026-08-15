import type { RawSpan, Rule } from "./types";
import { spans } from "./util";
import { paragraphSpans } from "./tokenize";

// v2.1 — the literary register. The first rules were built for slop that knows
// it's slop: LinkedIn, landing pages, vendor decks. But ask a model for a
// "short story" and it drops the buzzwords and reaches for the other voice —
// nature-mysticism, purple prose, everything suffering nobly and hanging on.
// Clean of every earlier tell, it sailed through reading "like a person".
//
// This family is the patch, and it's the pile the voice classifier reads to
// call "Literary AI". The rule ids here are load-bearing: voice.ts names them,
// so rename with care. Weight-2 by default (CATEGORY_META); the two signature
// moves are bumped to 3. Genuine literary humans reach for some of this, so
// every note stays a nudge, not a verdict.

/** A single short sentence sitting alone as its own paragraph, wedged between
 *  paragraphs that actually have more than one sentence in them. The dramatic
 *  drop-line. Humans do it on purpose too, so it's a nudge, not a verdict. */
function loneLine(text: string): RawSpan[] {
  const paras = paragraphSpans(text);
  if (paras.length < 3) return [];
  const out: RawSpan[] = [];
  paras.forEach((p, i) => {
    if (p.sentences.length !== 1) return;
    const words = p.sentences[0].words;
    if (words < 2 || words > 10) return;
    const prev = paras[i - 1];
    const next = paras[i + 1];
    const neighbourLong =
      (prev && prev.sentences.length > 1) || (next && next.sentences.length > 1);
    if (neighbourLong) out.push({ from: p.from, to: p.to });
  });
  return out;
}

// Function words that, as the second half of a "word, word" pair, mean the
// comma is a clause break — not an adjective pair. Keeps the density heuristic
// off "clusters, they hoarded" and friends.
const PAIR_STOP = new Set([
  "they", "the", "it", "its", "we", "he", "she", "i", "a", "an", "and", "or",
  "but", "was", "were", "is", "are", "had", "has", "have", "this", "that",
  "these", "those", "then", "there", "their", "his", "her", "our", "your",
  "my", "who", "which", "when", "where", "with", "for", "to", "of", "in",
  "on", "at", "by", "as", "so", "yet", "nor",
]);

/** The relentless "dry, skeletal / twisted, low-slung / dense, stubborn"
 *  adjective-pair rhythm. One pair is nothing; a passage built out of them is
 *  the machine painting by numbers. Density-gated: only fires at 3+. The regex
 *  has no part of speech, so it's the noisiest rule here — a nudge; the deep
 *  pass does it properly. */
function pairedAdjectives(text: string): RawSpan[] {
  const re = /\b([a-z]{3,}), ([a-z]{3,})\b/gi;
  const out: RawSpan[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (PAIR_STOP.has(m[1].toLowerCase()) || PAIR_STOP.has(m[2].toLowerCase()))
      continue;
    // a "word, word and word" triple belongs to rule-of-three, not here
    const tail = text.slice(m.index + m[0].length, m.index + m[0].length + 6);
    if (/^,?\s+(?:and|or)\b/i.test(tail)) continue;
    out.push({ from: m.index, to: m.index + m[0].length });
  }
  return out.length >= 3 ? out : [];
}

export const figurative: Rule[] = [
  {
    id: "stoic-personification",
    label: "stoic personification",
    category: "figurative",
    weight: 3,
    note: "Nature cast as a stoic hero — it \"holds its ground\", \"refuses to yield\", \"simply endures\", \"hoards\" what it has. The model's favourite ending: everything hangs on, nobly, until the thaw. Ridgelines don't have a work ethic. It's sentiment poured over a landscape.",
    detect: (t) =>
      spans(
        t,
        /\b(?:refus(?:e|es|ed|ing) to (?:yield|bend|break|die|fall|surrender)|(?:held|stood|kept|holding|standing) (?:its|their|his|her|the) ground|simply (?:endured|endure|endures|remained|remains|waited|waits|persisted|survived|survives)|would not (?:yield|bend|break|die)|clinging to|clung to|refused to die|hoarded|had surrendered|surrendered to|weeping from (?:old )?wounds|waiting for (?:lightning|the storm|rain|snow|spring|death|decay))\b/gi,
      ),
  },
  {
    id: "anaphoric-negation",
    label: "anaphoric negation",
    category: "figurative",
    weight: 3,
    note: "\"They didn't bloom, and they didn't weep.\" Two negations in lockstep, usually teed up so a swelling \"they simply—\" can land after. It's the cadence of a voiceover, not a person. Real refusal picks one verb and means it.",
    detect: (t) =>
      spans(
        t,
        /\b(They|It|He|She|We|You)\s+(?:didn['’]t|did not|do not|don['’]t|wouldn['’]t|would not|couldn['’]t|never)\s+\w+,?\s+(?:and|but|nor)\s+\1\s+(?:didn['’]t|did not|do not|don['’]t|wouldn['’]t|would not|couldn['’]t|never)\s+\w+/gi,
      ),
  },
  {
    id: "lone-dramatic-line",
    label: "lone dramatic line",
    category: "figurative",
    note: "A one-line paragraph, sat alone for weight. \"Only the pines held their ground.\" The beat-drop the model reaches for after a dense block. Fine once. As a habit it's doing the feeling for you, so the sentence doesn't have to.",
    detect: loneLine,
  },
  {
    id: "paired-adjectives",
    label: "adjective-pair rhythm",
    category: "figurative",
    note: "\"dry, skeletal ribbons. twisted, low-slung firs. a dense, stubborn stain.\" Every noun issued its regulation pair of adjectives. One is an image; a passage of them is the machine painting by numbers. (Noisiest rule here — fires only at three or more, and it's still a nudge.)",
    detect: pairedAdjectives,
  },
  {
    id: "elemental-simile",
    label: "off-the-shelf simile",
    category: "figurative",
    note: "\"like silver\", \"thick as armour\", \"smooth as glass\". Reach for a precious metal or a hard surface and call it imagery. If the comparison surprises no one, it isn't doing the work of one — it's just décor.",
    detect: (t) =>
      spans(
        t,
        /(?<!\b(?:I|we|you|they|he|she|people|who)\s)\b(?:like|as(?:\s+(?:hard|thick|cold|pale|white|bright|sharp|smooth|heavy|soft|dark|clear))?)\s+(?:a |an )?(?:silver|gold|glass|bone|stone|iron|steel|armou?r|smoke|silk|velvet|marble|porcelain|old blood|a ghost|ghosts?|a wound)\b/gi,
      ),
  },
  {
    id: "sensory-catalogue",
    label: "synaesthetic catalogue",
    category: "figurative",
    note: "\"wind that tasted of salt and crushed slate.\" The senses menu — wind you can taste, silence you can smell, light with a texture. One earns its place. As a reflex it's the model showing you it remembered there are five of them.",
    detect: (t) =>
      spans(t, /\b(?:tasted|smelled|smelt|reeked|stank|stunk)\s+(?:of|like)\b/gi),
  },
  {
    id: "poetic-possessive",
    label: "cosmic possessive",
    category: "figurative",
    note: "\"the turn of the earth\", \"the pulse of the mountain\". Bolt an anatomy word — pulse, breath, marrow, spine — onto a landscape and it sounds ancient. It's a fridge magnet with a mountain on it: deep-sounding, load-bearing of nothing.",
    detect: (t) =>
      spans(
        t,
        /\bthe\s+(?:turn|pulse|breath|bones?|marrow|hush|spine|sinew|song|silence|memory|ache)\s+of\s+the\s+\w+/gi,
      ),
  },
];
