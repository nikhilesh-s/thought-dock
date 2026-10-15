# Accessibility audit

Each claim is listed with its evidence and one of three statuses:

- **Verified:** checked with a reproducible command, or by reading the code.
- **Agent-checked:** the build agent tested it in a headless browser during development; the test isn't saved as a file.
- **Unverified:** a person still needs to check it.

Last updated 2026-10-15.

| # | Claim | Evidence | Status |
|---|---|---|---|
| 1 | Text contrast meets WCAG 2.2 AA (≥4.5:1) in light and dark | `npm run check:contrast` checks 16 token pairs × 2 themes; all pass (lowest: muted on bg, 4.66:1 light). The light accent was raised from #0071e3 (4.31:1, failed) to #0066cc (5.11:1) because of this check | Verified |
| 2 | Meaning never relies on color alone | Kind chips and rows always show an icon plus the word (`KIND_ICON` + `KIND_LABEL`); sync status is shown in words | Verified (code) |
| 3 | No red or guilt signals for unfinished work | No red token exists; overdue reads "Was due Tue" in muted text; no streaks or scores (DESIGN.md) | Verified (code) |
| 4 | Visible focus on every control | Global `:focus-visible` gives a 3px accent outline (4.3:1+ against backgrounds, above the 3:1 non-text minimum) | Verified (code) · Unverified (visual pass on every screen) |
| 5 | Every desk action works from the keyboard | Keys T/E/M/D/C/K/A, U and ⌘Z undo, J/↓/↑, N/⌘K, `?` sheet; single-letter keys are ignored while typing | Agent-checked (17 headless checks of actions against server state) · Unverified by a person |
| 6 | Dialogs trap focus, close with Esc and return focus | Native `<dialog>` + `showModal()` | Verified (code) · Unverified (manual) |
| 7 | Reduced motion | `prefers-reduced-motion` and the in-app toggle (`html[data-motion=reduce]`) remove movement and keep opacity fades; 11 code paths honor it; the 3D viewer doesn't auto-spin | Verified (code) · Unverified (manual) |
| 8 | Status changes are announced | `aria-live="polite"` on toasts and sync status (6 regions) | Verified (code) · Unverified (VoiceOver pass) |
| 9 | Skip links | "Skip to inbox" on /desk; "Skip to content" on / and /jared | Verified (code) |
| 10 | Every action is reversible | Undo on every processing action; Archive instead of delete; "Delete forever" only from Archive, with a confirm | Agent-checked |
| 11 | Touch targets ≥44px on the phone | Dock buttons and Save sized at 44px or more | Verified (code) · Unverified (real phone) |
| 12 | Readable type | 17px body, never below 15px for content or 13px for metadata; system font | Verified (code) |
| 13 | Screen reader (VoiceOver) can complete capture → task | n/a | **Unverified.** Team to run |
| 14 | Mic, speech recognition and camera on a real iPhone and Android | n/a | **Unverified.** Headless browsers can't test these |
| 15 | 200% zoom without loss of content | n/a | **Unverified** |

## How to re-check (team)
1. Run `npm run check:contrast`.
2. Unplug the mouse. On `/desk`, process 3 thoughts with keys only, open and close every dialog with Esc, and confirm focus is always visible.
3. On macOS turn on Reduce Motion (System Settings → Accessibility → Display) and repeat Sort; nothing should slide.
4. VoiceOver (⌘F5): capture a thought on `/capture`, then make it a task on `/desk`. Note anything unlabeled.
5. On a phone, record a voice note and take a photo.
