import type { Rule } from "./types";
import { spans, wordList } from "./util";
import { wordSwap } from "./swaps";

// Grouped so each cluster of watchlist words gets its own note rather than one
// generic verdict. Vocabulary tells decay fastest — weighted lowest, and this
// whole file is the part of the ruleset with the shortest shelf life.
export const vocab: Rule[] = [
  {
    id: "vocab-corporate-verbs",
    label: "corporate verb",
    category: "vocab",
    note: "leverage, unlock, harness, foster, elevate, embark. Verbs that only live in decks. Nobody harnesses anything they'd talk about at the pub.",
    detect: (t) =>
      spans(
        t,
        wordList([
          "leverage",
          "unlock",
          "harness",
          "foster",
          "elevate",
          "embark",
          "underscore",
          "spearhead",
        ]),
      ),
    suggest: wordSwap({
      leverage: "use",
      harness: "use",
      foster: "encourage",
      elevate: "improve",
      embark: "start",
      underscore: "highlight",
      spearhead: "lead",
      unlock: "enable",
    }),
  },
  {
    id: "vocab-buzz-adjectives",
    label: "buzz adjective",
    category: "vocab",
    note: "seamless, robust, comprehensive, cutting-edge, next-generation. Adjectives that describe nothing and reassure everyone. Say what it actually does.",
    detect: (t) =>
      spans(
        t,
        wordList([
          "seamless",
          "seamlessly",
          "robust",
          "comprehensive",
          "cutting-edge",
          "next-generation",
          "industry-leading",
          "best-of-breed",
          "fast-paced",
          "state-of-the-art",
        ]),
      ),
    suggest: wordSwap({
      seamless: "smooth",
      seamlessly: "smoothly",
      robust: "strong",
      comprehensive: "thorough",
      "cutting-edge": "latest",
    }),
  },
  {
    id: "vocab-reveal-verbs",
    label: "reveal verb",
    category: "vocab",
    note: "delve, quietly, seamlessly weave. The register that lowers its voice to sound profound. \"Quietly\" is the loudest word on this list now. (Literal ones slip through — it's a nudge to check the sentence, not a verdict.)",
    detect: (t) => spans(t, wordList(["delve", "quietly", "seamlessly weave"])),
    suggest: wordSwap({ delve: "explore" }),
  },
  {
    id: "pathetic-fallacy",
    label: "pathetic fallacy",
    category: "vocab",
    note: "surrender, weep, yield, endure, cling, defy. The weather handed the inner life of a stoic war widow. One is a fine image; a whole hillside of brave little shrubs is the machine going for the lump in your throat. Let the hill just be a hill.",
    detect: (t) =>
      spans(
        t,
        wordList([
          "surrender", "surrendered", "surrenders", "surrendering",
          "weep", "weeps", "weeping", "wept",
          "yield", "yields", "yielded", "yielding",
          "refuse", "refuses", "refused", "refusing",
          "cling", "clings", "clung", "clinging",
          "defy", "defies", "defied", "defying",
          "hoard", "hoards", "hoarded", "hoarding",
          "endure", "endures", "endured", "enduring",
          "brave", "braved", "braving",
          "held their ground", "hold their ground",
        ]),
      ),
  },
  {
    id: "vocab-hype-nouns",
    label: "hype noun",
    category: "vocab",
    note: "game-changer, paradigm shift, watershed moment, testament. The gift shop of significance. Nothing here is a watershed. It's a Tuesday.",
    detect: (t) =>
      spans(
        t,
        wordList([
          "game-changer",
          "game changer",
          "paradigm shift",
          "watershed moment",
          "testament",
          "a testament to",
        ]),
      ),
    suggest: wordSwap({
      "a testament to": "shows",
      "watershed moment": "turning point",
    }),
  },
];
