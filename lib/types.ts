export const KINDS = ["task", "event", "idea", "resource", "note"] as const;
export type Kind = (typeof KINDS)[number];

export type Status = "inbox" | "kept" | "archived";

export type Item = {
  id: string;
  text: string; // what was captured, verbatim
  body?: string; // "Develop" notes added later
  createdAt: number;
  updatedAt: number;
  status: Status; // inbox until processed; archived is reversible
  kind?: Kind; // set by the user when processing
  spaceId?: string | null;
  due?: string; // task due date, YYYY-MM-DD
  at?: string; // event start, local "YYYY-MM-DDTHH:mm"
  done?: boolean;
  links: string[]; // connected item ids (kept symmetric by the client)
  url?: string; // first URL found in text
  media?: { type: "audio" | "image"; mime: string; ms?: number };
  source?: "phone" | "desk";
};

export type Space = { id: string; name: string; createdAt: number };

export type Dock = { id: string; createdAt: number; items: Item[]; spaces: Space[] };

export type Op =
  | { op: "put"; item: Item }
  | { op: "del"; id: string }
  | { op: "putSpace"; space: Space }
  | { op: "delSpace"; id: string };

export const KIND_LABEL: Record<Kind, string> = {
  task: "Task",
  event: "Event",
  idea: "Idea",
  resource: "Resource",
  note: "Note",
};
