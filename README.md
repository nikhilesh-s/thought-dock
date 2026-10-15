# Thought Dock / DeskOS

**Capture now. Organize later.** Put every thought down on your phone in one tap, then sort it at
your desk when you're ready, one thought at a time.

Live: https://thought-dock-peach.vercel.app

| Route | What it is |
|---|---|
| `/` | Landing page |
| `/capture` | Phone capture: one field, voice notes with live transcript, photos |
| `/desk` | DeskOS: Inbox, Sort, Tasks, Calendar, Spaces, Archive |
| `/jared` | Process portfolio (design thinking, personas, 3D dock, Agile, AI build, code) |
| `/brag` | 25-second launch video |

Made by Luke, Nikhilesh and Maryam for ENGR 1 Mini-Hackathon ("Making an Accessible World").
Built with Claude Code as AI design lead and builder; product decisions are the team's (see
DECISIONS.md).

## Try it
1. Open `/desk` on a laptop. It starts with a few demo thoughts.
2. Click **Pair phone** and scan the QR code with your phone (no account).
3. Capture something on the phone. It shows up in the desk Inbox within a few seconds.
4. Press **Sort**, then use the keys: **T** task, **E** event, **M** move to space, **D** develop,
   **C** connect, **K** keep, **A** archive, **⌘Z** undo, **?** all shortcuts.

## Run locally
```bash
npm install
npm run dev
```
Without Redis credentials, data lives in memory (fine for a demo on one machine). To use the real
database, run `vercel env pull .env.local` (needs access to the Vercel project).

## Checks
```bash
npm run lint && npx tsc --noEmit && npm test && npm run build
```
`npm test` runs the classifier checks and the WCAG contrast check.

Retrain the classifier after adding rows to `data/thoughts.csv`:
```bash
npm run train
```

## Stack
- Next.js 16, React 19, Tailwind v4, `motion`, `three`, `qrcode.react`.
- Upstash Redis (Vercel Marketplace) with an in-memory fallback.
- A from-scratch softmax-regression classifier in TypeScript, run in the browser.
- Hosted on Vercel.

## Docs
- [DESIGN.md](DESIGN.md): design contract (rules)
- [docs/DESIGN_PROCESS.md](docs/DESIGN_PROCESS.md): three directions and the choice
- [PRODUCT_SPEC.md](PRODUCT_SPEC.md) · [DECISIONS.md](DECISIONS.md) · [TASKS.md](TASKS.md)
- [ACCESSIBILITY_AUDIT.md](ACCESSIBILITY_AUDIT.md) · [TEST_REPORT.md](TEST_REPORT.md) · [RUN_LOG.md](RUN_LOG.md)
- [DEMO_SCRIPT.md](DEMO_SCRIPT.md) · [docs/USABILITY_TEST.md](docs/USABILITY_TEST.md)
- [docs/MODEL_CARD.md](docs/MODEL_CARD.md) · [docs/3D_DOCK.md](docs/3D_DOCK.md) · [docs/MARKETING.md](docs/MARKETING.md)

## Team tasks
See the [issues](https://github.com/nikhilesh-s/thought-dock/issues). Anything labeled `team` is
for a person to do. Anything labeled `ai-built` needs a human review before it counts as done.
