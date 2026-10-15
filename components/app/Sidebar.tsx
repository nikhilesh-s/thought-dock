"use client";
import { useState } from "react";
import type { SyncState } from "@/lib/client";
import type { Dock } from "@/lib/types";
import { ArchiveIcon, EventIcon, GearIcon, InboxIcon, KeyboardIcon, Logo, PhoneIcon, PlusIcon, SpaceIcon, TaskIcon, TodayIcon } from "@/components/Icons";
import { SyncStatus } from "./SyncStatus";
import { NO_SPACE, inboxOf, spaceItems, type View } from "./views";

type Props = {
  dock: Dock | null;
  view: View;
  state: SyncState;
  onView: (v: View) => void;
  onCreateSpace: (name: string) => void;
  onPair: () => void;
  onSettings: () => void;
  onKeys: () => void;
  /** Phone/tablet "Spaces" tab: the segmented control already covers Inbox/Tasks/Calendar. */
  compact?: boolean;
};

function Row({ active, onClick, icon, label, count }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string; count?: number }) {
  return (
    <li>
      <button type="button" onClick={onClick} aria-current={active ? "page" : undefined}
        className={`flex min-h-11 w-full items-center gap-2.5 rounded-md px-2.5 text-left text-[15px] ${active ? "bg-accent-soft font-medium text-accent" : "text-text [@media(hover:hover)]:hover:bg-bg-2/70"}`}>
        <span className={active ? "text-accent" : "text-text-2"}>{icon}</span>
        <span className="min-w-0 flex-1 truncate">{label}</span>
        {count ? <span className={`tnum text-[13px] ${active ? "text-accent" : "text-muted"}`}>{count}</span> : null}
      </button>
    </li>
  );
}

export function Sidebar({ dock, view, state, onView, onCreateSpace, onPair, onSettings, onKeys, compact }: Props) {
  const [adding, setAdding] = useState(false);
  const spaces = (dock?.spaces ?? []).slice().sort((a, b) => a.createdAt - b.createdAt);
  const noSpace = dock ? spaceItems(dock, NO_SPACE).length : 0;
  const nav = (v: View, label: string, icon: React.ReactNode, count?: number) => (
    <Row key={v} active={view === v} onClick={() => onView(v)} icon={icon} label={label} count={count} />
  );

  return (
    <nav aria-label="Spaces" className="flex h-full flex-col gap-5 overflow-auto px-3 pt-4 pb-4">
      {!compact && (
        <div className="flex items-center gap-2 px-2.5 pt-1">
          <Logo size={24} />
          <span className="text-[15px] font-semibold">Thought Dock</span>
        </div>
      )}
      <ul className="flex flex-col gap-0.5">
        {!compact && nav("inbox", "Inbox", <InboxIcon size={18} />, dock ? inboxOf(dock).length : undefined)}
        {nav("today", "Today", <TodayIcon size={18} />)}
        {!compact && nav("tasks", "Tasks", <TaskIcon size={18} />)}
        {!compact && nav("calendar", "Calendar", <EventIcon size={18} />)}
      </ul>

      <div>
        <div className="flex items-center justify-between pr-1 pl-2.5">
          <h2 className="text-[13px] font-semibold tracking-normal text-muted">Spaces</h2>
          <button type="button" onClick={() => setAdding(true)} aria-label="New space" title="New space"
            className="grid size-8 place-items-center rounded-full text-text-2 [@media(hover:hover)]:hover:bg-bg-2">
            <PlusIcon size={16} />
          </button>
        </div>
        <ul className="mt-1 flex flex-col gap-0.5">
          {spaces.map((s) => nav(`space:${s.id}`, s.name, <SpaceIcon size={18} />, dock ? spaceItems(dock, s.id).length : undefined))}
          {noSpace > 0 && nav(`space:${NO_SPACE}`, "No space", <SpaceIcon size={18} />, noSpace)}
          {adding && (
            <li>
              <form onSubmit={(e) => {
                e.preventDefault();
                const name = (new FormData(e.currentTarget).get("name") as string).trim();
                if (name) onCreateSpace(name.slice(0, 60));
                setAdding(false);
              }}>
                <label htmlFor="new-space" className="sr-only">New space name</label>
                <input id="new-space" name="name" autoFocus placeholder="Space name" maxLength={60}
                  onBlur={() => setAdding(false)}
                  onKeyDown={(e) => { if (e.key === "Escape") { e.stopPropagation(); setAdding(false); } }}
                  className="min-h-11 w-full rounded-md border border-line-strong bg-surface px-2.5 text-[15px]" />
              </form>
            </li>
          )}
        </ul>
      </div>

      <ul className="flex flex-col gap-0.5">
        {nav("archive", "Archive", <ArchiveIcon size={18} />)}
      </ul>

      <div className="mt-auto flex flex-col gap-1 pt-2">
        <button type="button" onClick={onPair}
          className="flex min-h-11 items-center gap-2.5 rounded-full border border-line bg-surface px-3.5 text-[15px] font-medium [@media(hover:hover)]:hover:border-line-strong">
          <PhoneIcon size={18} className="text-text-2" />Pair phone
        </button>
        <div className="flex items-center justify-between gap-1">
          <button type="button" onClick={onSettings} className="flex min-h-11 items-center gap-2 rounded-md px-2.5 text-[15px] text-text-2 [@media(hover:hover)]:hover:bg-bg-2/70">
            <GearIcon size={18} />Settings
          </button>
          <button type="button" onClick={onKeys} aria-label="Keyboard shortcuts" title="Keyboard shortcuts (?)"
            className="grid size-11 place-items-center rounded-full text-text-2 [@media(hover:hover)]:hover:bg-bg-2/70">
            <KeyboardIcon size={18} />
          </button>
        </div>
        <SyncStatus state={state} className="px-2.5" />
      </div>
    </nav>
  );
}
