# Palette change: how to present it in the report

Facts only; do not claim a formal usability test unless one was run (docs/USABILITY_TEST.md is still "not yet run").

**What happened.** A teammate (Maryam) reviewing the app said the single look was not enough: not everyone wants the same dark theme, and a more personal, pleasant interface would attract more students. We added a Colors picker in Settings with 8 options (Classic + 7 palettes). The pick applies instantly and is remembered on that device.

**Lesson (suggested wording, Section 7).**
- Specific problem: one fixed look (light/dark following the system) did not fit every student's taste.
- Change: palettes added as design tokens; the contrast script was extended so every palette keeps text at 4.5:1 or better, so personalization never costs readability.
- Result: the change touched only the stylesheet, Settings and one startup script; capture, saving thoughts and turning them into tasks/events were not modified. Checks: type check, lint, tests, build and contrast all pass.
- Reflection hooks: personalization is an accessibility feature (comfort, light sensitivity), not decoration; token-based design made it cheap; a design check that is automated (contrast) lets the team add options safely.

**Where it connects to the rubric.** Iterate step (Table 2), Lessons Learned (Section 7), Table 1 criterion C5 (contrast now covers 9 themes, lowest 4.66:1), and the Appendix A AI-use paragraph (Claude Code implemented it from Maryam's spec).

**Do not write:** that palettes came from a usability test, or any user quote, unless it really happened.
