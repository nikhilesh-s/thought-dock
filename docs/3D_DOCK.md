# Triangular Prism Dock (concept 1): 3D product-design study

Concept 1 was a physical NFC dock: set your phone on it and the app switches into Desk Mode.
The team rejected it as the product (cost, a required physical object, a fixed desk) and chose the
software-only Capture → DeskOS concept. The dock was carried through as the product-design study.

The design is Nikhilesh's **Triangular Prism Dock**: a triangular prism whose sloped front face holds
the phone with a MagSafe puck, with an NFC chip just above the puck. Sources:

- hand drawing: `docs/report/source/prism-dock-p1.png` (full PDF: `prism-dock-2026-09-22.pdf`)
- render used for the look (soft, rounded edges): `docs/report/source/ai-ref-image.png`

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
open or inside-out meshes) or if the bounding box is not 170 × 85 × 68 mm.

## Dimensions (mm)

| Feature | Size |
|---|---|
| Overall | 170 W × 85 D × 68 H triangular prism, vertical back face |
| Sloped face | 39.6° from the desk (39° nominal, see below), rising from the front edge to the ridge |
| Rounded edges | R6 ridge, R3 front-bottom and back-bottom edges; end faces flat |
| MagSafe puck recess | ⌀56 × 6 deep, square to the sloped face, centred on width |
| NFC chip pocket | 30 × 30 × 2 deep, square to the sloped face, 4 above the puck recess |
| Cable channel | 6 W × 6 H, internal and horizontal, from the recess floor (2 inside its upper rim) to the back wall |
| Rear cable exit | ⌀8 through the 4 mm back wall, centred on width, 34 above the desk |
| Solid volume | ≈ 547 cm³ |

The puck and NFC pocket are centred, as a group, on the flat part of the sloped face between the two
roundings. The exact positions are on the drawing.

## Reading the hand drawing

Two things in the drawing disagree, and the model has to pick one:

- **Side view vs. Section A-A.** The right side view is a right triangle (vertical back, one 39°
  slope), but Section A-A is drawn as a roughly isosceles triangle. The model uses the **right
  triangle**: it matches the notes (68 H, 85 D, 39°) because 68 ÷ tan 39° ≈ 84 ≈ 85, and the render.
  The side view also draws the slope on the right; in third-angle projection the right view has the
  front on the left, so the model's drawing shows it mirrored relative to the sketch.
- **39° vs. 85 × 68.** A sharp 85 × 68 right triangle has a 38.7° slope, and rounding the edges
  (as in the render) shrinks the envelope further. The model keeps the overall size exact
  (170 × 85 × 68 as measured over the rounded part) and solves for the slope, which comes out at
  39.6°. Change `radius` in `DOCK` and the angle follows.

Also from the drawing, not modelled: the front view is drawn as a trapezoid (narrower at the top) and
the top view has small circles at the four corners. Neither is in the notes, so the ends stay
vertical and there are no foot recesses. Add them if that was the intent.

## STL coordinates

Binary STL, millimetres, Z up: X = width (0 at the left seen from the front), Y = depth (front edge
at 0), Z = height (desk at 0). The body is exported as touching solids (three width slices of the
side profile, a 6 mm slab under the sloped face in two layers, and a back-wall strip), so the
recesses need no CSG library; slicers merge them into one part.

## Print settings

- Material: PLA
- Layer height: 0.2 mm
- Infill: 20 %, 3 walls
- Orientation: **standing on its base**. The sloped face and both recesses face up, the back is
  vertical, and the 6 mm channel and ⌀8 exit are short bridges, so **no supports** are needed.
- Hardware: an Apple MagSafe charger (puck ⌀56 mm) pressed into the recess; one 30 × 30 mm NTAG215
  NFC tag in the pocket.

## Not yet validated

Nothing has been printed. Before relying on the design, check:

- **Assembly.** The MagSafe cable is fixed to the puck, and its USB-C plug (about 8 × 12 mm) will
  not pass through a 6 mm channel or an 8 mm hole. As drawn, the cable cannot be threaded. Options:
  a slot from the channel out through the base, or a two-part body.
- Puck fit in a ⌀56.0 recess (the puck is about 55.9 mm; it may need +0.3 mm clearance).
- Recess floor thickness: at its lowest edge the puck recess floor is about 2.6 mm above the desk.
- NFC read range through the phone and its case, and whether the chip sits where the phone's NFC
  antenna lands when the phone is centred on the puck (iPhone antennas are near the top edge).
- Tipping: whether the 85 mm deep base stays put when the screen is tapped.
