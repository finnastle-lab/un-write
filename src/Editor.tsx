import { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, placeholder } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";

interface EditorProps {
  initialDoc?: string;
  onChange?: (doc: string) => void;
}

/**
 * Thin CodeMirror 6 wrapper. Plain-text surface, no language mode.
 * v0: just the writing pane. The decoration + tooltip layers that draw
 * the tell highlights get added in v1 as extensions — the doc model
 * stays plain text underneath.
 */
export default function Editor({ initialDoc = "", onChange }: EditorProps) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  // keep the latest onChange without re-creating the editor
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
        placeholder("Paste or write. It'll tell you how it reads."),
        EditorView.updateListener.of((u) => {
          if (u.docChanged) onChangeRef.current?.(u.state.doc.toString());
        }),
        EditorView.theme({
          "&": { height: "100%", fontSize: "17px" },
          ".cm-content": {
            fontFamily: "'Iowan Old Style', Georgia, 'Times New Roman', serif",
            lineHeight: "1.7",
            padding: "24px 8px",
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

  return <div ref={host} className="editor-host" />;
}
