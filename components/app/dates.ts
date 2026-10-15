// Local-date helpers. Dates are "YYYY-MM-DD" (due) or "YYYY-MM-DDTHH:mm" (event start), local time.
const DAY = 86_400_000;
const p = (n: number) => String(n).padStart(2, "0");

export const ymd = (d: Date) => `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
export const todayYmd = () => ymd(new Date());
export const startOfToday = () => new Date(new Date().setHours(0, 0, 0, 0)).getTime();
const parse = (s: string) => {
  const [y, m, d] = s.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
};
/** Whole days from today to `s` (negative = past). */
export const daysFromToday = (s: string) => Math.round((parse(s).getTime() - parse(todayYmd()).getTime()) / DAY);

const weekday = (s: string) => parse(s).toLocaleDateString(undefined, { weekday: "short" });
const monthDay = (s: string) => parse(s).toLocaleDateString(undefined, { month: "short", day: "numeric" });

/** "Due today", "Due Thu", "Was due Tue". Never alarming. */
export function dueWords(due: string, done?: boolean) {
  const n = daysFromToday(due);
  if (done) return "Done";
  if (n === 0) return "Due today";
  if (n === 1) return "Due tomorrow";
  if (n > 1 && n < 7) return `Due ${weekday(due)}`;
  if (n > 0) return `Due ${monthDay(due)}`;
  if (n === -1) return "Was due yesterday";
  if (n > -7) return `Was due ${weekday(due)}`;
  return `Was due ${monthDay(due)}`;
}

export function dayLabel(s: string) {
  const n = daysFromToday(s);
  if (n === 0) return "Today";
  if (n === 1) return "Tomorrow";
  if (n === -1) return "Yesterday";
  return parse(s).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}

export const timeLabel = (at: string) =>
  new Date(at).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

export function whenWords(at: string) {
  return `${dayLabel(at)}, ${timeLabel(at)}`;
}

export function ago(ts: number) {
  const m = Math.round((Date.now() - ts) / 60_000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m} min ago`;
  if (ts >= startOfToday()) return new Date(ts).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
  return dayLabel(ymd(new Date(ts)));
}
