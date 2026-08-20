import { useMemo, useState, type ReactNode } from "react";
import { classifyHouse } from "./attribution/model";
import type { House } from "./attribution/corpus/samples";
import { analyse, CATEGORY_META, type Category } from "./rules";
import type { RawSpan } from "./rules/types";
import {
  EDIT_LEVELS,
  estimateWatermarkSurvival,
  simulateEdit,
} from "./watermark";

// The education/attribution surface. Same pasted text as the editor, a
// different lens on it: which house's register it resembles, how much
// editing it'd take to dilute a watermark like the ones providers ship,
// and an illustrative look at the mechanism itself. See docs/SCOPE-v3.md
// §0 for the honesty gate this whole view is built around — style, not
// provenance; simulation, not a reading of a real mark.

const HOUSE_META: Record<House, { label: string; blurb: string }> = {
  claude: {
    label: "Claude",
    blurb:
      "Anthropic's register — measured hedging, faux-balance, em-dashes doing the thinking, both sides named and neither picked.",
  },
  gemini: {
    label: "Gemini",
    blurb:
      "Google's register — structured openers that swing into literary, sensory prose; nature cast as a stoic hero.",
  },
  openai: {
    label: "GPT / OpenAI",
    blurb:
      "OpenAI's register — formal five-paragraph cadence, stock disclaimers, exhaustive hedged lists, \"in conclusion.\"",
  },
  human: {
    label: "Human",
    blurb: "No house register dominates — reads like a person, not an assistant house style.",
  },
};

const HOUSE_ORDER: House[] = ["claude", "gemini", "openai", "human"];

const DEMO_SENTENCE =
  "The harbor changed slowly, then all at once, and nobody who lived there could say exactly when it happened.";

interface AttributionViewProps {
  doc: string;
}

export default function AttributionView({ doc }: AttributionViewProps) {
  const hasText = doc.trim().length > 0;
  const attribution = useMemo(() => classifyHouse(doc), [doc]);
  const matches = useMemo(() => analyse(doc), [doc]);
  const categoryCounts = useMemo(() => {
    const counts: Record<Category, number> = {
      structure: 0,
      figurative: 0,
      punctuation: 0,
      phrase: 0,
      transition: 0,
      vocab: 0,
    };
    for (const m of matches) counts[m.category]++;
    return counts;
  }, [matches]);

  const [level, setLevel] = useState(0);
  const levelId = EDIT_LEVELS[level].id;
  const edited = useMemo(() => (hasText ? simulateEdit(doc, levelId) : ""), [doc, levelId, hasText]);
  const survival = useMemo(
    () => (hasText ? estimateWatermarkSurvival(doc, edited) : null),
    [doc, edited, hasText],
  );

  return (
    <div className="identify">
      <section className="identify-section">
        <h2>Which house does this read like?</h2>
        <p className="identify-honesty">
          This is stylometry, not forensics — matching your text's writing habits against each
          house's documented register. It cannot read a real watermark; SynthID and Anthropic's
          mark are keyed with private keys nothing client-side can see. <strong>"Unknown" is a
          normal, correct answer</strong> — a human can write in any of these registers.
        </p>

        {!hasText && <p className="identify-empty">Paste something in the editor first.</p>}

        {hasText && attribution.verdict === "not-enough-text" && (
          <p className="identify-empty">
            Needs roughly 40+ words before a register reading means anything ({attribution.words} so
            far). Short text just doesn't carry enough signal.
          </p>
        )}

        {hasText && attribution.verdict !== "not-enough-text" && (
          <>
            <div className="house-bars">
              {HOUSE_ORDER.map((h) => {
                const pct = Math.round((attribution.scores[h] ?? 0) * 100);
                return (
                  <div className="house-bar" key={h}>
                    <div className="house-bar-label">
                      <span>{HOUSE_META[h].label}</span>
                      <span className="house-bar-pct">{pct}%</span>
                    </div>
                    <div className="house-bar-track">
                      <div
                        className="house-bar-fill"
                        data-best={attribution.best === h}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="identify-verdict">
              {attribution.verdict === "unknown" || !attribution.best
                ? "No house register clears the bar here — could be genuinely human, a blend of registers, or just not enough of a lean either way. Unknown is the honest answer."
                : `Reads like ${HOUSE_META[attribution.best].label}'s register, ${
                    attribution.verdict === "clear" ? "fairly clearly" : "faintly"
                  } (${Math.round(attribution.confidence * 100)}% confidence). ${HOUSE_META[attribution.best].blurb}`}
            </p>
          </>
        )}

        {matches.length > 0 && (
          <div className="identify-evidence">
            <h3>What's feeding this read</h3>
            <ul>
              {(Object.keys(CATEGORY_META) as Category[])
                .filter((c) => categoryCounts[c] > 0)
                .map((c) => (
                  <li key={c}>
                    <span className="legend-dot" style={{ background: CATEGORY_META[c].color }} />
                    <span>{CATEGORY_META[c].label}</span>
                    <span className="identify-evidence-count">{categoryCounts[c]}</span>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </section>

      <section className="identify-section">
        <h2>How much editing survives?</h2>
        <p className="identify-honesty">
          A simulation, not a reading. Drag the slider — it runs your text through a canned, fully
          local edit at each step and measures how much stays word-for-word recognisable, then
          projects that onto an open watermarking scheme (Kirchenbauer et al.'s KGW) at a 1,500-word
          reference length. Real watermark keys are private, so this can only teach how such a
          scheme decays, never diagnose one.
        </p>

        {!hasText && <p className="identify-empty">Paste something in the editor first.</p>}

        {hasText && survival && (
          <>
            <div className="survival-text">{renderSurvivalText(doc, survival.survivingRanges)}</div>
            <input
              type="range"
              min={0}
              max={EDIT_LEVELS.length - 1}
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="survival-slider"
              aria-label="Simulated edit intensity"
            />
            <div className="survival-levels">
              {EDIT_LEVELS.map((l, i) => (
                <span key={l.id} data-active={i === level}>
                  {l.label}
                </span>
              ))}
            </div>
            <p className="survival-readout">
              <strong>{EDIT_LEVELS[level].label}</strong> · surviving windows:{" "}
              <strong>{Math.round(survival.survivingFraction * 100)}%</strong> · {survival.verdict}
            </p>
            <p className="identify-honesty">
              Verdict reads the surviving fraction measured <em>from the highlights above</em>,
              projected to a 1,500-word document. Two things to notice: how much a "heavy edit"
              leaves standing, and how far toward a full rewrite you have to drag before the
              evidence actually dies.
            </p>
          </>
        )}
      </section>

      <section className="identify-section">
        <h2>How the watermark actually works</h2>
        <p className="identify-honesty">
          Illustrative only — a toy green/red split on made-up rules, teaching the mechanism real
          schemes use (SynthID-Text, Kirchenbauer's KGW). Every word here gets coloured by a local
          hash of itself and the word before it, standing in for a cryptographic key seeded by the
          previous few tokens. Not a reading of your text's real mark — nobody's key is public.
        </p>
        <div className="shadow-key-demo">{renderShadowKey(hasText ? doc : DEMO_SENTENCE)}</div>
        <p className="shadow-key-legend">
          <span className="shadow-token-green">green</span> = the key favoured this word here ·{" "}
          <span className="shadow-token-red">red</span> = it didn't, so choosing it costs the mark a
          little. A real watermark nudges generation toward long green runs; this demo only colours
          what's already there.
        </p>
      </section>
    </div>
  );
}

function renderSurvivalText(text: string, ranges: RawSpan[]): ReactNode {
  if (!text) return null;
  const sorted = [...ranges].sort((a, b) => a.from - b.from);
  const nodes: ReactNode[] = [];
  let cursor = 0;
  sorted.forEach((r, i) => {
    if (r.from > cursor) {
      nodes.push(
        <span key={`f${i}`} className="survival-faded">
          {text.slice(cursor, r.from)}
        </span>,
      );
    }
    nodes.push(
      <span key={`s${i}`} className="survival-surviving">
        {text.slice(r.from, r.to)}
      </span>,
    );
    cursor = r.to;
  });
  if (cursor < text.length) {
    nodes.push(
      <span key="tail" className="survival-faded">
        {text.slice(cursor)}
      </span>,
    );
  }
  return nodes;
}

function hashPair(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function renderShadowKey(text: string): ReactNode {
  const parts = text.split(/(\s+)/);
  let prevNorm = "";
  return parts.map((part, i) => {
    if (part === "" || /^\s+$/.test(part)) return <span key={i}>{part}</span>;
    const norm = part.toLowerCase().replace(/[^\w']/g, "");
    const isGreen = hashPair(`${prevNorm}|${norm}`) % 2 === 0;
    prevNorm = norm;
    return (
      <span key={i} className={isGreen ? "shadow-token-green" : "shadow-token-red"}>
        {part}
      </span>
    );
  });
}
