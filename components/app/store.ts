"use client";
import { useSyncExternalStore } from "react";

// localStorage as an external store, so prefs and the saved dock id render without
// hydration mismatches (server snapshot = undefined, meaning "not known yet").
const EVT = "td:store";
function subscribe(cb: () => void) {
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVT, cb);
    window.removeEventListener("storage", cb);
  };
}
function get(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Raw localStorage value: string, null (unset), or undefined during SSR/hydration. */
export function useStored(key: string): string | null | undefined {
  return useSyncExternalStore(subscribe, () => get(key), () => undefined);
}

export function setStored(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {}
  window.dispatchEvent(new Event(EVT));
}

/** Call after lib/client's saveDock() so subscribers re-read. */
export const notifyStored = () => window.dispatchEvent(new Event(EVT));

/** The saved dock id (lib/client stores it JSON-encoded). */
export function useSavedDock(): string | null | undefined {
  const raw = useStored("td:dock");
  if (raw === undefined || raw === null) return raw;
  try {
    return JSON.parse(raw) as string;
  } catch {
    return null;
  }
}

export function reducedMotion() {
  return document.documentElement.dataset.motion === "reduce" || matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Persist a root pref (theme/motion) and apply it to <html data-*> now (layout.tsx re-applies before paint). */
export function setRootPref(name: "theme" | "motion" | "palette", value: string | null) {
  setStored(`td:${name}`, value);
  const ds = document.documentElement.dataset;
  if (value) ds[name] = value;
  else delete ds[name];
}
