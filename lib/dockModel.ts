// Thought Dock, Triangular Prism Dock (design concept 1). The geometry is defined ONCE here, in
// millimetres, and feeds the 3D viewer, the dimensioned drawing, and scripts/export-stl.ts (STL + SVG).
// Source: the hand drawing docs/report/source/prism-dock-p1.png and the render ai-ref-image.png.
// Keep this file to erasable TypeScript: Node strips the types when the export script imports it.
//
// Design axes: x = width (0 at the left, seen from the front), y = up (0 on the desk), z = depth
// (0 at the front edge, increasing toward the back). The sloped face looks forward and rises from the
// front edge to the ridge over the vertical back face. three.js is right-handed with +Z toward the
// viewer, so the meshes put design z at world -Z.
import * as THREE from "three";

export const DOCK = {
  width: 170,
  depth: 85,
  height: 68,
  slopeNominal: 39, // as drawn; the true angle is solved below so the rounded body fills 170 × 85 × 68
  radius: { front: 3, apex: 6, back: 3 }, // rounded long edges: front-bottom, ridge, back-bottom
  puck: { dia: 56, depth: 6 }, // MagSafe puck recess, square to the sloped face, centred on width
  nfc: { size: 30, depth: 2, gap: 4 }, // NFC chip pocket, `gap` above the puck along the slope
  cable: { width: 6, exitDia: 8, wall: 4 }, // internal 6 × 6 channel; ⌀8 exit through a 4 mm back wall
  arcSegments: 16,
} as const;

type Pt = [number, number];
const deg = (r: number) => (r * 180) / Math.PI;
const unit = ([x, y]: Pt): Pt => { const l = Math.hypot(x, y); return [x / l, y / l]; };

/** Arc rounding the corner v (between neighbours p and q) with radius r, from the p side to the q side. */
function fillet(p: Pt, v: Pt, q: Pt, r: number): Pt[] {
  const a = unit([p[0] - v[0], p[1] - v[1]]), b = unit([q[0] - v[0], q[1] - v[1]]);
  const half = Math.acos(a[0] * b[0] + a[1] * b[1]) / 2;
  const t = r / Math.tan(half), h = r / Math.sin(half), m = unit([a[0] + b[0], a[1] + b[1]]);
  const c: Pt = [v[0] + m[0] * h, v[1] + m[1] * h];
  const a1 = Math.atan2(v[1] + a[1] * t - c[1], v[0] + a[0] * t - c[0]);
  let sweep = Math.atan2(v[1] + b[1] * t - c[1], v[0] + b[0] * t - c[0]) - a1;
  if (sweep > Math.PI) sweep -= 2 * Math.PI;
  if (sweep < -Math.PI) sweep += 2 * Math.PI;
  const n = DOCK.arcSegments;
  return Array.from({ length: n + 1 }, (_, i): Pt => [c[0] + r * Math.cos(a1 + (sweep * i) / n), c[1] + r * Math.sin(a1 + (sweep * i) / n)]);
}

/**
 * The side profile is a right triangle: front vertex A on the desk, right angle B at the back, ridge C
 * above B. With the edges rounded, the drawn 85 × 68 envelope only holds if the slope is a little under
 * the nominal 39°, so solve for it: frontmost point at z = 0, top of the ridge arc at y = height.
 */
function solve() {
  const { depth: D, height: H, radius: r } = DOCK;
  const sharp = (a: number) => {
    const az = r.front - r.front / Math.tan(a / 2);
    const cy = (D - az) * Math.tan(a);
    return { az, cy, top: cy - r.apex / Math.tan((Math.PI / 2 - a) / 2) + r.apex };
  };
  let lo = 0.3, hi = 1.2; // radians; top grows with the angle
  for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (sharp(mid).top < H) lo = mid; else hi = mid; }
  const angle = (lo + hi) / 2, { az, cy } = sharp(angle);
  const A: Pt = [az, 0], B: Pt = [D, 0], C: Pt = [D, cy];
  const sin = Math.sin(angle), cos = Math.cos(angle);
  /** Slope coordinates -> profile (z, y): u along the sloped face from A, n out of the face. */
  const S = (u: number, n: number): Pt => [az + u * cos - n * sin, u * sin + n * cos];
  const front = fillet(C, A, B, r.front), back = fillet(A, B, C, r.back), apex = fillet(B, C, A, r.apex);

  // Straight part of the sloped face, between the front and ridge roundings. Puck + NFC are centred on it.
  const u0 = r.front / Math.tan(angle / 2);
  const u1 = Math.hypot(D - az, cy) - r.apex / Math.tan((Math.PI / 2 - angle) / 2);
  const { puck, nfc, cable } = DOCK;
  const margin = (u1 - u0 - puck.dia - nfc.gap - nfc.size) / 2;
  const puckU = u0 + margin + puck.dia / 2;
  const nfcU = puckU + puck.dia / 2 + nfc.gap + nfc.size / 2;

  // Channel: 6 × 6, horizontal, from the recess floor (top edge 2 mm inside the up-slope rim) to the back wall.
  const floorU = (y: number) => (y + puck.depth * cos) / sin; // where the recess floor plane meets height y
  const yc = S(puckU + puck.dia / 2 - 2, -puck.depth)[1] - cable.width / 2;
  const P1 = S(floorU(yc - cable.width / 2), -puck.depth), P2 = S(floorU(yc + cable.width / 2), -puck.depth);
  const zw = D - cable.wall;
  const plate = { y0: yc - cable.exitDia / 2 - 2, y1: yc + cable.exitDia / 2 + 2 }; // back-wall strip holding the ⌀8 hole

  if (margin < 1 || plate.y0 < r.back || plate.y1 > apex[0][1] || floorU(yc - cable.width / 2) < puckU - puck.dia / 2 + 1)
    throw new Error("Dock features do not fit the prism");
  return { angle, A, B, C, S, front, back, apex, u0, u1, puckU, nfcU, yc, P1, P2, zw, plate };
}

export const PRISM = solve();
export const slopeDeg = () => +deg(PRISM.angle).toFixed(1);

/** Profile (z, y) pieces. Notches leave room for the sloped-face slab and the back-wall strip. */
function profiles() {
  const { S, front, back, apex, u0, u1, P1, P2, zw, plate, yc } = PRISM;
  const { depth: D, puck, cable } = DOCK;
  const full = [...front, ...back, ...apex];
  const backNotch: Pt[] = [[D, plate.y0], [zw, plate.y0], [zw, plate.y1], [D, plate.y1]];
  const notched = [...front, ...back, ...backNotch, ...apex, S(u1, -puck.depth), S(u0, -puck.depth)];
  // The 6 mm wide middle slice also loses the channel, which splits it into a part below and above.
  const h = cable.width / 2;
  const below = [...front, ...back, backNotch[0], backNotch[1], [zw, yc - h] as Pt, P1, S(u0, -puck.depth)];
  const above = [P2, [zw, yc + h] as Pt, backNotch[2], backNotch[3], ...apex, S(u1, -puck.depth)];
  const channel: Pt[] = [P1, [zw, yc - h], [zw, yc + h], P2];
  return { full, notched, below, above, channel };
}

const area = (pts: Pt[]) => Math.abs(pts.reduce((s, p, i) => { const q = pts[(i + 1) % pts.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0)) / 2;
const shape = (pts: Pt[]) => new THREE.Shape(pts.map(([a, b]) => new THREE.Vector2(a, b)));
const circle = (x: number, y: number, r: number) => new THREE.Path().absarc(x, y, r, 0, Math.PI * 2, true);
const rect = (x0: number, y0: number, x1: number, y1: number) =>
  new THREE.Path([new THREE.Vector2(x0, y0), new THREE.Vector2(x0, y1), new THREE.Vector2(x1, y1), new THREE.Vector2(x1, y0)]);
const extrude = (s: THREE.Shape, depth: number) => new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: false, curveSegments: 64 });

/** Extrude a side profile (z, y) across the width, from x0 to x1. */
function profileLayer(pts: Pt[], x0: number, x1: number) {
  const g = extrude(shape(pts), x1 - x0);
  g.rotateY(Math.PI / 2); // shape x (design z) -> world -Z, extrusion -> world +X
  g.translate(x0, 0, 0);
  return g;
}

/** Extrude a shape drawn on the sloped face (x, u) outward along its normal, from n0 to n1. */
function slopeLayer(s: THREE.Shape, n0: number, n1: number) {
  const { angle, S } = PRISM;
  const g = extrude(s, n1 - n0);
  const [z, y] = S(0, n0);
  // local x -> world X, local y (u, up the slope) -> world (0, sin, -cos), local z (n) -> world (0, cos, sin)
  g.applyMatrix4(new THREE.Matrix4().makeBasis(
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, Math.sin(angle), -Math.cos(angle)),
    new THREE.Vector3(0, Math.cos(angle), Math.sin(angle)),
  ).setPosition(0, y, -z));
  return g;
}

/**
 * The printable body as touching solids (slicers union them), so no CSG library is needed:
 * three width slices of the side profile (the middle 6 mm one carries the cable channel), a 6 mm slab
 * under the sloped face in two layers (puck recess through both, NFC pocket through the outer 2 mm),
 * and a 4 mm back-wall strip with the ⌀8 exit hole.
 */
export function buildDockGeometries(): THREE.BufferGeometry[] {
  const { width: W, puck, nfc, cable } = DOCK;
  const { u0, u1, puckU, nfcU, yc, plate } = PRISM;
  const p = profiles(), xa = W / 2 - cable.width / 2, xb = W / 2 + cable.width / 2;
  const slab = () => shape([[0, u0], [W, u0], [W, u1], [0, u1]]);
  const outer = slab(), inner = slab();
  outer.holes.push(circle(W / 2, puckU, puck.dia / 2), rect(W / 2 - nfc.size / 2, nfcU - nfc.size / 2, W / 2 + nfc.size / 2, nfcU + nfc.size / 2));
  inner.holes.push(circle(W / 2, puckU, puck.dia / 2));
  const strip = shape([[0, plate.y0], [W, plate.y0], [W, plate.y1], [0, plate.y1]]);
  strip.holes.push(circle(W / 2, yc, cable.exitDia / 2));
  const back = extrude(strip, cable.wall);
  back.translate(0, 0, -DOCK.depth); // design z from zw to depth -> world -zw .. -depth
  return [
    profileLayer(p.notched, 0, xa),
    profileLayer(p.below, xa, xb),
    profileLayer(p.above, xa, xb),
    profileLayer(p.notched, xb, W),
    slopeLayer(inner, -puck.depth, -nfc.depth),
    slopeLayer(outer, -nfc.depth, 0),
    back,
  ];
}

/** Analytic solid volume in mm³, for checking the mesh. */
export function expectedVolume() {
  const { width: W, puck, nfc, cable } = DOCK;
  const p = profiles();
  return area(p.full) * W - Math.PI * (puck.dia / 2) ** 2 * puck.depth - nfc.size ** 2 * nfc.depth
    - area(p.channel) * cable.width - Math.PI * (cable.exitDia / 2) ** 2 * cable.wall;
}

/** Bounding box of the rounded profile, for checking the exported mesh. */
export function envelope() {
  const pts = profiles().full;
  return { z0: Math.min(...pts.map((q) => q[0])), z1: Math.max(...pts.map((q) => q[0])), y1: Math.max(...pts.map((q) => q[1])) };
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

/** World position + X rotation for something lying on the sloped face, centred at slope coords (u, n). */
export function onSlope(u: number, n: number) {
  const [z, y] = PRISM.S(u, n);
  return { position: [DOCK.width / 2, y, -z] as [number, number, number], tiltX: PRISM.angle };
}

/** A phone (147 × 71.5 × 8 mm, landscape) held by the MagSafe puck: centred on it, back on the face. */
export function phonePose() {
  const size = { w: 147, h: 71.5, t: 8 };
  const { position } = onSlope(PRISM.puckU, size.t / 2);
  return { size, position, tiltX: -(Math.PI / 2 - PRISM.angle) };
}

// ---------------------------------------------------------------------------------------------
// Dimensioned multiview drawing (third-angle projection), A3 landscape sheet at 1:1, units mm.
// Returned as an SVG string so the page can inline it and the export script can write the file.

export const DRAWN_ON = "2026-10-16";
type DrawOpts = { ink: string; paper: string; muted: string; id: string; date?: string };
const fx = (n: number) => +n.toFixed(2);
const mm = (n: number) => String(+n.toFixed(1));

export function dockDrawingSvg(o: DrawOpts): string {
  const { width: W, depth: D, height: H, puck, nfc, cable, radius } = DOCK;
  const { S, angle, A, puckU, nfcU, u0, u1, yc, P1, P2, zw } = PRISM;
  const sin = Math.sin(angle);
  const prof = profiles();
  const ridgeZ = D - radius.apex;
  const p = o.id;
  const out: string[] = [];

  // View origins on the sheet. Sheet y grows downward.
  const FX = 50, FY = 240; // front view: x -> right, y -> up
  const TX = 50, TY = 150; // top view (above front): x -> right, z -> up (front edge at the bottom)
  const RX = 248; // right view (right of front): z -> right (front edge at the left), y -> up
  const F = (x: number, y: number): Pt => [FX + x, FY - y];
  const T = (x: number, z: number): Pt => [TX + x, TY - z];
  const R = (z: number, y: number): Pt => [RX + z, FY - y];
  const RS = (u: number, n: number) => { const [z, y] = S(u, n); return R(z, y); };

  const ln = (a: Pt, b: Pt, cls: string) =>
    out.push(`<line x1="${fx(a[0])}" y1="${fx(a[1])}" x2="${fx(b[0])}" y2="${fx(b[1])}" class="${p}-${cls}"/>`);
  const poly = (pts: Pt[], cls: string, closed = true) =>
    out.push(`<${closed ? "polygon" : "polyline"} points="${pts.map((q) => `${fx(q[0])},${fx(q[1])}`).join(" ")}" class="${p}-${cls}"/>`);
  const circ = (q: Pt, r: number, cls: string) =>
    out.push(`<circle cx="${fx(q[0])}" cy="${fx(q[1])}" r="${fx(r)}" class="${p}-${cls}"/>`);
  const ell = (q: Pt, rx: number, ry: number, cls: string) =>
    out.push(`<ellipse cx="${fx(q[0])}" cy="${fx(q[1])}" rx="${fx(rx)}" ry="${fx(ry)}" class="${p}-${cls}"/>`);
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
    out.push(`<line x1="${fx(qa[0])}" y1="${fx(qa[1])}" x2="${fx(qb[0])}" y2="${fx(qb[1])}" class="${p}-d" marker-start="url(#${p}-ar)" marker-end="url(#${p}-ar)"/>`);
    const m: Pt = [(qa[0] + qb[0]) / 2, (qa[1] + qb[1]) / 2];
    if (side === "above") text([m[0], m[1] - 1.2], label);
    else if (side === "below") text([m[0], m[1] + 4.2], label);
    else if (side === "left") text([m[0] - 1.4, m[1] + 1.1], label, "end");
    else text([m[0] + 1.4, m[1] + 1.1], label, "start");
  }

  const leader = (tip: Pt, knee: Pt, lines: string[], dir: 1 | -1 = 1) => {
    const end: Pt = [knee[0] + 3 * dir, knee[1]];
    out.push(`<polyline points="${fx(end[0])},${fx(end[1])} ${fx(knee[0])},${fx(knee[1])} ${fx(tip[0])},${fx(tip[1])}" class="${p}-d" fill="none" marker-end="url(#${p}-ar)"/>`);
    lines.forEach((s, i) => text([end[0] + 1.2 * dir, end[1] + 1.1 + i * 4.4], s, dir > 0 ? "start" : "end"));
  };

  const zOf = (u: number, n = 0) => S(u, n)[0];
  const yOf = (u: number, n = 0) => S(u, n)[1];
  const nfcBox = (map: (x: number, v: number) => Pt, v: (u: number) => number) => {
    const a = map(W / 2 - nfc.size / 2, v(nfcU - nfc.size / 2)), b = map(W / 2 + nfc.size / 2, v(nfcU + nfc.size / 2));
    poly([a, [b[0], a[1]], b, [a[0], b[1]]], "o");
  };

  // ---------------- TOP VIEW ----------------
  out.push(`<rect x="${fx(T(0, D)[0])}" y="${fx(T(0, D)[1])}" width="${W}" height="${D}" class="${p}-o"/>`);
  for (const z of [zOf(u0), zOf(u1), ridgeZ]) ln(T(0, z), T(W, z), "s"); // where the roundings meet the flats
  ell(T(W / 2, zOf(puckU)), puck.dia / 2, (puck.dia / 2) * Math.cos(angle), "o");
  nfcBox(T, zOf);
  ln(T(W / 2 - cable.width / 2, P1[0]), T(W / 2 - cable.width / 2, zw), "h");
  ln(T(W / 2 + cable.width / 2, P1[0]), T(W / 2 + cable.width / 2, zw), "h");
  for (const x of [W / 2 - cable.exitDia / 2, W / 2 + cable.exitDia / 2]) ln(T(x, zw), T(x, D), "h");
  ln(T(W / 2, -4), T(W / 2, D + 4), "c");
  ln(T(W / 2 - 33, zOf(puckU)), T(W / 2 + 33, zOf(puckU)), "c");
  ln(T(W / 2 - 19, zOf(nfcU)), T(W / 2 + 19, zOf(nfcU)), "c");
  text(T(W / 2, D + 7), "TOP VIEW", "middle", "vt");
  dim(T(0, 0), T(0, zOf(puckU)), 8, mm(zOf(puckU)), "left");
  dim(T(0, 0), T(0, zOf(nfcU)), 18, mm(zOf(nfcU)), "left");
  dim(T(0, 0), T(0, D), 28, String(D), "left");
  leader(T(W / 2 + cable.exitDia / 2, D - cable.wall / 2), [228, 60], [`⌀${cable.exitDia} REAR CABLE EXIT, ${cable.wall} DEEP`]);
  leader(T(W / 2 + cable.width / 2, (zw + zOf(nfcU + nfc.size / 2)) / 2), [228, 74], [`INTERNAL CABLE CHANNEL ${cable.width} W × ${cable.width} H`, "RECESS FLOOR TO BACK WALL"]);
  leader(T(W / 2 + nfc.size / 2, zOf(nfcU)), [228, 92], [`NFC CHIP POCKET ${nfc.size} × ${nfc.size} × ${nfc.depth} DP`, "SQUARE TO SLOPED FACE"]);
  leader(T(W / 2 + puck.dia / 2, zOf(puckU)), [228, 125], [`MAGSAFE PUCK RECESS ⌀${puck.dia} × ${puck.depth} DP`, "SQUARE TO SLOPED FACE"]);

  // ---------------- FRONT VIEW ----------------
  out.push(`<rect x="${fx(F(0, H)[0])}" y="${fx(F(0, H)[1])}" width="${W}" height="${H}" class="${p}-o"/>`);
  for (const y of [yOf(u0), yOf(u1)]) ln(F(0, y), F(W, y), "s");
  ell(F(W / 2, yOf(puckU)), puck.dia / 2, (puck.dia / 2) * sin, "o");
  nfcBox(F, yOf);
  out.push(`<rect x="${fx(F(W / 2 - cable.width / 2, yc + cable.width / 2)[0])}" y="${fx(F(0, yc + cable.width / 2)[1])}" width="${cable.width}" height="${cable.width}" class="${p}-h"/>`);
  circ(F(W / 2, yc), cable.exitDia / 2, "h");
  ln(F(W / 2, -4), F(W / 2, H + 4), "c");
  ln(F(W / 2 - 33, yOf(puckU)), F(W / 2 + 33, yOf(puckU)), "c");
  ln(F(W / 2 - 19, yOf(nfcU)), F(W / 2 + 19, yOf(nfcU)), "c");
  text(F(W / 2, -16), "FRONT VIEW", "middle", "vt");
  dim(F(0, 0), F(W, 0), -8, String(W), "below");
  dim(F(0, 0), F(0, yOf(puckU)), 8, mm(yOf(puckU)), "left");
  dim(F(0, 0), F(0, yOf(nfcU)), 16, mm(yOf(nfcU)), "left");
  dim(F(0, 0), F(0, H), 24, String(H), "left");

  // ---------------- RIGHT SIDE VIEW ----------------
  poly(prof.full.map(([z, y]) => R(z, y)), "o");
  poly([RS(puckU - puck.dia / 2, 0), RS(puckU - puck.dia / 2, -puck.depth), RS(puckU + puck.dia / 2, -puck.depth), RS(puckU + puck.dia / 2, 0)], "h", false);
  poly([RS(nfcU - nfc.size / 2, 0), RS(nfcU - nfc.size / 2, -nfc.depth), RS(nfcU + nfc.size / 2, -nfc.depth), RS(nfcU + nfc.size / 2, 0)], "h", false);
  ln(R(P1[0], P1[1]), R(zw, P1[1]), "h");
  ln(R(P2[0], P2[1]), R(zw, P2[1]), "h");
  ln(R(zw, yc - cable.exitDia / 2), R(zw, yc + cable.exitDia / 2), "h");
  for (const y of [yc - cable.exitDia / 2, yc + cable.exitDia / 2]) ln(R(zw, y), R(D, y), "h");
  ln(R(D - 6, yc), R(D + 4, yc), "c");
  text(R(D / 2, -16), "RIGHT SIDE VIEW", "middle", "vt");
  dim(R(0, 0), R(D, 0), -8, String(D), "below");
  dim(R(D, 0), R(D, H), -10, String(H), "right");
  // slope angle at the (virtual) sharp front corner
  {
    const r = 22, a0 = R(A[0] + r, 0), a1 = R(A[0] + r * Math.cos(angle), r * sin);
    ln(R(A[0], 0), R(zOf(u0), yOf(u0)), "d");
    ln(R(A[0], 0), R(0, 0), "d");
    out.push(`<path d="M${fx(a0[0])},${fx(a0[1])} A${r},${r} 0 0 0 ${fx(a1[0])},${fx(a1[1])}" class="${p}-d" fill="none" marker-start="url(#${p}-ar)" marker-end="url(#${p}-ar)"/>`);
    const m = R(A[0] + (r + 2) * Math.cos(angle / 2), (r + 2) * Math.sin(angle / 2));
    text([m[0], m[1] + 1], `${slopeDeg()}°`, "start");
  }
  const mid = (arc: Pt[]) => R(...arc[arc.length >> 1]);
  leader(mid(PRISM.apex), [RX + D + 14, FY - H - 4], [`R${radius.apex} RIDGE`]);
  leader(mid(PRISM.front), [RX - 8, FY + 10], [`R${radius.front}`], -1);
  leader(mid(PRISM.back), [RX + D + 14, FY + 10], [`R${radius.back}`]);

  // ---------------- NOTES, PROJECTION SYMBOL, TITLE BLOCK ----------------
  const notes = [
    "NOTES",
    "1. ALL DIMENSIONS IN MILLIMETRES. GENERAL TOLERANCE ±0.2.",
    "2. THIRD-ANGLE PROJECTION. HIDDEN EDGES DASHED.",
    `3. SLOPE ${slopeDeg()}° (${DOCK.slopeNominal}° NOMINAL) KEEPS THE ${W} × ${D} × ${H} ENVELOPE WITH ROUNDED EDGES.`,
    "4. MATERIAL PLA. 0.2 LAYERS, 20% INFILL, 3 WALLS.",
    "5. PRINT STANDING ON ITS BASE. NO SUPPORTS NEEDED.",
    "6. FROM NIKHILESH'S HAND DRAWING, TRIANGULAR PRISM DOCK, 2026-09-22.",
  ];
  notes.forEach((s, i) => text([262, 24 + i * 5.2], s, "start", i ? "t" : "vt"));

  const TB = { x: 238, y: 261, w: 172, h: 26 };
  out.push(`<rect x="${TB.x}" y="${TB.y}" width="${TB.w}" height="${TB.h}" class="${p}-o"/>`);
  ln([TB.x, TB.y + 13], [TB.x + TB.w, TB.y + 13], "o");
  const cell = (x: number, y: number, w: number, label: string, value: string) => {
    if (x > TB.x) ln([x, y], [x, y + 13], "o");
    text([x + 2, y + 4.2], label, "start", "lb");
    text([x + 2, y + 10.4], value, "start", w > 60 ? "vt" : "t");
  };
  cell(TB.x, TB.y, 84, "TITLE", "TRIANGULAR PRISM DOCK (CONCEPT 1)");
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
    `<title id="${p}-title">Thought Dock Triangular Prism Dock, dimensioned multiview drawing</title>` +
    `<desc id="${p}-desc">Third-angle projection with top, front and right side views. A triangular prism ${W} millimetres wide, ${D} deep and ${H} tall, with a vertical back and a front face sloped at ${slopeDeg()} degrees (${DOCK.slopeNominal} nominal), long edges rounded to ${radius.front} and ${radius.apex} millimetres. On the sloped face: a ${puck.dia} millimetre MagSafe puck recess ${puck.depth} deep, and a ${nfc.size} millimetre square NFC chip pocket ${nfc.depth} deep above it. A ${cable.width} millimetre internal cable channel runs from the recess floor to an ${cable.exitDia} millimetre exit hole in the back.</desc>` +
    `<defs><style>${css}</style><marker id="${p}-ar" viewBox="0 0 10 4" refX="10" refY="2" markerUnits="userSpaceOnUse" markerWidth="3" markerHeight="1.2" orient="auto-start-reverse"><path d="M0,0L10,2L0,4z" fill="${o.ink}"/></marker></defs>` +
    `<rect width="420" height="297" fill="${o.paper}"/>` +
    `<rect x="10" y="10" width="400" height="277" class="${p}-o"/>` +
    out.join("") +
    `</svg>`
  );
}
