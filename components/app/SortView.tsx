"use client";
import type { Item, Kind } from "@/lib/types";
import { ChevronLeftIcon, ChevronRightIcon, MicIcon, PhotoIcon } from "@/components/Icons";
import { ActionBar } from "./ActionBar";
import { Notes } from "./Notes";
import { Suggestion } from "./Suggestion";
import { ago } from "./dates";
import { reducedMotion } from "./store";
import type { ActionKey } from "./actions";

/**
 * Slide the card 24px toward the button of the action taken, fading out (200ms). The one
 * place motion carries meaning: "it went somewhere". Reduced motion: fade only.
 */
export async function sortLeave(action: ActionKey) {
  const card = document.getElementById("sort-card");
  if (!card) return;
  const reduce = reducedMotion();
  let to: Keyframe = { opacity: 0 };
  const btn = document.querySelector(`[data-sort-action="${action}"]`);
  if (btn && !reduce) {
    const a = card.getBoundingClientRect();
    const b = btn.getBoundingClientRect();
    const vx = b.x + b.width / 2 - (a.x + a.width / 2);
    const vy = b.y + b.height / 2 - (a.y + a.height / 2);
    const len = Math.hypot(vx, vy) || 1;
    to = { opacity: 0, transform: `translate(${(vx / len) * 24}px, ${(vy / len) * 24}px)` };
  }
  await card
    .animate([{ opacity: 1, transform: "none" }, to], { duration: reduce ? 120 : 200, easing: "cubic-bezier(0.23, 1, 0.32, 1)", fill: "forwards" })
    .finished.catch(() => {});
}

type Props = {
  item: Item | null;
  position: number;
  total: number;
  rising: boolean;
  developing: boolean;
  showSuggestions: boolean;
  canPrev: boolean;
  canNext: boolean;
  onAction: (a: ActionKey) => void;
  onTake: (k: Kind) => void;
  onSaveNotes: (body: string) => void;
  onSkip: (d: 1 | -1) => void;
  onExit: () => void;
};

export function SortView(p: Props) {
  return (
    <section aria-labelledby="sort-h" className="flex min-h-full flex-col px-5 pt-5 pb-36 lg:px-10">
      <div className="flex items-center justify-between gap-3">
        <button type="button" onClick={p.onExit}
          className="-ml-2 flex min-h-11 items-center gap-1 rounded-full pr-3 pl-1 text-accent [@media(hover:hover)]:hover:bg-accent-soft">
          <ChevronLeftIcon />Done sorting
        </button>
        <h1 id="sort-h" className="sr-only">Sort</h1>
        {p.item && (
          <div className="flex items-center gap-1">
            <button type="button" onClick={() => p.onSkip(-1)} disabled={!p.canPrev} aria-label="Previous thought" title="Previous (←)"
              className="grid size-11 place-items-center rounded-full text-text-2 [@media(hover:hover)]:hover:bg-bg-2">
              <ChevronLeftIcon />
            </button>
            <p className="tnum min-w-16 text-center text-[15px] text-text-2" aria-live="polite">{p.position} of {p.total}</p>
            <button type="button" onClick={() => p.onSkip(1)} disabled={!p.canNext} aria-label="Next thought" title="Next (→)"
              className="grid size-11 place-items-center rounded-full text-text-2 [@media(hover:hover)]:hover:bg-bg-2">
              <ChevronRightIcon />
            </button>
          </div>
        )}
      </div>

      {!p.item ? (
        <div className="rise m-auto flex max-w-md flex-col items-center py-16 text-center">
          <h2 className="text-[28px]">Inbox clear.</h2>
          <p className="mt-2 text-text-2">Nothing&apos;s waiting on you.</p>
          <button type="button" autoFocus onClick={p.onExit} className="mt-6 min-h-11 rounded-full bg-ink px-6 font-semibold text-on-ink">Back to your desk</button>
        </div>
      ) : (
        <div className="mx-auto mt-6 flex w-full max-w-5xl flex-1 flex-col justify-center gap-8">
          <div id="sort-card" key={p.item.id}
            className={`${p.rising ? "rise" : ""} flex min-h-[260px] flex-col justify-center gap-5 mx-auto w-full max-w-3xl rounded-xl border border-line bg-surface px-8 py-10 shadow-1 lg:px-14`}>
            <p className="text-[13px] text-muted">
              <span className="tnum">{ago(p.item.createdAt)}</span>
              {p.item.media?.type === "audio" && <span className="ml-2 inline-flex items-center gap-1 align-middle"><MicIcon size={13} />Voice</span>}
              {p.item.media?.type === "image" && <span className="ml-2 inline-flex items-center gap-1 align-middle"><PhotoIcon size={13} />Photo</span>}
            </p>
            <p className="text-[clamp(1.5rem,2.6vw,2.1rem)] leading-[1.3] font-medium tracking-[-0.02em] break-words whitespace-pre-wrap text-balance">
              {p.item.text}
            </p>
            {p.showSuggestions && <div><Suggestion item={p.item} onTake={p.onTake} /></div>}
            {p.developing && <Notes key={p.item.id} initial={p.item.body ?? ""} onSave={p.onSaveNotes} autoFocus />}
          </div>
          <ActionBar big onAction={p.onAction} />
          <p className="text-center text-[13px] text-muted">Press a letter to act, ← → to skip, Esc when you&apos;re done.</p>
        </div>
      )}
    </section>
  );
}
