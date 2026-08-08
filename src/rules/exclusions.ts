import type { Match, RawSpan } from "./types";
import { spans } from "./util";

/**
 * The do-not-flag gate. Runs last and always wins.
 *
 * v1 scope: strip anything inside code (fenced or inline) or a URL — that's
 * not prose, and flagging a dash inside a code snippet is exactly the kind of
 * thing that makes a tool infuriating. The house-style exclusions from the
 * source list (Oxford comma, AU spelling, "you", contractions, lists) don't
 * need a gate here because v1 never detects them in the first place.
 */
export function excludedRanges(text: string): RawSpan[] {
  return [
    ...spans(text, /```[\s\S]*?```/g), // fenced code
    ...spans(text, /`[^`\n]+`/g), // inline code
    ...spans(text, /\bhttps?:\/\/\S+/gi), // urls
  ];
}

function overlaps(a: RawSpan, b: RawSpan): boolean {
  return a.from < b.to && b.from < a.to;
}

/** Drop any match that touches an excluded range. */
export function applyExclusions(matches: Match[], text: string): Match[] {
  const gate = excludedRanges(text);
  if (gate.length === 0) return matches;
  return matches.filter((m) => !gate.some((g) => overlaps(m, g)));
}

/**
 * Resolve overlaps between kept matches so highlights never stack: when two
 * spans overlap, the heavier one wins; ties go to the longer span. Keeps the
 * decoration layer and the tooltips unambiguous.
 */
export function resolveOverlaps(matches: Match[]): Match[] {
  const sorted = [...matches].sort(
    (a, b) => b.weight - a.weight || b.to - b.from - (a.to - a.from),
  );
  const kept: Match[] = [];
  for (const m of sorted) {
    if (!kept.some((k) => overlaps(k, m))) kept.push(m);
  }
  return kept.sort((a, b) => a.from - b.from || a.to - b.to);
}
