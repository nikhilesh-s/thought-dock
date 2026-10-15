// Sanity checks for the shipped model.  npm run test:model
import assert from "node:assert/strict";
import { statSync } from "node:fs";
// @ts-expect-error -- Node runs .ts directly; tsconfig (owned by the app) doesn't allow .ts import paths.
import { featurize, suggestKind } from "../lib/classifier.ts";

const cases: [string, string][] = [
  ["finish ochem pset before friday", "task"],
  ["email prof about the regrade", "task"],
  ["buy printer ink", "task"],
  ["study group thurs 6pm library", "event"],
  ["dentist appt tues 3:30", "event"],
  ["what if we made the app work offline", "idea"],
  ["maybe start a podcast about transferring", "idea"],
  ["https://www.youtube.com/watch?v=xyz great vid on recursion", "resource"],
  ["khan academy playlist for calc", "resource"],
  ["so stressed about the midterm", "note"],
  ["prof said the final is open book", "note"],
];
for (const [text, want] of cases) assert.equal(suggestKind(text).kind, want, `"${text}" -> ${want}`);

// A bare URL leans resource through learned weights.
assert.equal(suggestKind("https://example.com/some/page").kind, "resource");

// Scores are a probability distribution over all five kinds; confidence is the top one.
for (const text of ["", "   ", "pset", "!!!", "hi ".repeat(500), cases[0][0]]) {
  const s = suggestKind(text);
  assert.deepEqual(Object.keys(s.scores).sort(), ["event", "idea", "note", "resource", "task"]);
  const sum = Object.values(s.scores).reduce((a, b) => a + b, 0);
  assert.ok(Math.abs(sum - 1) < 1e-9, `scores sum to 1 for "${text.slice(0, 20)}"`);
  assert.equal(s.confidence, Math.max(...Object.values(s.scores)));
  assert.equal(s.scores[s.kind], s.confidence);
}

// Deterministic and pure.
assert.deepEqual(suggestKind("call mom 5pm"), suggestKind("call mom 5pm"));

// Engineered features fire.
const f = featurize("Finish hw by 6pm thurs? https://x.org");
for (const name of ["#url", "#time", "#date", "#imperative", "#question"]) assert.ok(f.includes(name), name);

// Stays small enough to ship to the browser.
assert.ok(statSync(new URL("../lib/model.json", import.meta.url)).size < 200_000, "model.json < 200KB");

console.log(`classifier: ${cases.length + 5} checks passed`);
