import { KIND_LABEL, type Kind } from "@/lib/types";
import { KIND_ICON } from "@/components/Icons";

export const KIND_TEXT: Record<Kind, string> = {
  task: "text-k-task",
  event: "text-k-event",
  idea: "text-k-idea",
  resource: "text-k-resource",
  note: "text-k-note",
};

/** Kind tint only ever appears with its icon AND its word. */
export function KindChip({ kind, size = 14 }: { kind: Kind; size?: number }) {
  const Icon = KIND_ICON[kind];
  return (
    <span className={`inline-flex items-center gap-1 text-[13px] font-medium ${KIND_TEXT[kind]}`}>
      <Icon size={size} />
      {KIND_LABEL[kind]}
    </span>
  );
}
