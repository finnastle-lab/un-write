// The tell taxonomy. Categories carry a base weight (structural tells are
// durable and weigh most; vocabulary decays and weighs least) and a colour
// used by both the editor decorations and the legend.

export type Category =
  | "semantic"
  | "structure"
  | "punctuation"
  | "phrase"
  | "transition"
  | "vocab";

export interface RawSpan {
  from: number;
  to: number;
}

export interface Rule {
  id: string;
  /** short human label, shown as the tooltip heading */
  label: string;
  category: Category;
  /** overrides the category base weight when set */
  weight?: number;
  /** the note, in FA's voice — static, authored once per rule */
  note: string;
  detect(text: string): RawSpan[];
}

export interface Match extends RawSpan {
  ruleId: string;
  label: string;
  category: Category;
  weight: number;
  note: string;
}

export const CATEGORY_META: Record<
  Category,
  { label: string; weight: number; color: string }
> = {
  // the v3 deep pass — model-judged semantic tells, as durable as structural
  semantic: { label: "semantic (deep pass)", weight: 3, color: "#6366d1" },
  // structural tells are the durable ones — weighted hardest
  structure: { label: "structure / rhythm", weight: 3, color: "#bd4d86" },
  transition: { label: "transition / hedge", weight: 1.5, color: "#2f7dc0" },
  phrase: { label: "manufactured phrase", weight: 1.5, color: "#8a5cc4" },
  punctuation: { label: "punctuation", weight: 1, color: "#c0432f" },
  vocab: { label: "vocabulary", weight: 1, color: "#2f9e6f" },
};

export function weightOf(rule: Rule): number {
  return rule.weight ?? CATEGORY_META[rule.category].weight;
}
