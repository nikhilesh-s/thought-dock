"use client";
import { useEffect, useRef, useState } from "react";

/** Develop notes under the original text. Autosaves (debounced) and on blur. Key it by item id. */
export function Notes({ initial, onSave, autoFocus }: { initial: string; onSave: (body: string) => void; autoFocus?: boolean }) {
  const [value, setValue] = useState(initial);
  const [saved, setSaved] = useState(true);
  const last = useRef(initial);
  const timer = useRef(0);
  const save = useRef(onSave);
  useEffect(() => { save.current = onSave; });

  const flush = (v: string) => {
    clearTimeout(timer.current);
    if (v === last.current) return;
    last.current = v;
    save.current(v);
    setSaved(true);
  };
  const latest = useRef(value);
  useEffect(() => { latest.current = value; });
  // Save anything pending when the thought changes or the pane closes.
  useEffect(() => () => {
    clearTimeout(timer.current);
    if (latest.current !== last.current) save.current(latest.current);
  }, []);

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor="notes" className="text-[13px] font-semibold text-muted">Notes</label>
        <span aria-live="polite" className="text-[13px] text-muted">{saved ? (value ? "Saved" : "") : "Saving…"}</span>
      </div>
      <textarea
        id="notes"
        autoFocus={autoFocus}
        value={value}
        placeholder="Develop this thought. The original stays as you wrote it."
        onChange={(e) => {
          const v = e.target.value;
          setValue(v);
          setSaved(false);
          clearTimeout(timer.current);
          timer.current = window.setTimeout(() => flush(v), 800);
        }}
        onBlur={(e) => flush(e.target.value)}
        rows={5}
        className="mt-1.5 w-full resize-y rounded-md border border-line bg-surface-2 p-3 text-[17px] leading-normal placeholder:text-muted"
      />
    </div>
  );
}
