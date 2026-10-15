// WCAG contrast check for the design tokens in app/globals.css (light + dark).
// Run: node scripts/check-contrast.mjs   (exits 1 if any required pair fails)
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const block = (re) => Object.fromEntries([...css.match(re)[1].matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]));
const light = block(/:root \{([\s\S]*?)\n\}/);
const dark = block(/:root\[data-theme="dark"\] \{([\s\S]*?)\n\}/);

const lum = (h) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

// [foreground, background, minimum]
const pairs = [
  ["text", "bg", 4.5], ["text", "surface", 4.5], ["text-2", "surface", 4.5],
  ["muted", "bg", 4.5], ["muted", "surface", 4.5],
  ["accent", "bg", 4.5], ["accent", "surface", 4.5], ["on-accent", "accent", 4.5], ["on-ink", "ink", 4.5],
  ["k-task", "surface", 4.5], ["k-event", "surface", 4.5], ["k-idea", "surface", 4.5], ["k-resource", "surface", 4.5], ["k-note", "surface", 4.5],
  ["warn", "surface", 4.5], ["ok", "surface", 4.5],
];
let fail = 0;
console.log("| Foreground on background | Light | Dark | Needs |\n|---|---|---|---|");
for (const [fg, bg, min] of pairs) {
  const l = ratio(light[fg], light[bg]), d = ratio(dark[fg], dark[bg]);
  const ok = l >= min && d >= min;
  if (!ok) fail++;
  console.log(`| ${fg} on ${bg} | ${l.toFixed(2)} | ${d.toFixed(2)} | ${min} ${ok ? "✓" : "✗ FAIL"} |`);
}
process.exit(fail ? 1 : 0);
