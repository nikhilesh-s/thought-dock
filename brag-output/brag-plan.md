# Brag Plan: Thought Dock

## What is this app?
A two-screen thought catcher: your phone saves any thought in one tap (one field, one Save), and DeskOS on your laptop lets you sort them later, one at a time, with single-key actions and undo for everything.

## The angle
"Capture now. Organize later." told as an Apple-keynote product film. The product is calm on purpose, so the video is calm too: white canvas, system type, one blue accent, black pills, real UI. The story is the product's own two-step promise played literally: a thought is typed on the phone and saved, it lands in the desk inbox, and it gets sorted with a single key. Confidence through restraint, not hype.

## Hook (first 2-3 seconds)
The Thought Dock mark settles on a white canvas, then "Capture now." lands, followed a beat later by "Organize later." in muted grey. Two short lines, the whole product in four words.

## Key moments (the middle)
- The phone Capture screen: "remember to email Professor Lee about missing Thursday's lab" types into the one field, Save is pressed, the black "Saved to your inbox / Undo" toast rises.
- The real DeskOS inbox screenshot: the same thought sits at the top of the Inbox, selected.
- Sort: one thought, large. A quiet "Looks like an Event" chip appears, the E key is pressed, the card slides toward the action and the next thought rises with "Looks like a Task"; T is pressed. A pill reads "Undo everything ⌘Z".
- QR pairing card (real screenshot crop) with three short promises: no account, keyboard for everything, light/dark and reduced motion.

## Outro / punchline
Logo + "Thought Dock", then "Capture now. Organize later." and a small credit: "Made by Luke, Nikhilesh and Maryam for ENGR 1." Music fades.

## User flow worth showing
Type a thought on the phone → tap Save, toast "Saved to your inbox" → it is waiting at the top of the DeskOS Inbox → Sort view: press E (Event) / T (Task) with the suggestion chip as a hint.

## Tone
- Preset: polished
- Creative direction: Apple keynote product film. Calm, premium, system font (SF), white canvas with one blue accent (#0071e3), black pills, real product UI.
- Interpretation: few scenes, long holds, soft 0.6s crossfades, ease-out only, no bounces, no decorative noise; the UI is the hero.

## Format: landscape — 1920x1080
## Duration: 25s (user asked ~20-30s; skill window 15-25s; 25s satisfies both)

## Visual identity (from the project, DESIGN.md + app/globals.css)
- Background: #ffffff canvas (product surface), page grey #f5f5f7 for UI panels
- Accent: #0071e3
- Text: #1d1d1f, secondary #424245, muted #6e6e73
- Ink pill: #1d1d1f with white text
- Display font: system stack (-apple-system / SF Pro Display), weight 600, tracking -0.03em
- Body font: system stack; SF Mono for key caps
- Strongest visual element: the Sort card with labeled key actions, and the Dock pill (Save)

## Share copy (draft)
Introducing Thought Dock: capture now, organize later. One tap to save a thought on your phone, one key to sort it at your desk.

## Audio direction
- Role: warm, low bed with sparse professional accents
- Music: happy-beats-business-moves-vol-12 (steady and clean, 109.96 BPM)
- Music treatment: start at 0, volume ~0.28, 1s fade-in, fade out over the last 1.6s
- Music cue guidance: preset `assets/music/cues/happy-beats-business-moves-vol-12-by-ende-dot-app.music-cues.json`. Strong cues to lock: 8.74s (desk inbox reveal), 18.02s beat / 18.56s strong (pair scene + first promise), 22.37s (outro wordmark). Beat grid 13.11-17.47s available for the Sort key presses.
- Audio-reactive treatment: subtle; music RMS breathes a very soft blue glow behind the focal UI. No visualizer graphics.
- SFX posture: sparse, motion-matched, low HF risk
- Audio-coupled moments: thinned key ticks while the phone thought types; a click on Save; a soft drop as the toast rises; clicks on E and T key presses; one soft bell on the outro wordmark.
- Restraint rule: never more than one accent at a time; nothing louder than the bed by much; no whooshes.

## Storyboard

### Scene 1 — Hook — 3.0s (0.0-3.0)
White canvas. Logo mark eases up. "Capture now." (large, #1d1d1f) then "Organize later." (#6e6e73) arrives 0.5s later. Hold ~1.4s on both lines.
Sequential/interaction: two lines, one after the other.
Audio intent: music fades in, calm.
Audio-coupled idea: none.
Transition mood: soft crossfade → Scene 2

### Scene 2 — Capture on the phone — 5.74s (3.0-8.74)
Left: phone frame with the Capture screen (wordmark, "Saved" status, the field, Dock row with Voice / Photo / Save). The thought types into the field. Save pill presses; "Saved to your inbox · Undo" toast rises. Right: headline "One field. One Save." and sub "Type it, say it, or snap a photo. No folders, tags, or dates."
Sequential/interaction: yes — typed text, simulated tap on Save, toast rises.
Audio intent: tactile, light.
Audio-coupled idea: thinned keypress ticks, click on Save, soft drop on toast.
Transition mood: soft crossfade → Scene 3 (beat-locked 8.74s)

### Scene 3 — The desk inbox — 2.76s (8.74-11.5)
Real `desk-light.png` screenshot in a rounded window with a soft shadow, easing up and slowly pushing in. Caption: "Later, it's waiting in your inbox."
Sequential/interaction: none (slow push-in only).
Audio intent: arrival.
Audio-coupled idea: soft impact on reveal.
Transition mood: soft crossfade → Scene 4

### Scene 4 — Sort — 6.52s (11.5-18.02)
HTML recreation of Sort (from components/app/SortView + landing SortMock): "1 of 5", the card "study group for ENGR 1 thursday 6pm library room 204", chip "Looks like an Event", the seven labeled actions with keys T E M D C K A. E presses (accent highlight), card slides toward it and fades; the next card rises: "UC transfer application due Nov 30, need to finish personal insight questions" with "Looks like a Task"; T presses. Headline: "Sort one thought at a time." Sub: "A small model we trained suggests. You decide." Black pill at end: "Undo everything ⌘Z".
Sequential/interaction: yes — two key presses, card advance.
Audio intent: precise, satisfying.
Audio-coupled idea: click on each key press.
Transition mood: soft crossfade → Scene 5

### Scene 5 — Pair and accessibility — 3.98s (18.02-22.0)
Left: the real QR pairing card crop (Pair your phone, code, Done pill). Right, revealed quickly and then held together: "Pair with a QR code. No account." / "Keyboard for everything." / "Light and dark. Reduced motion."
Sequential/interaction: three short lines, ~0.55s apart, then held ~2.8s as a set.
Audio intent: steady.
Audio-coupled idea: none (let the music carry).
Transition mood: soft crossfade → Scene 6

### Scene 6 — Outro — 3.0s (22.0-25.0)
Logo + "Thought Dock" (beat-locked 22.37s), tagline "Capture now. Organize later." in blue, then the credit line "Made by Luke, Nikhilesh and Maryam for ENGR 1." Hold, music fades.
Sequential/interaction: three elements in order.
Audio intent: resolve.
Audio-coupled idea: one soft bell on the wordmark.

**Music mood for this video:** calm, steady, premium
**Audio summary:** a low steady bed fades in, small tactile ticks follow the phone and the Sort keys, one soft bell lands the name, and the bed fades out under the credit.
