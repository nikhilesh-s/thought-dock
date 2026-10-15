import type { SyncState } from "@/lib/client";
import { CheckIcon, CloudIcon } from "@/components/Icons";

const WORDS: Record<SyncState, string> = {
  loading: "Loading…",
  synced: "Saved",
  saving: "Saving…",
  offline: "Offline, will sync when you're back",
  missing: "Couldn't find this dock",
};

/** Sync state in words + icon, never color alone. */
export function SyncStatus({ state, className = "" }: { state: SyncState; className?: string }) {
  return (
    <p role="status" aria-live="polite"
      className={`flex items-center gap-1.5 text-[13px] ${state === "missing" ? "text-warn" : "text-muted"} ${className}`}>
      {state === "synced" ? <CheckIcon size={14} /> : <CloudIcon size={14} />}
      {WORDS[state]}
    </p>
  );
}
