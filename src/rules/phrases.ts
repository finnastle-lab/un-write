import type { Rule } from "./types";
import { spans, wordList } from "./util";

// bounded wildcard: stay inside one clause, never leap a sentence boundary
const GAP = "[^.?!\\n]{0,40}";

export const phrases: Rule[] = [
  // --- contrast-reframe family -------------------------------------------
  {
    id: "not-x-its-y",
    label: "it's not X, it's Y",
    category: "phrase",
    note: "The reframe reflex. Set up a thing only to swap it for a shinier thing. It feels like insight and is actually just a swerve. I know because I do it too.",
    detect: (t) =>
      spans(t, new RegExp(`\\b(?:it['’]s|it is|that['’]s) not\\b${GAP}\\bit['’]s\\b`, "gi")),
  },
  {
    id: "not-just-x-but-y",
    label: "not just X, but Y",
    category: "phrase",
    note: "\"Not just X, but Y.\" The escalator move — whatever you said, here's a bigger one. Rarely is the bigger one true.",
    detect: (t) =>
      spans(t, new RegExp(`\\bnot just\\b${GAP}\\b(?:but|it['’]s)\\b`, "gi")),
  },
  {
    id: "less-x-more-y",
    label: "less X, more Y",
    category: "phrase",
    note: "\"Less X, more Y.\" Symmetry standing in for an argument. Pleasant shape, no weight.",
    detect: (t) => spans(t, /\bless\s+\w+,\s+more\s+\w+/gi),
  },
  {
    id: "question-isnt",
    label: "the question isn't X",
    category: "phrase",
    note: "\"The question isn't X, it's Y.\" It tells you what to care about instead of showing you why. A magician's other hand.",
    detect: (t) =>
      spans(t, new RegExp(`\\bthe (?:question|point|issue) (?:isn['’]t|is not)\\b${GAP}\\bit['’]s\\b`, "gi")),
  },
  {
    id: "table-stakes",
    label: "X is table stakes",
    category: "phrase",
    note: "\"X is table stakes, Y is the real question.\" Demote the obvious thing, anoint the next thing. Poker chips for people who've never sat at the table.",
    detect: (t) => spans(t, /\b(?:is|are)\s+table[\s-]stakes\b/gi),
  },

  // --- pseudo-cleft / manufactured weight --------------------------------
  {
    id: "pseudo-cleft",
    label: "pseudo-cleft opener",
    category: "phrase",
    note: "\"What matters here is…\" — a plain claim wearing a raincoat. Cut the front half and the sentence stands up fine, usually better.",
    detect: (t) =>
      spans(t, /\bwhat (?:matters|counts|really matters)(?:\s+\w+){0,3}\s+is\b|\bwhat \w+ actually does is\b/gi),
  },
  {
    id: "signposting",
    label: "argument signposting",
    category: "phrase",
    note: "\"The part worth pausing on…\" It points at significance instead of earning it. If the part's worth pausing on, we'll pause. You don't hold up the sign.",
    detect: (t) =>
      spans(t, /\bthe (?:part|bit|thing) (?:worth|to) (?:pausing on|noting|watch)\b|\bthe (?:finding|point) (?:underneath|beneath) the\b/gi),
  },

  // --- faux-balance / the non-decision -----------------------------------
  {
    id: "faux-balance",
    label: "flagging, not picking",
    category: "phrase",
    note: "\"Both are valid. Flagging rather than picking.\" Two options named, neither weighed, the decision slid back across the table to you. It performs even-handedness to dodge the risk of a view. Fence-sitting in a nice coat. Pick one.",
    detect: (t) =>
      spans(
        t,
        /\b(?:flagging|surfacing|noting|raising) (?:(?:it|this) )?(?:rather than|not|over|instead of) (?:picking|choosing|deciding|prescribing)\b|\b(?:for you to decide|your call to make|leaving (?:it|this) (?:to you|open)|you'?ll (?:want to |need to )?decide)\b|\bthe (?:honest|real|two|main) (?:options|choices|paths|tradeoffs?) (?:here )?(?:are|is)\b|\bboth (?:are|options are|approaches are|have merit|are valid|are defensible)\b|\bthere'?s a (?:case|argument) (?:to be made )?for both\b/gi,
      ),
  },

  // --- announcing --------------------------------------------------------
  {
    id: "announcing-good-part",
    label: "announcing the good part",
    category: "phrase",
    note: "\"Here's the kicker.\" \"Here's what most people miss.\" The trailer for a film that's about to disappoint you. Just show the thing.",
    detect: (t) =>
      spans(t, /\bhere['’]s (?:the kicker|the thing|what (?:most people|nobody) (?:miss|misses|realise|realises|get|gets))\b/gi),
  },
  {
    id: "announcing-honesty",
    label: "announcing honesty",
    category: "phrase",
    note: "\"The truth is…\" \"Let me be blunt.\" Flagging honesty is what you do when the sentence can't manage it alone. Blunt things don't clear their throat first.",
    detect: (t) =>
      spans(t, /\b(?:the truth is|to be honest|honest answer|let me be blunt|the honest truth|worth noting(?: that)?)\b/gi),
  },
  {
    id: "summarising",
    label: "summarising conclusion",
    category: "phrase",
    note: "\"In summary.\" \"The bottom line is.\" It announces a landing for a plane that never took off. If it needs a recap this short, it didn't say much.",
    detect: (t) =>
      spans(t, /\b(?:in summary|to recap|to sum up|the bottom line is|in conclusion|at the end of the day)\b/gi),
  },

  // --- register tells ----------------------------------------------------
  {
    id: "therapist-mode",
    label: "therapist mode",
    category: "phrase",
    note: "\"You're not alone in this.\" \"That's completely understandable.\" Warmth with no one on the other end of it. It's comforting a reader it can't see about a problem it invented.",
    detect: (t) =>
      spans(t, /\b(?:you['’]re not alone|that['’]s (?:completely|totally) understandable|and that['’]s (?:okay|ok)|there['’]s nothing wrong with)\b/gi),
  },
  {
    id: "engagement-closer",
    label: "engagement closer",
    category: "phrase",
    note: "\"What do you think?\" \"Sound familiar?\" \"Want to go deeper?\" The copy asking permission to keep existing. Nobody deep asks if you're ready.",
    detect: (t) =>
      spans(t, /\b(?:what do you think\??|sound familiar\??|want to go deeper\??|does (?:this|that) resonate\??|dm me(?: for more)?)\b/gi),
  },

  // --- vendor / cliché openers -------------------------------------------
  {
    id: "vendor-opener",
    label: "vendor opener",
    category: "phrase",
    note: "The landing-page throat-clear. \"In today's landscape…\" \"It's not a matter of if, but when.\" Every deck since 2019 opens here. You can just start.",
    detect: (t) =>
      spans(
        t,
        wordList([
          "in today's threat landscape",
          "in today's digital landscape",
          "in today's fast-paced world",
          "in an era of",
          "in the age of",
          "it's not a matter of if, but when",
          "sophisticated threat actors",
          "don't be the next victim",
          "exciting news",
          "it's important to note that",
        ]),
      ),
  },
  {
    id: "vague-attribution",
    label: "vague attribution",
    category: "phrase",
    note: "\"Industry experts say.\" \"Research suggests.\" A citation shaped like a citation with nobody home. Name the expert or drop the claim.",
    detect: (t) =>
      spans(
        t,
        wordList([
          "industry experts say",
          "experts agree",
          "research suggests",
          "studies show",
          "it's widely reported",
          "it is widely believed",
        ]),
      ),
  },
];
