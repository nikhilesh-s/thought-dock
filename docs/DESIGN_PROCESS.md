# Design process

How the design direction for Thought Dock / DeskOS was chosen. The rules that came out of it are in
[`DESIGN.md`](../DESIGN.md). This document is the reasoning.

## 1. Where students get stuck

The team's problem statement: students pile up thoughts, deadlines, links, screenshots and worries
all day, and most tools make them organize each one at the moment they're least able to. From that
we picked out the moments with the most friction:

1. **The capture moment.** A thought shows up while walking to class. Opening a notes app means
   picking a folder, a title, maybe a date. That's enough friction that the thought gets dropped,
   or held in your head, which costs attention.
2. **The "where does this go?" decision.** Categorizing too early forces a decision with incomplete
   information. That's decision fatigue, especially for students with attention or
   executive-function differences.
3. **The pile-up.** Unsorted captures turn into a wall of guilt. Red badges, overdue counts and
   streaks make the pile feel like a judgment.
4. **The sit-down.** Facing 40 mixed items at once is overwhelming, and it isn't obvious where to
   start.
5. **Losing context.** A link saved without "why I saved this" is useless a week later.

## 2. References studied

- **Cage** (Nik's earlier project, `~/cage`), studied for its process rather than its look:
  - a written design contract that every screen must follow;
  - one accent color with a strict meaning;
  - a radius hierarchy instead of one radius everywhere;
  - Emil Kowalski's motion rules (ease-out only, under 300 ms, never animate keyboard actions);
  - an accessibility floor;
  - a shared data layer built before any UI.

  Cage also proved the phone ↔ desk pairing pattern (short code + QR + Upstash Redis), which we
  reuse here.
- **voiceos.com**, read from its served HTML and CSS rather than guessed:
  - the system SF font stack;
  - 600-weight headings with −0.03em tracking;
  - a white canvas and a single Apple blue (#007aff);
  - black pill buttons;
  - 28/22/18 px radii;
  - `cubic-bezier(.25,1,.5,1)` easing at 150–520 ms;
  - CSS-only motion with reduced-motion fallbacks.

  What we left out:
  - its gradient headline, which has low contrast mid-sweep;
  - its dense looping animation;
  - its lack of a dark mode.
- **Apple HIG / macOS apps** (Mail, Notes, Reminders) for the three-pane desk and the sidebar.
- **Claude toolkit skills used:**
  - `emil-design-eng` for the motion and interaction rules;
  - `ai-vibe-coding-check` to avoid generic AI-looking UI;
  - `which-skill` for skill discovery;
  - `brag` / Hyperframes for the launch video.

## 3. Three directions

### A. Quiet Desk (chosen)
Apple-native calm. The phone shows one field. The desk is a three-pane workspace (sidebar, list,
detail) with an opinionated **Sort** mode that shows one thought at a time, with big labeled
actions you can drive by keyboard.

- **Visual language:** system type, white or black canvas, one blue accent, hairlines, translucent
  sidebar.
- **Motion:** almost none. The one meaningful motion is the card leaving toward its destination in
  Sort.
- **Accessibility:** conventional structure is easy for screen readers. Keyboard works everywhere.
  Low visual load.
- **Risk:** it could look like "just another notes app" without a signature element. We addressed
  that with the Dock (below).

### B. Paper Tray (unconventional)
A skeuomorphic-light desk surface. Captures land as paper cards in an "in tray", and you drag them
into labeled trays (Tasks, Calendar, Spaces). It's tactile and memorable, and the physical metaphor
explains itself.

- **Accessibility:** drag-and-drop is hard for keyboard, switch and motor-impaired users, so it
  needs a full non-drag alternative. Spatial layouts are harder to linearize for screen readers.
  Heavier motion.
- **Complexity:** high (drag physics, stacking, collision).

### C. Constellation (unconventional)
Thoughts are nodes on a canvas. Connections are the primary structure, and spaces are clusters.
Organizing means pulling ideas together.

- **Strengths:** beautiful for idea-heavy users, and it shows "a map of your thinking" directly.
- **Accessibility:** canvas graphs are difficult for screen readers and keyboards. It adds
  cognitive load for students who just need to know what's due. Tasks and dates fit the metaphor
  poorly.
- **Complexity:** high.

## 4. Critique

| | A. Quiet Desk | B. Paper Tray | C. Constellation |
|---|---|---|---|
| Clarity | Highest. Familiar patterns, labeled actions | High metaphor clarity, but drag isn't obvious | Low for tasks and deadlines |
| Originality | Medium; the Dock + Sort give it identity | High | High |
| Mental effort | Lowest. Sort reduces it to one decision at a time | Medium | High |
| Build complexity | Low–medium | High | High |
| Accessibility | Strongest | Needs a parallel non-drag UI | Weakest |
| Emotional feel | Calm, trustworthy | Playful, tactile | Inspiring, but busy |

These are the AI design lead's qualitative judgments. The team's own numeric decision matrix, which
compares the three *product* concepts (NFC dock, Capture → DeskOS, AI organizer), is a separate
artifact. It's tracked in issue #17 and must be scored by the team.

## 5. Choice

**A, Quiet Desk**, with two ideas borrowed from B:

- **Sort** keeps B's "one paper at a time from the in-tray" feeling, but as a keyboard-first view
  with labeled buttons instead of drag.
- **The Dock**, a floating capture pill that is the whole UI on the phone and stays pinned on the
  desk. It's the product's signature object, and it echoes the original physical-dock concept.

Why A works for Capture → Desk: capture must be close to zero-decision, and processing must be
legible, reversible and keyboard-operable. A meets both with the least added cognitive load, and
it's the option the team can build well, demo reliably and defend on accessibility.

## 6. What's proposed vs built

Everything in DESIGN.md is implemented in this repo, except where ACCESSIBILITY_AUDIT.md marks an
item unverified. No user testing has been run yet. See docs/USABILITY_TEST.md.
