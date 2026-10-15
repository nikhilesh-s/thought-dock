// Static recreation of the Sort view (one thought, big labeled actions). Presentational only:
// callers mark it aria-hidden and give a text alternative.
import { ArchiveIcon, ConnectIcon, DevelopIcon, EventIcon, KeepIcon, SpaceIcon, TaskIcon } from "@/components/Icons";

export const ACTIONS = [
  { key: "T", label: "Task", Icon: TaskIcon },
  { key: "E", label: "Event", Icon: EventIcon },
  { key: "M", label: "Move", Icon: SpaceIcon },
  { key: "D", label: "Develop", Icon: DevelopIcon },
  { key: "C", label: "Connect", Icon: ConnectIcon },
  { key: "K", label: "Keep", Icon: KeepIcon },
  { key: "A", label: "Archive", Icon: ArchiveIcon },
] as const;

export function Key({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={`inline-flex h-[1.6em] min-w-[1.6em] items-center justify-center rounded-[0.35em] border border-line-strong bg-surface-2 px-[0.35em] font-mono text-[0.8em] leading-none text-text-2 shadow-[inset_0_-1px_0_var(--line-strong)] ${className}`}
    >
      {children}
    </kbd>
  );
}

export function SuggestionChip({ kind = "Task" }: { kind?: "Task" | "Event" }) {
  const Icon = kind === "Task" ? TaskIcon : EventIcon;
  return (
    <span className="inline-flex items-center gap-[0.4em] rounded-full border border-line bg-surface-2 py-[0.3em] pl-[0.5em] pr-[0.8em] text-[0.9em] text-text-2">
      <Icon className={`h-[1.15em] w-[1.15em] ${kind === "Task" ? "text-k-task" : "text-k-event"}`} />
      Looks like {kind === "Task" ? "a" : "an"} <strong className="font-semibold text-text">{kind}</strong>
    </span>
  );
}

export function SortMock({ compact = false }: { compact?: boolean }) {
  const actions = compact ? ACTIONS.slice(0, 3) : ACTIONS;
  return (
    <div className={compact ? "text-[15px]" : "text-[15px] md:text-[17px]"}>
      <div className="flex items-center justify-between text-[0.85em] text-muted">
        <span className="tnum">Sort · {compact ? "1" : "2"} of 5</span>
        <span>Done for now</span>
      </div>
      <div className={`mt-[1em] rounded-xl bg-surface shadow-1 ring-1 ring-line ${compact ? "p-[1.2em]" : "p-[1.4em] md:p-[2.2em]"}`}>
        <p className="text-[0.85em] text-muted">From your phone · 5 hours ago</p>
        <p className={`mt-[0.4em] font-semibold leading-[1.2] tracking-[-0.02em] text-text ${compact ? "text-[1.35em]" : "text-[1.6em] md:text-[2.1em]"}`}>
          study group for ENGR 1 thursday 6pm library room 204
        </p>
        <div className="mt-[1em]">
          <SuggestionChip kind="Event" />
        </div>
      </div>
      <div className={`mt-[1em] grid gap-[0.5em] ${compact ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-4 lg:grid-cols-7"}`}>
        {actions.map(({ key, label }) => (
          <span
            key={key}
            className="flex min-h-[2.9em] items-center gap-[0.55em] rounded-md border border-line bg-surface px-[0.7em] text-[0.95em] font-medium text-text"
          >
            <Key className="text-[0.95em]">{key}</Key>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
