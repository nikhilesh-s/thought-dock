# Decisions

Significant choices, newest last. Each entry says who decided: **Team** means Nikhilesh answered a
question during planning; **AI** means the design/build agent's default, open to change.

| # | Date | Decision | Why | By |
|---|---|---|---|---|
| 1 | 2026-10-15 | Software only, no required hardware; NFC dock kept as a 3D design study | Cost, accessibility of requiring an object, demo reliability | Team (handoff doc) |
| 2 | 2026-10-15 | Name stays **Thought Dock / DeskOS** | Team preference | Team |
| 3 | 2026-10-15 | Phone ↔ desk sync by **pairing code / QR, no accounts** | No sign-up friction; the same pattern Cage proved | Team |
| 4 | 2026-10-15 | Storage: **Upstash Redis via Vercel Marketplace** (free tier), not Supabase | Team couldn't use Supabase; Redis hashes per dock avoid write conflicts; already installed on the team's Vercel account | AI |
| 5 | 2026-10-15 | The dock ID is a 22-character random secret that acts as a bearer key; pairing codes are 6 characters with a 10-minute TTL | Accounts aren't needed and the ID is unguessable. Ceiling: anyone holding the ID can read the dock, so treat it like a password | AI |
| 6 | 2026-10-15 | Voice notes: record audio (≤60 s, 24 kbps) + **free browser speech recognition** for the transcript | No paid API; works in Chrome and Safari. Firefox gets audio only | Team |
| 7 | 2026-10-15 | Media stored as data URLs in Redis (≤~650 KB) instead of Blob storage | One storage service. Ceiling: Upstash 1 MB request cap; move to Vercel Blob if longer notes are needed | AI |
| 8 | 2026-10-15 | **Train a classifier from scratch** (logistic regression in TypeScript) for kind suggestions | Qualifies for the "Best Use of AI" award; runs on-device; suggestions only | Team |
| 9 | 2026-10-15 | Events: in-app agenda + **.ics download** instead of Google Calendar OAuth | Works with every calendar app, no OAuth setup | Team |
| 10 | 2026-10-15 | Design direction **Quiet Desk** with Sort + the Dock (see docs/DESIGN_PROCESS.md) | Lowest cognitive load, strongest accessibility, buildable in a week | AI (team to approve) |
| 11 | 2026-10-15 | Light + dark following the system, with a manual toggle | Students work late; Apple convention | Team |
| 12 | 2026-10-15 | No shadcn/ui; native elements (`<dialog>`, `<input type=date>`) + Tailwind tokens | Native dialogs give a focus trap and Esc for free and need fewer dependencies. The handoff listed shadcn as the default stack; this is a deliberate deviation | AI |
| 13 | 2026-10-15 | Motion with CSS + `motion` only where interruptible; no animation on keyboard navigation | Emil Kowalski's rules (emil-design-eng skill) | AI |
| 14 | 2026-10-15 | Agile board on **GitHub Projects**. AI-built issues are labeled `ai-built` and need a human review tick; teammate tasks are real human tasks | Shows real Agile practice honestly. No fabricated history | Team |
| 15 | 2026-10-15 | Public repo `nikhilesh-s/thought-dock` | Instructor and teammates can see it without invites | Team |
| 16 | 2026-10-15 | `/jared` = process portfolio for the instructor; `/brag` = 30–60 s launch video | Team | Team |
| 17 | 2026-10-15 | Build with one orchestrating agent + parallel subagents in isolated git worktrees | Separate file ownership, so merges stay clean; covered on /jared as the long-horizon AI task | AI |
