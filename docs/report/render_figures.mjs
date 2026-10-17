// Renders docs/report/figures/*.svg to PNG (2x) and captures a few live-site elements.
// Run: node docs/report/render_figures.mjs
import { chromium } from "playwright";
import { readdirSync, readFileSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const dir = join(dirname(fileURLToPath(import.meta.url)), "figures");
const root = join(dir, "..", "..", "..");
const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const page = await browser.newPage({ deviceScaleFactor: 2 });

const svgs = [...readdirSync(dir).filter((f) => f.endsWith(".svg"))];
for (const f of svgs) {
  const src = readFileSync(join(dir, f), "utf8");
  const vb = src.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"|viewBox='0 0 ([\d.]+) ([\d.]+)'/);
  let w = Number(vb[1] ?? vb[3]), h = Number(vb[2] ?? vb[4]);
  if (w < 600) { h = (h * 1400) / w; w = 1400; } // mm-based drawing: render large
  await page.setViewportSize({ width: Math.round(w), height: Math.round(h) });
  await page.setContent(`<html><body style="margin:0;background:#fff">${src.replace(/<svg /, `<svg style="width:${w}px;height:${h}px;display:block" `)}</body></html>`);
  const name = f.includes("dock-drawing") ? "fig5-dock-drawing.png" : f.replace(".svg", ".png");
  await page.screenshot({ path: join(dir, name) });
  console.log("png", name);
}

// Concept sketches from the live /jared page (rendered from the same source as the site).
const live = "https://thought-dock-peach.vercel.app";
await page.setViewportSize({ width: 1280, height: 900 });
await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
await page.goto(`${live}/jared`, { waitUntil: "networkidle" });
const concepts = page.locator("h3", { hasText: "Three concepts" }).locator("xpath=following-sibling::*[1]");
if (await concepts.count()) {
  await concepts.scrollIntoViewIfNeeded();
  await concepts.screenshot({ path: join(dir, "fig2-concepts.png") });
  console.log("png fig2-concepts.png");
} else console.log("concepts locator not found");

for (const [from, to] of [["capture.png", "fig1a-capture.png"], ["desk-light.png", "fig1b-desk.png"], ["desk-sort.png", "fig8-sort.png"], ["desk-pair.png", "fig9-pair.png"]]) {
  copyFileSync(join(root, "docs", "screenshots", from), join(dir, to));
}
await browser.close();
