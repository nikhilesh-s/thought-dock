// Kind suggester: softmax (multinomial logistic) regression trained from scratch on
// data/thoughts.csv by scripts/train-classifier.ts. Weights live in ./model.json.
// Contract the UI depends on: pure, synchronous, runs in the browser, never auto-applies.
// See docs/MODEL_CARD.md.
import type { Kind } from "./types";
import model from "./model.json" with { type: "json" };

export type Suggestion = { kind: Kind; confidence: number; scores: Record<Kind, number> };

export type Model = { kinds: string[]; bias: number[]; weights: Record<string, number[]> };

const URL_RE = /\bhttps?:\/\/\S+|\bwww\.\S+|\b[a-z0-9-]+\.(?:com|org|edu|gov|io|net|ly|gle|gg)\b\S*/gi;
const TIME_RE = /\b\d{1,2}(?::\d{2})?\s?(?:am|pm)\b|\b\d{1,2}:\d{2}\b|\bnoon\b|\bmidnight\b|\btonight\b/i;
const DATE_RE =
  /\b(?:mon|monday|tue|tues|tuesday|wed|wednesday|wednsday|thu|thur|thurs|thursday|fri|friday|sat|saturday|sun|sunday|weekend|today|tmrw|tmr|tomorrow|tonight|jan|feb|march|april|may|june|july|aug|sept|oct|nov|dec)\b|\b\d{1,2}\/\d{1,2}\b/i;
// Common verbs a brain-dump to-do starts with. ponytail: hand list, grow it from real captures.
const IMPERATIVE = new Set(
  "finish email submit buy call do return study read pay sign reply fix upload print ask get make clean apply cancel schedule turn refill update write practice review go check redo order book respond start charge merge send rsvp install pick complete water memorize move debug proofread renew drop text file reset pack bring prep grab hand fill cite learn take wash look backup draft grade annotate need must remember todo gotta dont".split(
    " ",
  ),
);

function tokens(text: string): string[] {
  const raw = text.toLowerCase().replace(/['’]/g, "").match(/[a-z0-9]+/g) ?? [];
  // Digits carry little meaning by value: "6pm" -> "0pm", "204" -> "0".
  return raw.map((t) => t.replace(/\d+/g, "0"));
}

/** Feature names for one text. Shared by training and inference so they can never drift. */
export function featurize(text: string): string[] {
  const urls = text.match(URL_RE) ?? [];
  const hosts = urls.flatMap((u) => tokens(u.replace(/^https?:\/\/(www\.)?/i, "").split(/[/?#]/)[0]));
  const toks = tokens(text.replace(URL_RE, " "));
  const f: string[] = [];
  for (let i = 0; i < toks.length; i++) {
    f.push("u:" + toks[i]);
    if (i > 0) f.push("b:" + toks[i - 1] + "_" + toks[i]);
  }
  for (const h of hosts) f.push("h:" + h);
  if (urls.length) f.push("#url");
  if (TIME_RE.test(text)) f.push("#time");
  if (DATE_RE.test(text)) f.push("#date");
  if (toks.length && IMPERATIVE.has(toks[0])) f.push("#imperative");
  if (text.includes("?")) f.push("#question");
  f.push(toks.length <= 3 ? "#len_short" : toks.length <= 8 ? "#len_mid" : "#len_long");
  return f;
}

/** Softmax probabilities for a featurized text under a model (also used by the trainer). */
export function predictProba(m: Model, feats: string[]): number[] {
  const z = m.bias.slice();
  for (const name of new Set(feats)) {
    const w = m.weights[name];
    if (w) for (let k = 0; k < z.length; k++) z[k] += w[k];
  }
  const max = Math.max(...z);
  const e = z.map((v) => Math.exp(v - max));
  const s = e.reduce((a, b) => a + b, 0);
  return e.map((v) => v / s);
}

export function suggestKind(text: string): Suggestion {
  const m = model as Model;
  const p = predictProba(m, featurize(text));
  let best = 0;
  for (let k = 1; k < p.length; k++) if (p[k] > p[best]) best = k;
  const scores = {} as Record<Kind, number>;
  m.kinds.forEach((k, i) => (scores[k as Kind] = p[i]));
  return { kind: m.kinds[best] as Kind, confidence: p[best], scores };
}
