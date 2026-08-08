import type { Match } from "./rules";

// v3 deep pass — the semantic layer. These tells need a model's judgment, not
// regex or rhythm maths: arguments that teleport, faux balance, near-miss
// metaphors, superficial -ing analysis, trait-caricature, performed warmth.
//
// It runs off-device: the text is sent to Anthropic with the user's OWN API key
// (stored only in their browser). Opt-in, clearly flagged. This is the honest
// break in the local-first promise — surfaced in the UI, never silent.
//
// Sonnet 5 is near-Opus quality at a fraction of the cost, which matters when
// every user brings their own key. Swap to "claude-opus-5" for maximum judgment.
const DEEP_PASS_MODEL = "claude-sonnet-5";

const SYSTEM = `You are the "deep pass" for a tool called the un-write, which flags AI writing tells. Your job is the tells that regex can't catch — the semantic ones. Read the user's text and return only the spans that genuinely exhibit one of these:

- teleporting argument: a logical bridge is missing between two sentences
- faux balance: both sides named, neither weighed, no conclusion drawn
- near-miss metaphor: technically apt, emotionally off
- superficial -ing analysis: an "-ing" clause bolted on to fake insight ("...reflecting the growing importance of...")
- trait-caricature: one surface feature of a voice cranked past where a person would take it
- performed warmth: considerate-colleague register with no relationship to protect
- false range: two adjacent things posed as a spectrum ("from phishing to BEC")
- too-tidy callback: an opening line resolved too neatly in the close

Be conservative. Flag only clear cases — a false positive here is worse than a miss. Do NOT flag ordinary human writing, strong opinions, contractions, second-person "you", or plain lists.

For each finding return: an EXACT quote copied verbatim from the text (a short span, one clause or sentence — it must appear in the text character-for-character), a short label (2-4 words), and a note. The note is dry and deflating, a little hostile, never tool-speak — one or two sentences, no "consider" or "try to". If nothing qualifies, return an empty findings array.`;

interface Finding {
  quote: string;
  label: string;
  note: string;
}

const SCHEMA = {
  type: "object",
  properties: {
    findings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          quote: { type: "string" },
          label: { type: "string" },
          note: { type: "string" },
        },
        required: ["quote", "label", "note"],
        additionalProperties: false,
      },
    },
  },
  required: ["findings"],
  additionalProperties: false,
} as const;

/** Locate each verbatim quote in the text and turn it into a Match. Quotes the
 *  model can't be found verbatim are dropped rather than guessed. */
function toMatches(text: string, findings: Finding[]): Match[] {
  const out: Match[] = [];
  const used: number[] = [];
  for (const f of findings) {
    const q = f.quote?.trim();
    if (!q || q.length < 3) continue;
    // find the first occurrence not already claimed by another finding
    let from = text.indexOf(q);
    while (from !== -1 && used.includes(from)) {
      from = text.indexOf(q, from + 1);
    }
    if (from === -1) continue;
    used.push(from);
    out.push({
      from,
      to: from + q.length,
      ruleId: "deep-pass",
      label: f.label || "semantic tell",
      category: "semantic",
      weight: 3,
      note: f.note || "The model clocked this one. Take a look.",
    });
  }
  return out;
}

export class DeepPassError extends Error {}

/** Send the text to Anthropic with the user's key and map findings to Matches. */
export async function runDeepPass(
  text: string,
  apiKey: string,
): Promise<Match[]> {
  let res: Response;
  try {
    res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        // opt into direct browser access (enables CORS for a BYO-key tool)
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: DEEP_PASS_MODEL,
        max_tokens: 2000,
        system: SYSTEM,
        output_config: { format: { type: "json_schema", schema: SCHEMA } },
        messages: [{ role: "user", content: text }],
      }),
    });
  } catch {
    throw new DeepPassError("Couldn't reach Anthropic. Check your connection.");
  }

  if (!res.ok) {
    if (res.status === 401)
      throw new DeepPassError("That key was rejected. Check it and try again.");
    if (res.status === 429)
      throw new DeepPassError("Rate limited by Anthropic. Give it a minute.");
    throw new DeepPassError(`Anthropic returned ${res.status}.`);
  }

  const data = await res.json();
  const block = data?.content?.find((b: { type: string }) => b.type === "text");
  if (!block?.text) return [];
  let parsed: { findings?: Finding[] };
  try {
    parsed = JSON.parse(block.text);
  } catch {
    throw new DeepPassError("The model's reply didn't parse. Try again.");
  }
  return toMatches(text, parsed.findings ?? []);
}
