"use client";
import { useState } from "react";
import { Dialog } from "./Dialog";
import { setRootPref, setStored, useStored } from "./store";

type Props = { open: boolean; onClose: () => void; dockId: string; onNewDock: (demo: boolean) => Promise<void> };

export function SettingsDialog({ open, onClose, dockId, onNewDock }: Props) {
  return (
    <Dialog open={open} onClose={onClose} title="Settings">
      <SettingsBody dockId={dockId} onNewDock={onNewDock} onClose={onClose} />
    </Dialog>
  );
}

const THEMES = [
  { v: null, label: "System" },
  { v: "light", label: "Light" },
  { v: "dark", label: "Dark" },
] as const;

// swatch = [bg, surface, accent]; keep in sync with the palettes in app/globals.css
const PALETTES = [
  { v: null, label: "Classic", sw: ["#f5f5f7", "#ffffff", "#0066cc"] },
  { v: "rose", label: "Pastel pink", sw: ["#fdf1f4", "#ffffff", "#b02b5c"] },
  { v: "sage", label: "Sage green", sw: ["#f0f5ee", "#ffffff", "#2d6a43"] },
  { v: "sky", label: "Sky blue", sw: ["#eef5fb", "#ffffff", "#1c5ea8"] },
  { v: "earth", label: "Earthy", sw: ["#f4ede1", "#ffffff", "#98471c"] },
  { v: "plum", label: "Plum night", sw: ["#171120", "#251c32", "#c9a2ff"] },
  { v: "forest", label: "Forest night", sw: ["#0e1a13", "#182a1f", "#7fd49b"] },
  { v: "mocha", label: "Mocha night", sw: ["#1a1511", "#2a221a", "#eaaa6e"] },
] as const;

function SettingsBody({ dockId, onNewDock, onClose }: Omit<Props, "open">) {
  const theme = useStored("td:theme") ?? null;
  const palette = useStored("td:palette") ?? null;
  const motion = useStored("td:motion");
  const suggest = useStored("td:suggest");
  const [asking, setAsking] = useState<null | "demo" | "fresh">(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  const setTheme = (v: string | null) => setRootPref("theme", v);
  const setPalette = (v: string | null) => setRootPref("palette", v);
  const setMotion = (reduce: boolean) => setRootPref("motion", reduce ? "reduce" : null);

  return (
    <div className="flex flex-col gap-6">
      <fieldset>
        <legend className="text-[15px] font-medium">Colors</legend>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PALETTES.map((pl) => (
            <label key={pl.label}
              className="flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-line px-2.5 text-[14px] has-checked:border-accent has-checked:font-medium has-checked:outline-2 has-checked:outline-accent has-focus-visible:outline-3 has-focus-visible:outline-accent">
              <input type="radio" name="palette" className="sr-only" checked={palette === pl.v} onChange={() => setPalette(pl.v)} />
              <span aria-hidden className="flex shrink-0 -space-x-1.5">
                {pl.sw.map((c) => <span key={c} className="size-4 rounded-full border border-line-strong" style={{ background: c }} />)}
              </span>
              {pl.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset disabled={palette !== null} className="disabled:opacity-50">
        <legend className="text-[15px] font-medium">Light or dark{palette !== null && <span className="text-[13px] font-normal text-muted"> · set by your color choice</span>}</legend>
        <div className="mt-2 grid grid-cols-3 gap-1 rounded-full bg-bg-2 p-1">
          {THEMES.map((t) => (
            <label key={t.label}
              className="flex min-h-10 cursor-pointer items-center justify-center rounded-full text-[15px] has-checked:bg-surface has-checked:font-medium has-checked:shadow-1 has-focus-visible:outline-3 has-focus-visible:outline-accent">
              <input type="radio" name="theme" className="sr-only" checked={theme === t.v} onChange={() => setTheme(t.v)} />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-col gap-1">
        <label className="flex min-h-11 items-center justify-between gap-4 text-[15px]">
          Reduce motion
          <input type="checkbox" checked={motion === "reduce"} onChange={(e) => setMotion(e.target.checked)} className="size-[18px] accent-(--accent)" />
        </label>
        <label className="flex min-h-11 items-center justify-between gap-4 text-[15px]">
          <span>Show suggestions <span className="block text-[13px] text-muted">A quiet hint like “Looks like a Task”. Never applied for you.</span></span>
          <input type="checkbox" checked={suggest !== "off"} onChange={(e) => setStored("td:suggest", e.target.checked ? null : "off")} className="size-[18px] accent-(--accent)" />
        </label>
      </div>

      <section aria-labelledby="dock-h" className="border-t border-line pt-5">
        <h3 id="dock-h" className="text-[15px] font-medium">Dock</h3>
        {asking ? (
          <div className="mt-2 rounded-md bg-bg-2 p-4">
            <p className="text-[15px]">
              {asking === "demo" ? "Switch this desk to a new demo dock with sample thoughts?" : "Start a fresh, empty dock on this desk?"}{" "}
              This device will forget your current dock. Copy its key below first if you want to come back to it.
            </p>
            <div className="mt-3 flex justify-end gap-2">
              <button type="button" onClick={() => setAsking(null)} className="min-h-10 rounded-full px-4 [@media(hover:hover)]:hover:bg-surface">Cancel</button>
              <button type="button" disabled={busy} className="min-h-10 rounded-full bg-ink px-4 font-semibold text-on-ink"
                onClick={async () => { setBusy(true); await onNewDock(asking === "demo").catch(() => {}); setBusy(false); onClose(); }}>
                {busy ? "Setting up…" : asking === "demo" ? "Load demo dock" : "Start fresh"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" onClick={() => setAsking("demo")} className="min-h-10 rounded-full border border-line px-4 text-[15px] [@media(hover:hover)]:hover:bg-bg-2">Load demo dock</button>
            <button type="button" onClick={() => setAsking("fresh")} className="min-h-10 rounded-full border border-line px-4 text-[15px] [@media(hover:hover)]:hover:bg-bg-2">Start fresh dock</button>
          </div>
        )}
        <details className="mt-4 text-[15px]">
          <summary className="min-h-11 cursor-pointer content-center font-medium">Your dock key</summary>
          <p className="mt-1 text-text-2">This key is your dock. Anyone who has it can read and change your thoughts, so keep it private, like a password. There&apos;s no account; pairing a phone shares it for you.</p>
          <div className="mt-3 flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate rounded-sm bg-bg-2 px-2 py-1.5 font-mono text-[13px]">{dockId}</code>
            <button type="button" className="min-h-10 rounded-full px-3 text-accent [@media(hover:hover)]:hover:bg-accent-soft"
              onClick={() => navigator.clipboard?.writeText(dockId).then(() => setCopied(true), () => {})}>
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </details>
      </section>

      <div className="flex justify-end">
        <button type="button" onClick={onClose} className="min-h-11 rounded-full bg-ink px-6 font-semibold text-on-ink">Done</button>
      </div>
    </div>
  );
}
