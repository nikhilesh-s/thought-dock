# What past reports teach us

The class Notion page has 11 past ENGR 1 / ENGR10 report PDFs. We reviewed them against the rubric
and the instructor's example report ("Constructing the Death Star II"). None of them is strong on every
rubric item. The best two are the Speaker Support System report and the Accessible Game Controller
(both the slides and the report).

## What we copy

1. **A title page**, then section headings named exactly as the rubric names them, in rubric order.
   (The Speaker Support report did this and was the easiest to grade.)
2. **Measurable design criteria.** Numbers, not adjectives. For us:
   - capture in ≤1 tap and ≤5 seconds
   - 0 required choices at capture
   - WCAG AA contrast (4.5:1) in both themes
   - every action reachable by keyboard
   - runs free and with no account
3. **Three genuinely different concepts**, each under its own heading:
   - a sketch beside one paragraph
   - the reason it was rejected

   Ours are the NFC dock, Capture → DeskOS, and the AI auto-organizer. They really are different
   ideas; some past reports only had three versions of one design.
4. **A weighted decision matrix in the instructor's format.** Concepts as columns, weights summing
   to 1.0, scores out of 10, weighted-score columns, a totals row, and a written paragraph explaining
   the winner. No past report fully got this right. Doing it well is an easy way to stand out.
5. **A formal drawing sheet for the dimensioned drawing.** Title block, units, scale, front/top/right
   views, and callouts like Ø30 × 1.2 DP. We already have this for the NFC dock.
6. **Figure numbers and captions on every image**, kept inside the page margins.
7. **One worked calculation with units.** For example:
   - the classifier's accuracy on held-out data
   - storage per voice note (60 s × 24 kbps ≈ 180 KB)
   - expected sync delay (4 s polling)
8. **Lessons tied to a specific problem and the change it caused.** Example: the contrast check
   failed at 4.31:1, so the accent color was darkened to 5.11:1.
9. **Real references** (academic sources on cognitive load, executive function, accessibility),
   cited in the text. Almost every past report had none or web links only.
10. **Third person throughout.** Nearly every past report used "I" or "we", and the rubric
    penalizes it.

## Software projects specifically
Both past software projects (computer vision, face tracking) simply skipped the dimensioned drawing.
We should not. Our plan:
- **Dimensioned NFC dock drawing.** This is the physical product-design study, and it's done.
- **Dimensioned screen layouts of the final design.** Capture on a 390 × 844 pt phone and DeskOS at
  1440 × 900, with pane widths (248 / 360 / flexible px), 44 px touch targets, 28/18/12 px radii and
  type sizes. This covers "fully dimensioned drawing of the final design", since the app is the
  final design.
- **A system block diagram** (phone → API → Redis → desk) and a **user-flow diagram**.

## Mistakes to avoid
- A matrix with no weights or totals, or one that compares materials instead of the concepts.
- Only two concepts, or three versions of the same idea.
- Brainstorms of the site instead of the design.
- An analysis that is listed but never interpreted.
- Numbers that contradict each other.
- Stock images, watermarked images, or uncited statistics.
- Personal excuses in the text.

## Length
The strongest reports run 8–11 pages. The instructor's own example is about 3 pages but has no
diagrams. Target about 10 pages including figures.
