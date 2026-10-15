import { Pending, Sub, captionCls, tableCls, tdCls, thCls } from "./ui";

const TASKS = [
  "On the phone, capture the application deadline and the link.",
  "On the laptop, find that thought and turn the deadline into a task with a due date.",
  "Save the link in a space called Engineering. Create the space if it doesn't exist.",
  "Undo your last action, then redo it.",
];

const MEASURES = [
  ["Completion", "Done alone, done with a hint, or not done"],
  ["Time on task", "Seconds from first touch to done"],
  ["Errors", "Wrong action, wrong space, lost thought"],
  ["Ease", "Single Ease Question, 1 (very hard) to 7 (very easy)"],
  ["Comments", "Think-aloud notes, in the participant's words"],
];

const SCRIPT = [
  "Thanks for helping. We're testing the app, not you. There are no wrong answers.",
  "Please think out loud: say what you're looking for and what you expect to happen.",
  "Hand over the scenario card. Ask them to read it aloud, then start whenever they're ready.",
  "I can't help during a task, but you can stop any time.",
  "Afterward: What was easiest? What was confusing? Would you use this? Why or why not?",
];

export function UsabilityTest() {
  return (
    <div id="usability-test" className="mt-24 scroll-mt-28">
      <Sub>Usability test plan</Sub>
      <p className="mt-2 max-w-[62ch] text-[16px] text-text-2">
        A moderated think-aloud test with 3 to 5 students on their own phones and a paired laptop. Ideally at least one
        participant navigates with the keyboard only.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-line bg-surface p-6 sm:p-7">
          <p className="text-[13px] font-semibold text-muted">Scenario</p>
          <p className="mt-2 text-[19px] leading-[1.4] font-medium tracking-[-0.02em] text-text">
            “Capture an application deadline and useful link on your phone. Later, turn the deadline into a task and save
            the link in an Engineering space.”
          </p>
          <p className="mt-6 text-[13px] font-semibold text-muted">Tasks</p>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-[15px] text-text-2">
            {TASKS.map((t) => <li key={t}>{t}</li>)}
          </ol>
        </div>
        <div className="rounded-lg border border-line bg-surface p-6 sm:p-7">
          <p className="text-[13px] font-semibold text-muted">Moderator script</p>
          <ol className="mt-2 space-y-2.5 text-[15px] text-text-2">
            {SCRIPT.map((s, i) => (
              <li key={i} className="flex gap-3"><span className="tnum text-muted">{i + 1}</span><span>{s}</span></li>
            ))}
          </ol>
        </div>
      </div>

      <dl className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-5">
        {MEASURES.map(([k, v]) => (
          <div key={k} className="border-t border-line-strong pt-3">
            <dt className="text-[15px] font-semibold text-text">{k}</dt>
            <dd className="mt-1 text-[14px] text-text-2">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 overflow-x-auto">
        <table className={`${tableCls} min-w-[640px]`}>
          <caption className={captionCls}>
            <span className="text-[17px] font-semibold text-text">Results: not yet run, team to record</span>
          </caption>
          <thead>
            <tr>{["Participant", "Task 1", "Task 2", "Task 3", "Task 4", "Ease (1–7)", "Notes"].map((h) => <th key={h} scope="col" className={thCls}>{h}</th>)}</tr>
          </thead>
          <tbody>
            {["P1", "P2", "P3", "P4", "P5"].map((p) => (
              <tr key={p}>
                <th scope="row" className={`${tdCls} font-semibold text-text`}>{p}</th>
                {Array.from({ length: 6 }, (_, i) => (
                  <td key={i} className={`${tdCls} text-muted`}><span aria-hidden>—</span><span className="sr-only">not recorded</span></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-5"><Pending>No sessions have been run. Results and the changes they lead to will be added here by the team.</Pending></div>
    </div>
  );
}
