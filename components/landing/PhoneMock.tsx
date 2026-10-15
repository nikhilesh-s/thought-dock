// Static recreation of the Capture screen inside an iPhone-proportioned frame.
// Everything is sized in em off one root font-size (a % of the frame width), so it scales
// like a screenshot. Presentational only: the caller marks it aria-hidden.
import { CloudIcon, Logo, MicIcon, PhotoIcon } from "@/components/Icons";

export const HERO_THOUGHT = "remember to email Professor Lee about missing Thursday's lab";

/** The Dock: the same floating capture pill on the phone and the desk. */
export function DockPill({ placeholder }: { placeholder?: string }) {
  return (
    <div className="flex items-center gap-[0.4em] rounded-full bg-raised p-[0.4em] shadow-2 ring-1 ring-line">
      {placeholder ? <span className="flex-1 truncate pl-[0.8em] text-muted">{placeholder}</span> : null}
      <span className="grid h-[2.6em] w-[2.6em] shrink-0 place-items-center rounded-full bg-surface-2 text-text-2 ring-1 ring-line">
        <MicIcon className="h-[1.25em] w-[1.25em]" />
      </span>
      <span className="grid h-[2.6em] w-[2.6em] shrink-0 place-items-center rounded-full bg-surface-2 text-text-2 ring-1 ring-line">
        <PhotoIcon className="h-[1.25em] w-[1.25em]" />
      </span>
      <span
        className={`grid h-[2.6em] place-items-center rounded-full bg-accent px-[1.2em] font-semibold text-on-accent ${placeholder ? "" : "flex-1"}`}
      >
        Save
      </span>
    </div>
  );
}

/** Crop of the Capture screen just after saving: toast, today's captures, the Dock. */
export function CaptureCrop() {
  const rows = [
    { icon: <MicIcon className="h-[1.2em] w-[1.2em]" />, label: "Voice note · 0:12", text: "pick up lab goggles before thursday" },
    { icon: <PhotoIcon className="h-[1.2em] w-[1.2em]" />, label: "Photo", text: "whiteboard from calc review" },
    { icon: null, label: "Just now", text: HERO_THOUGHT },
  ];
  return (
    <div className="mx-auto max-w-[360px] text-[15px]">
      <p className="text-[0.85em] font-medium text-muted">Today&rsquo;s captures</p>
      <ul className="mt-[0.5em] divide-y divide-line rounded-lg bg-surface ring-1 ring-line">
        {rows.map((r) => (
          <li key={r.text} className="px-[1em] py-[0.75em]">
            <p className="flex items-center gap-[0.35em] text-[0.8em] text-muted">
              {r.icon}
              {r.label}
            </p>
            <p className="mt-[0.15em] text-text">{r.text}</p>
          </li>
        ))}
      </ul>
      <div className="mt-[1.2em] flex items-center justify-between rounded-md bg-ink px-[1em] py-[0.7em] text-on-ink shadow-2">
        <span>Saved to your inbox</span>
        <span className="font-semibold">Undo</span>
      </div>
      <div className="mt-[0.8em]">
        <DockPill />
      </div>
    </div>
  );
}

export function PhoneMock() {
  return (
    <div className="@container w-full">
      <div className="aspect-[9/19.5] rounded-[2.9em] bg-ink p-[0.45em] text-[5.25cqw] shadow-2">
        <div className="flex h-full flex-col overflow-hidden rounded-[2.5em] bg-bg px-[1.1em] pb-[0.7em]">
          <div className="flex h-[2.6em] shrink-0 items-center justify-between px-[0.6em] pt-[0.3em] text-[0.85em] font-semibold text-text">
            <span className="tnum">9:41</span>
            <span className="h-[0.75em] w-[1.6em] rounded-[0.25em] border border-text/60" />
          </div>
          <div className="flex items-center justify-between text-[0.85em]">
            <span className="flex items-center gap-[0.4em] font-semibold text-text">
              <Logo className="h-[1.5em] w-[1.5em]" />
              Thought Dock
            </span>
            <span className="flex items-center gap-[0.3em] text-muted">
              <CloudIcon className="h-[1.2em] w-[1.2em]" />
              Saved
            </span>
          </div>
          <p className="mt-[1.4em] text-[1.4em] leading-[1.35] text-text">
            {HERO_THOUGHT}
            <span className="ml-[0.05em] inline-block h-[1.1em] w-[0.08em] translate-y-[0.18em] bg-accent" />
          </p>
          <div className="flex-1" />
          <DockPill />
          <div className="mx-auto mt-[1em] h-[0.3em] w-[7em] rounded-full bg-text/70" />
        </div>
      </div>
    </div>
  );
}
