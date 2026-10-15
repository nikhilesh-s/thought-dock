# Test report

Results from real runs only.

## 2026-10-15: main @ deploy to production

| Check | Command | Result |
|---|---|---|
| Types | `npx tsc --noEmit` | pass (exit 0) |
| Lint | `npm run lint` | pass, 0 problems |
| Build | `npm run build` | pass; routes `/`, `/capture`, `/desk`, `/jared`, `/brag`, 4 API routes |
| Classifier | `npm run test:model` | 16 checks passed |
| Contrast | `npm run check:contrast` | 16/16 pairs pass AA in both themes |
| Model eval | `npm run train` | held-out accuracy 85.8%, macro-F1 85.7%; 5-fold CV 84.9% ± 1.6% (see docs/MODEL_CARD.md) |
| 3D export | `node scripts/export-stl.ts` | STL written; volume and bounding-box assertions pass |
| Production smoke | curl against https://thought-dock-peach.vercel.app | all pages + `/brag.mp4` + STL return 200; demo dock created (7 items, 4 spaces) in Upstash Redis; pair code redeemed to the same dock; PATCH put → GET shows item; malformed op → 400 |
| Desk actions | headless Playwright, run by the build agent (not saved as a file) | 17 action checks passed against server state, no console errors |

## Not tested yet
- A real phone: mic, live transcript, camera, and offline queue on cellular.
- Screen reader pass.
- Usability test with a student (docs/USABILITY_TEST.md).
