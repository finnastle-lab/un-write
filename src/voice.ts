import type { Match } from "./rules";

// --- the "which AI is this" layer -----------------------------------------
//
// Not detection — attribution, for laughs. The rule engine already knows WHAT
// tells fired; this reads the *shape* of that pile and guesses which house
// register it came out of. It's vibes, not forensics, and it says so. The joke
// that has to survive: the frontier-assistant profile is this exact voice, so
// the tool gets to name its own maker.

interface VoiceProfile {
  id: string;
  /** the callout, shown big */
  label: string;
  /** one line, FA's wry register — draft, punch it up */
  blurb: string;
  /** ruleIds that point at this register */
  signals: string[];
}

const PROFILES: VoiceProfile[] = [
  {
    id: "literary",
    label: "Literary AI",
    blurb:
      "Every noun handed a feeling, every paragraph landing on a swell of strings. Gemini on a nature retreat. Beautiful — and nobody's grandmother wrote it.",
    signals: [
      "anaphoric-negation",
      "lone-dramatic-line",
      "paired-adjectives",
      "stoic-personification",
      "sensory-catalogue",
      "elemental-simile",
      "poetic-possessive",
      "pathetic-fallacy",
      "rule-of-three",
      "staccato",
      "negation-affirmation",
    ],
  },
  {
    id: "frontier-assistant",
    label: "Frontier-assistant AI",
    blurb:
      "Measured, balanced, em-dashes doing the thinking — both options named, neither chosen, flagging rather than picking. Talks in a private vocabulary and calls it precision. Reads like a helpful assistant. Possibly the one that built this tool. Awkward.",
    signals: [
      "not-x-its-y",
      "not-just-x-but-y",
      "question-isnt",
      "pseudo-cleft",
      "signposting",
      "announcing-honesty",
      "summarising",
      "hedge-stack",
      "faux-balance",
      "stiff-transition",
      "em-dash",
    ],
  },
  {
    id: "linkedin",
    label: "LinkedIn AI",
    blurb:
      "Buzzwords in formation, a hook up top, a soft ask at the bottom. Straight off the content calendar. Someone's about to check whether this resonates.",
    signals: [
      "vendor-opener",
      "table-stakes",
      "setup-then-list",
      "announcing-good-part",
      "two-word-closer",
      "less-x-more-y",
      "vague-attribution",
      "vocab-corporate-verbs",
      "vocab-buzz-adjectives",
      "vocab-hype-nouns",
    ],
  },
  {
    id: "companion",
    label: "Companion AI",
    blurb:
      "Warmth pointed at no one in particular. You're not alone, that's completely valid, and here's a gentle follow-up question you never asked for.",
    signals: ["therapist-mode", "engagement-closer", "exclamation"],
  },
];

export interface VoiceVerdict {
  label: string;
  blurb: string;
  /** 0–1: share of the weighted evidence that pointed at this register */
  share: number;
  /** how sure the phrasing should sound */
  confidence: "faint" | "clear";
}

/**
 * Read the fired matches and name the register. Deliberately conservative:
 * needs either two distinct signal rules or one heavy structural tell, plus a
 * real share of the evidence — otherwise it stays quiet rather than inventing
 * a verdict from a lone em-dash.
 */
export function classifyVoice(matches: Match[]): VoiceVerdict | null {
  if (matches.length === 0) return null;
  const total = matches.reduce((s, m) => s + m.weight, 0);
  if (total === 0) return null;

  let best: { p: VoiceProfile; weight: number; distinct: number } | null = null;
  for (const p of PROFILES) {
    const claimed = matches.filter((m) => p.signals.includes(m.ruleId));
    const weight = claimed.reduce((s, m) => s + m.weight, 0);
    const distinct = new Set(claimed.map((m) => m.ruleId)).size;
    if (weight > 0 && (!best || weight > best.weight))
      best = { p, weight, distinct };
  }
  if (!best) return null;

  const heavy = matches.some(
    (m) => best!.p.signals.includes(m.ruleId) && m.weight >= 3,
  );
  if (best.distinct < 2 && !heavy) return null;

  const share = best.weight / total;
  if (share < 0.34) return null;

  return {
    label: best.p.label,
    blurb: best.p.blurb,
    share: Math.round(share * 100) / 100,
    confidence: share >= 0.55 ? "clear" : "faint",
  };
}
