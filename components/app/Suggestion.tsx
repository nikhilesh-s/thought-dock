"use client";
import { suggestKind } from "@/lib/classifier";
import { KIND_LABEL, type Item, type Kind } from "@/lib/types";
import { KIND_ICON } from "@/components/Icons";
import { KIND_TEXT } from "./KindChip";

const article = (k: Kind) => (k === "event" || k === "idea" ? "an" : "a");

/** Quiet chip: "Looks like a Task" + one click to accept. Never auto-applied. */
export function Suggestion({ item, onTake }: { item: Item; onTake: (k: Kind) => void }) {
  if (item.status !== "inbox") return null;
  const s = suggestKind(item.text);
  if (s.confidence < 0.45) return null;
  const Icon = KIND_ICON[s.kind];
  const name = KIND_LABEL[s.kind];
  return (
    <div className="inline-flex self-start flex-wrap items-center gap-2 rounded-full border border-line bg-surface-2 py-1 pr-1 pl-3.5 text-[15px] text-text-2">
      <span className="inline-flex items-center gap-1.5">
        <Icon size={16} className={KIND_TEXT[s.kind]} />
        Looks like {article(s.kind)} <strong className={`font-semibold ${KIND_TEXT[s.kind]}`}>{name}</strong>
      </span>
      <button type="button" onClick={() => onTake(s.kind)}
        className="min-h-9 rounded-full bg-accent-soft px-3.5 font-medium text-accent [@media(hover:hover)]:hover:bg-accent [@media(hover:hover)]:hover:text-on-accent">
        Make it {article(s.kind)} {name}
      </button>
    </div>
  );
}
