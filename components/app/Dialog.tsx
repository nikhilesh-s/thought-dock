"use client";
import { useEffect, useId, useRef } from "react";

/**
 * Native <dialog> with showModal(): focus trap + Esc for free. Children mount only while
 * open (fresh state, autoFocus works). Focus returns to whatever opened it.
 */
export function Dialog({ open, onClose, title, children, wide }: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const back = useRef<HTMLElement | null>(null);
  const id = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      back.current = document.activeElement as HTMLElement | null;
      d.showModal();
      // React's autoFocus fires before showModal (not focusable yet); data-autofocus picks the target.
      d.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    } else if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={id}
      onClose={() => {
        onClose();
        const b = back.current;
        back.current = null;
        if (b?.isConnected) b.focus();
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className={`sheet m-auto max-h-[min(86dvh,720px)] ${wide ? "w-[min(92vw,560px)]" : "w-[min(92vw,440px)]"} overflow-auto rounded-lg border border-line bg-surface p-0 text-text shadow-2 backdrop:bg-black/35`}
    >
      {open && (
        <div className="p-6">
          <h2 id={id} className="mb-4 text-[20px]">{title}</h2>
          {children}
        </div>
      )}
    </dialog>
  );
}
