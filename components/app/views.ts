// What each desk view shows, as labeled groups. Pure: dock in, groups out.
import { KINDS, type Dock, type Item, type Kind } from "@/lib/types";
import { dayLabel, daysFromToday, startOfToday, todayYmd } from "./dates";

export type View = "inbox" | "today" | "tasks" | "calendar" | "archive" | "spaces" | `space:${string}`;
export type Group = { label?: string; items: Item[] };
export const NO_SPACE = "none";

const newest = (a: Item, b: Item) => b.createdAt - a.createdAt;
const PLURAL: Record<Kind, string> = { task: "Tasks", event: "Events", idea: "Ideas", resource: "Resources", note: "Notes" };

export const inboxOf = (d: Dock) => d.items.filter((i) => i.status === "inbox").sort(newest);
const tasksOf = (d: Dock) => d.items.filter((i) => i.status === "kept" && i.kind === "task");
const eventsOf = (d: Dock) => d.items.filter((i) => i.status === "kept" && i.kind === "event" && i.at);
export const spaceItems = (d: Dock, id: string) =>
  d.items.filter((i) => i.status === "kept" && (id === NO_SPACE ? !i.spaceId || !d.spaces.some((s) => s.id === i.spaceId) : i.spaceId === id));

function byDue(a: Item, b: Item) {
  if (!!a.done !== !!b.done) return a.done ? 1 : -1;
  return (a.due ?? "").localeCompare(b.due ?? "") || newest(a, b);
}

export function groupsFor(d: Dock, view: View): Group[] {
  const today = todayYmd();
  const nonEmpty = (gs: Group[]) => gs.filter((g) => g.items.length);
  switch (view) {
    case "inbox":
      return [{ items: inboxOf(d) }];
    case "archive":
      return [{ items: d.items.filter((i) => i.status === "archived").sort((a, b) => b.updatedAt - a.updatedAt) }];
    case "tasks": {
      const t = tasksOf(d).sort(byDue);
      return nonEmpty([
        { label: "No date", items: t.filter((i) => !i.due) },
        { label: "Today", items: t.filter((i) => i.due === today) },
        { label: "Upcoming", items: t.filter((i) => i.due && i.due > today) },
        { label: "Earlier", items: t.filter((i) => i.due && i.due < today) },
      ]);
    }
    case "calendar": {
      const ev = eventsOf(d).sort((a, b) => a.at!.localeCompare(b.at!));
      const groups: Group[] = [];
      for (const e of ev.filter((x) => daysFromToday(x.at!) >= 0)) {
        const label = dayLabel(e.at!);
        const last = groups[groups.length - 1];
        if (last?.label === label) last.items.push(e);
        else groups.push({ label, items: [e] });
      }
      return nonEmpty([...groups, { label: "Earlier", items: ev.filter((x) => daysFromToday(x.at!) < 0).reverse() }]);
    }
    case "today":
      return nonEmpty([
        { label: "Due today", items: tasksOf(d).filter((i) => i.due === today).sort(byDue) },
        { label: "Events today", items: eventsOf(d).filter((i) => i.at!.startsWith(today)).sort((a, b) => a.at!.localeCompare(b.at!)) },
        { label: "Captured today", items: inboxOf(d).filter((i) => i.createdAt >= startOfToday()) },
      ]);
    case "spaces":
      return [];
    default: {
      const its = spaceItems(d, view.slice(6)).sort(newest);
      return nonEmpty([
        ...KINDS.map((k) => ({ label: PLURAL[k], items: its.filter((i) => i.kind === k) })),
        { label: "Other thoughts", items: its.filter((i) => !i.kind) },
      ]);
    }
  }
}

/** Where a thought lives, for jumping to a connection. */
export function homeView(d: Dock, it: Item): View {
  if (it.status === "archived") return "archive";
  if (it.status === "inbox") return "inbox";
  if (it.kind === "task") return "tasks";
  if (it.kind === "event" && it.at) return "calendar";
  return `space:${it.spaceId && d.spaces.some((s) => s.id === it.spaceId) ? it.spaceId : NO_SPACE}`;
}

export const EMPTY: Record<string, string> = {
  inbox: "Inbox clear. Nothing's waiting on you.",
  today: "Nothing due today. Room to think.",
  tasks: "No tasks yet. Press T on any thought to make one.",
  calendar: "No events yet. Press E on a thought to add one.",
  archive: "Nothing archived. Archived thoughts wait here, never deleted.",
  space: "Nothing here yet. Press M on a thought to move it in.",
};
