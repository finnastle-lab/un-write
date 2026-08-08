// Shared sentence/paragraph tokeniser with character offsets, so structural
// rules can highlight the exact span they object to. Naive on purpose — good
// enough for rhythm maths, and cheap enough to run on every keystroke.

export interface Sentence {
  from: number;
  to: number;
  text: string;
  words: number;
}

export function sentenceSpans(text: string): Sentence[] {
  const out: Sentence[] = [];
  const re = /[^.!?]+[.!?]+|\S[^.!?]*$/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const raw = m[0];
    const trimmed = raw.trim();
    if (!trimmed) continue;
    const from = m.index + (raw.length - raw.trimStart().length);
    out.push({
      from,
      to: from + trimmed.length,
      text: trimmed,
      words: trimmed.split(/\s+/).filter(Boolean).length,
    });
  }
  return out;
}

export interface Paragraph {
  from: number;
  to: number;
  sentences: Sentence[];
}

export function paragraphSpans(text: string): Paragraph[] {
  const all = sentenceSpans(text);
  const out: Paragraph[] = [];
  let idx = 0;
  for (const part of text.split(/(\n\s*\n)/)) {
    const isBreak = /^\n\s*\n$/.test(part);
    if (!isBreak && part.trim()) {
      const from = idx + (part.length - part.trimStart().length);
      const to = from + part.trim().length;
      out.push({
        from,
        to,
        sentences: all.filter((s) => s.from >= from && s.to <= to),
      });
    }
    idx += part.length;
  }
  return out;
}
