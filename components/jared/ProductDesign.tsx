import { DOCK, PRISM, dockDrawingSvg, expectedVolume, slopeDeg } from "@/lib/dockModel";
import { LINKS } from "@/lib/links";
import { DownloadIcon } from "@/components/Icons";
import { DockViewer } from "./DockViewer";
import { Method, Section, Sub, TextLink, captionCls, tableCls, tdCls, thCls } from "./ui";

const { radius, puck, nfc, cable } = DOCK;
const SPECS: [string, string][] = [
  ["Overall", `${DOCK.width} W × ${DOCK.depth} D × ${DOCK.height} H mm triangular prism, vertical back`],
  ["Sloped face", `${slopeDeg()}° from the desk (${DOCK.slopeNominal}° nominal in the hand drawing)`],
  ["Rounded edges", `R${radius.apex} ridge, R${radius.front} front and back bottom edges`],
  ["MagSafe recess", `⌀${puck.dia} × ${puck.depth} mm deep, square to the sloped face, centred on width`],
  ["NFC chip pocket", `${nfc.size} × ${nfc.size} × ${nfc.depth} mm deep, ${nfc.gap} mm above the puck recess`],
  ["Cable channel", `${cable.width} × ${cable.width} mm, inside, from the recess floor to the back wall`],
  ["Rear cable exit", `⌀${cable.exitDia} mm through the ${cable.wall} mm back wall, ${PRISM.yc.toFixed(0)} mm above the desk`],
  ["Solid volume", `≈ ${(expectedVolume() / 1000).toFixed(0)} cm³ (checked against the exported mesh)`],
];

const WHY = [
  ["A prism, not a cradle", "Three flat faces and a vertical back: nothing to snap off, nothing to tip over, and it reads as one calm object on a desk."],
  [`${slopeDeg()}° face`, `Leans the phone back far enough to read from a chair while the puck holds it. The drawing says ${DOCK.slopeNominal}°; rounding the edges inside the ${DOCK.depth} × ${DOCK.height} mm envelope moves it slightly.`],
  ["MagSafe does the holding", "The puck sits flush in its recess, so the phone snaps on, charges, and stays put without a slot or lip."],
  ["NFC chip above the puck", `A ${nfc.size} mm tag sits ${nfc.depth} mm under the surface, so setting the phone down is the same as tapping it: the app switches into Desk Mode.`],
  ["Prints without supports", "Standing on its base, every face is flat, vertical, or slopes upward; the channel and exit hole are short bridges."],
];

export function ProductDesign() {
  const svg = dockDrawingSvg({ ink: "var(--text)", paper: "var(--surface)", muted: "var(--muted)", id: "tdj" });
  return (
    <Section id="product-design" n="04" eyebrow="3D product design" band
      title="The dock we designed, then chose not to build."
      lead="Concept 1 was a physical NFC dock: tap your phone on it and the app switches into Desk Mode. We rejected it as the product but carried it through as a full product-design study.">
      <Method
        what="Product design turns a concept into a manufacturable object: parametric geometry, standard views and dimensions someone else could build from, and a plan for how it will be made."
        how={<>We defined the dock once, as numbers in millimetres, in <code className="font-mono text-[14px]">lib/dockModel.ts</code>. The same numbers generate this 3D view, the dimensioned drawing, and the printable STL file.</>}
        changed="Designing the physical dock showed us what it would cost a student: a purchase, a fixed desk, and a device to lose. That pushed us to software only, and the Dock became the floating capture pill in the app instead."
      />

      <div className="mt-20">
        <DockViewer />
        <p className={`${captionCls} mt-3`}>Drag to orbit. The grey disc is the MagSafe puck and the blue square is the NFC chip. Phone shown at 147 × 71.5 × 8 mm.</p>
      </div>

      <div className="mt-20 grid gap-12 lg:grid-cols-[1.15fr_1fr]">
        <div className="overflow-x-auto">
          <table className={tableCls}>
            <caption className={captionCls}><span className="text-[1.5rem] font-semibold tracking-[-0.03em] text-text">Key dimensions</span></caption>
            <thead><tr><th scope="col" className={thCls}>Feature</th><th scope="col" className={thCls}>Size (mm)</th></tr></thead>
            <tbody>
              {SPECS.map(([k, v]) => (
                <tr key={k}><th scope="row" className={`${tdCls} font-semibold whitespace-nowrap text-text`}>{k}</th><td className={`${tdCls} tnum`}>{v}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <Sub>Design decisions</Sub>
          <dl className="mt-6 space-y-6">
            {WHY.map(([k, v]) => (
              <div key={k}>
                <dt className="text-[17px] font-semibold tracking-[-0.02em] text-text">{k}</dt>
                <dd className="mt-1 text-[15px] text-text-2">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <figure className="mt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Sub>Dimensioned drawing</Sub>
            <p className="mt-2 max-w-[60ch] text-[15px] text-text-2">
              Third-angle projection: top view above the front view, right side view to its right. Hidden edges are dashed.
              Generated from the same parameters as the 3D model, so the two cannot drift apart.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/jared/dock-drawing.svg" download className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-[15px] font-medium text-on-ink hover-dim">
              <DownloadIcon size={18} /> Download drawing (SVG)
            </a>
            <a href="/models/thought-dock.stl" download className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-5 text-[15px] font-medium text-text hover-soft">
              <DownloadIcon size={18} /> 3D model (STL)
            </a>
          </div>
        </div>
        <div className="mt-8 overflow-x-auto rounded-xl border border-line bg-surface">
          <div className="dock-drawing min-w-[900px] p-2 sm:p-4" dangerouslySetInnerHTML={{ __html: svg }} />
        </div>
        <figcaption className={`${captionCls} mt-3`}>
          On narrow screens, scroll the drawing sideways or download the SVG. Print settings and assembly notes:{" "}
          <TextLink href={`${LINKS.repo}/blob/main/docs/3D_DOCK.md`}>docs/3D_DOCK.md</TextLink>.
        </figcaption>
      </figure>
    </Section>
  );
}
