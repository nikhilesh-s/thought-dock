// Processing actions as pure op builders: each returns the ops and their inverse, so the
// desk list, detail pane and Sort view all share one definition and one undo story.
import { edit } from "@/lib/client";
import { KIND_LABEL, type Dock, type Item, type Kind, type Op, type Space } from "@/lib/types";
import { ArchiveIcon, ConnectIcon, DevelopIcon, EventIcon, KeepIcon, SpaceIcon, TaskIcon } from "@/components/Icons";

export type ActionKey = "task" | "event" | "move" | "develop" | "connect" | "keep" | "archive";
export type Undoable = { ops: Op[]; undo: { label: string; ops: Op[] } };

export const ACTIONS: { key: ActionKey; label: string; hotkey: string; Icon: typeof TaskIcon }[] = [
  { key: "task", label: "Make a Task", hotkey: "T", Icon: TaskIcon },
  { key: "event", label: "Make an Event", hotkey: "E", Icon: EventIcon },
  { key: "move", label: "Move to Space", hotkey: "M", Icon: SpaceIcon },
  { key: "develop", label: "Develop", hotkey: "D", Icon: DevelopIcon },
  { key: "connect", label: "Connect", hotkey: "C", Icon: ConnectIcon },
  { key: "keep", label: "Keep", hotkey: "K", Icon: KeepIcon },
  { key: "archive", label: "Archive", hotkey: "A", Icon: ArchiveIcon },
];
export const HOTKEYS: Record<string, ActionKey> = Object.fromEntries(ACTIONS.map((a) => [a.hotkey.toLowerCase(), a.key]));
/** Actions that take a thought out of the inbox (Sort animates these). */
export const LEAVES_INBOX = new Set<ActionKey>(["task", "event", "move", "keep", "archive"]);

const put = (item: Item): Op => ({ op: "put", item });

export function change(prev: Item, changes: Partial<Item>, label: string): Undoable {
  return { ops: [put(edit(prev, changes))], undo: { label, ops: [put(prev)] } };
}

export const makeTask = (it: Item, due?: string) =>
  change(it, { kind: "task", status: "kept", due: due || undefined, done: it.done ?? false }, "Made a task");
export const makeEvent = (it: Item, at: string) => change(it, { kind: "event", status: "kept", at }, "Made an event");
export const keepAs = (it: Item, kind: Kind) => change(it, { kind, status: "kept" }, `Kept as ${KIND_LABEL[kind]}`);
export const archive = (it: Item) => change(it, { status: "archived" }, "Archived");
export const restore = (it: Item) => change(it, { status: it.kind || it.spaceId ? "kept" : "inbox" }, "Restored");
export const toggleDone = (it: Item) => change(it, { done: !it.done }, it.done ? "Marked not done" : "Marked done");
export const editText = (it: Item, text: string) => change(it, { text }, "Edited text");

export function moveTo(it: Item, space: Space, isNew: boolean): Undoable {
  const u = change(it, { spaceId: space.id, status: it.status === "inbox" ? "kept" : it.status }, `Moved to ${space.name}`);
  if (isNew) {
    u.ops.unshift({ op: "putSpace", space });
    u.undo.ops.push({ op: "delSpace", id: space.id });
  }
  return u;
}

/** Links are symmetric: both items change, one undo restores both. */
export function connect(a: Item, b: Item): Undoable {
  const link = (x: Item, id: string) => edit(x, { links: [...new Set([...x.links, id])] });
  return { ops: [put(link(a, b.id)), put(link(b, a.id))], undo: { label: "Connected", ops: [put(a), put(b)] } };
}

export function renameSpace(s: Space, name: string): Undoable {
  return { ops: [{ op: "putSpace", space: { ...s, name } }], undo: { label: "Renamed space", ops: [{ op: "putSpace", space: s }] } };
}

/** Removing a space sends its thoughts back to "No space"; undo puts everything back. */
export function removeSpace(d: Dock, s: Space): Undoable {
  const its = d.items.filter((i) => i.spaceId === s.id);
  return {
    ops: [{ op: "delSpace", id: s.id }, ...its.map((i) => put(edit(i, { spaceId: null })))],
    undo: { label: `Removed ${s.name}`, ops: [{ op: "putSpace", space: s }, ...its.map(put)] },
  };
}

/** The only hard delete (from Archive, after a confirm). Also unlinks it from its connections. */
export function deleteForever(d: Dock, it: Item): Op[] {
  const linked = d.items.filter((i) => i.id !== it.id && i.links.includes(it.id));
  return [{ op: "del", id: it.id }, ...linked.map((i) => put(edit(i, { links: i.links.filter((x) => x !== it.id) })))];
}
