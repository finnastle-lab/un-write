import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, placeholder } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import type { Match } from "./rules";
import { matchState, setMatches, tellTooltip } from "./editorExtensions";

interface EditorProps {
  initialDoc?: string;
  matches: Match[];
  onChange?: (doc: string) => void;
}

/**
 * CodeMirror 6 writing surface. Plain text underneath; the tell highlights and
 * their notes ride on top as decorations, pushed in from React via setMatches.
 */
export default function Editor({
  initialDoc = "",
  matches,
  onChange,
}: EditorProps) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!host.current) return;

    const state = EditorState.create({
      doc: initialDoc,
      extensions: [
        history(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        EditorView.lineWrapping,
        matchState,
        tellTooltip,
        placeholder("Paste or write. It'll tell you how it reads."),
        EditorView.updateListener.of((u) => {
          if (u.docChanged) onChangeRef.current?.(u.state.doc.toString());
        }),
        EditorView.theme({
          "&": { height: "100%", fontSize: "17px" },
          ".cm-content": {
            fontFamily: "'Iowan Old Style', Georgia, 'Times New Roman', serif",
            lineHeight: "1.8",
            padding: "24px 8px 40vh",
            maxWidth: "72ch",
            caretColor: "var(--ink)",
          },
          ".cm-scroller": { overflow: "auto" },
          "&.cm-focused": { outline: "none" },
        }),
      ],
    });

    const v = new EditorView({ state, parent: host.current });
    view.current = v;
    return () => v.destroy();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // push fresh matches whenever the analysis changes
  useEffect(() => {
    view.current?.dispatch({ effects: setMatches.of(matches) });
  }, [matches]);

  return <div ref={host} className="editor-host" />;
}
