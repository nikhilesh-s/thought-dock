// STUB — replaced by the trained model (see scripts/train-classifier.ts, docs/MODEL_CARD.md).
// Contract the UI depends on: pure, synchronous, runs in the browser, never auto-applies.
import type { Kind } from "./types";

export type Suggestion = { kind: Kind; confidence: number; scores: Record<Kind, number> };

export function suggestKind(text: string): Suggestion {
  const scores: Record<Kind, number> = { task: 0.2, event: 0.2, idea: 0.2, resource: 0.2, note: 0.2 };
  if (/https?:\/\//i.test(text)) return { kind: "resource", confidence: 0.6, scores: { ...scores, resource: 0.6 } };
  return { kind: "note", confidence: 0.2, scores };
}
