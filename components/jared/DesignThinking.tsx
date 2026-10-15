import { Card, Method, Pending, Section, Sub, Tag, captionCls, tableCls, tdCls, thCls } from "./ui";
import { CheckIcon } from "@/components/Icons";

const STAGES = [
  ["Empathize", "Listed the moments students lose thoughts: commutes, lectures, shifts, late nights. Drafted proto-personas."],
  ["Define", "Wrote one point-of-view statement and five How Might We questions."],
  ["Ideate", "Brainstormed 20 ideas, clustered them, and shaped three distinct concepts."],
  ["Prototype", "Wireframes, then a coded Capture and DeskOS with real sync."],
  ["Test", "Wrote a usability script. Sessions are next; results will be recorded here."],
];

const HMW = [
  "How might we let a student save a thought in under five seconds, one-handed, without choosing anything?",
  "How might we make sorting feel like a short task with an end, instead of a pile that keeps growing?",
  "How might we offer structure, like “this looks like a task”, without taking the decision away?",
  "How might we make the tool free to use with no account, no purchase, and no extra hardware?",
  "How might we keep the app calm for students who already feel anxious about unfinished work?",
];

type Idea = { t: string; built?: boolean };
const WALL: { cluster: string; ideas: Idea[] }[] = [
  { cluster: "Capture", ideas: [
    { t: "One text field, nothing else", built: true }, { t: "Voice note button", built: true }, { t: "Photo of a whiteboard", built: true },
    { t: "Works offline, syncs later", built: true }, { t: "Lock-screen widget" }] },
  { cluster: "Sorting", ideas: [
    { t: "Sort one thought at a time", built: true }, { t: "Turn a thought into a task", built: true }, { t: "Turn it into a calendar event", built: true },
    { t: "Spaces per class", built: true }, { t: "Link related thoughts", built: true }] },
  { cluster: "Hardware", ideas: [
    { t: "NFC dock on the desk" }, { t: "Tap phone to enter Desk Mode" }, { t: "Physical inbox light" }] },
  { cluster: "Help & AI", ideas: [
    { t: "Suggest a type, user confirms", built: true }, { t: "Auto-file everything with AI" }, { t: "Daily digest email" }] },
  { cluster: "Calm", ideas: [
    { t: "Undo on every action", built: true }, { t: "No red overdue badges", built: true }, { t: "Pair with a QR code, no login", built: true }, { t: "Streaks and points" }] },
];

const CONCEPTS = [
  { n: 1, name: "NFC Thought Dock", status: "Not chosen", sketch: <SketchDock />,
    idea: "A small stand on the desk with an NFC tag. Tap your phone on it and the app switches into Desk Mode.",
    why: "Costs money to make, needs a device in a specific place, and makes a physical object a requirement for access. We kept it as our 3D product-design study." },
  { n: 2, name: "Capture Mode → DeskOS", status: "Selected", sketch: <SketchSplit />,
    idea: "Software only. A phone screen that does one thing, capture, and a desktop workspace for sorting when you sit down.",
    why: "Free, works on devices students already own, keeps every decision with the user, and is buildable and demoable in a hackathon." },
  { n: 3, name: "AI-first organizer", status: "Not chosen", sketch: <SketchAi />,
    idea: "Dump thoughts in and an AI model files them automatically into tasks, events, and folders.",
    why: "Removes user control and can misfile something silently. Needs paid APIs. We kept a small, local suggestion model instead." },
];

const CRITERIA: [string, string, string, string][] = [
  ["Accessibility", "Requires a physical object at a desk", "Runs on a phone and any browser", "Accessible UI possible; errors hard to notice"],
  ["Mental effort at capture", "Low once docked, but you have to get to the dock", "Lowest: one field, no choices", "Low at capture, high when checking its filing"],
  ["Cost", "Parts, printing, NFC tags", "Free tiers only", "Ongoing API cost per thought"],
  ["Feasibility in the time", "Hardware plus software", "Software we can finish and polish", "Depends on prompt quality and API limits"],
  ["Ease of demo", "Needs the physical dock in the room", "Two screens, live, on any laptop", "Results vary run to run"],
  ["User control", "Full", "Full: suggestions only, undo everywhere", "Low: the model decides first"],
  ["Distinctiveness", "Most distinctive object", "Distinct split between capture and sorting", "Many similar products exist"],
];

export function DesignThinking() {
  return (
    <Section id="design-thinking" n="02" eyebrow="d.school design thinking" band
      title="From a crowded head to one clear point of view."
      lead="We followed the Stanford d.school sequence, looping back from prototype to define more than once.">
      <Method
        what="A human-centered process in five modes: understand people (Empathize), frame the problem (Define), generate many options (Ideate), make them real cheaply (Prototype), and learn from users (Test)."
        how="We moved through all five and looped back when a prototype exposed a conflict. A category picker on the capture screen, for example, clashed with our point of view, so we returned to Define and cut it."
        changed="The POV statement became the rule for the capture screen: if a control asks the user to decide something, it does not belong there."
      />

      <ol className="mt-20 grid gap-8 md:grid-cols-5 md:gap-0" aria-label="Design thinking stages">
        {STAGES.map(([t, d], i) => (
          <li key={t} className="relative md:pr-6">
            <div className="flex items-center gap-3 md:block">
              <span className={`grid size-9 shrink-0 place-items-center rounded-full text-[14px] font-semibold tnum ${i === 4 ? "border border-line-strong bg-bg text-text" : "bg-ink text-on-ink"}`}>{i + 1}</span>
              <span aria-hidden className="absolute top-[18px] left-11 hidden h-px w-[calc(100%-2.75rem)] bg-line-strong md:block" />
              <p className="text-[19px] font-semibold tracking-[-0.02em] text-text md:mt-4">{t}</p>
            </div>
            <p className="mt-2 text-[15px] text-text-2 md:pr-2">{d}</p>
          </li>
        ))}
      </ol>

      <div className="mt-24 grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="p-7 sm:p-10">
          <p className="text-[13px] font-semibold text-muted">Point of view</p>
          <p className="mt-4 text-[clamp(1.25rem,2.2vw,1.6rem)] leading-[1.35] font-medium tracking-[-0.02em] text-text">
            A busy student needs a way to get a thought out of their head the moment it shows up, without deciding what it
            is, because deciding right then is what makes them drop the thought or lose their focus.
          </p>
        </Card>
        <div>
          <p className="text-[13px] font-semibold text-muted">How might we…</p>
          <ol className="mt-4 divide-y divide-line border-y border-line">
            {HMW.map((q, i) => (
              <li key={q} className="flex gap-4 py-4 text-[16px] text-text">
                <span className="tnum text-muted">{i + 1}</span>{q}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Sub>Brainstorm wall</Sub>
          <p className="flex items-center gap-2 text-[13px] text-muted">
            <span className="inline-flex items-center gap-1 text-[12px] font-medium text-accent"><CheckIcon size={12} /> In the build</span>
            marks ideas that made it into the app
          </p>
        </div>
        <div className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
          {WALL.map((c) => (
            <section key={c.cluster} aria-label={`${c.cluster} ideas`}>
              <h4 className="border-b border-line-strong pb-2 text-[13px] font-semibold text-text">{c.cluster}</h4>
              <ul className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-1">
                {c.ideas.map((idea) => (
                  <li key={idea.t} className="note-tilt flex min-h-[84px] flex-col justify-between rounded-sm border border-line bg-surface p-3 text-[14px] leading-[1.3] text-text shadow-1">
                    {idea.t}
                    {idea.built ? (
                      <span className="mt-2 inline-flex w-fit items-center gap-1 text-[12px] font-medium text-accent">
                        <CheckIcon size={12} /> In the build
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      <div className="mt-24">
        <Sub>Three concepts</Sub>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {CONCEPTS.map((c) => {
            const sel = c.status === "Selected";
            return (
              <article key={c.n} className={`flex flex-col rounded-lg border bg-surface p-6 ${sel ? "border-accent ring-1 ring-accent" : "border-line"}`}>
                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-muted">Concept {c.n}</p>
                  <Tag tone={sel ? "accent" : "plain"}>{sel ? <CheckIcon size={12} /> : null}{c.status}</Tag>
                </div>
                <div className="mt-4 rounded-md border border-line bg-bg p-4 text-text">{c.sketch}</div>
                <h4 className="mt-5 text-[21px] font-semibold tracking-[-0.03em] text-text">{c.name}</h4>
                <p className="mt-2 text-[15px] text-text-2">{c.idea}</p>
                <p className="mt-4 border-t border-line pt-4 text-[15px] text-text-2">
                  <span className="font-semibold text-text">{sel ? "Why we chose it. " : "Why not. "}</span>{c.why}
                </p>
              </article>
            );
          })}
        </div>
      </div>

      <div className="mt-24">
        <div className="overflow-x-auto">
          <table className={`${tableCls} min-w-[860px]`}>
            <caption className={captionCls}>
              <span className="text-[1.5rem] font-semibold tracking-[-0.03em] text-text">Decision matrix</span>
              <span className="mt-1 block">Criteria and our qualitative reasoning. Weights and 1–5 scores are left for the team to fill in together.</span>
            </caption>
            <thead>
              <tr>
                <th scope="col" className={thCls}>Criterion</th>
                <th scope="col" className={`${thCls} w-20`}>Weight</th>
                <th scope="col" className={thCls}>1 · NFC dock</th>
                <th scope="col" className={`${thCls} bg-accent-soft`}>2 · Capture → DeskOS</th>
                <th scope="col" className={thCls}>3 · AI organizer</th>
              </tr>
            </thead>
            <tbody>
              {CRITERIA.map(([k, a, b, c]) => (
                <tr key={k}>
                  <th scope="row" className={`${tdCls} font-semibold text-text`}>{k}</th>
                  <td className={`${tdCls} text-muted`}>—<span className="sr-only">weight not set</span></td>
                  <td className={tdCls}>{a}<Score /></td>
                  <td className={`${tdCls} bg-accent-soft`}>{b}<Score /></td>
                  <td className={tdCls}>{c}<Score /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5"><Pending>Scores pending team evaluation. Luke and Maryam will set weights and score each concept.</Pending></div>
      </div>
    </Section>
  );
}

function Score() {
  return <span className="mt-1.5 block text-[13px] text-muted">Score: <span aria-hidden>—</span><span className="sr-only">not yet scored</span></span>;
}

const sk = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function SketchDock() {
  return (
    <svg viewBox="0 0 240 120" className="h-auto w-full" role="img" aria-labelledby="sk1">
      <title id="sk1">Sketch: phone leaning in a desk stand, NFC waves near the base</title>
      <path {...sk} d="M40 100h150l-10-18H54z" />
      <path {...sk} d="M98 82 128 22M112 82l30-58" />
      <rect {...sk} x="106" y="18" width="24" height="70" rx="5" transform="rotate(26 118 53)" />
      <path {...sk} stroke="var(--accent)" d="M150 92c6-4 6-12 0-16M158 96c10-7 10-21 0-28" />
      <path {...sk} opacity=".5" d="M20 108h200" />
    </svg>
  );
}
function SketchSplit() {
  return (
    <svg viewBox="0 0 240 120" className="h-auto w-full" role="img" aria-labelledby="sk2">
      <title id="sk2">Sketch: a phone with one text field, an arrow, and a laptop showing one thought with action buttons</title>
      <rect {...sk} x="20" y="18" width="46" height="86" rx="9" />
      <path {...sk} d="M30 34h26M30 42h18" />
      <rect {...sk} stroke="var(--accent)" x="40" y="88" width="18" height="8" rx="4" />
      <path {...sk} d="M78 61h30m-7-6 7 6-7 6" />
      <rect {...sk} x="120" y="22" width="100" height="66" rx="6" />
      <path {...sk} d="M110 96h120" />
      <rect {...sk} x="140" y="34" width="60" height="26" rx="4" />
      <path {...sk} d="M136 72h14M156 72h14M176 72h14M196 72h8" />
    </svg>
  );
}
function SketchAi() {
  return (
    <svg viewBox="0 0 240 120" className="h-auto w-full" role="img" aria-labelledby="sk3">
      <title id="sk3">Sketch: an inbox feeding a closed box that sends thoughts into three folders automatically</title>
      <path {...sk} d="M18 50h40l6 14v22H18V64z" />
      <path {...sk} d="M66 70h22m-6-5 6 5-6 5" />
      <rect {...sk} x="96" y="46" width="48" height="48" rx="8" />
      <path {...sk} d="M112 64h16M112 74h10" opacity=".6" />
      <path {...sk} d="M150 58l22-20M150 70h22M150 82l22 20" />
      <path {...sk} d="M178 30h14l4 4h20v14h-38zM178 62h14l4 4h20v14h-38zM178 94h14l4 4h20v14h-38z" />
    </svg>
  );
}
