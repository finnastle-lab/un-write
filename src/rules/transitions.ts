import type { Rule } from "./types";
import { spans, wordList } from "./util";

export const transitions: Rule[] = [
  {
    id: "stiff-transition",
    label: "stiff transition",
    category: "transition",
    note: "\"Furthermore.\" \"Moreover.\" \"That said.\" The connective tissue of an essay nobody wanted to write. One per piece, maximum, and even that's generous.",
    detect: (t) =>
      spans(
        t,
        wordList([
          "furthermore",
          "moreover",
          "in addition",
          "additionally",
          "that said",
          "with that being said",
          "as such",
        ]),
      ),
  },
  {
    id: "hedge-stack",
    label: "hedge stacking",
    category: "transition",
    note: "\"May potentially.\" \"Could arguably.\" Two hedges doing one hedge's job, so it can't be pinned to anything. Pick a lane or say nothing.",
    detect: (t) =>
      spans(
        t,
        /\b(?:may potentially|could potentially|could arguably|might arguably|often tends to|can sometimes|may (?:sometimes )?in some cases)\b/gi,
      ),
  },
  {
    id: "prepositional-cliche",
    label: "prepositional cliché",
    category: "transition",
    note: "\"When it comes to.\" \"In terms of.\" \"With regard to.\" Four words to point at a noun you could've just named. Padding that thinks it's transition.",
    detect: (t) =>
      spans(
        t,
        wordList([
          "when it comes to",
          "in terms of",
          "with regard to",
          "with regards to",
          "taking into account",
          "in order to",
          "for the purpose of",
        ]),
      ),
  },
];
