import { useMemo, useState } from "react";
import Editor from "./Editor";
import { analyse, CATEGORY_META, type Category, RULESET_VERSION } from "./rules";
import { score } from "./score";

const CATEGORIES = Object.keys(CATEGORY_META) as Category[];

// A verdict line for the headline number. Deflating on purpose — the tool
// doesn't get to sound like a tool.
function verdict(n: number, hasText: boolean): string {
  if (!hasText) return "nothing yet";
  if (n >= 75) return "wrote itself, basically";
  if (n >= 50) return "a machine had a hand in this";
  if (n >= 25) return "a few tells, nothing fatal";
  if (n > 0) return "reads like a person";
  return "clean, or too short to tell";
}

export default function App() {
  const [doc, setDoc] = useState("");

  const matches = useMemo(() => analyse(doc), [doc]);
  const result = useMemo(() => score(doc, matches), [doc, matches]);
  const hasText = result.words > 0;

  return (
    <div className="app">
      <header className="chrome">
        <h1 className="wordmark">the un-write</h1>
        <p className="tagline">Detection, obsolete by design.</p>
      </header>

      <main className="pane">
        <Editor matches={matches} onChange={setDoc} />
      </main>

      <aside className="score" aria-label="score">
        <div className="score-number" data-band={band(result.score, hasText)}>
          {hasText ? result.score : "—"}
        </div>
        <div className="score-label">how AI does this read</div>
        <div className="score-verdict">{verdict(result.score, hasText)}</div>

        <ul className="legend">
          {CATEGORIES.map((c) => (
            <li key={c}>
              <span
                className="legend-dot"
                style={{ background: CATEGORY_META[c].color }}
              />
              <span className="legend-label">{CATEGORY_META[c].label}</span>
              <span className="legend-count">{result.byCategory[c]}</span>
            </li>
          ))}
        </ul>

        <details className="working">
          <summary>show the working</summary>
          <dl>
            <div>
              <dt>words</dt>
              <dd>{result.words}</dd>
            </div>
            <div>
              <dt>flags</dt>
              <dd>{result.flagCount}</dd>
            </div>
            <div>
              <dt>weighted / 100w</dt>
              <dd>{result.flagLoad}</dd>
            </div>
            <div>
              <dt>sentence variance</dt>
              <dd>{result.cv}</dd>
            </div>
            <div>
              <dt>uniformity penalty</dt>
              <dd>+{result.varPenalty}</dd>
            </div>
          </dl>
          <p className="working-note">
            Structural spread is weighted over vocabulary — words decay every
            model release, rhythm doesn't. Ruleset {RULESET_VERSION}.
          </p>
        </details>
      </aside>

      <footer className="admission">
        A tool that rewrites your text to sound less like AI is an AI rewriting
        your text. The rewrites will carry the exact tells it flags. We know.
        That's the joke, and it's on all of us.
      </footer>
    </div>
  );
}

function band(n: number, hasText: boolean): string {
  if (!hasText) return "none";
  if (n >= 75) return "high";
  if (n >= 50) return "mid";
  if (n >= 25) return "low";
  return "clean";
}
