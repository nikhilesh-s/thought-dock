"use client";
import { useState } from "react";
import { mediaUrl } from "@/lib/client";
import type { Dock, Item, Kind } from "@/lib/types";
import { ChevronLeftIcon, MicIcon, PhotoIcon, SpaceIcon } from "@/components/Icons";
import { ActionBar } from "./ActionBar";
import { KindChip } from "./KindChip";
import { Notes } from "./Notes";
import { Suggestion } from "./Suggestion";
import { dueWords, whenWords } from "./dates";
import type { ActionKey } from "./actions";

type Props = {
  item: Item;
  dock: Dock;
  showSuggestions: boolean;
  onAction: (a: ActionKey) => void;
  onTake: (k: Kind) => void;
  onEditText: (text: string) => void;
  onSaveNotes: (body: string) => void;
  onJump: (id: string) => void;
  onToggleDone: () => void;
  onIcs: () => void;
  onRestore: () => void;
  onDelete: () => void;
  onBack: () => void;
};

export function Detail(p: Props) {
  const { item, dock } = p;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.text);
  const [mediaFailed, setMediaFailed] = useState(false);
  const space = dock.spaces.find((s) => s.id === item.spaceId);
  const links = item.links.map((id) => dock.items.find((i) => i.id === id)).filter((x): x is Item => !!x);
  const archived = item.status === "archived";
  let host: string | null = null;
  try { host = item.url ? new URL(item.url).hostname.replace(/^www\./, "") : null; } catch {}

  return (
    <article aria-label="Thought" className="mx-auto flex max-w-[68ch] flex-col gap-6 px-6 pt-4 pb-36 lg:px-10 lg:pt-10">
      <button id="sheet-back" type="button" onClick={p.onBack}
        className="-ml-2 flex min-h-11 items-center gap-1 self-start rounded-full pr-3 pl-1 text-accent lg:hidden">
        <ChevronLeftIcon />Back
      </button>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted">
        {item.kind && <KindChip kind={item.kind} />}
        {space && <span className="inline-flex items-center gap-1"><SpaceIcon size={14} />{space.name}</span>}
        {item.kind === "task" && item.due && <span className="tnum">{dueWords(item.due, item.done)}</span>}
        {item.kind === "event" && item.at && <span className="tnum">{whenWords(item.at)}</span>}
        {archived && <span>Archived</span>}
        <span className="tnum">Captured {new Date(item.createdAt).toLocaleString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}{item.source === "phone" ? " on phone" : ""}</span>
      </div>

      {editing ? (
        <form className="flex flex-col gap-2" onSubmit={(e) => { e.preventDefault(); if (draft.trim()) p.onEditText(draft.trim()); setEditing(false); }}>
          <label htmlFor="edit-text" className="text-[13px] font-semibold text-muted">Original text</label>
          <textarea id="edit-text" autoFocus value={draft} onChange={(e) => setDraft(e.target.value)} rows={4}
            onKeyDown={(e) => { if (e.key === "Escape") { e.stopPropagation(); setEditing(false); } }}
            className="w-full resize-y rounded-md border border-line-strong bg-surface p-3 text-[20px] leading-[1.4]" />
          <div className="flex gap-2">
            <button type="submit" className="min-h-10 rounded-full bg-accent px-5 font-semibold text-on-accent">Save text</button>
            <button type="button" onClick={() => setEditing(false)} className="min-h-10 rounded-full px-4 text-text-2 [@media(hover:hover)]:hover:bg-bg-2">Cancel</button>
          </div>
        </form>
      ) : (
        <div>
          <p className={`text-[22px] leading-[1.4] break-words whitespace-pre-wrap ${item.done ? "text-text-2" : "text-text"}`}>{item.text}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            {item.url && host && (
              <a href={item.url} target="_blank" rel="noreferrer noopener" className="text-[15px] text-accent underline-offset-4 hover:underline">
                Open {host}
              </a>
            )}
            <button type="button" onClick={() => { setDraft(item.text); setEditing(true); }}
              className="min-h-9 rounded-full text-[15px] text-text-2 underline-offset-4 [@media(hover:hover)]:hover:underline">
              Edit text
            </button>
          </div>
        </div>
      )}

      {item.media && (mediaFailed ? (
        <p className="flex items-center gap-2 text-[15px] text-muted">
          {item.media.type === "audio" ? <MicIcon size={16} /> : <PhotoIcon size={16} />}
          The {item.media.type === "audio" ? "recording" : "photo"} isn&apos;t available.
        </p>
      ) : item.media.type === "audio" ? (
        <audio controls preload="none" src={mediaUrl(dock.id, item.id)} onError={() => setMediaFailed(true)} className="w-full" aria-label="Voice note" />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- private per-dock media, not optimizable
        <img src={mediaUrl(dock.id, item.id)} alt={`Photo: ${item.text}`} onError={() => setMediaFailed(true)}
          className="max-h-[50vh] self-start rounded-lg border border-line object-contain" />
      ))}

      {p.showSuggestions && <Suggestion item={item} onTake={p.onTake} />}

      {archived ? (
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={p.onRestore} className="min-h-11 rounded-full bg-accent px-5 font-semibold text-on-accent">Restore</button>
          <button type="button" onClick={p.onDelete} className="min-h-11 rounded-full border border-line px-5 text-text-2 [@media(hover:hover)]:hover:bg-bg-2">Delete forever</button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {item.kind === "task" && item.status === "kept" && (
            <label className="flex min-h-11 items-center gap-2.5 self-start text-[15px]">
              <input type="checkbox" checked={!!item.done} onChange={p.onToggleDone} className="size-[18px] accent-(--accent)" />
              Done
            </label>
          )}
          {item.kind === "event" && item.at && (
            <button type="button" onClick={p.onIcs} className="min-h-10 self-start rounded-full bg-accent-soft px-4 text-[15px] font-medium text-accent">
              Add to Calendar
            </button>
          )}
          <ActionBar onAction={p.onAction} />
        </div>
      )}

      <Notes key={item.id} initial={item.body ?? ""} onSave={p.onSaveNotes} />

      <section aria-labelledby="links-h">
        <h3 id="links-h" className="text-[13px] font-semibold tracking-normal text-muted">Connections</h3>
        {links.length === 0 ? (
          <p className="mt-1 text-[15px] text-muted">None yet. Press C to connect related thoughts.</p>
        ) : (
          <ul className="mt-1.5 flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.id}>
                <button type="button" onClick={() => p.onJump(l.id)}
                  className="flex min-h-11 w-full items-center gap-2 rounded-md border border-line bg-surface px-3 text-left text-[15px] [@media(hover:hover)]:hover:border-line-strong">
                  <span className="line-clamp-1 flex-1">{l.text}</span>
                  {l.kind && <KindChip kind={l.kind} size={13} />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}
