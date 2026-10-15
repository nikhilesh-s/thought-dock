"use client";
import type { Item, Space } from "@/lib/types";
import { MicIcon, PhotoIcon } from "@/components/Icons";
import { KindChip } from "./KindChip";
import { ago, dueWords, timeLabel, whenWords } from "./dates";
import type { Group, View } from "./views";

type Props = {
  groups: Group[];
  view: View;
  spaces: Space[];
  currentId: string | null;
  onSelect: (id: string) => void;
  onToggleDone: (it: Item) => void;
  onIcs: (it: Item) => void;
  onRestore: (it: Item) => void;
  onDelete: (it: Item) => void;
};

/** A plain list of buttons (one per thought); selection follows focus. */
export function ItemList({ groups, view, spaces, currentId, onSelect, onToggleDone, onIcs, onRestore, onDelete }: Props) {
  const spaceName = (id?: string | null) => spaces.find((s) => s.id === id)?.name;
  return (
    <div className="flex flex-col gap-4">
      {groups.map((g, gi) => (
        <section key={g.label ?? gi} aria-label={g.label}>
          {g.label && <h3 className="px-3 pb-1 text-[13px] font-semibold tracking-normal text-muted">{g.label}</h3>}
          <ul className="flex flex-col gap-0.5">
            {g.items.map((it) => {
              const selected = it.id === currentId;
              const space = view.startsWith("space:") ? undefined : spaceName(it.spaceId);
              return (
                <li key={it.id} className={`group flex items-start gap-1 rounded-md ${selected ? "bg-accent-soft" : "[@media(hover:hover)]:hover:bg-bg-2/70"}`}>
                  {it.kind === "task" && it.status === "kept" && (
                    <label className="grid min-h-11 min-w-10 shrink-0 cursor-pointer place-items-center pl-1">
                      <span className="sr-only">Done: {it.text}</span>
                      <input type="checkbox" checked={!!it.done} onChange={() => onToggleDone(it)} className="size-[18px] accent-(--accent)" />
                    </label>
                  )}
                  <button
                    type="button"
                    id={`row-${it.id}`}
                    aria-current={selected ? "true" : undefined}
                    onClick={() => onSelect(it.id)}
                    className={`min-h-11 min-w-0 flex-1 rounded-md py-2.5 text-left ${it.kind === "task" && it.status === "kept" ? "pr-3" : "px-3"}`}
                  >
                    <span className={`line-clamp-2 text-[15px] leading-snug ${it.done ? "text-muted line-through" : "text-text"}`}>{it.text}</span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 text-[13px] text-muted">
                      {it.kind && view !== "tasks" && view !== "calendar" && <KindChip kind={it.kind} size={13} />}
                      {it.kind === "task" && it.due && <span className="tnum">{dueWords(it.due, it.done)}</span>}
                      {it.kind === "event" && it.at && <span className="tnum">{view === "calendar" ? timeLabel(it.at) : whenWords(it.at)}</span>}
                      {space && <span>{space}</span>}
                      {it.media?.type === "audio" && <span className="inline-flex items-center gap-1"><MicIcon size={13} />Voice</span>}
                      {it.media?.type === "image" && <span className="inline-flex items-center gap-1"><PhotoIcon size={13} />Photo</span>}
                      {(view === "inbox" || view === "archive" || view === "today") && <span className="tnum">{ago(it.createdAt)}</span>}
                    </span>
                  </button>
                  {view === "calendar" && (
                    <button type="button" onClick={() => onIcs(it)}
                      className="my-1.5 mr-1.5 min-h-9 shrink-0 rounded-full px-3 text-[13px] font-medium text-accent [@media(hover:hover)]:hover:bg-accent-soft">
                      Add to Calendar
                    </button>
                  )}
                  {view === "archive" && (
                    <span className="my-1.5 mr-1.5 flex shrink-0 gap-1">
                      <button type="button" onClick={() => onRestore(it)}
                        className="min-h-9 rounded-full px-3 text-[13px] font-medium text-accent [@media(hover:hover)]:hover:bg-accent-soft">
                        Restore
                      </button>
                      <button type="button" onClick={() => onDelete(it)} aria-label={`Delete forever: ${it.text}`}
                        className="min-h-9 rounded-full px-3 text-[13px] font-medium text-text-2 [@media(hover:hover)]:hover:bg-bg-2">
                        Delete
                      </button>
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}
