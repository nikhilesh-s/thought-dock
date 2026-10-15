"use client";
import { Dialog } from "./Dialog";

export type Confirm = { title: string; body: string; action: string; run: () => void };

export function ConfirmDialog({ confirm, onClose }: { confirm: Confirm | null; onClose: () => void }) {
  return (
    <Dialog open={!!confirm} onClose={onClose} title={confirm?.title ?? ""}>
      {confirm && (
        <>
          <p className="text-[15px] text-text-2">{confirm.body}</p>
          <div className="mt-6 flex justify-end gap-2">
            <button type="button" autoFocus onClick={onClose} className="min-h-11 rounded-full px-5 text-text [@media(hover:hover)]:hover:bg-bg-2">Cancel</button>
            <button type="button" onClick={() => { confirm.run(); onClose(); }} className="min-h-11 rounded-full bg-ink px-5 font-semibold text-on-ink">
              {confirm.action}
            </button>
          </div>
        </>
      )}
    </Dialog>
  );
}
