"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { blobToDataUrl, newItem, redeemPair, saveDock, uploadMedia, useDock } from "@/lib/client";
import type { Item } from "@/lib/types";
import { CloseIcon, Logo, MicIcon, PhotoIcon } from "@/components/Icons";
import { FirstRun } from "./FirstRun";
import { SyncStatus } from "./SyncStatus";
import { Toast, useToast } from "./Toast";
import { downscaleImage, useRecorder } from "./useRecorder";
import { notifyStored, useSavedDock } from "./store";
import { ago, startOfToday } from "./dates";

const noSub = () => () => {};
const pairParam = () => new URLSearchParams(location.search).get("pair");

export function CaptureApp() {
  const dockId = useSavedDock();
  const pairCode = useSyncExternalStore(noSub, pairParam, () => null);
  const [pairError, setPairError] = useState<string | null>(null);

  // ?pair=CODE from the desk's QR code: redeem, save, then drop the code from the URL.
  useEffect(() => {
    if (!pairCode) return;
    let live = true;
    redeemPair(pairCode)
      .then((id) => { saveDock(id); })
      .catch((e: Error) => { if (live) setPairError(e.message); })
      .finally(() => {
        history.replaceState(null, "", "/capture");
        notifyStored();
      });
    return () => { live = false; };
  }, [pairCode]);

  if (dockId === undefined || (pairCode && !pairError)) {
    return (
      <main className="grid min-h-dvh place-items-center text-[15px] text-muted" aria-busy="true">
        {pairCode ? "Pairing with your desk…" : null}
      </main>
    );
  }
  if (!dockId) return <FirstRun initialError={pairError} />;
  return <CaptureScreen key={dockId} dockId={dockId} />;
}

function CaptureScreen({ dockId }: { dockId: string }) {
  const { dock, state, apply, undo } = useDock(dockId);
  const { toast, show, clear } = useToast();
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const before = useRef(""); // text that was there when recording started
  const rec = useRecorder((t) => setText(before.current ? `${before.current} ${t}` : t));
  const recording = rec.status === "recording";

  async function addPhoto(file: Blob) {
    setPhotoError(null);
    try {
      setPhoto(await downscaleImage(file));
    } catch {
      setPhotoError("That photo couldn't be read. Try another one.");
    }
  }

  // Paste an image anywhere on the screen.
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const f = [...(e.clipboardData?.files ?? [])].find((x) => x.type.startsWith("image/"));
      if (f) { e.preventDefault(); addPhoto(f); }
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, []);

  async function save() {
    const clip = recording ? await rec.stop() : rec.clip;
    const t = text.trim();
    if (!t && !clip && !photo) return;
    const media: Item["media"] = clip ? { type: "audio", mime: clip.mime, ms: clip.ms } : photo ? { type: "image", mime: "image/jpeg" } : undefined;
    const item = newItem(t || (clip ? "Voice note" : "Photo"), "phone", media ? { media } : {});
    apply([{ op: "put", item }], { label: "Captured", ops: [{ op: "del", id: item.id }] });
    const img = photo;
    setText("");
    setPhoto(null);
    rec.discard();
    show("Saved to your inbox", { undo: true });
    field.current?.focus();
    if (!media) return;
    try {
      await uploadMedia(dockId, item.id, clip ? await blobToDataUrl(clip.blob) : img!);
    } catch {
      // ponytail: media isn't queued offline; the text is. Queue blobs in IndexedDB if this bites.
      show(`Saved, but the ${clip ? "recording" : "photo"} couldn't upload. Only the text was kept.`, { warn: true });
    }
  }

  async function toggleMic() {
    if (recording) { await rec.stop(); return; }
    before.current = text.trim();
    rec.discard();
    await rec.start();
  }

  const todays = (dock?.items ?? [])
    .filter((i) => i.status === "inbox" && i.createdAt >= startOfToday())
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 5);
  const canSave = Boolean(text.trim() || rec.clip || photo || recording);

  if (state === "missing") {
    return (
      <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6">
        <h1 className="text-[28px]">Couldn&apos;t find this dock</h1>
        <p className="mt-2 text-text-2">It may have expired, or the link was mistyped. Pair again to keep capturing.</p>
        <button type="button" onClick={() => { saveDock(null); notifyStored(); }}
          className="mt-6 min-h-12 self-start rounded-full bg-accent px-6 font-semibold text-on-accent">
          Set up again
        </button>
      </main>
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col px-5 pt-[max(env(safe-area-inset-top),12px)] pb-[calc(max(env(safe-area-inset-bottom),16px)+96px)]">
      <header className="flex min-h-11 items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-[15px] font-semibold"><Logo size={22} />Thought Dock</span>
        <a href="/desk" className="rounded-md px-1 text-[15px] text-accent">Open your desk</a>
      </header>
      <SyncStatus state={state} className="mb-3" />

      <main className="flex flex-1 flex-col">
        <label htmlFor="capture-field" className="sr-only">What&apos;s on your mind?</label>
        <textarea
          id="capture-field"
          ref={field}
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); save(); }
          }}
          placeholder="What's on your mind?"
          className="min-h-[34dvh] w-full resize-none rounded-lg border border-line bg-surface p-5 text-[20px] leading-[1.4] shadow-1 placeholder:text-muted"
        />

        {(recording || rec.clip || photo || rec.status === "denied" || rec.status === "unsupported" || photoError) && (
          <div className="mt-3 flex flex-col gap-2">
            {recording && (
              <p className="flex items-center gap-2 text-[15px] text-text-2">
                <span aria-hidden className="rec-dot size-2.5 rounded-full bg-accent" />
                Recording. <span className="tnum">{rec.left}s</span> left. Tap Stop when you&apos;re done.
              </p>
            )}
            {rec.clip && !recording && (
              <div className="flex items-center gap-2 rounded-md border border-line bg-surface p-2">
                <audio controls src={rec.clip.url} className="h-10 min-w-0 flex-1" aria-label="Your voice note" />
                <button type="button" onClick={rec.discard} aria-label="Remove voice note" title="Remove voice note"
                  className="grid size-11 place-items-center rounded-full text-text-2 [@media(hover:hover)]:hover:bg-bg-2">
                  <CloseIcon />
                </button>
              </div>
            )}
            {photo && (
              <div className="flex items-start gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element -- local data URL preview */}
                <img src={photo} alt="Photo to save" className="max-h-40 rounded-md border border-line object-cover" />
                <button type="button" onClick={() => setPhoto(null)} aria-label="Remove photo" title="Remove photo"
                  className="grid size-11 place-items-center rounded-full text-text-2 [@media(hover:hover)]:hover:bg-bg-2">
                  <CloseIcon />
                </button>
              </div>
            )}
            {rec.status === "denied" && <p role="alert" className="text-[15px] text-text-2">Microphone access is off for this site. You can still type, or turn the mic on in your browser settings.</p>}
            {rec.status === "unsupported" && <p role="alert" className="text-[15px] text-text-2">This browser can&apos;t record audio here. Typing still works.</p>}
            {photoError && <p role="alert" className="text-[15px] text-warn">{photoError}</p>}
          </div>
        )}

        <section aria-labelledby="today-h" className="mt-8">
          <h2 id="today-h" className="text-[13px] font-semibold tracking-normal text-muted">Today&apos;s captures</h2>
          {todays.length === 0 ? (
            <p className="mt-2 text-[15px] text-muted">{dock ? "Nothing yet today." : "Loading…"}</p>
          ) : (
            <ul className="mt-2 divide-y divide-line">
              {todays.map((i) => (
                <li key={i.id} className="flex items-start gap-2 py-2.5 text-[15px]">
                  {i.media?.type === "audio" && <MicIcon size={16} className="mt-0.5 shrink-0 text-text-2" title="Voice note" />}
                  {i.media?.type === "image" && <PhotoIcon size={16} className="mt-0.5 shrink-0 text-text-2" title="Photo" />}
                  <span className="line-clamp-2 min-w-0 flex-1">{i.text}</span>
                  <span className="tnum shrink-0 text-[13px] text-muted">{ago(i.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <Toast toast={toast} onUndo={() => { undo(); clear(); }} className="inset-x-0 bottom-[calc(max(env(safe-area-inset-bottom),16px)+80px)]" />

      {/* The Dock */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-[max(env(safe-area-inset-bottom),16px)]">
        <div className="flex w-full max-w-md items-center gap-1.5 rounded-full border border-line bg-sidebar p-2 shadow-2 backdrop-blur-xl">
          <button type="button" onClick={toggleMic} aria-pressed={recording}
            className={`flex min-h-12 items-center gap-2 rounded-full px-4 font-medium ${recording ? "bg-accent-soft text-accent" : "text-text [@media(hover:hover)]:hover:bg-bg-2"}`}>
            {recording ? <span aria-hidden className="rec-dot size-2.5 rounded-full bg-accent" /> : <MicIcon />}
            {recording ? <span>Stop <span className="tnum">{rec.left}s</span></span> : "Voice"}
          </button>
          <button type="button" onClick={() => fileInput.current?.click()}
            className="flex min-h-12 items-center gap-2 rounded-full px-4 font-medium text-text [@media(hover:hover)]:hover:bg-bg-2">
            <PhotoIcon />Photo
          </button>
          <input ref={fileInput} type="file" accept="image/*" capture="environment" className="sr-only" tabIndex={-1} aria-hidden
            onChange={(e) => { const f = e.target.files?.[0]; if (f) addPhoto(f); e.target.value = ""; }} />
          <button type="button" onClick={save} disabled={!canSave}
            className="ml-auto min-h-12 rounded-full bg-accent px-7 font-semibold text-on-accent [@media(hover:hover)]:hover:bg-accent-hover">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
