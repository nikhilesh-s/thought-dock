// Shared icon set (SF Symbols-like, 1.6 stroke). Decorative by default: pair with visible text
// or pass `title` for icon-only buttons (which still need aria-label on the button).
import type { Kind } from "@/lib/types";

type P = { size?: number; className?: string; title?: string };
function Svg({ size = 20, className, title, children }: P & { children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}>
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export const TaskIcon = (p: P) => <Svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="m8.5 12.2 2.3 2.3 4.7-5" /></Svg>;
export const EventIcon = (p: P) => <Svg {...p}><rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M3.5 9.5h17M8 3v4M16 3v4" /></Svg>;
export const IdeaIcon = (p: P) => <Svg {...p}><path d="M9 17.5h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z" /></Svg>;
export const ResourceIcon = (p: P) => <Svg {...p}><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></Svg>;
export const NoteIcon = (p: P) => <Svg {...p}><path d="M6 3.5h8l4 4V19a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 5 19V5a1.5 1.5 0 0 1 1-1.5Z" /><path d="M14 3.5V8h4M8.5 12h7M8.5 15.5h5" /></Svg>;
export const InboxIcon = (p: P) => <Svg {...p}><path d="M3.5 13.5 6 5.5h12l2.5 8V18a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 18Z" /><path d="M3.5 13.5H8l1.5 2.5h5l1.5-2.5h4.5" /></Svg>;
export const ArchiveIcon = (p: P) => <Svg {...p}><rect x="3" y="4" width="18" height="4.5" rx="1.2" /><path d="M5 8.5V18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5M10 12.5h4" /></Svg>;
export const SpaceIcon = (p: P) => <Svg {...p}><path d="M3.5 7.5A2 2 0 0 1 5.5 5.5h4l2 2h7a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2Z" /></Svg>;
export const ConnectIcon = (p: P) => <Svg {...p}><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><circle cx="18" cy="6" r="2.5" /><path d="M8.2 7.2 15.8 16.8M8.5 6h7" /></Svg>;
export const DevelopIcon = (p: P) => <Svg {...p}><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16Z" /><path d="m13.5 6.5 4 4" /></Svg>;
export const UndoIcon = (p: P) => <Svg {...p}><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" /></Svg>;
export const MicIcon = (p: P) => <Svg {...p}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" /></Svg>;
export const PhotoIcon = (p: P) => <Svg {...p}><rect x="3" y="5" width="18" height="14" rx="3" /><circle cx="9" cy="10" r="1.8" /><path d="m21 16-5-5-8 8" /></Svg>;
export const SearchIcon = (p: P) => <Svg {...p}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></Svg>;
export const GearIcon = (p: P) => <Svg {...p}><circle cx="12" cy="12" r="3" /><path d="M12 2.8v2.4M12 18.8v2.4M4.2 7.5l2.1 1.2M17.7 15.3l2.1 1.2M4.2 16.5l2.1-1.2M17.7 8.7l2.1-1.2" /></Svg>;
export const PhoneIcon = (p: P) => <Svg {...p}><rect x="6.5" y="2.5" width="11" height="19" rx="2.8" /><path d="M10.5 18.5h3" /></Svg>;
export const SortIcon = (p: P) => <Svg {...p}><rect x="5" y="7" width="14" height="12" rx="2.5" /><path d="M7.5 4.5h9" /></Svg>;
export const CheckIcon = (p: P) => <Svg {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></Svg>;
export const PlusIcon = (p: P) => <Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>;
export const CloseIcon = (p: P) => <Svg {...p}><path d="M6 6l12 12M18 6 6 18" /></Svg>;
export const KeepIcon = (p: P) => <Svg {...p}><path d="M7 3.5h10a1 1 0 0 1 1 1V21l-6-4-6 4V4.5a1 1 0 0 1 1-1Z" /></Svg>;
export const CloudIcon = (p: P) => <Svg {...p}><path d="M7 18.5h10.5a4 4 0 0 0 .4-8 6 6 0 0 0-11.6 1.6A3.3 3.3 0 0 0 7 18.5Z" /></Svg>;
export const ChevronLeftIcon = (p: P) => <Svg {...p}><path d="m14.5 5-7 7 7 7" /></Svg>;
export const ChevronRightIcon = (p: P) => <Svg {...p}><path d="m9.5 5 7 7-7 7" /></Svg>;
export const TodayIcon = (p: P) => <Svg {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" /></Svg>;
export const KeyboardIcon = (p: P) => <Svg {...p}><rect x="2.5" y="6" width="19" height="12" rx="2.5" /><path d="M6.5 10h1M10 10h1M13.5 10h1M17 10h.5M8 14h8" /></Svg>;
export const ArrowRightIcon = (p: P) => <Svg {...p}><path d="M5 12h14M13 6l6 6-6 6" /></Svg>;

export const KIND_ICON: Record<Kind, (p: P) => React.ReactElement> = {
  task: TaskIcon,
  event: EventIcon,
  idea: IdeaIcon,
  resource: ResourceIcon,
  note: NoteIcon,
};

/** The Thought Dock mark: a tray (the dock) with one thought resting in it. */
export function Logo({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
      <rect x="1" y="1" width="30" height="30" rx="9" fill="var(--ink)" />
      <rect x="7" y="18" width="18" height="6" rx="3" fill="var(--on-ink)" opacity="0.92" />
      <circle cx="16" cy="11.5" r="3.5" fill="var(--accent)" />
    </svg>
  );
}
