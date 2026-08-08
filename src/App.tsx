import { useMemo, useState } from "react";
import Editor from "./Editor";

export default function App() {
  const [doc, setDoc] = useState("");

  const words = useMemo(
    () => (doc.trim() ? doc.trim().split(/\s+/).length : 0),
    [doc],
  );

  return (
    <div className="app">
      <header className="chrome">
        <h1 className="wordmark">the un-write</h1>
        <p className="tagline">Detection, obsolete by design.</p>
      </header>

      <main className="pane">
        <Editor onChange={setDoc} />
      </main>

      <aside className="score" aria-label="score">
        {/* v0 placeholder — the real "how AI does this read" score lands in v1 */}
        <div className="score-number">—</div>
        <div className="score-label">how AI does this read</div>
        <div className="score-meta">{words} words · no rules yet</div>
      </aside>

      <footer className="admission">
        A tool that rewrites your text to sound less like AI is an AI rewriting
        your text. We know. That's the joke.
      </footer>
    </div>
  );
}
