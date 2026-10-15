// Static recreation of DeskOS (sidebar, inbox list, detail, the Dock) in a 16:10 window.
// Sized in em off a root font-size that is a % of its own width, so it scales like a
// screenshot. Presentational only: the caller marks it aria-hidden.
import { ArchiveIcon, ConnectIcon, EventIcon, InboxIcon, Logo, PhoneIcon, SortIcon, SpaceIcon, TaskIcon, TodayIcon } from "@/components/Icons";
import { HERO_THOUGHT, DockPill } from "./PhoneMock";
import { ACTIONS, Key, SuggestionChip } from "./SortMock";
import s from "./landing.module.css";

const ROWS = [
  { text: "UC transfer application due Nov 30, need to finish personal insight questions", meta: "From phone · 3 hr ago", selected: true },
  { text: "study group for ENGR 1 thursday 6pm library room 204", meta: "From phone · 5 hr ago" },
  { text: "what if the robot arm used a cheaper servo and a 3D printed gearbox", meta: "From phone · Yesterday" },
  { text: "nsf.gov/funding undergraduate engineering research link a TA mentioned", meta: "From phone · Yesterday" },
];

function Row({ text, meta, selected, className = "" }: { text: string; meta: string; selected?: boolean; className?: string }) {
  return (
    <div className={`rounded-[0.7em] px-[0.8em] py-[0.7em] ${selected ? "bg-accent-soft" : ""} ${className}`}>
      <p className="line-clamp-2 text-[1em] leading-[1.35] text-text">{text}</p>
      <p className="mt-[0.25em] text-[0.8em] text-muted">{meta}</p>
    </div>
  );
}

function NavItem({ icon, label, count, active }: { icon: React.ReactNode; label: string; count?: number; active?: boolean }) {
  return (
    <div
      className={`flex h-[2.3em] items-center gap-[0.55em] rounded-[0.6em] px-[0.6em] text-[0.95em] ${active ? "bg-accent-soft font-medium text-accent" : "text-text"}`}
    >
      {icon}
      <span className="flex-1">{label}</span>
      {count ? <span className="tnum text-[0.9em] text-muted">{count}</span> : null}
    </div>
  );
}

export function DeskMock({ arriving = false }: { arriving?: boolean }) {
  const ic = "h-[1.25em] w-[1.25em] shrink-0";
  return (
    <div className="@container w-full">
      <div className="flex aspect-[16/10] flex-col overflow-hidden rounded-[1.4em] bg-surface text-[1.25cqw] shadow-2 ring-1 ring-line">
        <div className="flex h-[2.4em] shrink-0 items-center justify-center border-b border-line bg-surface-2 text-[0.85em] font-medium text-muted">
          DeskOS
        </div>
        <div className="relative grid min-h-0 flex-1 grid-cols-[21%_31%_1fr]">
          {/* Sidebar */}
          <div className="flex flex-col gap-[0.15em] border-r border-line bg-sidebar p-[0.8em]">
            <div className="mb-[0.6em] flex items-center gap-[0.5em] px-[0.4em] font-semibold text-text">
              <Logo className="h-[1.6em] w-[1.6em]" />
              Thought Dock
            </div>
            <NavItem icon={<InboxIcon className={ic} />} label="Inbox" count={5} active />
            <NavItem icon={<TodayIcon className={ic} />} label="Today" />
            <NavItem icon={<TaskIcon className={ic} />} label="Tasks" count={3} />
            <NavItem icon={<EventIcon className={ic} />} label="Calendar" />
            <p className="mt-[0.9em] px-[0.6em] pb-[0.3em] text-[0.8em] font-medium text-muted">Spaces</p>
            {["Classes", "Engineering", "College Apps", "Personal"].map((n) => (
              <NavItem key={n} icon={<SpaceIcon className={ic} />} label={n} />
            ))}
            <NavItem icon={<ArchiveIcon className={ic} />} label="Archive" />
            <div className="flex-1" />
            <NavItem icon={<PhoneIcon className={ic} />} label="Pair phone" />
          </div>

          {/* Inbox list */}
          <div className="flex min-h-0 flex-col border-r border-line p-[0.6em]">
            <div className="flex items-center justify-between px-[0.4em] pb-[0.6em] pt-[0.4em]">
              <span className="text-[1.5em] font-semibold tracking-[-0.02em] text-text">Inbox</span>
              <span className="flex items-center gap-[0.35em] rounded-full bg-ink px-[0.9em] py-[0.35em] text-[0.85em] font-medium text-on-ink">
                <SortIcon className="h-[1.1em] w-[1.1em]" />
                Sort
              </span>
            </div>
            <Row text={HERO_THOUGHT} meta="From phone · Just now" className={arriving ? s.arrive : ""} />
            {ROWS.map((r) => (
              <Row key={r.text} {...r} />
            ))}
          </div>

          {/* Detail */}
          <div className="flex min-h-0 flex-col p-[2em]">
            <p className="text-[0.85em] text-muted">From your phone · 3 hours ago</p>
            <p className="mt-[0.4em] text-[1.65em] font-semibold leading-[1.25] tracking-[-0.02em] text-text">{ROWS[0].text}</p>
            <div className="mt-[1.1em] flex items-center gap-[0.7em]">
              <SuggestionChip kind="Task" />
              <span className="text-[0.9em] font-medium text-accent">Make it a Task</span>
            </div>
            <div className="mt-[1.6em] flex flex-wrap gap-[0.5em]">
              {ACTIONS.map(({ key, label, Icon }) => (
                <span
                  key={key}
                  className="flex h-[2.5em] items-center gap-[0.45em] rounded-full border border-line bg-surface-2 pl-[0.8em] pr-[0.45em] text-[0.9em] font-medium text-text"
                >
                  <Icon className="h-[1.15em] w-[1.15em] text-text-2" />
                  {label}
                  <Key>{key}</Key>
                </span>
              ))}
            </div>
            <div className="mt-[2em] border-t border-line pt-[1.4em]">
              <p className="text-[0.8em] font-medium text-muted">Notes</p>
              <div className="mt-[0.5em] h-[5.5em] rounded-[0.7em] border border-line bg-surface-2 p-[0.9em] text-[0.95em] text-muted">
                Add notes. Your original words stay as they are.
              </div>
              <p className="mt-[1.4em] text-[0.8em] font-medium text-muted">Connected</p>
              <span className="mt-[0.5em] inline-flex items-center gap-[0.45em] rounded-full border border-line px-[0.8em] py-[0.35em] text-[0.9em] text-text">
                <ConnectIcon className="h-[1.1em] w-[1.1em] text-text-2" />
                PIQ ideas from Sunday
              </span>
            </div>
          </div>

          {/* The Dock, pinned at the bottom of list + detail */}
          <div className="pointer-events-none absolute bottom-[1.2em] left-[21%] right-0 flex justify-center">
            <div className="w-[24em] text-[0.95em]">
              <DockPill placeholder="Capture a thought" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
