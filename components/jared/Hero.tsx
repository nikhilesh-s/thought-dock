import { ArchiveIcon, EventIcon, KeepIcon, MicIcon, PhotoIcon, SpaceIcon, TaskIcon, CheckIcon } from "@/components/Icons";
import { LINKS } from "@/lib/links";
import { Pill } from "./ui";

const TEAM = ["Luke", "Nikhilesh (Nik)", "Maryam"];

export function Hero() {
  return (
    <section id="top" aria-labelledby="top-h" className="overflow-hidden">
      <div className="mx-auto max-w-[1120px] px-4 pt-16 pb-24 sm:px-6 md:pt-24 md:pb-32">
        <p className="rise text-[15px] font-medium text-muted">ENGR 1 Mini-Hackathon · Process portfolio</p>
        <h1 id="top-h" className="rise mt-4 max-w-[14ch] text-[clamp(2.6rem,7vw,5rem)] leading-[1.02]">
          How we built Thought Dock
        </h1>
        <p className="rise mt-6 max-w-[38ch] text-[clamp(1.25rem,2.2vw,1.5rem)] leading-[1.35] text-text-2">
          Students lose good thoughts because every app asks them to organize at the exact moment they have the
          least attention to spare. We split capture from sorting.
        </p>
        <div className="rise mt-9 flex flex-wrap gap-3">
          <Pill href={LINKS.app} primary>Open the app</Pill>
          <Pill href={LINKS.repo} external>GitHub</Pill>
          <Pill href={LINKS.project} external>Project board</Pill>
          <Pill href={LINKS.brag}>Launch video</Pill>
        </div>

        <dl className="mt-14 grid max-w-[760px] grid-cols-1 gap-6 border-t border-line pt-6 text-[15px] sm:grid-cols-3">
          <div>
            <dt className="text-[13px] text-muted">Team</dt>
            <dd className="mt-1 text-text">{TEAM.join(", ")}</dd>
          </div>
          <div>
            <dt className="text-[13px] text-muted">Theme</dt>
            <dd className="mt-1 text-text">Making an Accessible World: Every Dog Has Its Day</dd>
          </div>
          <div>
            <dt className="text-[13px] text-muted">Deliverables</dt>
            <dd className="mt-1 text-text">Individual design reports and one team presentation (15 min max)</dd>
          </div>
        </dl>

        <ProductGlimpse />
      </div>
    </section>
  );
}

/** Built from the app's own tokens and icons: Capture on the phone, Sort on the desk. */
function ProductGlimpse() {
  return (
    <figure className="mt-20 md:mt-24">
      <div className="grid items-center gap-8 rounded-xl border border-line bg-surface p-5 sm:p-8 md:grid-cols-[300px_1fr] md:gap-12 md:p-12">
        <PhoneCapture />
        <SortCard />
      </div>
      <figcaption className="mt-3 text-[13px] text-muted">
        Capture on the phone (left) and Sort on the desk (right). Illustration drawn with the app&apos;s design tokens; the
        live screens are at <a className="text-accent" href={LINKS.capture}>/capture</a> and{" "}
        <a className="text-accent" href={LINKS.app}>/desk</a>.
      </figcaption>
    </figure>
  );
}

function PhoneCapture() {
  return (
    <div aria-hidden className="mx-auto w-[260px] rounded-[44px] border border-line-strong bg-bg p-2.5 shadow-1">
      <div className="flex h-[480px] flex-col rounded-[36px] bg-surface px-4 pt-5 pb-4">
        <div className="flex items-center justify-between text-[11px] text-muted">
          <span className="font-semibold text-text">Thought Dock</span>
          <span className="inline-flex items-center gap-1"><CheckIcon size={12} /> Saved</span>
        </div>
        <p className="mt-6 text-[19px] leading-[1.3] text-text">
          Scholarship app due Fri 11:59pm, essay link is in my counselor’s email
        </p>
        <div className="mt-auto">
          <p className="mb-2 text-[11px] font-medium text-muted">Today&apos;s captures</p>
          <ul className="space-y-1.5 text-[12px] text-text-2">
            <li className="truncate rounded-md bg-bg px-2.5 py-1.5">Ask about lab report extension</li>
            <li className="truncate rounded-md bg-bg px-2.5 py-1.5">Idea: club flyer with QR</li>
          </ul>
          <div className="mt-4 flex items-center gap-2 rounded-full border border-line bg-raised p-1.5 shadow-2">
            <span className="grid size-9 place-items-center rounded-full bg-bg text-text-2"><MicIcon size={18} /></span>
            <span className="grid size-9 place-items-center rounded-full bg-bg text-text-2"><PhotoIcon size={18} /></span>
            <span className="ml-auto rounded-full bg-accent px-5 py-2 text-[14px] font-semibold text-on-accent">Save</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const ACTIONS = [
  { icon: TaskIcon, label: "Make a Task", k: "T" },
  { icon: EventIcon, label: "Make an Event", k: "E" },
  { icon: SpaceIcon, label: "Move to Space", k: "M" },
  { icon: KeepIcon, label: "Keep", k: "K" },
  { icon: ArchiveIcon, label: "Archive", k: "A" },
];

function SortCard() {
  return (
    <div aria-hidden className="min-w-0">
      <div className="flex items-center justify-between text-[13px] text-muted">
        <span><span className="font-semibold text-text">Sort</span> · 3 of 7</span>
        <span className="hidden sm:inline">← → to move</span>
      </div>
      <div className="mt-4 rounded-xl border border-line bg-surface-2 p-6 shadow-1 sm:p-8">
        <p className="text-[13px] text-muted">From your phone · 9:42 AM</p>
        <p className="mt-3 text-[clamp(1.25rem,2.4vw,1.75rem)] leading-[1.25] font-medium tracking-[-0.02em] text-text">
          Scholarship app due Fri 11:59pm, essay link is in my counselor’s email
        </p>
        <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-[13px] text-text">
          <TaskIcon size={15} className="text-k-task" /> Looks like a <strong className="font-semibold">Task</strong>
        </p>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {ACTIONS.map(({ icon: I, label, k }, i) => (
          <span key={k} className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13px] font-medium ${i === 0 ? "border-transparent bg-ink text-on-ink" : "border-line-strong text-text"}`}>
            <I size={16} /> {label}
            <kbd className={`rounded-sm px-1.5 font-mono text-[11px] ${i === 0 ? "bg-on-ink/15" : "bg-bg-2 text-muted"}`}>{k}</kbd>
          </span>
        ))}
      </div>
    </div>
  );
}
