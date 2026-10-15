# NFC Thought Dock (concept 1): 3D product-design study

Concept 1 was a desk stand with an NFC tag: tap your phone on it and the app switches into Desk Mode.
The team rejected it as the product (cost, a required physical object, a fixed desk) and chose the
software-only Capture → DeskOS concept. The dock was carried through as the product-design study.

## Single source of truth

All geometry lives in `lib/dockModel.ts` as millimetre parameters (`DOCK`). The same numbers drive:

- the interactive three.js viewer on `/jared` (`components/jared/DockViewer.tsx`)
- the dimensioned third-angle drawing (`dockDrawingSvg()`), inline on `/jared` and as
  `public/jared/dock-drawing.svg`
- the printable mesh `public/models/thought-dock.stl`

Regenerate both files after changing any parameter:

```bash
node scripts/export-stl.ts
```

The script fails if the mesh volume differs from the analytic volume by more than 0.5 % (catches
open or inside-out meshes) or if the bounding box is not 120 × 90 × 80 mm.

## Dimensions (mm)

| Feature | Size |
|---|---|
| Base | 120 W × 90 D × 18 H, 6 × 45° chamfer on the four vertical corners |
| Overall height | 80 (base 18 + backrest 62) |
| Phone slot | 14 wide, measured square to the walls; walls at 65° from horizontal |
| Front lip | 12 tall, 6 thick (horizontal), front face starts 12 from the front edge |
| Backrest | 62 above the base, 8 thick (horizontal) at the base, leans back at 65° |
| NFC tag pocket | ⌀30 × 1.2 deep, underside, centred on width, 48 from the front edge |
| Cable channel | 8 wide × 6 deep, underside, centred on width, from the slot to the right side |
| Cable hole | 8 × 8 through the slot floor, centred 26 from the front edge |
| Foot recesses | 4 × ⌀10 × 1 deep, centres 12 from each edge |
| Solid volume | ≈ 256 cm³ |

## STL coordinates

Binary STL, millimetres, Z up: X = width (0 at the left seen from the front), Y = depth (front edge
at 0), Z = height (desk at 0). The body is exported as touching solids (stacked base layers plus the
lip and backrest extrusions); slicers merge them into one part.

## Print settings

- Material: PLA
- Layer height: 0.2 mm
- Infill: 20 %, 3 walls
- Orientation: rotate the part to lie on its **left side face** (X = 0 on the bed). The whole side
  profile is then flat on the bed and every feature is either vertical, a 45° chamfer, or a short
  bridge (8 mm channel, 1.2 mm pocket), so **no supports** are needed.
- Hardware: one 30 mm NTAG215 NFC sticker pressed into the pocket; four stick-on rubber bumpers.

## Not yet validated

Nothing has been printed. Before relying on the design, check: phone fit in the 14 mm slot with a
thick case, NFC read range through the 18 mm base (phones place their antenna differently; the
pocket may need to move to the backrest face), and tipping when the screen is tapped.
