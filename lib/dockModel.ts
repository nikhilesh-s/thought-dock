// NFC Thought Dock (design concept 1). The geometry is defined ONCE here, in millimetres, and
// feeds the 3D viewer, the dimensioned drawing, and scripts/export-stl.ts (STL + SVG files).
// Keep this file to erasable TypeScript: Node strips the types when the export script imports it.
//
// Design axes (used by DOCK, the profiles, and the drawing): x = width (0 at the left, seen from
// the front), y = up (0 on the desk), z = depth (0 at the front edge, increasing toward the back).
// three.js is right-handed with +Z toward the viewer, so the meshes put design z at world -Z.
import * as THREE from "three";

export const DOCK = {
  width: 120,
  depth: 90,
  baseHeight: 18,
  chamfer: 6, // 45° chamfer on the four vertical corners of the base
  angle: 65, // phone rest angle from horizontal
  slotWidth: 14, // measured square to the slot walls; fits phones in cases
  lipFront: 12, // front lip starts this far back from the front edge
  lipThickness: 6,
  lipHeight: 12,
  backrestThickness: 8, // horizontal, at the base
  backrestHeight: 62, // above the base top
  nfc: { dia: 30, depth: 1.2, z: 48 }, // NTAG215 sticker pocket, underside, centred on x
  cable: { width: 8, depth: 6, holeZ: 26 }, // underside channel; 8 × 8 hole up through the slot floor
  foot: { dia: 10, depth: 1, inset: 12 }, // four rubber bump-on recesses, underside
} as const;

type Pt = [number, number];
const rad = (d: number) => (d * Math.PI) / 180;
/** Horizontal run of a 65° face over a given rise. */
export const run = (rise: number) => rise / Math.tan(rad(DOCK.angle));

/** Side profile (z, y) of the cradle: front lip and backrest parallelograms on top of the base. */
export function cradleProfile() {
  const { baseHeight: H, lipFront, lipThickness, lipHeight, slotWidth, backrestThickness: bt, backrestHeight: bh } = DOCK;
  const slotRun = slotWidth / Math.sin(rad(DOCK.angle)); // horizontal width of the slot at its floor
  const lip: Pt[] = [
    [lipFront, H],
    [lipFront + lipThickness, H],
    [lipFront + lipThickness + run(lipHeight), H + lipHeight],
    [lipFront + run(lipHeight), H + lipHeight],
  ];
  const b0 = lipFront + lipThickness + slotRun;
  const back: Pt[] = [
    [b0, H],
    [b0 + bt, H],
    [b0 + bt + run(bh), H + bh],
    [b0 + run(bh), H + bh],
  ];
  return { lip, back, slotRun, b0, height: H + bh };
}

/** Cable channel / through-hole rectangle in plan (x0, z0, x1, z1). */
export function cableRect() {
  const { width, depth, cable } = DOCK;
  const x0 = width / 2 - cable.width / 2;
  return { x0, x1: x0 + cable.width, z0: cable.holeZ - cable.width / 2, z1: cable.holeZ + cable.width / 2, exitX: width, d: depth };
}

export function feet(): Pt[] {
  const { width: W, depth: D, foot } = DOCK;
  const i = foot.inset;
  return [[i, i], [W - i, i], [i, D - i], [W - i, D - i]];
}

/** Plan outline (x, z) with chamfered corners; optionally notched where the cable channel exits the right side. */
function planShape(notch: boolean) {
  const { width: W, depth: D, chamfer: c } = DOCK;
  const r = cableRect();
  const pts: Pt[] = [[c, 0], [W - c, 0], [W, c]];
  if (notch) pts.push([W, r.z0], [r.x0, r.z0], [r.x0, r.z1], [W, r.z1]);
  pts.push([W, D - c], [W - c, D], [c, D], [0, D - c], [0, c]);
  return new THREE.Shape(pts.map(([x, z]) => new THREE.Vector2(x, z)));
}

const circle = (x: number, z: number, r: number) => new THREE.Path().absarc(x, z, r, 0, Math.PI * 2, true);
const rect = (x0: number, z0: number, x1: number, z1: number) =>
  new THREE.Path([new THREE.Vector2(x0, z0), new THREE.Vector2(x0, z1), new THREE.Vector2(x1, z1), new THREE.Vector2(x1, z0)]);

/** Extrude a plan shape upward between y0 and y1. */
function planLayer(shape: THREE.Shape, y0: number, y1: number) {
  const g = new THREE.ExtrudeGeometry(shape, { depth: y1 - y0, bevelEnabled: false, curveSegments: 48 });
  g.rotateX(-Math.PI / 2); // shape y (design z) -> world -Z, extrusion -> world +Y
  g.translate(0, y0, 0);
  return g;
}

/** Extrude a side profile (z, y) across the full width. */
function profileLayer(pts: Pt[]) {
  const g = new THREE.ExtrudeGeometry(new THREE.Shape(pts.map(([z, y]) => new THREE.Vector2(z, y))), {
    depth: DOCK.width,
    bevelEnabled: false,
  });
  g.rotateY(Math.PI / 2); // shape x (design z) -> world -Z, extrusion -> world +X
  return g;
}

/**
 * The printable body as touching solids (slicers union them). Stacked plan layers carve the
 * underside features without a CSG library: feet (0–1 mm), NFC pocket (0–1.2), cable channel (0–6),
 * then the 8 × 8 hole through to the slot floor (6–18).
 */
export function buildDockGeometries(): THREE.BufferGeometry[] {
  const { baseHeight: H, nfc, foot, cable, width: W } = DOCK;
  const r = cableRect();
  const nfcHole = () => circle(W / 2, nfc.z, nfc.dia / 2);
  const s0 = planShape(true);
  s0.holes.push(...feet().map(([x, z]) => circle(x, z, foot.dia / 2)), nfcHole());
  const s1 = planShape(true);
  s1.holes.push(nfcHole());
  const s2 = planShape(true);
  const s3 = planShape(false);
  s3.holes.push(rect(r.x0, r.z0, r.x1, r.z1));
  const { lip, back } = cradleProfile();
  return [
    planLayer(s0, 0, foot.depth),
    planLayer(s1, foot.depth, nfc.depth),
    planLayer(s2, nfc.depth, cable.depth),
    planLayer(s3, cable.depth, H),
    profileLayer(lip),
    profileLayer(back),
  ];
}

/** Analytic solid volume in mm³, for checking the mesh. */
export function expectedVolume() {
  const { width: W, depth: D, baseHeight: H, chamfer: c, nfc, foot, cable, lipThickness, lipHeight, backrestThickness, backrestHeight } = DOCK;
  const r = cableRect();
  const base = (W * D - 2 * c * c) * H;
  const cuts =
    4 * Math.PI * (foot.dia / 2) ** 2 * foot.depth +
    Math.PI * (nfc.dia / 2) ** 2 * nfc.depth +
    cable.width * cable.depth * (W - r.x0) +
    cable.width * cable.width * (H - cable.depth);
  return base - cuts + W * (lipThickness * lipHeight + backrestThickness * backrestHeight);
}

/** Signed volume of non-indexed triangle geometry (positive when outward-facing). */
export function meshVolume(geos: THREE.BufferGeometry[]) {
  let v = 0;
  for (const g of geos) {
    const p = (g.index ? g.toNonIndexed() : g).attributes.position.array;
    for (let i = 0; i < p.length; i += 9) {
      v += (p[i] * (p[i + 4] * p[i + 8] - p[i + 5] * p[i + 7]) -
        p[i + 1] * (p[i + 3] * p[i + 8] - p[i + 5] * p[i + 6]) +
        p[i + 2] * (p[i + 3] * p[i + 7] - p[i + 4] * p[i + 6])) / 6;
    }
  }
  return v;
}

/** Where a phone (72 × 150 × 8 mm) rests: back on the backrest face, bottom on the slot floor. */
export function phonePose() {
  const { b0 } = cradleProfile();
  const a = rad(DOCK.angle);
  const size = { w: 72, h: 150, t: 8 };
  const u: Pt = [Math.cos(a), Math.sin(a)]; // up the backrest face (z, y)
  const n: Pt = [-Math.sin(a), Math.cos(a)]; // out of the face, toward the lip
  const z = b0 + u[0] * size.h / 2 + n[0] * size.t / 2;
  const y = DOCK.baseHeight + u[1] * size.h / 2 + n[1] * size.t / 2;
  // world coordinates (design z -> -Z); the phone leans back, toward -Z
  return { size, position: [DOCK.width / 2, y, -z] as [number, number, number], tiltX: -(Math.PI / 2 - a) };
}

// ---------------------------------------------------------------------------------------------
// Dimensioned multiview drawing (third-angle projection), A3 landscape sheet at 1:1, units mm.
// Returned as an SVG string so the page can inline it and the export script can write the file.

export const DRAWN_ON = "2026-10-15";
type DrawOpts = { ink: string; paper: string; muted: string; id: string; date?: string };
const fx = (n: number) => +n.toFixed(2);

export function dockDrawingSvg(o: DrawOpts): string {
  const { width: W, depth: D, baseHeight: H, chamfer: c, nfc, foot } = DOCK;
  const { lip, back, b0 } = cradleProfile();
  const top = DOCK.baseHeight + DOCK.backrestHeight;
  const cr = cableRect();
  const p = o.id;
  const out: string[] = [];

  // View origins on the sheet. Sheet y grows downward.
  const FX = 64, FY = 245; // front view: x -> right, y -> up
  const TX = 64, TY = 140; // top view (above front): x -> right, z -> up (front edge at the bottom)
  const RX = 232; // right view (right of front): z -> right (front edge at the left), y -> up
  const F = (x: number, y: number): Pt => [FX + x, FY - y];
  const T = (x: number, z: number): Pt => [TX + x, TY - z];
  const R = (z: number, y: number): Pt => [RX + z, FY - y];

  const ln = (a: Pt, b: Pt, cls: string) =>
    out.push(`<line x1="${fx(a[0])}" y1="${fx(a[1])}" x2="${fx(b[0])}" y2="${fx(b[1])}" class="${p}-${cls}"/>`);
  const poly = (pts: Pt[], cls: string) =>
    out.push(`<polygon points="${pts.map((q) => `${fx(q[0])},${fx(q[1])}`).join(" ")}" class="${p}-${cls}"/>`);
  const circ = (q: Pt, r: number, cls: string) =>
    out.push(`<circle cx="${fx(q[0])}" cy="${fx(q[1])}" r="${fx(r)}" class="${p}-${cls}"/>`);
  const text = (q: Pt, s: string, anchor = "middle", cls = "t") =>
    out.push(`<text x="${fx(q[0])}" y="${fx(q[1])}" text-anchor="${anchor}" class="${p}-${cls}">${s}</text>`);

  // Dimension between two feature points a, b (sheet coords). The dimension line runs parallel to
  // a->b, offset by `off` along the left-hand normal. Text sits beside the line, horizontal.
  function dim(a: Pt, b: Pt, off: number, label: string, side: "above" | "below" | "left" | "right") {
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const u: Pt = [(b[0] - a[0]) / L, (b[1] - a[1]) / L];
    const n: Pt = [u[1], -u[0]];
    const s = Math.sign(off);
    const qa: Pt = [a[0] + n[0] * off, a[1] + n[1] * off];
    const qb: Pt = [b[0] + n[0] * off, b[1] + n[1] * off];
    ln([a[0] + n[0] * s, a[1] + n[1] * s], [qa[0] + n[0] * s * 1.5, qa[1] + n[1] * s * 1.5], "d");
    ln([b[0] + n[0] * s, b[1] + n[1] * s], [qb[0] + n[0] * s * 1.5, qb[1] + n[1] * s * 1.5], "d");
    if (L >= 9) {
      out.push(`<line x1="${fx(qa[0])}" y1="${fx(qa[1])}" x2="${fx(qb[0])}" y2="${fx(qb[1])}" class="${p}-d" marker-start="url(#${p}-ar)" marker-end="url(#${p}-ar)"/>`);
    } else {
      // too short for arrows inside: arrows point in from outside
      ln(qa, qb, "d");
      const oa: Pt = [qa[0] - u[0] * 5, qa[1] - u[1] * 5], ob: Pt = [qb[0] + u[0] * 5, qb[1] + u[1] * 5];
      out.push(`<line x1="${fx(oa[0])}" y1="${fx(oa[1])}" x2="${fx(qa[0])}" y2="${fx(qa[1])}" class="${p}-d" marker-end="url(#${p}-ar)"/>`);
      out.push(`<line x1="${fx(ob[0])}" y1="${fx(ob[1])}" x2="${fx(qb[0])}" y2="${fx(qb[1])}" class="${p}-d" marker-end="url(#${p}-ar)"/>`);
    }
    const m: Pt = [(qa[0] + qb[0]) / 2, (qa[1] + qb[1]) / 2];
    if (side === "above") text([m[0], m[1] - 1.2], label);
    else if (side === "below") text([m[0], m[1] + 4.2], label);
    else if (side === "left") text([m[0] - 1.4, m[1] + 1.1], label, "end");
    else text([m[0] + 1.4, m[1] + 1.1], label, "start");
  }

  const leader = (tip: Pt, knee: Pt, lines: string[]) => {
    const end: Pt = [knee[0] + 3, knee[1]];
    out.push(`<polyline points="${fx(end[0])},${fx(end[1])} ${fx(knee[0])},${fx(knee[1])} ${fx(tip[0])},${fx(tip[1])}" class="${p}-d" fill="none" marker-end="url(#${p}-ar)"/>`);
    lines.forEach((s, i) => text([end[0] + 1.2, end[1] + 1.1 + i * 4.4], s, "start"));
  };

  // ---------------- TOP VIEW ----------------
  poly([T(c, 0), T(W - c, 0), T(W, c), T(W, D - c), T(W - c, D), T(c, D), T(0, D - c), T(0, c)], "o");
  // lip: front-bottom edge, top face edges visible; back-bottom edge hidden under the top
  for (const z of [lip[0][0], lip[3][0], lip[2][0]]) ln(T(0, z), T(W, z), "o");
  ln(T(0, lip[1][0]), T(W, lip[1][0]), "h");
  for (const z of [back[0][0], back[3][0], back[2][0]]) ln(T(0, z), T(W, z), "o");
  ln(T(0, back[1][0]), T(W, back[1][0]), "h");
  // 8 × 8 hole in the slot floor: the front strip hides under the lip overhang
  const lipTop = lip[2][0];
  ln(T(cr.x0, cr.z1), T(cr.x1, cr.z1), "o");
  ln(T(cr.x0, lipTop), T(cr.x0, cr.z1), "o");
  ln(T(cr.x1, lipTop), T(cr.x1, cr.z1), "o");
  ln(T(cr.x0, cr.z0), T(cr.x1, cr.z0), "h");
  ln(T(cr.x0, cr.z0), T(cr.x0, lipTop), "h");
  ln(T(cr.x1, cr.z0), T(cr.x1, lipTop), "h");
  // underside features (hidden)
  ln(T(cr.x1, cr.z0), T(W, cr.z0), "h");
  ln(T(cr.x1, cr.z1), T(W, cr.z1), "h");
  circ(T(W / 2, nfc.z), nfc.dia / 2, "h");
  for (const f of feet()) {
    circ(T(f[0], f[1]), foot.dia / 2, "h");
    ln(T(f[0] - 7, f[1]), T(f[0] + 7, f[1]), "c");
    ln(T(f[0], f[1] - 7), T(f[0], f[1] + 7), "c");
  }
  ln(T(W / 2, -4), T(W / 2, D + 4), "c");
  ln(T(W / 2 - 19, nfc.z), T(W / 2 + 19, nfc.z), "c");
  text(T(W / 2, D + 16), "TOP VIEW", "middle", "vt");
  // dimensions (left stack)
  dim(T(0, 0), T(0, foot.inset), 6, String(foot.inset), "left");
  dim(T(0, 0), T(0, cr.z0 + DOCK.cable.width / 2), 14, String(DOCK.cable.holeZ), "left");
  dim(T(0, 0), T(0, nfc.z), 22, String(nfc.z), "left");
  dim(T(0, 0), T(0, D), 30, String(D), "left");
  dim(T(0, D), T(foot.inset, D), 8, String(foot.inset), "above");
  // callouts
  const ang = rad(35);
  leader(T(W / 2 + Math.cos(ang) * 15, nfc.z + Math.sin(ang) * 15), [208, 70], ["⌀30 × 1.2 DP, UNDERSIDE", "NFC TAG POCKET (NTAG215)"]);
  const bf = feet()[3];
  leader(T(bf[0] + 3.6, bf[1] + 3.6), [208, 50], ["4× ⌀10 × 1 DP, UNDERSIDE", "RUBBER FOOT RECESS"]);
  leader(T(100, cr.z0), [208, 96], ["CABLE CHANNEL 8 W × 6 DP", "UNDERSIDE, EXITS RIGHT SIDE", "8 × 8 THRU SLOT FLOOR"]);
  leader(T(W - c / 2, c / 2), [208, 128], ["4× CHAMFER 6 × 45°"]);

  // ---------------- FRONT VIEW ----------------
  out.push(`<rect x="${fx(F(0, top)[0])}" y="${fx(F(0, top)[1])}" width="${W}" height="${top}" class="${p}-o"/>`);
  ln(F(0, H), F(W, H), "o");
  ln(F(0, H + DOCK.lipHeight), F(W, H + DOCK.lipHeight), "o");
  ln(F(c, 0), F(c, H), "o");
  ln(F(W - c, 0), F(W - c, H), "o");
  ln(F(cr.x0, 0), F(cr.x0, H), "h");
  ln(F(cr.x1, DOCK.cable.depth), F(cr.x1, H), "h");
  ln(F(cr.x1, DOCK.cable.depth), F(W, DOCK.cable.depth), "h");
  ln(F(W / 2 - nfc.dia / 2, nfc.depth), F(W / 2 + nfc.dia / 2, nfc.depth), "h");
  for (const x of [foot.inset, W - foot.inset]) ln(F(x - foot.dia / 2, foot.depth), F(x + foot.dia / 2, foot.depth), "h");
  ln(F(W / 2, -4), F(W / 2, top + 4), "c");
  text(F(W / 2, top + 9), "FRONT VIEW", "middle", "vt");
  dim(F(0, 0), F(W, 0), -10, String(W), "below");
  dim(F(0, 0), F(0, H), 8, String(H), "left");
  dim(F(0, 0), F(0, top), 20, String(top), "left");

  // ---------------- RIGHT VIEW ----------------
  poly([R(0, 0), R(D, 0), R(D, H), R(back[1][0], H), R(back[2][0], top), R(back[3][0], top), R(back[0][0], H),
    R(lip[1][0], H), R(lip[2][0], lip[2][1]), R(lip[3][0], lip[3][1]), R(lip[0][0], H), R(0, H)], "o");
  ln(R(c, 0), R(c, H), "o");
  ln(R(D - c, 0), R(D - c, H), "o");
  out.push(`<rect x="${fx(R(cr.z0, DOCK.cable.depth)[0])}" y="${fx(R(cr.z0, DOCK.cable.depth)[1])}" width="${DOCK.cable.width}" height="${DOCK.cable.depth}" class="${p}-o"/>`);
  ln(R(cr.z0, DOCK.cable.depth), R(cr.z0, H), "h");
  ln(R(cr.z1, DOCK.cable.depth), R(cr.z1, H), "h");
  ln(R(nfc.z - nfc.dia / 2, nfc.depth), R(nfc.z + nfc.dia / 2, nfc.depth), "h");
  for (const z of [foot.inset, D - foot.inset]) ln(R(z - foot.dia / 2, foot.depth), R(z + foot.dia / 2, foot.depth), "h");
  text(R(D / 2 - 20, top + 9), "RIGHT SIDE VIEW", "middle", "vt");
  dim(R(0, 0), R(D, 0), -10, String(D), "below");
  dim(R(D, 0), R(D, H), -8, String(H), "right");
  dim(R(D, H), R(D, top), -8, String(DOCK.backrestHeight), "right");
  dim(R(D, 0), R(D, top), -20, String(top), "right");
  dim(R(0, H), R(0, lip[3][1]), 8, String(DOCK.lipHeight), "left");
  dim(R(0, H), R(DOCK.lipFront, H), 4, String(DOCK.lipFront), "above");
  dim(R(lip[3][0], lip[3][1]), R(lip[2][0], lip[2][1]), 6, String(DOCK.lipThickness), "above");
  dim(R(back[3][0], top), R(back[2][0], top), 6, String(DOCK.backrestThickness), "above");
  // slot width, measured square to the 65° walls
  {
    const a = rad(DOCK.angle);
    const y = H + 32;
    const p2: Pt = [b0 + run(y - H), y];
    const p1: Pt = [p2[0] - Math.sin(a) * DOCK.slotWidth, p2[1] + Math.cos(a) * DOCK.slotWidth];
    const s1 = R(p1[0], p1[1]), s2 = R(p2[0], p2[1]);
    const lt = R(lip[2][0] + Math.cos(a), lip[2][1] + Math.sin(a));
    ln(lt, R(p1[0] + Math.cos(a) * 2, p1[1] + Math.sin(a) * 2), "d");
    out.push(`<line x1="${fx(s1[0])}" y1="${fx(s1[1])}" x2="${fx(s2[0])}" y2="${fx(s2[1])}" class="${p}-d" marker-start="url(#${p}-ar)" marker-end="url(#${p}-ar)"/>`);
    text([s1[0] - 1.5, s1[1] - 1], `${DOCK.slotWidth} SLOT`, "end");
  }
  // 65° between the base top and the backrest's rear face
  {
    const cz = back[1][0], r = 15;
    const a0 = R(cz + r, H);
    const a1 = R(cz + r * Math.cos(rad(DOCK.angle)), H + r * Math.sin(rad(DOCK.angle)));
    ln(R(cz, H), R(cz + r + 3, H), "d");
    out.push(`<path d="M${fx(a0[0])},${fx(a0[1])} A${r},${r} 0 0 0 ${fx(a1[0])},${fx(a1[1])}" class="${p}-d" fill="none" marker-start="url(#${p}-ar)" marker-end="url(#${p}-ar)"/>`);
    const m = R(cz + (r + 4) * Math.cos(rad(32)), H + (r + 4) * Math.sin(rad(32)));
    text([m[0], m[1] + 1], `${DOCK.angle}°`, "start");
  }

  // ---------------- NOTES, PROJECTION SYMBOL, TITLE BLOCK ----------------
  const notes = [
    "NOTES",
    "1. ALL DIMENSIONS IN MILLIMETRES. GENERAL TOLERANCE ±0.2.",
    "2. THIRD-ANGLE PROJECTION. HIDDEN EDGES DASHED.",
    "3. MATERIAL PLA. 0.2 LAYERS, 20% INFILL, 3 WALLS.",
    "4. PRINT LYING ON THE LEFT SIDE FACE. NO SUPPORTS NEEDED.",
    "5. NFC TAG: 30 MM NTAG215 STICKER, PRESSED INTO POCKET.",
  ];
  notes.forEach((s, i) => text([268, 24 + i * 5.2], s, "start", i ? "t" : "vt"));

  const TB = { x: 238, y: 261, w: 172, h: 26 };
  out.push(`<rect x="${TB.x}" y="${TB.y}" width="${TB.w}" height="${TB.h}" class="${p}-o"/>`);
  ln([TB.x, TB.y + 13], [TB.x + TB.w, TB.y + 13], "o");
  const cell = (x: number, y: number, w: number, label: string, value: string) => {
    if (x > TB.x) ln([x, y], [x, y + 13], "o");
    text([x + 2, y + 4.2], label, "start", "lb");
    text([x + 2, y + 10.4], value, "start", w > 60 ? "vt" : "t");
  };
  cell(TB.x, TB.y, 84, "TITLE", "NFC THOUGHT DOCK (CONCEPT 1)");
  cell(TB.x + 84, TB.y, 52, "DRAWN BY", "TEAM THOUGHT DOCK");
  cell(TB.x + 136, TB.y, 36, "PROJECTION", "");
  const row2: [string, string][] = [["UNITS", "mm"], ["SCALE", "1:1 ON A3"], ["DATE", o.date ?? DRAWN_ON], ["MATERIAL", "PLA"], ["SHEET", "1 OF 1"]];
  row2.forEach(([l, v], i) => cell(TB.x + i * 34.4, TB.y + 13, 34.4, l, v));
  // third-angle symbol: frustum side view on the left, end view (two circles) on the right
  {
    const sx = TB.x + 153, sy = TB.y + 8.8;
    poly([[sx - 6, sy - 3], [sx + 1, sy - 1.8], [sx + 1, sy + 1.8], [sx - 6, sy + 3]], "s");
    circ([sx + 9, sy], 3, "s");
    circ([sx + 9, sy], 1.8, "s");
  }

  const css =
    `.${p}-o{fill:none;stroke:${o.ink};stroke-width:.5;stroke-linejoin:round}` +
    `.${p}-s{fill:none;stroke:${o.ink};stroke-width:.3}` +
    `.${p}-h{fill:none;stroke:${o.ink};stroke-width:.3;stroke-dasharray:2 1.2}` +
    `.${p}-c{fill:none;stroke:${o.muted};stroke-width:.2;stroke-dasharray:7 1.5 1.2 1.5}` +
    `.${p}-d{stroke:${o.ink};stroke-width:.18}` +
    `.${p}-t,.${p}-vt,.${p}-lb{font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;fill:${o.ink};paint-order:stroke;stroke:${o.paper};stroke-width:.9px;stroke-linejoin:round}` +
    `.${p}-t{font-size:3px}.${p}-vt{font-size:3.4px;font-weight:600}.${p}-lb{font-size:2px;fill:${o.muted};letter-spacing:.1px}`;

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 297" width="420mm" height="297mm" role="img" aria-labelledby="${p}-title ${p}-desc">` +
    `<title id="${p}-title">NFC Thought Dock, dimensioned multiview drawing</title>` +
    `<desc id="${p}-desc">Third-angle projection with top, front and right side views. Base ${W} by ${D} by ${H} millimetres with 6 millimetre corner chamfers. Phone slot ${DOCK.slotWidth} millimetres wide at ${DOCK.angle} degrees, overall height ${top}. Underside: 30 millimetre NFC tag pocket 1.2 deep, 8 millimetre cable channel, four 10 millimetre foot recesses 1 deep.</desc>` +
    `<defs><style>${css}</style><marker id="${p}-ar" viewBox="0 0 10 4" refX="10" refY="2" markerUnits="userSpaceOnUse" markerWidth="3" markerHeight="1.2" orient="auto-start-reverse"><path d="M0,0L10,2L0,4z" fill="${o.ink}"/></marker></defs>` +
    `<rect width="420" height="297" fill="${o.paper}"/>` +
    `<rect x="10" y="10" width="400" height="277" class="${p}-o"/>` +
    out.join("") +
    `</svg>`
  );
}
