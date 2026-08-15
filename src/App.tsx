import { useEffect, useMemo, useRef, useState } from "react";
import Editor from "./Editor";
import {
  analyse,
  CATEGORY_META,
  type Category,
  type Match,
  resolveOverlaps,
  RULESET_VERSION,
} from "./rules";
import { score } from "./score";
import { classifyVoice } from "./voice";
import { useTheme } from "./useTheme";
import { DeepPassError, runDeepPass } from "./deepPass";
import cloud from "./assets/cloud.png";
import signatureBlack from "./assets/signature-black.png";
import signatureWhite from "./assets/signature-white.png";

const CATEGORIES = Object.keys(CATEGORY_META) as Category[];
const KEY_STORE = "un-write-anthropic-key";

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

type DeepStatus = "idle" | "loading" | "done" | "error";

export default function App() {
  const [doc, setDoc] = useState("");
  const [theme, toggleTheme] = useTheme();

  const localMatches = useMemo(() => analyse(doc), [doc]);

  // --- deep pass (v3) -----------------------------------------------------
  const [deepMatches, setDeepMatches] = useState<Match[]>([]);
  const [deepStatus, setDeepStatus] = useState<DeepStatus>("idle");
  const [deepError, setDeepError] = useState("");
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(KEY_STORE) ?? "");
  const [showKey, setShowKey] = useState(false);
  const keyInput = useRef<HTMLInputElement>(null);

  // deep-pass results are tied to the exact text — a keystroke invalidates them
  useEffect(() => {
    setDeepMatches([]);
    setDeepStatus("idle");
  }, [doc]);

  async function deepPass() {
    if (!doc.trim()) return;
    if (!apiKey) {
      setShowKey(true);
      queueMicrotask(() => keyInput.current?.focus());
      return;
    }
    setDeepStatus("loading");
    setDeepError("");
    try {
      setDeepMatches(await runDeepPass(doc, apiKey));
      setDeepStatus("done");
    } catch (e) {
      setDeepStatus("error");
      setDeepError(e instanceof DeepPassError ? e.message : "Something went wrong.");
    }
  }

  function saveKey() {
    const v = keyInput.current?.value.trim() ?? "";
    if (!v) return;
    localStorage.setItem(KEY_STORE, v);
    setApiKey(v);
    setShowKey(false);
    void deepPass();
  }

  function forgetKey() {
    localStorage.removeItem(KEY_STORE);
    setApiKey("");
    setDeepMatches([]);
    setDeepStatus("idle");
  }

  const matches = useMemo(
    () => resolveOverlaps([...localMatches, ...deepMatches]),
    [localMatches, deepMatches],
  );
  const result = useMemo(() => score(doc, matches), [doc, matches]);
  const voice = useMemo(() => classifyVoice(matches), [matches]);
  const hasText = result.words > 0;
  const signature = theme === "dark" ? signatureWhite : signatureBlack;

  return (
    <div className="app">
      <header className="chrome">
        <div className="brand">
          <img className="brand-icon" src={cloud} alt="" />
          <div>
            <h1 className="wordmark">the un-write</h1>
            <p className="tagline">Detection, obsolete by design.</p>
          </div>
        </div>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        </button>
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

        {hasText && voice && (
          <div className="score-voice">
            <span className="voice-tag">
              {voice.confidence === "clear" ? "sounds like" : "faint whiff of"}
            </span>
            <strong className="voice-label">{voice.label}</strong>
            <p className="voice-blurb">{voice.blurb}</p>
          </div>
        )}

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

        <div className="deep">
          <button
            className="deep-btn"
            onClick={deepPass}
            disabled={deepStatus === "loading" || !hasText}
          >
            {deepStatus === "loading" ? "reading…" : "deep pass"}
          </button>
          <p className="deep-note">
            The semantic tells regex can't catch. Sends your text to Anthropic
            with your own API key. Off-device, opt-in — that's the honest break
            in the local-first promise, and yes, an AI grading you for sounding
            like AI.
          </p>
          {deepStatus === "done" && (
            <p className="deep-status">
              {deepMatches.length
                ? `${deepMatches.length} flagged — indigo underline.`
                : "Nothing the model would swear to."}
            </p>
          )}
          {deepStatus === "error" && (
            <p className="deep-status deep-err">{deepError}</p>
          )}
          {showKey && (
            <div className="key-form">
              <input
                ref={keyInput}
                type="password"
                placeholder="sk-ant-…"
                aria-label="Anthropic API key"
                onKeyDown={(e) => e.key === "Enter" && saveKey()}
              />
              <button onClick={saveKey}>save</button>
              <p className="key-note">
                Stored only in this browser. Get one at console.anthropic.com.
              </p>
            </div>
          )}
          {apiKey && !showKey && (
            <button className="key-forget" onClick={forgetKey}>
              forget key
            </button>
          )}
        </div>
      </aside>

      <footer className="admission">
        <p>
          A tool that rewrites your text to sound less like AI is an AI
          rewriting your text. The rewrites will carry the exact tells it flags.
          We know. That's the joke, and it's on all of us.
        </p>
        <figure className="stamp">
          <a
            href="https://astlecreative.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={signature} alt="Finn Astle" />
            <figcaption>Built by Finn Astle. Free Access.</figcaption>
          </a>
        </figure>
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

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.6 6.6 0 0 0 9.8 9.8z" />
    </svg>
  );
}
