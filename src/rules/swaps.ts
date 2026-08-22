/**
 * The de-ai step's swap dictionaries — canonical, single-answer replacements
 * for tells that have one, adapted from the avoid-ai-writing skill's Tier
 * 1/1B/2 tables (github.com/conorbronsdon/avoid-ai-writing). Where that skill
 * offers several options ("smooth, easy, without friction"), we pick one so
 * the swap can actually be applied instead of just suggested. Deliberately
 * partial: a tell only gets an entry here if the fix is a like-for-like
 * word/phrase swap, not a rewrite.
 */

function preserveCase(original: string, replacement: string): string {
  if (!original || !replacement) return replacement;
  if (original[0] === original[0].toUpperCase() && original[0] !== original[0].toLowerCase()) {
    return replacement[0].toUpperCase() + replacement.slice(1);
  }
  return replacement;
}

/** Case-insensitive lookup keyed by the exact matched text. */
export function wordSwap(
  map: Record<string, string>,
): (matchedText: string) => string | undefined {
  const lower: Record<string, string> = {};
  for (const [k, v] of Object.entries(map)) lower[k.toLowerCase()] = v;
  return (matchedText: string) => {
    const hit = lower[matchedText.toLowerCase()];
    return hit === undefined ? undefined : preserveCase(matchedText, hit);
  };
}
