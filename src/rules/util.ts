import type { RawSpan } from "./types";

/** Escape a literal string for use inside a RegExp. */
export function esc(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** All matches of a global regex, as spans. Regex MUST have the /g flag. */
export function spans(text: string, re: RegExp): RawSpan[] {
  const out: RawSpan[] = [];
  let m: RegExpExecArray | null;
  re.lastIndex = 0;
  while ((m = re.exec(text)) !== null) {
    // guard against zero-width matches spinning forever
    if (m.index === re.lastIndex) re.lastIndex++;
    out.push({ from: m.index, to: m.index + m[0].length });
  }
  return out;
}

/**
 * Build a case-insensitive, word-bounded alternation from a list of literal
 * phrases. Apostrophes match both straight and curly. Used for watchlists.
 */
export function wordList(words: string[]): RegExp {
  const alt = words
    .map((w) => esc(w).replace(/'/g, "['’]"))
    .sort((a, b) => b.length - a.length) // longer first so multiword wins
    .join("|");
  return new RegExp(`\\b(?:${alt})\\b`, "gi");
}
