import { Method, Pending, Section, Sub, Tag, captionCls, tableCls, tdCls, thCls } from "./ui";

type Persona = {
  initials: string; name: string; who: string; goals: string[]; frustrations: string[]; moment: string; access: string[];
};

const PERSONAS: Persona[] = [
  {
    initials: "DR", name: "Dani", who: "Community-college commuter, works 25 hours a week",
    goals: ["Keep up with three classes between shifts", "Stop finding out about assignments late"],
    frustrations: ["Ideas show up on the bus, with one hand on a pole", "Planner apps want a class, a date, and a priority before saving"],
    moment: "On the bus, remembers the chem quiz moved to Thursday. Types eight words with a thumb, taps Save, pockets the phone.",
    access: ["One-handed use", "Works on a spotty connection", "Large touch targets"],
  },
  {
    initials: "SK", name: "Sam", who: "Second-year student whose attention comes and goes",
    goals: ["Get a thought down before it drifts", "Sit down later to a short, finite list"],
    frustrations: ["Switching apps to file a thought breaks focus in lecture", "Red overdue badges cause avoidance, not action"],
    moment: "Mid-lecture, has an idea for the group project. Says it as a voice note in two seconds and looks back up.",
    access: ["No time pressure or streaks", "Reduced motion option", "Gentle wording, nothing alarming in red"],
  },
  {
    initials: "PN", name: "Priya", who: "Transfer applicant tracking deadlines across six schools",
    goals: ["Never miss an application or scholarship deadline", "Keep links and requirements per school"],
    frustrations: ["Deadlines live in emails, portals, and screenshots", "Calendar entries take too long to make on a phone"],
    moment: "At work, sees a scholarship deadline in an email. Captures the date and link, then turns it into an event at home with one key.",
    access: ["Keyboard-only sorting at the desk", "Calendar export (.ics)", "Clear focus outlines"],
  },
];

const STAGES = ["Thought appears", "Capture", "Put it away", "Sit down", "Sort", "Act"];
const ROWS: [string, string[]][] = [
  ["Actions", ["Notices a deadline or idea", "Opens Capture, types or speaks", "Taps Save, locks phone", "Opens the desk, sees the inbox count", "Sorts one thought at a time", "Works from Tasks, Calendar, Spaces"]],
  ["Thoughts", ["“I’ll forget this.”", "“Where does this go?”", "“It’s safe somewhere.”", "“How much is waiting?”", "“Task. Event. Keep. Next.”", "“I know what’s next.”"]],
  ["Feelings", ["Anxious", "Rushed", "Relieved", "Hesitant", "Focused", "Calm"]],
  ["Opportunities", ["Capture reachable in one tap", "No choices, autofocus, voice", "Toast with Undo; offline queue", "Show the count in words, no red", "Big labeled actions, keys, suggestion chip", "Everything reversible from Archive"]],
];

export function Personas() {
  return (
    <Section id="personas" n="03" eyebrow="Personas and journey map" title="Three people we designed for, before we met them."
      lead="These are proto-personas: assumptions written down on purpose so we can check them against real students.">
      <Method
        what="A persona is a short, specific portrait of a user type: goals, frustrations, context. A journey map follows one person through a task stage by stage, noting actions, thoughts, feelings, and opportunities."
        how="We wrote three proto-personas from our own experience and classmates' situations, then mapped one capture-to-sort journey across all of them."
        changed="Dani made one-handed, offline capture a requirement. Sam ruled out streaks and red badges. Priya made keyboard sorting and calendar export essential."
      />

      <div className="mt-20 grid gap-6 lg:grid-cols-3">
        {PERSONAS.map((p) => (
          <article key={p.name} aria-labelledby={`persona-${p.initials}`} className="flex flex-col rounded-lg border border-line bg-surface p-6 sm:p-7">
            <Tag>Proto-persona · assumption-based, to validate</Tag>
            <div className="mt-5 flex items-center gap-4">
              <span aria-hidden className="grid size-12 place-items-center rounded-full bg-bg-2 text-[15px] font-semibold text-text-2">{p.initials}</span>
              <div>
                <h3 id={`persona-${p.initials}`} className="text-[21px] tracking-[-0.03em]">{p.name}</h3>
                <p className="text-[14px] text-text-2">{p.who}</p>
              </div>
            </div>
            <figure className="mt-6 rounded-md bg-bg p-4">
              <figcaption className="text-[12px] font-semibold text-muted">Capture moment</figcaption>
              <p className="mt-1.5 text-[15px] leading-[1.45] text-text">{p.moment}</p>
            </figure>
            <List title="Goals" items={p.goals} />
            <List title="Frustrations" items={p.frustrations} />
            <List title="Accessibility needs" items={p.access} />
          </article>
        ))}
      </div>

      <div className="mt-24">
        <Sub>Journey map: capture to sort</Sub>
        <div className="mt-8 overflow-x-auto rounded-lg border border-line bg-surface">
          <table className={`${tableCls} min-w-[960px] table-fixed`}>
            <caption className="sr-only">Journey map with six stages across actions, thoughts, feelings, and opportunities</caption>
            <thead>
              <tr>
                <th scope="col" className={`${thCls} w-36`}><span className="sr-only">Row</span></th>
                {STAGES.map((s, i) => (
                  <th key={s} scope="col" className={thCls}>
                    <span className="tnum block text-[12px] font-medium text-muted">{i + 1}</span>{s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([label, cells]) => (
                <tr key={label}>
                  <th scope="row" className={`${tdCls} font-semibold text-text`}>{label}</th>
                  {cells.map((c, i) => (
                    <td key={i} className={`${tdCls} ${label === "Opportunities" ? "text-text" : ""}`}>{c}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className={`${captionCls} mt-3`}>Feelings are hypotheses from the proto-personas, not observations.</p>
        <div className="mt-4"><Pending>Validate personas and journey with 3 to 5 student interviews; replace assumptions with what we hear.</Pending></div>
      </div>
    </Section>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-5">
      <p className="text-[12px] font-semibold text-muted">{title}</p>
      <ul className="mt-1.5 space-y-1 text-[15px] text-text-2">
        {items.map((i) => <li key={i}>{i}</li>)}
      </ul>
    </div>
  );
}
