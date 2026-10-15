"use client";
import { ACTIONS, type ActionKey } from "./actions";

/** The seven processing actions, always labeled, with their key as an accelerator. */
export function ActionBar({ onAction, big = false }: { onAction: (a: ActionKey) => void; big?: boolean }) {
  return (
    <div role="group" aria-label="Actions" className={big ? "grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-7" : "flex flex-wrap gap-1.5"}>
      {ACTIONS.map(({ key, label, hotkey, Icon }) => (
        <button
          key={key}
          type="button"
          data-sort-action={big ? key : undefined}
          aria-keyshortcuts={hotkey}
          onClick={() => onAction(key)}
          className={
            big
              ? "flex min-h-[84px] flex-col items-center justify-center gap-1.5 rounded-lg border border-line bg-surface px-2 py-3 text-[15px] font-medium text-text shadow-1 [@media(hover:hover)]:hover:border-line-strong"
              : "flex min-h-10 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-[15px] text-text [@media(hover:hover)]:hover:border-line-strong"
          }
        >
          <Icon size={big ? 22 : 17} className="text-text-2" />
          <span className={big ? "xl:whitespace-nowrap" : undefined}>{label}</span>
          <kbd className={`rounded-sm border border-line bg-surface-2 px-1.5 font-mono text-[13px] leading-5 text-muted ${big ? "" : "ml-0.5"}`}>{hotkey}</kbd>
        </button>
      ))}
    </div>
  );
}
