"use client";
import { useCallback, useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { requestPair } from "@/lib/client";
import { Dialog } from "./Dialog";

export function PairDialog({ open, onClose, dockId }: { open: boolean; onClose: () => void; dockId: string }) {
  return (
    <Dialog open={open} onClose={onClose} title="Pair your phone">
      <PairBody dockId={dockId} onClose={onClose} />
    </Dialog>
  );
}

function PairBody({ dockId, onClose }: { dockId: string; onClose: () => void }) {
  const [pair, setPair] = useState<{ code: string; expiresAt: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const fresh = useCallback(() => {
    requestPair(dockId)
      .then((p) => { setPair(p); setError(null); setNow(Date.now()); })
      .catch((e: Error) => setError(e.message));
  }, [dockId]);

  useEffect(fresh, [fresh]);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const left = pair ? Math.max(0, Math.round((pair.expiresAt - now) / 1000)) : 0;
  const url = pair ? `${location.origin}/capture?pair=${pair.code}` : "";

  return (
    <div className="flex flex-col items-center text-center">
      <p className="text-[15px] text-text-2">Scan with your phone&apos;s camera. Or open <span className="font-medium text-text">/capture</span> on your phone and type the code.</p>
      <div className="mt-5 grid size-[212px] place-items-center rounded-lg border border-line bg-white p-4">
        {pair && left > 0 ? (
          <QRCodeSVG value={url} size={180} bgColor="#ffffff" fgColor="#000000" title={`Pairing link for code ${pair.code}`} />
        ) : (
          <span className="text-[15px] text-[#6e6e73]">{error ? "No code" : left === 0 && pair ? "Expired" : "Making a code…"}</span>
        )}
      </div>
      {pair && (
        <p className="tnum mt-5 font-mono text-[40px] font-semibold tracking-[0.2em]" aria-label={`Code ${pair.code.split("").join(" ")}`}>
          {pair.code}
        </p>
      )}
      <p className="tnum mt-1 text-[13px] text-muted" aria-live="polite">
        {error ? <span className="text-warn">{error}</span>
          : !pair ? " "
          : left > 0 ? `Expires in ${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`
          : "This code expired. Make a new one."}
      </p>
      <div className="mt-6 flex w-full justify-between gap-2">
        <button type="button" onClick={fresh} className="min-h-11 rounded-full px-4 text-accent [@media(hover:hover)]:hover:bg-accent-soft">Make a new code</button>
        <button type="button" onClick={onClose} className="min-h-11 rounded-full bg-ink px-6 font-semibold text-on-ink">Done</button>
      </div>
    </div>
  );
}
