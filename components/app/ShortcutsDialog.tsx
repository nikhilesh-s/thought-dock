"use client";
import { Dialog } from "./Dialog";
import { ACTIONS } from "./actions";

const KEYS: [string, string][] = [
  ...ACTIONS.map((a): [string, string] => [a.hotkey, a.label]),
  ["U  ·  ⌘Z", "Undo"],
  ["J / ↓  ·  ↑", "Next / previous thought"],
  ["→ / ←", "Next / previous in Sort"],
  ["N  ·  ⌘K", "Capture (focus the Dock)"],
  ["Esc", "Leave Sort, close a sheet"],
  ["?", "This list"],
];

export function ShortcutsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose} title="Keyboard shortcuts">
      <p className="mb-3 text-[15px] text-text-2">Letter keys work when you&apos;re not typing in a field.</p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2 text-[15px]">
        {KEYS.map(([k, what]) => (
          <div key={what} className="contents">
            <dt><kbd className="rounded-sm border border-line bg-surface-2 px-2 py-0.5 font-mono text-[13px] whitespace-pre">{k}</kbd></dt>
            <dd>{what}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 flex justify-end">
        <button type="button" autoFocus onClick={onClose} className="min-h-11 rounded-full bg-ink px-6 font-semibold text-on-ink">Done</button>
      </div>
    </Dialog>
  );
}
