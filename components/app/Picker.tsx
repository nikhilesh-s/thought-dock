"use client";
import { useId, useState } from "react";
import { PlusIcon } from "@/components/Icons";

export type Option = { id: string; label: string; hint?: string };

/** Type to filter, ↑/↓ to move, Enter to pick. With onCreate, Enter on no match creates. */
export function Picker({ options, onPick, onCreate, label, placeholder, empty }: {
  options: Option[];
  onPick: (id: string) => void;
  onCreate?: (name: string) => void;
  label: string;
  placeholder: string;
  empty: string;
}) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const base = useId();
  const needle = q.trim().toLowerCase();
  const shown = options.filter((o) => o.label.toLowerCase().includes(needle)).slice(0, 60);
  const canCreate = !!onCreate && needle.length > 0 && !options.some((o) => o.label.toLowerCase() === needle);
  const total = shown.length + (canCreate ? 1 : 0);
  const choose = (i: number) => {
    if (i < shown.length) onPick(shown[i].id);
    else if (canCreate) onCreate!(q.trim().slice(0, 60));
  };

  return (
    <div>
      <label htmlFor={`${base}-q`} className="sr-only">{label}</label>
      <input
        id={`${base}-q`}
        autoFocus
        role="combobox"
        aria-expanded="true"
        aria-controls={`${base}-list`}
        aria-activedescendant={total ? `${base}-${Math.min(active, total - 1)}` : undefined}
        autoComplete="off"
        value={q}
        placeholder={placeholder}
        onChange={(e) => { setQ(e.target.value); setActive(0); }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, total - 1)); }
          else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
          else if (e.key === "Enter") { e.preventDefault(); if (total) choose(Math.min(active, total - 1)); }
        }}
        className="min-h-11 w-full rounded-md border border-line-strong bg-surface-2 px-3.5 text-[17px] placeholder:text-muted"
      />
      <ul id={`${base}-list`} role="listbox" aria-label={label} className="mt-2 flex max-h-[min(50dvh,360px)] flex-col gap-0.5 overflow-auto">
        {shown.map((o, i) => (
          <li key={o.id} id={`${base}-${i}`} role="option" aria-selected={i === active}
            onClick={() => choose(i)} onMouseMove={() => setActive(i)}
            className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-[15px] ${i === active ? "bg-accent-soft" : ""}`}>
            <span className="line-clamp-2 flex-1">{o.label}</span>
            {o.hint && <span className="shrink-0 text-[13px] text-muted">{o.hint}</span>}
          </li>
        ))}
        {canCreate && (
          <li id={`${base}-${shown.length}`} role="option" aria-selected={active === shown.length}
            onClick={() => choose(shown.length)} onMouseMove={() => setActive(shown.length)}
            className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-md px-3 text-[15px] text-accent ${active === shown.length ? "bg-accent-soft" : ""}`}>
            <PlusIcon size={16} />Create “{q.trim()}”
          </li>
        )}
        {total === 0 && <li className="px-3 py-2 text-[15px] text-muted">{empty}</li>}
      </ul>
    </div>
  );
}
