# Hyperframes Composition Brief: Thought Dock

## Objective
Create a short launch-style brag video for Thought Dock (phone Capture + DeskOS).

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080, 30fps
- Duration: 25s

## Source Material
- Project root: /Users/niks/Desktop/thought-dock
- Primary files read: DESIGN.md, app/globals.css, app/page.tsx, components/landing/{PhoneMock,SortMock}.tsx, components/Icons.tsx, components/app/CaptureApp.tsx, docs/screenshots/*.png
- Product name: Thought Dock (desk: DeskOS)
- Tagline / strongest claim: "Capture now. Organize later."
- Key UI to recreate: phone Capture screen (field + Dock row + "Saved to your inbox / Undo" toast), Sort view (one card, suggestion chip, seven keyed actions). Real screenshots: `assets/img/desk-light.png` (dev badge painted out), `assets/img/pair-card.png` (crop of the QR pairing dialog).
- Copy that must appear verbatim:
  - Capture now. / Organize later.
  - Saved to your inbox · Undo
  - Looks like an Event / Looks like a Task
  - Make a Task T, Make an Event E, Move to Space M, Develop D, Connect C, Keep K, Archive A
  - Made by Luke, Nikhilesh and Maryam for ENGR 1.

## Creative Direction
- Tone preset: polished
- Creative direction: Apple keynote product film — calm, premium, SF system font, white canvas, one blue accent, black pills, real product UI.
- Interpretation: six short scenes with soft crossfades, ease-out only, generous holds, no ambient clutter; UI is the hero.
- Angle: the product's own two-step promise shown literally — type and save on the phone, find it in the desk inbox, sort it with one key.
- Hook: logo + "Capture now." / "Organize later."
- Outro / punchline: Logo, "Thought Dock", tagline, team credit.
- Avoid: generic SaaS language, invented stats/users/testimonials, abstract filler, gradients/purple/glass beyond the Dock, red.

## Visual Identity
- Background: #ffffff canvas; UI page grey #f5f5f7; surface #ffffff; hairline rgb(0 0 0 / 0.08)
- Text: #1d1d1f / #424245 / #6e6e73
- Accent: #0071e3 (accent-soft rgb(0 113 227 / 0.1))
- Display font: -apple-system, "SF Pro Display", system-ui; 600, -0.03em
- Body font: same stack; mono "SF Mono", ui-monospace for key caps
- Radii: 28 / 18 / 12 / 8 / pill. Shadow-2 for floating things.

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract.
1. Hook — 3.0s — logo, "Capture now." "Organize later."
2. Capture — 5.74s — phone types the thought, Save tap, toast; headline + sub at right
3. Inbox — 2.76s — real desk screenshot, "Later, it's waiting in your inbox."
4. Sort — 6.52s — E then T key presses, card advance, suggestion chips, "Undo everything ⌘Z"
5. Pair + accessibility — 3.98s — QR card + four short promises
6. Outro — 3.0s — logo, name, tagline, credit

## Audio
- Audio role: warm low bed + sparse accents
- Audio arc: fade in → small tactile ticks → soft bell on name → fade out
- Music: `assets/music/happy-beats-business-moves-vol-12-by-ende-dot-app.mp3`, volume 0.28
- Music cue guidance: bundled preset (vol-12). Locks: 8.74s desk reveal, 18.56s first promise line, 22.37s wordmark.
- Audio-reactive treatment: subtle; RMS drives the opacity/scale of a soft accent glow behind focal UI.
- Audio-coupled moments: typing ticks (thinned), Save click, toast drop, E/T clicks, outro bell.
- SFX analysis guidance: low HF risk picks from brag `assets/sfx/sfx-analysis.md` (click_003/005, drop_001, impactSoft_medium_001, impactBell_heavy_000 at low volume).
