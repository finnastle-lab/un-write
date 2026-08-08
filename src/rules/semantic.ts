import type { Match, Rule } from "./types";

/**
 * v3 — the next layer. Semantic tells that can't be caught by regex or rhythm
 * maths: arguments that teleport (a missing logical bridge), faux balance (both
 * sides named, neither weighed), metaphors that almost land, superficial -ing
 * analysis, trait-caricature, performed warmth. These need a model's judgment,
 * not a pattern.
 *
 * It's built as a SEPARATE LAYER on purpose. The v1/v2 rules above run locally,
 * instantly, and never leave the browser. This layer can't honour that — good
 * semantic judgment means sending the text to a model off-device. So it's
 * opt-in, clearly flagged, and inert until the user asks for a "deep pass".
 *
 * Nothing here runs yet. `semantic` is empty, so the engine's behaviour is
 * unchanged; this file is the socket the deep pass plugs into.
 */

export interface DeepPassFinding {
  from: number;
  to: number;
  ruleId: string;
  label: string;
  note: string;
}

/** The shape a deep-pass provider must satisfy. An implementation would send
 *  `text` to a model and map its findings back onto character offsets. */
export type DeepPass = (text: string) => Promise<DeepPassFinding[]>;

/** Turn deep-pass findings into Matches the editor can render, tagged with the
 *  structure weight (semantic tells are as durable as structural ones). */
export function toMatches(findings: DeepPassFinding[]): Match[] {
  return findings.map((f) => ({
    ...f,
    category: "structure",
    weight: 3,
  }));
}

// Deliberately empty — see the note above. The local ruleset is complete
// without it; wiring a provider is a product decision (privacy tradeoff), not
// a detail to sneak in.
export const semantic: Rule[] = [];
