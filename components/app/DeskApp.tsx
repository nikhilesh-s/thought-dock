"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { createDock, downloadIcs, edit, newId, newItem, saveDock, useDock } from "@/lib/client";
import type { Dock, Item, Kind } from "@/lib/types";
import { GearIcon, Logo, PhoneIcon, SortIcon } from "@/components/Icons";
import * as A from "./actions";
import { ActionDialog, type Pending } from "./ActionDialog";
import { ConfirmDialog, type Confirm } from "./ConfirmDialog";
import { DeskDock } from "./DeskDock";
import { Detail } from "./Detail";
import { ItemList } from "./ItemList";
import { PairDialog } from "./PairDialog";
import { SettingsDialog } from "./SettingsDialog";
import { ShortcutsDialog } from "./ShortcutsDialog";
import { Sidebar } from "./Sidebar";
import { SortView, sortLeave } from "./SortView";
import { Toast, useToast } from "./Toast";
import { notifyStored, useSavedDock, useStored } from "./store";
import { EMPTY, NO_SPACE, groupsFor, homeView, inboxOf, type View } from "./views";

let creating: Promise<void> | null = null; // one dock per first visit, even under StrictMode

export function DeskApp() {
  const dockId = useSavedDock();
  const [error, setError] = useState<string | null>(null);

  // First visit: make a demo dock so there's something to sort.
  useEffect(() => {
    if (dockId !== null) return;
    creating ??= createDock(true)
      .then((d) => { saveDock(d.id); notifyStored(); })
      .finally(() => { creating = null; });
    creating.catch(() => setError("Couldn't set up your desk. Check your connection and try again."));
  }, [dockId]);

  if (dockId) return <Desk key={dockId} dockId={dockId} />;
  if (error) {
    return (
      <Centered title="Your desk isn't ready yet" body={error}>
        <button type="button" onClick={() => location.reload()} className="mt-6 min-h-11 rounded-full bg-ink px-6 font-semibold text-on-ink">Try again</button>
      </Centered>
    );
  }
  return <Shell />;
}

function Centered({ title, body, children }: { title: string; body: string; children?: React.ReactNode }) {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col items-start justify-center px-6">
      <Logo size={36} />
      <h1 className="mt-5 text-[28px]">{title}</h1>
      <p className="mt-2 text-text-2">{body}</p>
      {children}
    </main>
  );
}

/** Loading skeleton: the real layout with quiet placeholder rows, no spinner. */
function Shell() {
  return (
    <div className="lg:grid lg:h-dvh lg:grid-cols-[248px_360px_1fr]" aria-busy="true">
      <div className="hidden border-r border-line bg-sidebar lg:block" />
      <div className="flex flex-col gap-2 border-r border-line bg-surface p-4">
        <div className="mb-3 h-7 w-24 rounded-sm bg-bg-2" />
        {Array.from({ length: 6 }, (_, i) => <div key={i} className="h-[62px] rounded-md bg-bg-2/70" />)}
        <p className="sr-only">Loading your desk…</p>
      </div>
      <div className="hidden bg-surface lg:block" />
    </div>
  );
}

const TITLES: Record<string, string> = { inbox: "Inbox", today: "Today", tasks: "Tasks", calendar: "Calendar", archive: "Archive", spaces: "Spaces" };
const TABS: { v: View; label: string }[] = [
  { v: "inbox", label: "Inbox" },
  { v: "tasks", label: "Tasks" },
  { v: "calendar", label: "Calendar" },
  { v: "spaces", label: "Spaces" },
];
const isWide = () => matchMedia("(min-width: 1024px)").matches;
const focusId = (id: string) => requestAnimationFrame(() => document.getElementById(id)?.focus());

function Desk({ dockId }: { dockId: string }) {
  const { dock, state, apply, undo } = useDock(dockId);
  const { toast, show, clear } = useToast();
  const showSuggestions = useStored("td:suggest") !== "off";
  const [view, setViewRaw] = useState<View>("inbox");
  const [sel, setSel] = useState<{ id: string | null; idx: number }>({ id: null, idx: 0 });
  const [sort, setSort] = useState<null | { ids: string[]; pos: number; rising: boolean }>(null);
  const [developId, setDevelopId] = useState<string | null>(null);
  const [pending, setPending] = useState<Pending>(null);
  const [confirm, setConfirm] = useState<Confirm | null>(null);
  const [dlg, setDlg] = useState<null | "pair" | "settings" | "keys">(null);
  const [sheet, setSheet] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const dockRef = useRef<Dock | null>(null);
  useEffect(() => { dockRef.current = dock; });

  const groups = useMemo(() => (dock ? groupsFor(dock, view) : []), [dock, view]);
  const list = useMemo(() => {
    const seen = new Set<string>();
    return groups.flatMap((g) => g.items).filter((i) => !seen.has(i.id) && !!seen.add(i.id));
  }, [groups]);
  // Selection survives the selected thought leaving the list: the next one slides into its index.
  const listCurrent = list.find((i) => i.id === sel.id) ?? list[Math.min(sel.idx, list.length - 1)] ?? null;

  const sortLeft = sort && dock ? sort.ids.filter((id) => dock.items.some((i) => i.id === id && i.status === "inbox")) : [];
  const sortPos = sort ? Math.max(0, Math.min(sort.pos, sortLeft.length - 1)) : 0;
  const sortItem = sort && dock ? dock.items.find((i) => i.id === sortLeft[sortPos]) ?? null : null;
  const current = sort ? sortItem : listCurrent;

  const spaceId = view.startsWith("space:") ? view.slice(6) : null;
  const space = dock?.spaces.find((s) => s.id === spaceId);
  const title = spaceId ? (spaceId === NO_SPACE ? "No space" : space?.name ?? "Space") : TITLES[view];

  // --- navigation --------------------------------------------------------------------------
  function setView(v: View) {
    setViewRaw(v);
    setSel({ id: null, idx: 0 });
    setSort(null);
    setSheet(false);
    setRenaming(false);
  }
  function select(id: string) {
    setSel({ id, idx: list.findIndex((i) => i.id === id) });
    if (!isWide()) { setSheet(true); focusId("sheet-back"); }
  }
  function closeSheet() {
    setSheet(false);
    if (current) focusId(`row-${current.id}`);
  }
  function step(d: 1 | -1) {
    if (!list.length) return;
    const i = current ? list.indexOf(current) : -1;
    const n = list[Math.max(0, Math.min(list.length - 1, i + d))];
    setSel({ id: n.id, idx: list.indexOf(n) });
    document.getElementById(`row-${n.id}`)?.focus(); // instant: no animation on keyboard nav
  }
  function jump(id: string) {
    const it = dock?.items.find((i) => i.id === id);
    if (!it || !dock) return;
    setSort(null);
    setRenaming(false);
    setViewRaw(homeView(dock, it));
    setSel({ id, idx: 0 });
    if (isWide()) focusId(`row-${id}`);
  }
  function startSort() {
    if (!dock) return;
    const ids = inboxOf(dock).map((i) => i.id);
    setSort({ ids, pos: Math.max(0, ids.indexOf(listCurrent?.id ?? "")), rising: false });
    setDevelopId(null);
    setSheet(false);
  }
  function exitSort() {
    setSort(null);
    setDevelopId(null);
    focusId("sort-button");
  }
  const skip = (d: 1 | -1) => setSort((s) => s && { ...s, pos: Math.max(0, Math.min(sortLeft.length - 1, sortPos + d)), rising: false });

  // --- actions (every one goes through apply() with its inverse) ----------------------------
  async function commit(a: A.ActionKey | null, u: A.Undoable) {
    if (sort && a && A.LEAVES_INBOX.has(a)) await sortLeave(a);
    apply(u.ops, u.undo);
    show(u.undo.label, { undo: true });
    if (sort) setSort((s) => s && { ...s, rising: true });
    else setTimeout(() => {
      // Keep keyboard flow going if the focused row just left the list.
      if (document.activeElement === document.body) (document.querySelector('[id^="row-"][aria-current="true"]') as HTMLElement | null)?.focus();
    }, 60);
  }
  function request(a: A.ActionKey, it: Item) {
    if (a === "archive") return void commit("archive", A.archive(it));
    if (a === "develop") {
      if (sort) setDevelopId(it.id);
      else if (!isWide()) setSheet(true);
      focusId("notes");
      return;
    }
    setPending({ type: a, item: it });
  }
  function take(it: Item, k: Kind) {
    if (k === "task" || k === "event") setPending({ type: k, item: it });
    else commit("keep", A.keepAs(it, k));
  }
  function saveNotes(id: string, body: string) {
    const latest = dockRef.current?.items.find((i) => i.id === id);
    if (latest && (latest.body ?? "") !== body) apply([{ op: "put", item: edit(latest, { body }) }]);
  }
  function doUndo() {
    const label = undo();
    clear();
    show(label ? `Undone: ${label}` : "Nothing to undo");
  }
  function capture(text: string) {
    const item = newItem(text, "desk");
    apply([{ op: "put", item }], { label: "Captured", ops: [{ op: "del", id: item.id }] });
    show("Saved to your inbox", { undo: true });
  }
  function createSpace(name: string) {
    const s = { id: newId("s"), name, createdAt: Date.now() };
    apply([{ op: "putSpace", space: s }], { label: `Made ${name}`, ops: [{ op: "delSpace", id: s.id }] });
    show(`Made ${name}`, { undo: true });
    setView(`space:${s.id}`);
  }
  function askDelete(it: Item) {
    setConfirm({
      title: "Delete forever?",
      body: `“${it.text.slice(0, 80)}” will be gone for good, with any recording or photo. This can't be undone.`,
      action: "Delete forever",
      run: () => { if (dock) { apply(A.deleteForever(dock, it)); show("Deleted forever"); } },
    });
  }
  async function newDock(demo: boolean) {
    const d = await createDock(demo);
    saveDock(d.id);
    notifyStored();
  }

  // --- keyboard ------------------------------------------------------------------------------
  function onKey(e: KeyboardEvent) {
    if (document.querySelector("dialog[open]")) return;
    const t = e.target as HTMLElement;
    const typing = t.isContentEditable || t.tagName === "TEXTAREA" || t.tagName === "SELECT" ||
      (t.tagName === "INPUT" && !["checkbox", "radio", "button", "submit"].includes((t as HTMLInputElement).type));
    const mod = e.metaKey || e.ctrlKey;
    const key = e.key.toLowerCase();
    if (mod && key === "k") { e.preventDefault(); document.getElementById("dock-input")?.focus(); return; }
    if (typing) return;
    if (mod && key === "z" && !e.shiftKey) { e.preventDefault(); doUndo(); return; }
    if (mod || e.altKey) return;
    if (e.key === "?") { e.preventDefault(); setDlg("keys"); return; }
    if (key === "u") { doUndo(); return; }
    if (key === "n") { e.preventDefault(); document.getElementById("dock-input")?.focus(); return; }
    if (e.key === "Escape") { if (sort) exitSort(); else if (sheet) closeSheet(); return; }
    if (sort) {
      if (e.key === "ArrowRight") { e.preventDefault(); skip(1); return; }
      if (e.key === "ArrowLeft") { e.preventDefault(); skip(-1); return; }
    } else {
      if (key === "j" || e.key === "ArrowDown") { e.preventDefault(); step(1); return; }
      if (e.key === "ArrowUp") { e.preventDefault(); step(-1); return; }
    }
    const a = A.HOTKEYS[key];
    if (a && current && current.status !== "archived") { e.preventDefault(); request(a, current); }
  }
  const keyRef = useRef(onKey);
  useEffect(() => { keyRef.current = onKey; });
  useEffect(() => {
    const h = (e: KeyboardEvent) => keyRef.current(e);
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  // --- render --------------------------------------------------------------------------------
  if (state === "missing" && !dock) {
    return (
      <Centered title="Couldn't find this dock" body="It may have expired, or the key was mistyped. You can start a new one.">
        <button type="button" onClick={() => newDock(true)} className="mt-6 min-h-11 rounded-full bg-ink px-6 font-semibold text-on-ink">Start a new dock</button>
      </Centered>
    );
  }
  if (!dock) {
    return state === "offline"
      ? <Centered title="You're offline" body="Your desk will load when you're back online." />
      : <Shell />;
  }

  const sidebarProps = {
    dock, view, state, onView: setView, onCreateSpace: createSpace,
    onPair: () => setDlg("pair"), onSettings: () => setDlg("settings"), onKeys: () => setDlg("keys"),
  };
  const inSpaces = view === "spaces" || view === "today" || view === "archive" || !!spaceId;
  const count = view === "inbox" ? list.length : 0;

  return (
    <div className="lg:grid lg:h-dvh lg:grid-cols-[248px_minmax(0,1fr)]">
      <a href="#list" className="sr-only-focusable fixed top-3 left-3 z-50 rounded-full bg-ink px-4 py-2 font-medium text-on-ink">Skip to inbox</a>

      <aside className="hidden h-dvh border-r border-line bg-sidebar backdrop-blur-xl lg:block">
        <Sidebar {...sidebarProps} />
      </aside>

      <div className="flex min-h-dvh min-w-0 flex-col lg:h-dvh lg:min-h-0">
        {/* Below 1024px: one column with a segmented control */}
        <header className="border-b border-line bg-bg px-4 pt-[max(env(safe-area-inset-top),10px)] pb-3 lg:hidden">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 font-semibold"><Logo size={24} />Desk</span>
            <span className="flex">
              <button type="button" onClick={() => setDlg("pair")} aria-label="Pair phone" title="Pair phone" className="grid size-11 place-items-center rounded-full text-text-2"><PhoneIcon /></button>
              <button type="button" onClick={() => setDlg("settings")} aria-label="Settings" title="Settings" className="grid size-11 place-items-center rounded-full text-text-2"><GearIcon /></button>
            </span>
          </div>
          <nav aria-label="Views" className="mt-2 grid grid-cols-4 gap-1 rounded-full bg-bg-2 p-1">
            {TABS.map((t) => {
              const on = t.v === "spaces" ? inSpaces : view === t.v && !sort;
              return (
                <button key={t.v} type="button" aria-current={on ? "page" : undefined} onClick={() => setView(t.v)}
                  className={`min-h-9 rounded-full text-[15px] ${on ? "bg-surface font-medium shadow-1" : "text-text-2"}`}>
                  {t.label}
                </button>
              );
            })}
          </nav>
          <p className="mt-2 text-[13px] text-muted sm:hidden">On your phone? <a href="/capture" className="text-accent">Capture</a> is quicker.</p>
        </header>

        {sort ? (
          <main id="list" tabIndex={-1} className="min-h-0 flex-1 overflow-auto bg-bg">
            <SortView
              item={sortItem}
              position={sortItem ? sort.ids.indexOf(sortItem.id) + 1 : 0}
              total={sort.ids.length}
              rising={sort.rising}
              developing={!!sortItem && developId === sortItem.id}
              showSuggestions={showSuggestions}
              canPrev={sortPos > 0}
              canNext={sortPos < sortLeft.length - 1}
              onAction={(a) => sortItem && request(a, sortItem)}
              onTake={(k) => sortItem && take(sortItem, k)}
              onSaveNotes={(b) => sortItem && saveNotes(sortItem.id, b)}
              onSkip={skip}
              onExit={exitSort}
            />
          </main>
        ) : (
          <main id="list" tabIndex={-1} className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[360px_minmax(0,1fr)]">
            <section aria-labelledby="list-h" className="min-h-0 flex-1 overflow-auto border-line bg-surface pb-32 lg:border-r">
              <div className="flex min-h-16 items-center justify-between gap-2 px-4 pt-3 pb-2">
                {renaming && space ? (
                  <form className="flex flex-1 gap-2" onSubmit={(e) => {
                    e.preventDefault();
                    const name = (new FormData(e.currentTarget).get("name") as string).trim().slice(0, 60);
                    if (name && name !== space.name) commit(null, A.renameSpace(space, name));
                    setRenaming(false);
                  }}>
                    <label htmlFor="rename" className="sr-only">Space name</label>
                    <input id="rename" name="name" autoFocus defaultValue={space.name} maxLength={60}
                      onKeyDown={(e) => { if (e.key === "Escape") setRenaming(false); }}
                      className="min-h-10 min-w-0 flex-1 rounded-md border border-line-strong bg-surface-2 px-3 text-[17px]" />
                    <button type="submit" className="min-h-10 rounded-full bg-accent px-4 font-semibold text-on-accent">Save</button>
                  </form>
                ) : (
                  <h1 id="list-h" className="flex min-w-0 items-baseline gap-2 text-[22px]">
                    <span className="truncate">{title}</span>
                    {count > 0 && <span className="tnum text-[15px] font-normal tracking-normal text-muted">{count}</span>}
                  </h1>
                )}
                {view === "inbox" && list.length > 0 && (
                  <button id="sort-button" type="button" onClick={startSort}
                    className="flex min-h-10 shrink-0 items-center gap-1.5 rounded-full bg-ink px-4 text-[15px] font-semibold text-on-ink">
                    <SortIcon size={17} />Sort
                  </button>
                )}
                {space && !renaming && (
                  <span className="flex shrink-0 gap-1">
                    <button type="button" onClick={() => setRenaming(true)} className="min-h-10 rounded-full px-3 text-[15px] text-accent [@media(hover:hover)]:hover:bg-accent-soft">Rename</button>
                    <button type="button" className="min-h-10 rounded-full px-3 text-[15px] text-text-2 [@media(hover:hover)]:hover:bg-bg-2"
                      onClick={() => setConfirm({
                        title: `Remove ${space.name}?`,
                        body: `Its thoughts go back to No space. Nothing is deleted, and you can undo this.`,
                        action: "Remove space",
                        run: () => { commit(null, A.removeSpace(dock, space)); setView("inbox"); },
                      })}>
                      Remove
                    </button>
                  </span>
                )}
              </div>

              {view === "spaces" ? (
                <Sidebar {...sidebarProps} compact />
              ) : list.length === 0 ? (
                <p className="px-4 pt-6 text-[17px] text-text-2">{EMPTY[spaceId ? "space" : view]}</p>
              ) : (
                <div className="px-2">
                  <ItemList
                    groups={groups}
                    view={view}
                    spaces={dock.spaces}
                    currentId={current?.id ?? null}
                    onSelect={select}
                    onToggleDone={(it) => commit(null, A.toggleDone(it))}
                    onIcs={downloadIcs}
                    onRestore={(it) => commit(null, A.restore(it))}
                    onDelete={askDelete}
                  />
                </div>
              )}
            </section>

            <div className={sheet ? "fixed inset-0 z-40 overflow-auto bg-surface lg:static lg:z-auto" : "hidden min-h-0 overflow-auto bg-surface lg:block"}>
              {current && view !== "spaces" ? (
                <Detail
                  key={current.id}
                  item={current}
                  dock={dock}
                  showSuggestions={showSuggestions}
                  onAction={(a) => request(a, current)}
                  onTake={(k) => take(current, k)}
                  onEditText={(t) => commit(null, A.editText(current, t))}
                  onSaveNotes={(b) => saveNotes(current.id, b)}
                  onJump={jump}
                  onToggleDone={() => commit(null, A.toggleDone(current))}
                  onIcs={() => downloadIcs(current)}
                  onRestore={() => commit(null, A.restore(current))}
                  onDelete={() => askDelete(current)}
                  onBack={closeSheet}
                />
              ) : (
                <p className="grid h-full place-items-center px-6 text-[15px] text-muted">
                  {view === "inbox" ? "Capture something with the Dock below." : "Pick a thought to see it here."}
                </p>
              )}
            </div>
          </main>
        )}
      </div>

      <DeskDock onSave={capture} />
      <Toast toast={toast} onUndo={doUndo} className="inset-x-0 bottom-[88px] lg:left-[248px]" />

      <ActionDialog pending={pending} dock={dock} onClose={() => setPending(null)} onCommit={commit} />
      <ConfirmDialog confirm={confirm} onClose={() => setConfirm(null)} />
      <PairDialog open={dlg === "pair"} onClose={() => setDlg(null)} dockId={dockId} />
      <SettingsDialog open={dlg === "settings"} onClose={() => setDlg(null)} dockId={dockId} onNewDock={newDock} />
      <ShortcutsDialog open={dlg === "keys"} onClose={() => setDlg(null)} />
    </div>
  );
}
