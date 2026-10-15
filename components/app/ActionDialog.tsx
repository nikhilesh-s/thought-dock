"use client";
import { newId } from "@/lib/client";
import { suggestKind } from "@/lib/classifier";
import { KIND_LABEL, type Dock, type Item, type Kind } from "@/lib/types";
import { KIND_ICON } from "@/components/Icons";
import { Dialog } from "./Dialog";
import { Picker } from "./Picker";
import { KIND_TEXT } from "./KindChip";
import * as A from "./actions";

export type Pending = { type: "task" | "event" | "move" | "connect" | "keep"; item: Item } | null;

const TITLE = { task: "Make a Task", event: "Make an Event", move: "Move to Space", connect: "Connect", keep: "Keep as…" };
const KEEP_KINDS: Kind[] = ["idea", "note", "resource"];
const primary = "min-h-11 rounded-full bg-accent px-5 font-semibold text-on-accent [@media(hover:hover)]:hover:bg-accent-hover";
const secondary = "min-h-11 rounded-full px-5 text-text [@media(hover:hover)]:hover:bg-bg-2";

/** The small dialog each processing action needs (date, space, link target, kind). */
export function ActionDialog({ pending, dock, onClose, onCommit }: {
  pending: Pending;
  dock: Dock;
  onClose: () => void;
  onCommit: (a: A.ActionKey, u: A.Undoable) => void;
}) {
  // Always act on the freshest copy (the phone may have synced while the dialog was open).
  const it = pending ? dock.items.find((i) => i.id === pending.item.id) ?? pending.item : null;
  const done = (a: A.ActionKey, u: A.Undoable) => { onClose(); onCommit(a, u); };

  return (
    <Dialog open={!!pending} onClose={onClose} title={pending ? TITLE[pending.type] : ""}>
      {pending && it && (
        <>
          <p className="mb-4 line-clamp-2 text-[15px] text-text-2">{it.text}</p>

          {pending.type === "task" && (
            <form onSubmit={(e) => { e.preventDefault(); done("task", A.makeTask(it, new FormData(e.currentTarget).get("due") as string)); }}>
              <label htmlFor="due" className="text-[15px] font-medium">Due date <span className="font-normal text-muted">(optional)</span></label>
              <input id="due" name="due" type="date" autoFocus defaultValue={it.due ?? ""}
                className="tnum mt-1.5 min-h-11 w-full rounded-md border border-line-strong bg-surface-2 px-3 text-[17px]" />
              <div className="mt-6 flex justify-end gap-2">
                <button type="button" onClick={onClose} className={secondary}>Cancel</button>
                <button type="submit" className={primary}>Make a Task</button>
              </div>
            </form>
          )}

          {pending.type === "event" && (
            <form onSubmit={(e) => { e.preventDefault(); done("event", A.makeEvent(it, new FormData(e.currentTarget).get("at") as string)); }}>
              <label htmlFor="at" className="text-[15px] font-medium">Date and time</label>
              <input id="at" name="at" type="datetime-local" required autoFocus defaultValue={it.at ?? ""}
                className="tnum mt-1.5 min-h-11 w-full rounded-md border border-line-strong bg-surface-2 px-3 text-[17px]" />
              <div className="mt-6 flex justify-end gap-2">
                <button type="button" onClick={onClose} className={secondary}>Cancel</button>
                <button type="submit" className={primary}>Make an Event</button>
              </div>
            </form>
          )}

          {pending.type === "keep" && <KeepChoice item={it} onPick={(k) => done("keep", A.keepAs(it, k))} />}

          {pending.type === "move" && (
            <Picker
              label="Space"
              placeholder="Type a space, or a new name"
              empty="No spaces yet. Type a name to make one."
              options={dock.spaces.slice().sort((a, b) => a.createdAt - b.createdAt).map((s) => ({ id: s.id, label: s.name, hint: s.id === it.spaceId ? "Current" : undefined }))}
              onPick={(id) => done("move", A.moveTo(it, dock.spaces.find((s) => s.id === id)!, false))}
              onCreate={(name) => done("move", A.moveTo(it, { id: newId("s"), name, createdAt: Date.now() }, true))}
            />
          )}

          {pending.type === "connect" && (
            <Picker
              label="Thought to connect"
              placeholder="Search your thoughts"
              empty="Nothing else to connect yet."
              options={dock.items
                .filter((o) => o.id !== it.id && o.status !== "archived" && !it.links.includes(o.id))
                .sort((a, b) => b.updatedAt - a.updatedAt)
                .map((o) => ({ id: o.id, label: o.text, hint: o.kind ? KIND_LABEL[o.kind] : o.status === "inbox" ? "Inbox" : undefined }))}
              onPick={(id) => done("connect", A.connect(it, dock.items.find((o) => o.id === id)!))}
            />
          )}
        </>
      )}
    </Dialog>
  );
}

function KeepChoice({ item, onPick }: { item: Item; onPick: (k: Kind) => void }) {
  const s = suggestKind(item.text).kind;
  const pre = KEEP_KINDS.includes(item.kind as Kind) ? item.kind! : KEEP_KINDS.includes(s) ? s : "note";
  return (
    <div role="group" aria-label="Keep as" className="grid grid-cols-3 gap-2">
      {KEEP_KINDS.map((k) => {
        const Icon = KIND_ICON[k];
        return (
          <button key={k} type="button" data-autofocus={k === pre ? "" : undefined} onClick={() => onPick(k)}
            className={`flex min-h-20 flex-col items-center justify-center gap-1 rounded-lg border text-[15px] font-medium ${k === pre ? "border-accent bg-accent-soft" : "border-line [@media(hover:hover)]:hover:border-line-strong"}`}>
            <Icon size={22} className={KIND_TEXT[k]} />
            {KIND_LABEL[k]}
            {k === pre && <span className="text-[13px] font-normal text-muted">Suggested</span>}
          </button>
        );
      })}
    </div>
  );
}
