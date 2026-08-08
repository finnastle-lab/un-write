import type { Match, Rule } from "./types";
import { weightOf } from "./types";
import { punctuation } from "./punctuation";
import { phrases } from "./phrases";
import { transitions } from "./transitions";
import { vocab } from "./vocab";
import { applyExclusions, resolveOverlaps } from "./exclusions";

/** The live ruleset. Hot-swappable — it decays, so it's meant to be edited. */
export const RULESET_VERSION = "v1.2026.08";

export const rules: Rule[] = [
  ...punctuation,
  ...phrases,
  ...transitions,
  ...vocab,
];

/** Run every rule, apply the exclusion gate, resolve overlaps. */
export function analyse(text: string): Match[] {
  if (!text) return [];
  const raw: Match[] = [];
  for (const rule of rules) {
    const w = weightOf(rule);
    for (const span of rule.detect(text)) {
      raw.push({
        ...span,
        ruleId: rule.id,
        label: rule.label,
        category: rule.category,
        weight: w,
        note: rule.note,
      });
    }
  }
  return resolveOverlaps(applyExclusions(raw, text));
}

export type { Match, Category, Rule } from "./types";
export { CATEGORY_META } from "./types";
