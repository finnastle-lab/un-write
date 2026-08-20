import type { RawSpan, Rule } from "./types";
import { spans } from "./util";

// "The problem: nobody tests this." — colon standing in for "is that",
// restating a clause rather than finishing it. Excludes list-announcing
// colons ("the following:", "these steps:") which are ordinary usage.
const LIST_INTRO = /\b(?:following|these|those|here|steps|options)$/i;

function midSentenceColon(text: string): RawSpan[] {
  const re = /\b([A-Z][a-z]+(?: [a-z]+){0,4}):\s+[a-z][^,.:;\n]{6,80}[.!?]/g;
  const out: RawSpan[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (LIST_INTRO.test(m[1])) continue;
    out.push({ from: m.index, to: m.index + m[0].length });
  }
  return out;
}

export const punctuation: Rule[] = [
  {
    id: "em-dash",
    label: "em / en dash",
    category: "punctuation",
    note: "The dash it reaches for when it wants to sound like it's thinking. A hyphen does the job and doesn't announce itself. This one's a fingerprint — soon to be scrubbed, so enjoy it while it lasts.",
    detect: (t) => spans(t, /[—–]/g),
  },
  {
    id: "em-dash-wrap",
    label: "double em-dash wrap",
    category: "punctuation",
    weight: 2,
    note: "—like this—. One dash is a fingerprint; two of them wrapping a clause is the whole hand. Humans reach for a comma or brackets here. The model reaches for this.",
    detect: (t) => spans(t, /[—–][^—–\n]{1,80}[—–]/g),
  },
  {
    id: "semicolon",
    label: "semicolon",
    category: "punctuation",
    note: "Two independent clauses, formally introduced to each other. Academic training data leaking through — almost nobody reaches for this in an email or a text message.",
    detect: (t) => spans(t, /;/g),
  },
  {
    id: "mid-sentence-colon",
    label: "mid-sentence colon",
    category: "punctuation",
    note: "\"The problem: nobody tests this.\" A colon standing in for \"is that\", restating the clause instead of finishing it. Fine once as a stylistic beat; as a habit it's the model's favourite way to sound like it's arriving at something.",
    detect: midSentenceColon,
  },
  {
    id: "exclamation",
    label: "exclamation mark",
    category: "punctuation",
    note: "Enthusiasm you didn't earn, punctuation doing the feeling for you. Delete it and see if the sentence still means it.",
    detect: (t) => spans(t, /!/g),
  },
  {
    id: "curly-double-quote",
    label: "smart quotes",
    category: "punctuation",
    note: "Curly double quotes, pasted straight out of somewhere that made them for you. Not damning on its own. Just a thread hanging off the jumper.",
    detect: (t) => spans(t, /[“”]/g),
  },
  {
    id: "markdown-artefact",
    label: "markdown artefact",
    category: "punctuation",
    note: "Formatting that leaked through from wherever this was drafted. `**` and stray hashes are the packaging the text forgot to take off.",
    detect: (t) => spans(t, /\*\*|(?:^|\n)#{1,6}\s/g),
  },
];
