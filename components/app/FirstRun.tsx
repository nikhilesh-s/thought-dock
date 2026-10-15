"use client";
import { useState } from "react";
import { createDock, redeemPair, saveDock } from "@/lib/client";
import { Logo } from "@/components/Icons";
import { notifyStored } from "./store";

/** Phone first run: pair with a desk by code, or start a dock on this phone. */
export function FirstRun({ initialError }: { initialError?: string | null }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState<"pair" | "start" | null>(null);
  const [error, setError] = useState<string | null>(initialError ?? null);

  async function use(p: Promise<string>, which: "pair" | "start") {
    setBusy(which);
    setError(null);
    try {
      saveDock(await p);
      notifyStored();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
      setBusy(null);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 pt-[max(env(safe-area-inset-top),24px)] pb-[max(env(safe-area-inset-bottom),24px)]">
      <Logo size={44} />
      <h1 className="mt-6 text-[34px]">Put every thought down.</h1>
      <p className="mt-2 text-text-2">Capture now. Organize later, at your desk.</p>

      <section aria-labelledby="pair-h" className="mt-10 rounded-lg border border-line bg-surface p-5 shadow-1">
        <h2 id="pair-h" className="text-[20px]">Pair with your desk</h2>
        <p className="mt-1 text-[15px] text-text-2">On your computer, open your desk and choose Pair phone. Type the code you see.</p>
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (code.length === 6) use(redeemPair(code), "pair");
          }}
        >
          <label htmlFor="pair-code" className="sr-only">Pairing code</label>
          <input
            id="pair-code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))}
            inputMode="text"
            autoCapitalize="characters"
            autoComplete="one-time-code"
            spellCheck={false}
            placeholder="ABC123"
            aria-describedby={error ? "pair-err" : undefined}
            className="tnum min-h-12 w-full min-w-0 rounded-md border border-line-strong bg-surface-2 px-4 font-mono text-[22px] tracking-[0.25em] uppercase placeholder:text-muted/60"
          />
          <button type="submit" disabled={code.length !== 6 || busy !== null}
            className="min-h-12 shrink-0 rounded-full bg-accent px-6 font-semibold text-on-accent [@media(hover:hover)]:hover:bg-accent-hover">
            {busy === "pair" ? "Pairing…" : "Pair"}
          </button>
        </form>
        {error && <p id="pair-err" role="alert" className="mt-3 text-[15px] text-warn">{error}</p>}
      </section>

      <div className="mt-6 text-center">
        <button type="button" disabled={busy !== null} onClick={() => use(createDock(false).then((d) => d.id), "start")}
          className="min-h-11 rounded-full px-5 font-medium text-accent [@media(hover:hover)]:hover:bg-accent-soft">
          {busy === "start" ? "Setting up…" : "Start on this phone"}
        </button>
        <p className="mt-1 text-[13px] text-muted">No desk yet? Capture here and sort later.</p>
      </div>
    </main>
  );
}
