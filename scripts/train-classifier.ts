// Trains the Thought Dock kind classifier from scratch (no ML libraries, no pre-trained anything).
//   npm run train   ->  evaluates 3 models on a held-out split, 5-fold CV, then writes lib/model.json
// Featurizer and inference are imported from lib/classifier.ts so training == serving.
import { readFileSync, writeFileSync } from "node:fs";
// @ts-expect-error -- Node runs .ts directly; tsconfig (owned by the app) doesn't allow .ts import paths.
import { featurize, predictProba, type Model } from "../lib/classifier.ts";

const KINDS = ["task", "event", "idea", "resource", "note"];
const SEED = 42;
const EPOCHS = 60;
const BATCH = 16;
const LR = 0.5;
const L2 = 1e-3;
const MIN_COUNT = 2; // drop features seen in fewer than 2 training examples

const root = new URL("..", import.meta.url);

// --- data ------------------------------------------------------------------
function parseCsv(src: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], cell = "", q = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (q) {
      if (c === '"' && src[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") {
      row.push(cell);
      cell = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(cell);
      cell = "";
      if (row.some((x) => x !== "")) rows.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell);
  if (row.some((x) => x !== "")) rows.push(row);
  return rows;
}

type Ex = { text: string; y: number; f: string[] };
const rows = parseCsv(readFileSync(new URL("data/thoughts.csv", root), "utf8")).slice(1);
const data: Ex[] = rows.map(([text, label], i) => {
  const y = KINDS.indexOf(label?.trim());
  if (y < 0) throw new Error(`row ${i + 2}: bad label "${label}"`);
  return { text, y, f: featurize(text) };
});

// --- seeded RNG (mulberry32) so every run is identical ---------------------
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function shuffle<T>(a: T[], r: () => number): T[] {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
/** Stratified k-fold assignment: fold index per example. */
function stratifiedFolds(xs: Ex[], k: number, seed: number): number[] {
  const r = rng(seed), fold = new Array<number>(xs.length);
  KINDS.forEach((_, c) => {
    const idx = shuffle(xs.map((x, i) => (x.y === c ? i : -1)).filter((i) => i >= 0), r);
    idx.forEach((i, n) => (fold[i] = n % k));
  });
  return fold;
}

// --- models ----------------------------------------------------------------
function vocabOf(train: Ex[]): string[] {
  const df = new Map<string, number>();
  for (const x of train) for (const f of new Set(x.f)) df.set(f, (df.get(f) ?? 0) + 1);
  return [...df].filter(([, n]) => n >= MIN_COUNT).map(([f]) => f).sort();
}

/** Softmax regression, mini-batch gradient descent, L2 (weight decay), fixed seed. */
function trainLogReg(train: Ex[]): Model {
  const vocab = vocabOf(train), K = KINDS.length;
  const index = new Map(vocab.map((f, i) => [f, i]));
  const X = train.map((x) => [...new Set(x.f)].map((f) => index.get(f)).filter((i) => i !== undefined));
  const W = vocab.map(() => new Float64Array(K)), b = new Float64Array(K);
  const r = rng(SEED);
  let order = train.map((_, i) => i);
  for (let ep = 0; ep < EPOCHS; ep++) {
    order = shuffle(order, r);
    for (let s = 0; s < order.length; s += BATCH) {
      const batch = order.slice(s, s + BATCH);
      const gW = new Map<number, Float64Array>(), gb = new Float64Array(K);
      for (const i of batch) {
        const z = Array.from(b);
        for (const j of X[i]) for (let k = 0; k < K; k++) z[k] += W[j][k];
        const m = Math.max(...z), e = z.map((v) => Math.exp(v - m)), sum = e.reduce((a, c) => a + c, 0);
        const g = e.map((v, k) => v / sum - (k === train[i].y ? 1 : 0)); // dLoss/dz
        for (let k = 0; k < K; k++) gb[k] += g[k];
        for (const j of X[i]) {
          const row = gW.get(j) ?? gW.set(j, new Float64Array(K)).get(j)!;
          for (let k = 0; k < K; k++) row[k] += g[k];
        }
      }
      const step = LR / batch.length, decay = 1 - LR * L2;
      for (const w of W) for (let k = 0; k < K; k++) w[k] *= decay;
      for (const [j, g] of gW) for (let k = 0; k < K; k++) W[j][k] -= step * g[k];
      for (let k = 0; k < K; k++) b[k] -= step * gb[k];
    }
  }
  const weights: Record<string, number[]> = {};
  vocab.forEach((f, j) => (weights[f] = Array.from(W[j])));
  return { kinds: KINDS, bias: Array.from(b), weights };
}

/** Multinomial Naive Bayes on binarized features, Laplace smoothing. Expressed as a linear Model. */
function trainNaiveBayes(train: Ex[]): Model {
  const vocab = vocabOf(train), K = KINDS.length, keep = new Set(vocab);
  const count = KINDS.map(() => new Map<string, number>()), total = new Array(K).fill(0), docs = new Array(K).fill(0);
  for (const x of train) {
    docs[x.y]++;
    for (const f of new Set(x.f)) {
      if (!keep.has(f)) continue;
      count[x.y].set(f, (count[x.y].get(f) ?? 0) + 1);
      total[x.y]++;
    }
  }
  const weights: Record<string, number[]> = {};
  for (const f of vocab) weights[f] = KINDS.map((_, c) => Math.log(((count[c].get(f) ?? 0) + 1) / (total[c] + vocab.length)));
  return { kinds: KINDS, bias: docs.map((d) => Math.log(d / train.length)), weights };
}

/** Hand-written keyword rules: the "no ML" baseline. */
function rules(text: string): number {
  const t = text.toLowerCase(), f = featurize(text);
  if (f.includes("#url")) return KINDS.indexOf("resource");
  if (/^(what if|maybe|idea|could|might|what about)\b|\bidea\b/.test(t)) return KINDS.indexOf("idea");
  if (f.includes("#imperative")) return KINDS.indexOf("task");
  if (f.includes("#time") || f.includes("#date")) return KINDS.indexOf("event");
  if (/\b(video|vid|book|article|tutorial|playlist|podcast|channel|website|pdf)\b/.test(t)) return KINDS.indexOf("resource");
  return KINDS.indexOf("note");
}

const argmax = (p: number[]) => p.reduce((bi, v, i) => (v > p[bi] ? i : bi), 0);
const predictWith = (m: Model) => (x: Ex) => argmax(predictProba(m, x.f));

// --- metrics ---------------------------------------------------------------
function evaluate(test: Ex[], predict: (x: Ex) => number) {
  const K = KINDS.length, cm = KINDS.map(() => new Array<number>(K).fill(0));
  for (const x of test) cm[x.y][predict(x)]++;
  const per = KINDS.map((_, c) => {
    const tp = cm[c][c], pred = cm.reduce((s, r) => s + r[c], 0), act = cm[c].reduce((s, v) => s + v, 0);
    const p = pred ? tp / pred : 0, r = act ? tp / act : 0;
    return { p, r, f1: p + r ? (2 * p * r) / (p + r) : 0, n: act };
  });
  const acc = KINDS.reduce((s, _, c) => s + cm[c][c], 0) / test.length;
  return { acc, macroF1: per.reduce((s, x) => s + x.f1, 0) / K, per, cm };
}

const pct = (v: number) => (100 * v).toFixed(1);
function report(name: string, e: ReturnType<typeof evaluate>) {
  console.log(`\n### ${name}\n\naccuracy **${pct(e.acc)}%**, macro-F1 **${pct(e.macroF1)}%**\n`);
  console.log("| class | precision | recall | F1 | n |\n|---|---|---|---|---|");
  KINDS.forEach((k, c) => console.log(`| ${k} | ${pct(e.per[c].p)} | ${pct(e.per[c].r)} | ${pct(e.per[c].f1)} | ${e.per[c].n} |`));
  console.log(`\nconfusion (rows = true, cols = predicted)\n\n| | ${KINDS.join(" | ")} |\n|---|${KINDS.map(() => "---").join("|")}|`);
  KINDS.forEach((k, c) => console.log(`| **${k}** | ${e.cm[c].join(" | ")} |`));
}

// --- run -------------------------------------------------------------------
const counts = KINDS.map((k, c) => `${k} ${data.filter((x) => x.y === c).length}`).join(", ");
console.log(`## Evaluation (seed ${SEED})\n\n${data.length} examples: ${counts}`);

const split = stratifiedFolds(data, 5, SEED); // fold 0 = 20% held out
const train = data.filter((_, i) => split[i] !== 0), test = data.filter((_, i) => split[i] === 0);
console.log(`stratified 80/20 split: ${train.length} train / ${test.length} held-out`);

const lr = trainLogReg(train);
report("Softmax logistic regression (shipped)", evaluate(test, predictWith(lr)));
report("Multinomial Naive Bayes (baseline)", evaluate(test, predictWith(trainNaiveBayes(train))));
report("Keyword rules (baseline)", evaluate(test, (x) => rules(x.text)));

const cv = stratifiedFolds(data, 5, SEED + 1);
const accs = [0, 1, 2, 3, 4].map((k) => {
  const m = trainLogReg(data.filter((_, i) => cv[i] !== k));
  return evaluate(data.filter((_, i) => cv[i] === k), predictWith(m)).acc;
});
const mean = accs.reduce((a, b) => a + b, 0) / 5;
const sd = Math.sqrt(accs.reduce((a, b) => a + (b - mean) ** 2, 0) / 4);
console.log(`\n### 5-fold stratified CV (logistic regression)\n\naccuracy ${pct(mean)}% ± ${pct(sd)}% (folds: ${accs.map(pct).join(", ")})`);

// Final model: all data, small weights dropped, rounded to keep model.json tiny.
const final = trainLogReg(data);
const weights: Record<string, number[]> = {};
for (const [f, w] of Object.entries(final.weights))
  if (w.some((v) => Math.abs(v) >= 1e-3)) weights[f] = w.map((v) => Math.round(v * 1e4) / 1e4);
const out = JSON.stringify({ kinds: KINDS, bias: final.bias.map((v) => Math.round(v * 1e4) / 1e4), weights });
writeFileSync(new URL("lib/model.json", root), out + "\n");
console.log(`\nwrote lib/model.json: ${Object.keys(weights).length} features, ${(out.length / 1024).toFixed(1)} KB`);
