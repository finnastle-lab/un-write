import type { Rule } from "./types";
import { spans, wordList } from "./util";

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
  },
  {
    id: "vocab-reveal-verbs",
    label: "reveal verb",
    category: "vocab",
    note: "delve, quietly, seamlessly weave. The register that lowers its voice to sound profound. \"Quietly\" is the loudest word on this list now. (Literal ones slip through — it's a nudge to check the sentence, not a verdict.)",
    detect: (t) => spans(t, wordList(["delve", "quietly", "seamlessly weave"])),
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
    id: "vocab-poison-words",
    label: "poison word",
    category: "vocab",
    note: "tapestry, pivotal, vibrant. The three words every watchlist since 2023 leads with, because the model still can't quit them. Decays fast — the next version drops these and finds three new ones — but right now they're a giveaway.",
    detect: (t) => spans(t, wordList(["tapestry", "pivotal", "vibrant"])),
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
  },
];
