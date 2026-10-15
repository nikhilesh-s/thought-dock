import { LINKS } from "@/lib/links";
import { Method, Pill, Section, Sub, Tag, captionCls, tableCls, tdCls, thCls } from "./ui";

const ROLES: [string, string, string][] = [
  ["Product and design decisions", "Luke, Nik, Maryam", "Problem, concept choice, what ships, what gets cut"],
  ["AI build", "Claude Code (orchestrator + subagents)", "Design system, code, tests, this portfolio, under the team's direction"],
  ["QA", "The team, plus ChatGPT as a second reviewer", "Usability test, reviewing builds, checking copy and accessibility"],
  ["Report and copy", "Luke and Maryam", "Humanizing copy, project report sections, decision-matrix scoring"],
];

const SPRINTS = [
  ["Sprint 0", "Plan and design", "Problem, personas, concepts, decision matrix criteria, design contract, board set up"],
  ["Sprint 1", "Core flow", "Capture, Inbox, Sort, the processing actions, phone–desk sync, QR pairing"],
  ["Sprint 2", "Accessibility polish", "Keyboard paths, focus, contrast in both themes, reduced motion, undo everywhere, offline queue"],
  ["Sprint 3", "Demo and report", "Usability sessions, report sections, launch video, presentation rehearsal"],
];

const STORIES = [
  { as: "student on the bus", want: "to save a thought with one hand in a few seconds", so: "I don't lose it before I get home",
    ac: ["Capture opens with the cursor in the field", "Save works with no other input", "Shows “Saved to your inbox” with Undo", "Works offline and syncs later"] },
  { as: "student at my desk", want: "to sort my inbox one thought at a time", so: "the pile has a clear end",
    ac: ["Sort shows one thought large", "Every action is a labeled button and a key", "Advancing shows the next thought", "Empty inbox says “Inbox clear. Nothing's waiting on you.”"] },
  { as: "transfer applicant", want: "to turn a captured deadline into a calendar event", so: "it shows up where I already look",
    ac: ["Make an Event takes a date and time", "Add to Calendar downloads a valid .ics file", "Undo restores the original thought"] },
  { as: "keyboard-only user", want: "to do everything without a mouse", so: "I can work at my own speed",
    ac: ["Every control is reachable with Tab", "Focus ring is always visible", "Single-letter keys are ignored while typing"] },
  { as: "student who distrusts automation", want: "suggestions I can ignore", so: "nothing gets filed somewhere I didn't choose",
    ac: ["Suggestion appears as a chip only above 0.45 confidence", "It never moves or changes an item on its own", "Suggestions can be turned off in Settings"] },
];

const BOARD: [string, string[]][] = [
  ["To do", ["Run usability test (3–5 students)", "Score the decision matrix", "Write report sections", "Humanize marketing copy", "Accessibility audit, both themes"]],
  ["In progress", ["Capture screen", "DeskOS and Sort", "Train text classifier", "Landing page"]],
  ["Review", ["Process portfolio (/jared)"]],
  ["Done", ["Design contract and tokens", "Data layer and API routes", "Upstash Redis storage", "Shared icon set"]],
];

export function ProjectManagement() {
  return (
    <Section id="project-management" n="07" eyebrow="Project management" band title="Small sprints, one board."
      lead="We ran the project like a tiny Agile team, with GitHub Projects as our Jira: user stories, sprints, and a kanban board everyone could see.">
      <Method
        what="Agile plans work in short sprints, writes requirements as user stories with acceptance criteria, and makes progress visible on a kanban board so the team can adjust every few days."
        how="Four sprints from planning to demo. Each story has testable acceptance criteria, and the board shows who owns each card and where it stands."
        changed="Writing accessibility as user stories made it part of the definition of done. The core flow isn't finished until the keyboard and undo criteria pass."
      />

      <div className="mt-20 overflow-x-auto">
        <table className={`${tableCls} min-w-[640px]`}>
          <caption className={captionCls}><span className="text-[1.5rem] font-semibold tracking-[-0.03em] text-text">Roles</span></caption>
          <thead><tr><th scope="col" className={thCls}>Role</th><th scope="col" className={thCls}>Who</th><th scope="col" className={thCls}>Owns</th></tr></thead>
          <tbody>
            {ROLES.map(([r, w, o]) => (
              <tr key={r}><th scope="row" className={`${tdCls} font-semibold text-text`}>{r}</th><td className={`${tdCls} text-text`}>{w}</td><td className={tdCls}>{o}</td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-24">
        <Sub>Sprint plan</Sub>
        <ol className="mt-8 grid gap-4 md:grid-cols-4">
          {SPRINTS.map(([n, t, d]) => (
            <li key={n} className="rounded-lg border border-line bg-surface p-5">
              <p className="text-[13px] font-semibold text-muted">{n}</p>
              <p className="mt-1 text-[19px] font-semibold tracking-[-0.02em] text-text">{t}</p>
              <p className="mt-2 text-[15px] text-text-2">{d}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-24">
        <Sub>User stories</Sub>
        <ul className="mt-8 grid gap-4 lg:grid-cols-2">
          {STORIES.map((s) => (
            <li key={s.as} className="rounded-lg border border-line bg-surface p-6">
              <p className="text-[17px] leading-[1.45] text-text">
                As a <strong className="font-semibold">{s.as}</strong>, I want {s.want}, so that {s.so}.
              </p>
              <p className="mt-4 text-[12px] font-semibold text-muted">Acceptance criteria</p>
              <ul className="mt-1.5 space-y-1 text-[15px] text-text-2">
                {s.ac.map((a) => (
                  <li key={a} className="flex gap-2"><span aria-hidden className="mt-[9px] size-1.5 shrink-0 rounded-full bg-muted" />{a}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Sub>Board snapshot</Sub>
            <p className="mt-2 text-[15px] text-text-2">A static copy from October 15, 2026. The live board is the source of truth.</p>
          </div>
          <Pill href={LINKS.project} external>Open the live board</Pill>
        </div>
        <div className="mt-8 overflow-x-auto">
          <div className="grid min-w-[880px] grid-cols-4 gap-4">
            {BOARD.map(([col, cards]) => (
              <section key={col} aria-label={`${col}, ${cards.length} cards`} className="rounded-lg bg-bg-2 p-3">
                <h4 className="flex items-center justify-between px-1 pb-3 text-[13px] font-semibold text-text">
                  {col} <span className="tnum font-normal text-muted">{cards.length}</span>
                </h4>
                <ul className="space-y-2">
                  {cards.map((c) => (
                    <li key={c} className="rounded-md border border-line bg-surface p-3 text-[14px] text-text shadow-1">
                      {c}
                      {col === "To do" ? <span className="mt-2 block"><Tag>Team</Tag></span> : null}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
        <p className="mt-6 max-w-[70ch] text-[15px] text-text-2">
          <span className="font-semibold text-text">Teammate tasks.</span> Luke and Maryam own the humanized copy, the project
          report sections, the usability test, and the decision-matrix scoring.
        </p>
      </div>
    </Section>
  );
}
