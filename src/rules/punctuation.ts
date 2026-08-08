import type { Rule } from "./types";
import { spans } from "./util";

export const punctuation: Rule[] = [
  {
    id: "em-dash",
    label: "em / en dash",
    category: "punctuation",
    note: "The dash it reaches for when it wants to sound like it's thinking. A hyphen does the job and doesn't announce itself. This one's a fingerprint — soon to be scrubbed, so enjoy it while it lasts.",
    detect: (t) => spans(t, /[—–]/g),
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
