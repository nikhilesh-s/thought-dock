# Design report (shared draft)

- **Google Doc (edit here):** https://docs.google.com/document/d/1b8bCepJPZY-kB1zPDJ3LvWnoKIJcGlW-S-FvebNpdnI/edit (in the team's "Engineering 1 Mini Hackathon Project" Drive folder).
- **Shared draft.** Each student copies it and turns it into their own report, as the course requires. Yellow highlights mark the parts a person must fill in. Don't invent test results or decision-matrix scores.

## Regenerating
```bash
uv run python docs/report/make_figures.py
node docs/report/render_figures.mjs
uv run --with python-docx python docs/report/build_report.py
```

## What the files are
- `make_figures.py`: generates the dimensioned layout SVGs, the architecture diagram and the user flow. The dimensions were measured on the live app.
- `render_figures.mjs`: renders those SVGs to PNG and captures the concept cards from /jared.
- `source/`: Nikhilesh's hand-drawn Prism Dock drawing (PDF and PNG), plus the AI-generated concept render.
