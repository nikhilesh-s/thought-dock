# Thought Dock / DeskOS — design contract

Every screen obeys this. Read it fully before writing UI. Rationale and alternatives live in
`docs/DESIGN_PROCESS.md`; this file is the rules.

## The one idea
**Capture now. Organize later.** Two connected but deliberately different experiences:

- **Capture** (`/capture`, phone-first): one field, one button. Nothing to choose. It's saved before you finish worrying about where it goes.
- **DeskOS** (`/desk`, desktop-first): a calm processing desk. You sort thoughts when *you* decide to sit down, one at a time if you want.

The signature element is **the Dock**: a floating capture pill (macOS-Dock shaped) that is the only input on the phone and stays pinned at the bottom of the desk. Same object, both screens. It's how users recognize the product.

## Direction: "Quiet Desk"
Apple-native calm (System Settings / Mail / Notes lineage) plus one opinionated feature: **Sort**, a focus view showing one thought large in the center with big labeled actions underneath, fully keyboard-driven. Inspirations: Apple HIG, voiceos.com (system type, white canvas, black pills, one blue accent, restrained ease-out motion), Cage's discipline (one accent, radius hierarchy, Emil motion rules, a11y floor).
Dials: VARIANCE 4 / MOTION 4 / DENSITY 3.

## Tokens (in `app/globals.css`; use them, never invent colors)
- Surfaces: `bg-bg` page (#f5f5f7 / #000), `bg-surface` cards (#fff / #1c1c1e), `bg-surface-2`, `bg-raised`, `bg-sidebar` (translucent, with `backdrop-blur-xl`), hairlines `border-line`.
- Text: `text-text`, `text-text-2`, `text-muted` (secondary only, ≥13px, never body copy).
- Accent: `accent` (#0071e3 / #2997ff). One accent: primary action, selection, focus ring, links. `bg-accent-soft` for selected rows.
- Primary CTA on marketing pages: black pill `bg-ink text-on-ink` (inverts in dark).
- Kind tints `text-k-task|event|idea|resource|note`: only ever next to the kind's icon AND its word. Never color-only.
- No red anywhere for overdue or unfinished work. Use the word ("Was due Tue") in `text-muted`. `text-warn` only for real errors (sync failed).
- No purple, no gradient meshes, no glassmorphism except the sidebar and the Dock, no emoji as UI, no sparkle icons.
- Radii: `rounded-xl` 28px (big panels, Sort card), `rounded-lg` 18px (cards, sheets), `rounded-md` 12px (inputs, rows), `rounded-sm` 8px (chips/keys), `rounded-full` (pills, Dock, buttons). Inner radius = outer − padding.
- Shadows: `shadow-1` resting cards, `shadow-2` the Dock and floating sheets only.

## Type
- System stack only (`font-sans` → SF Pro on Apple devices). `font-mono` (SF Mono) for keyboard hints and codes.
- Body 17px / 1.47 (Apple's default). Never below 15px for content, 13px for metadata.
- Headings weight 600, tracking −0.03em, `text-wrap: balance`. Marketing hero: `clamp(2.6rem, 7vw, 5rem)`.
- Numbers (counts, dates, codes): `tnum`.

## Layout
- **Capture (phone):** full-height, safe-area padded (`env(safe-area-inset-*)`). Top: tiny wordmark + sync status in words. Middle: big textarea (autofocused, 20px). Bottom: the Dock row with Mic, Photo, and **Save** (pill, accent). After save: the field clears, a toast says "Saved to your inbox" with Undo, and a list of "Today's captures" (last 5, read-only) sits below. No categories, no tags, no dates, ever.
- **DeskOS (≥1024px):** three panes. Sidebar 248px (Inbox with count, Today, Tasks, Calendar, Spaces list, Archive; Pair phone; settings) → list 360px → detail (flex). The Dock is a floating pill centered at the bottom of the list+detail area. `Sort` button at top of Inbox opens Sort view.
- **DeskOS (<1024px):** single column with a top segmented control; still fully usable on a tablet. On a phone `/desk` works but suggests `/capture`.
- 4/8px spacing scale. 44px min touch targets. Max text measure ~68ch.

## Processing actions (same labels everywhere, same keys everywhere)
| Action | Key | What it does |
|---|---|---|
| Make a Task | `T` | kind=task, optional due date (native `<input type=date>`), stays until done |
| Make an Event | `E` | kind=event, date+time (native `datetime-local`), "Add to Calendar" downloads .ics |
| Move to Space | `M` | pick a space (type to filter, Enter to create new) |
| Develop | `D` | open notes editor under the original text (original text is never altered) |
| Connect | `C` | search other thoughts and link them; links show both ways |
| Keep | `K` | file as Idea/Note/Resource (suggested kind preselected) without making it a task |
| Archive | `A` | out of the way, never deleted; restorable from Archive |
| Undo | `⌘Z` / `U` | reverses the last action, toast shows what was undone |
| Next / previous | `J`/`K` or `↓`/`↑` | (in Sort: `→`/`←`) |
| Capture | `N` or `⌘K` | focus the Dock |
| Shortcuts | `?` | sheet listing all keys |

Every action is also a visible labeled button. Keys are accelerators, never the only path. Single-letter keys are ignored while typing in a field.

## Suggestions (the trained classifier)
- Shown as a quiet chip: "Looks like a **Task**" with the kind's icon, plus one-click "Make it a Task". Never auto-applied. Never moves or deletes anything.
- Settings has "Show suggestions" (on by default). Confidence below 0.45 → no chip.

## Motion (Emil rules, strict)
- Easing `var(--ease-out)` for everything entering; `var(--ease-drawer)` for sheets. Never ease-in.
- Durations: press 140ms, hovers 160ms, list item enter/leave 200ms, sheets 280ms. Only the Sort card advance may reach 320ms.
- **No animation on keyboard-initiated navigation** (J/K, arrow keys move selection instantly).
- Processing a thought in Sort: the card slides 24px toward the action and fades (200ms), next card rises in (`.rise`). This explains "it went somewhere"; it's the one place motion carries meaning.
- Never animate from scale(0). Enter at `opacity 0, translateY(8px), scale(.98)`.
- Hover effects gated behind `@media (hover:hover)`.
- `prefers-reduced-motion` and the in-app "Reduce motion" toggle (`html[data-motion=reduce]`) remove all movement; opacity fades remain.
- No idle loops. The only looping animation is the recording indicator while the mic is live.

## Content language
Gentle, specific, short. Halve the words.
- Empty inbox: "Inbox clear. Nothing's waiting on you." Never "0 items".
- Overdue: "Was due Tue". Never "OVERDUE", never red, no streaks, no scores, no guilt.
- Save button: "Save". Toast: "Saved to your inbox".
- Archive toast: "Archived. Undo". Never "Deleted".
- Sync status (always in words + icon): "Saved", "Saving…", "Offline, will sync when you're back", "Couldn't find this dock".

## Accessibility floor (testable; see ACCESSIBILITY_AUDIT.md)
- WCAG 2.2 AA contrast: body ≥4.5:1, large text/icons ≥3:1, both themes.
- Visible focus ring on everything (global `:focus-visible`, 3px accent).
- Every control is a real `<button>`, `<a>`, `<input>`, or `<select>` with a visible label or `aria-label`. Icon-only buttons need `aria-label` + `title`.
- Landmarks: `<nav aria-label="Spaces">`, `<main>`, list is `role="listbox"` with `aria-activedescendant` OR a plain list of buttons; pick one and be consistent.
- Live regions: toasts and sync status use `aria-live="polite"`.
- Skip link "Skip to inbox" on desk.
- Modals/sheets use native `<dialog>` with `showModal()` (focus trap + Esc for free) and return focus to the trigger.
- Reversible: archive and every processing action can be undone. Nothing is ever hard-deleted from the UI except from Archive, with a confirm.
- Theme: follows system; manual Light/Dark/System toggle + "Reduce motion" toggle in Settings.

## Data layer (built; use it, don't fork it)
- `lib/types.ts` — `Item`, `Space`, `Dock`, `Op`, `KINDS`, `KIND_LABEL`.
- `lib/client.ts` — `useDock(id)` → `{ dock, state, apply(ops, undo?), undo(), lastUndo }`; `newItem`, `edit`, `newId`, `getSavedDock/saveDock`, `createDock(demo)`, `requestPair`, `redeemPair`, `uploadMedia`, `mediaUrl`, `blobToDataUrl`, `downloadIcs`.
- `lib/classifier.ts` — `suggestKind(text)` → `{ kind, confidence, scores }`.
- Server: `lib/dock.ts` (Upstash Redis, in-memory fallback), routes under `app/api/`.
- Every mutation goes through `apply()` with an inverse for undo: `apply([{op:"put", item: next}], { label: "Made a task", ops: [{op:"put", item: prev}] })`.
