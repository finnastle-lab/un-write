import { RangeSetBuilder, StateEffect, StateField } from "@codemirror/state";
import {
  Decoration,
  type DecorationSet,
  EditorView,
  hoverTooltip,
} from "@codemirror/view";
import type { Match } from "./rules";

/** Push a fresh set of matches into the editor. */
export const setMatches = StateEffect.define<Match[]>();

function buildDeco(matches: Match[]): DecorationSet {
  const builder = new RangeSetBuilder<Decoration>();
  for (const m of matches) {
    if (m.to <= m.from) continue;
    builder.add(
      m.from,
      m.to,
      Decoration.mark({
        class: `tell tell-${m.category}`,
        attributes: { "data-rule": m.ruleId },
      }),
    );
  }
  return builder.finish();
}

interface MatchState {
  matches: Match[];
  deco: DecorationSet;
}

/**
 * Holds the current matches and their decorations. Matches are pushed in from
 * React (the analysis lives there, single source of truth); between a doc edit
 * and the next push we just map the old decorations through the change so
 * highlights don't visibly lag.
 */
export const matchState = StateField.define<MatchState>({
  create: () => ({ matches: [], deco: Decoration.none }),
  update(value, tr) {
    for (const e of tr.effects) {
      if (e.is(setMatches)) return { matches: e.value, deco: buildDeco(e.value) };
    }
    if (tr.docChanged) {
      return { matches: value.matches, deco: value.deco.map(tr.changes) };
    }
    return value;
  },
  provide: (f) => EditorView.decorations.from(f, (v) => v.deco),
});

/** Hover a highlight → the note, in FA's voice. */
export const tellTooltip = hoverTooltip((view, pos) => {
  const { matches } = view.state.field(matchState);
  const m = matches.find((x) => pos >= x.from && pos <= x.to);
  if (!m) return null;
  return {
    pos: m.from,
    end: m.to,
    above: true,
    create() {
      const dom = document.createElement("div");
      dom.className = "tell-tooltip";
      const label = document.createElement("div");
      label.className = "tell-tooltip-label";
      label.dataset.cat = m.category;
      label.textContent = m.label;
      const note = document.createElement("div");
      note.className = "tell-tooltip-note";
      note.textContent = m.note;
      dom.append(label, note);
      return { dom };
    },
  };
});
