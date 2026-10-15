"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Dock, Item, Op } from "./types";

// --- local storage (wrapped: private mode can throw) ----------------------------------
const DOCK_KEY = "td:dock";
const queueKey = (id: string) => `td:queue:${id}`;
const cacheKey = (id: string) => `td:cache:${id}`;
function read<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, v: unknown) {
  try {
    if (v === null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(v));
  } catch {}
}

export const getSavedDock = () => read<string | null>(DOCK_KEY, null);
export const saveDock = (id: string | null) => write(DOCK_KEY, id);

// --- ids + item helpers -----------------------------------------------------------------
const B62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
export function newId(prefix = "i") {
  const b = crypto.getRandomValues(new Uint8Array(14));
  return prefix + Array.from(b, (x) => B62[x % 62]).join("");
}
const URL_RE = /https?:\/\/[^\s<>"']+/i;
export function newItem(text: string, source: Item["source"], extra: Partial<Item> = {}): Item {
  const now = Date.now();
  const url = text.match(URL_RE)?.[0];
  return { id: newId(), text: text.trim(), createdAt: now, updatedAt: now, status: "inbox", links: [], source, ...(url ? { url } : {}), ...extra };
}
/** Returns a copy with changes + fresh updatedAt. */
export const edit = (it: Item, changes: Partial<Item>): Item => ({ ...it, ...changes, updatedAt: Date.now() });

// --- network ------------------------------------------------------------------------------
export async function createDock(demo = false): Promise<Dock> {
  const r = await fetch("/api/dock", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ demo }) });
  if (!r.ok) throw new Error("Couldn't create a dock");
  return r.json();
}
export async function requestPair(dock: string): Promise<{ code: string; expiresAt: number }> {
  const r = await fetch("/api/pair", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ dock }) });
  if (!r.ok) throw new Error("Couldn't make a pairing code");
  return r.json();
}
export async function redeemPair(code: string): Promise<string> {
  const r = await fetch(`/api/pair?code=${encodeURIComponent(code)}`, { cache: "no-store" });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error ?? "That code didn't match.");
  return j.dock;
}
export const mediaUrl = (dock: string, item: string) => `/api/dock/${dock}/media/${item}`;
export async function uploadMedia(dock: string, item: string, dataUrl: string) {
  const r = await fetch(mediaUrl(dock, item), { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ dataUrl }) });
  if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error ?? "Upload failed");
}
export function blobToDataUrl(b: Blob): Promise<string> {
  return new Promise((res, rej) => {
    const fr = new FileReader();
    fr.onload = () => res(fr.result as string);
    fr.onerror = rej;
    fr.readAsDataURL(b);
  });
}

// --- applying ops locally (same semantics as the server) ----------------------------------
export function applyLocal(d: Dock, ops: Op[]): Dock {
  const items = new Map(d.items.map((i) => [i.id, i]));
  const spaces = new Map(d.spaces.map((s) => [s.id, s]));
  for (const o of ops) {
    if (o.op === "put") items.set(o.item.id, o.item);
    else if (o.op === "del") items.delete(o.id);
    else if (o.op === "putSpace") spaces.set(o.space.id, o.space);
    else spaces.delete(o.id);
  }
  return { ...d, items: [...items.values()], spaces: [...spaces.values()] };
}

export type SyncState = "loading" | "synced" | "saving" | "offline" | "missing";
type UndoEntry = { label: string; ops: Op[] };

/**
 * The one hook both screens use. Optimistic: every change shows instantly, is queued in
 * localStorage, and flushes to the server; failed flushes retry on reconnect, so capture
 * never loses a thought to a bad connection. Undo replays inverse ops.
 */
export function useDock(id: string | null, pollMs = 4000) {
  const [dock, setDock] = useState<Dock | null>(null);
  const [state, setState] = useState<SyncState>("loading");
  const undoStack = useRef<UndoEntry[]>([]);
  const [lastUndo, setLastUndo] = useState<string | null>(null);
  const queue = useRef<Op[]>([]);
  const flushing = useRef(false);
  const server = useRef<Dock | null>(null);
  const flushRef = useRef<() => void>(() => {});
  const flushes = useRef(0); // bumps on every successful flush; a GET that raced one is stale

  const recompute = useCallback(() => {
    if (server.current) setDock(applyLocal(server.current, queue.current));
  }, []);

  const flush = useCallback(async () => {
    if (!id || flushing.current || queue.current.length === 0) return;
    flushing.current = true;
    const batch = queue.current.slice(0, 200);
    setState("saving");
    let retry = 3000;
    try {
      const r = await fetch(`/api/dock/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ ops: batch }) });
      if (r.status === 404) { retry = -1; setState("missing"); return; }
      if (!r.ok) throw new Error(String(r.status));
      flushes.current++;
      retry = 0; // more queued while we were saving: send it now, not in 3s
      queue.current = queue.current.slice(batch.length);
      if (server.current) server.current = applyLocal(server.current, batch);
      write(queueKey(id), queue.current);
      setState(queue.current.length ? "saving" : "synced");
    } catch {
      setState("offline");
    } finally {
      flushing.current = false;
      if (retry >= 0 && queue.current.length && navigator.onLine) setTimeout(() => flushRef.current(), retry);
    }
  }, [id]);

  useEffect(() => { flushRef.current = flush; }, [flush]);

  const load = useCallback(async () => {
    if (!id) return;
    const seen = flushes.current;
    try {
      const r = await fetch(`/api/dock/${id}`, { cache: "no-store" });
      if (r.status === 404) { setState("missing"); return; }
      if (!r.ok) throw new Error(String(r.status));
      const fresh = (await r.json()) as Dock;
      if (flushing.current || seen !== flushes.current) return; // raced a write; next poll is accurate
      server.current = fresh;
      write(cacheKey(id), server.current);
      recompute();
      setState((s) => (queue.current.length ? s : "synced"));
    } catch {
      setState("offline");
    }
  }, [id, recompute]);

  useEffect(() => {
    if (!id) return;
    queue.current = read<Op[]>(queueKey(id), []);
    const cached = read<Dock | null>(cacheKey(id), null);
    if (cached) { server.current = cached; recompute(); }
    // Syncing with an external store (server + localStorage); setState happens after awaits.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load().then(flush);
    const t = setInterval(() => { if (document.visibilityState === "visible" && !flushing.current) load(); }, pollMs);
    const on = () => { load(); flush(); };
    window.addEventListener("online", on);
    window.addEventListener("focus", on);
    return () => { clearInterval(t); window.removeEventListener("online", on); window.removeEventListener("focus", on); };
  }, [id, pollMs, load, flush, recompute]);

  /** Apply ops now. Pass `undo` (inverse ops) + `label` to make it undoable. */
  const apply = useCallback((ops: Op[], undo?: { label: string; ops: Op[] }) => {
    if (!id) return;
    queue.current = [...queue.current, ...ops];
    write(queueKey(id), queue.current);
    if (!server.current) server.current = { id, createdAt: Date.now(), items: [], spaces: [] };
    recompute();
    if (undo) {
      undoStack.current = [...undoStack.current.slice(-29), undo];
      setLastUndo(undo.label);
    }
    flush();
  }, [id, flush, recompute]);

  const undo = useCallback(() => {
    const last = undoStack.current.pop();
    if (!last || !id) return null;
    queue.current = [...queue.current, ...last.ops];
    write(queueKey(id), queue.current);
    recompute();
    flush();
    setLastUndo(undoStack.current[undoStack.current.length - 1]?.label ?? null);
    return last.label;
  }, [id, flush, recompute]);

  return { dock, state, apply, undo, lastUndo, reload: load };
}

/** .ics for one event or task, so it opens in Apple/Google/Outlook Calendar with no OAuth. */
export function toIcs(it: Item): string {
  const esc = (s: string) => s.replace(/[\\;,]/g, (m) => "\\" + m).replace(/\n/g, "\\n");
  const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  let when: string;
  if (it.at) {
    const s = it.at.replace(/[-:]/g, "") + "00";
    const end = new Date(new Date(it.at).getTime() + 3600_000);
    const p = (n: number) => String(n).padStart(2, "0");
    const e = `${end.getFullYear()}${p(end.getMonth() + 1)}${p(end.getDate())}T${p(end.getHours())}${p(end.getMinutes())}00`;
    when = `DTSTART:${s}\r\nDTEND:${e}`;
  } else {
    const d = (it.due ?? new Date().toISOString().slice(0, 10)).replace(/-/g, "");
    when = `DTSTART;VALUE=DATE:${d}`;
  }
  return [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Thought Dock//EN", "BEGIN:VEVENT",
    `UID:${it.id}@thoughtdock`, `DTSTAMP:${stamp}`, when,
    `SUMMARY:${esc(it.text.slice(0, 200))}`,
    ...(it.body ? [`DESCRIPTION:${esc(it.body.slice(0, 1000))}`] : []),
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
}
export function downloadIcs(it: Item) {
  const url = URL.createObjectURL(new Blob([toIcs(it)], { type: "text/calendar" }));
  const a = Object.assign(document.createElement("a"), { href: url, download: "thought-dock-event.ics" });
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
