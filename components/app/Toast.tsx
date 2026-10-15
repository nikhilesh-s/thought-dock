"use client";
import { useCallback, useEffect, useState } from "react";

export type ToastMsg = { id: number; text: string; undo?: boolean; warn?: boolean };

export function useToast() {
  const [toast, setToast] = useState<ToastMsg | null>(null);
  const show = useCallback((text: string, opts: { undo?: boolean; warn?: boolean } = {}) => {
    setToast({ id: Date.now(), text, ...opts });
  }, []);
  const clear = useCallback(() => setToast(null), []);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast((x) => (x?.id === toast.id ? null : x)), toast.undo ? 7000 : 4000);
    return () => clearTimeout(t);
  }, [toast]);
  return { toast, show, clear };
}

/** Always-mounted polite live region; the visible pill rises in when there's a message. */
export function Toast({ toast, onUndo, className = "" }: { toast: ToastMsg | null; onUndo: () => void; className?: string }) {
  return (
    <div role="status" aria-live="polite" className={`pointer-events-none fixed z-40 flex justify-center ${className}`}>
      {toast && (
        <div key={toast.id} className="rise pointer-events-auto flex min-h-11 items-center gap-3 rounded-full bg-ink py-1.5 pr-1.5 pl-5 text-[15px] text-on-ink shadow-2">
          <span className={toast.warn ? "font-medium" : undefined}>{toast.text}</span>
          {toast.undo ? (
            <button type="button" onClick={onUndo}
              className="min-h-9 rounded-full px-4 font-semibold text-on-ink underline-offset-4 [@media(hover:hover)]:hover:underline">
              Undo
            </button>
          ) : <span className="w-3" />}
        </div>
      )}
    </div>
  );
}
