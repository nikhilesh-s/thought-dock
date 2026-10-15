import type { Item, Space } from "./types";

const day = 86_400_000;
const ymd = (t: number) => new Date(t).toISOString().slice(0, 10);

// Default spaces every new dock starts with; users rename or remove them.
// Demo items mirror the usability-test scenario in DEMO_SCRIPT.md.
export function seedDemo(now: number, demo: boolean): { spaces: Space[]; items: Item[] } {
  const spaces: Space[] = [
    { id: "sp-classes", name: "Classes", createdAt: now },
    { id: "sp-engineering", name: "Engineering", createdAt: now + 1 },
    { id: "sp-college", name: "College Apps", createdAt: now + 2 },
    { id: "sp-personal", name: "Personal", createdAt: now + 3 },
  ];
  if (!demo) return { spaces, items: [] };

  const base = (id: string, text: string, ago: number, extra: Partial<Item> = {}): Item => ({
    id, text, createdAt: now - ago, updatedAt: now - ago, status: "inbox", links: [], source: "phone", ...extra,
  });
  const items: Item[] = [
    base("demo-deadline", "UC transfer application due Nov 30, need to finish personal insight questions", 3 * 3600_000),
    base("demo-link", "https://www.nsf.gov/funding/undergraduate engineering research link a TA mentioned", 2 * 3600_000, {
      url: "https://www.nsf.gov/funding/",
    }),
    base("demo-idea", "what if the robot arm used a cheaper servo and a 3D printed gearbox", 26 * 3600_000),
    base("demo-worry", "remember to email Professor Lee about missing Thursday's lab", 50 * 60_000),
    base("demo-event", "study group for ENGR 1 thursday 6pm library room 204", 5 * 3600_000),
    base("demo-done-task", "Turn in physics problem set 4", 4 * day, {
      status: "kept", kind: "task", spaceId: "sp-classes", due: ymd(now + day), source: "desk",
    }),
    base("demo-kept-res", "Fusion 360 multiview drawing tutorial", 6 * day, {
      status: "kept", kind: "resource", spaceId: "sp-engineering", source: "desk",
    }),
  ];
  return { spaces, items };
}
