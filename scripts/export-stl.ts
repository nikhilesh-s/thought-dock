// Builds the Triangular Prism Dock from lib/dockModel.ts and writes:
//   public/models/thought-dock.stl  (binary STL, millimetres)
//   public/jared/dock-drawing.svg   (dimensioned multiview drawing, black on white)
// Run: node scripts/export-stl.ts   (Node 22.18+ strips the types; erasable syntax only)
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as THREE from "three";
import { STLExporter } from "three/examples/jsm/exporters/STLExporter.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
// Explicit .ts path for Node; typed through the extensionless module so tsc stays happy.
const modelPath = join(root, "lib", "dockModel.ts");
const model = (await import(pathToFileURL(modelPath).href)) as typeof import("../lib/dockModel");

const geos = model.buildDockGeometries();

// Self-check: the mesh must be closed and outward-facing, so its signed volume matches the analytic one.
const got = model.meshVolume(geos);
const want = model.expectedVolume();
if (Math.abs(got - want) / want > 0.005) throw new Error(`Volume mismatch: mesh ${got.toFixed(0)} mm³ vs expected ${want.toFixed(0)} mm³`);

// three is Y-up; slicers and CAD expect Z-up. Rotating +90° about X gives X = width (right),
// Y = depth (front edge at 0, back at +85), Z = up, base on Z = 0.
const group = new THREE.Group();
for (const g of geos) group.add(new THREE.Mesh(g));
group.rotation.x = Math.PI / 2;
group.updateMatrixWorld(true);
const box = new THREE.Box3().setFromObject(group);
const env = model.envelope();
const { width, depth, height } = model.DOCK;
const off = [box.min.x, box.max.x - width, box.min.y - env.z0, box.max.y - env.z1, box.min.z, box.max.z - env.y1];
if (off.some((d) => Math.abs(d) > 1e-3) || [env.z0, env.z1 - depth, env.y1 - height].some((d) => Math.abs(d) > 0.05)) {
  throw new Error(`Unexpected bounds ${JSON.stringify(box)}, envelope ${JSON.stringify(env)}`);
}
const stl = new STLExporter().parse(group, { binary: true }) as DataView;

const stlPath = join(root, "public", "models", "thought-dock.stl");
mkdirSync(dirname(stlPath), { recursive: true });
writeFileSync(stlPath, new Uint8Array(stl.buffer, stl.byteOffset, stl.byteLength));

const svgPath = join(root, "public", "jared", "dock-drawing.svg");
mkdirSync(dirname(svgPath), { recursive: true });
writeFileSync(svgPath, model.dockDrawingSvg({ ink: "#111111", paper: "#ffffff", muted: "#6e6e73", id: "tdd" }) + "\n");

console.log(`Slope ${model.slopeDeg()}°, bounds ${(box.max.x - box.min.x).toFixed(2)} × ${(box.max.y - box.min.y).toFixed(2)} × ${(box.max.z - box.min.z).toFixed(2)} mm`);
console.log(`STL  ${stlPath} (${stl.byteLength} bytes, ${(got / 1000).toFixed(1)} cm³ solid)`);
console.log(`SVG  ${svgPath}`);
