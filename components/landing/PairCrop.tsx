"use client"; // qrcode.react uses hooks
// Static recreation of the desk's "Pair phone" sheet. Presentational only.
// The QR encodes a harmless demo string, not a live pairing code.
import { QRCodeSVG } from "qrcode.react";

export function PairCrop() {
  return (
    <div className="mx-auto max-w-[360px] rounded-lg bg-surface p-6 text-center text-[15px] shadow-1 ring-1 ring-line">
      <p className="text-[1.15em] font-semibold tracking-[-0.02em] text-text">Pair your phone</p>
      <p className="mt-1 text-text-2">Scan with your phone&rsquo;s camera.</p>
      <div className="mx-auto mt-5 w-fit rounded-md bg-white p-3 ring-1 ring-line">
        <QRCodeSVG value="THOUGHT-DOCK-DEMO-K7M2QD" size={132} fgColor="#1d1d1f" bgColor="#ffffff" level="M" />
      </div>
      <p className="mt-5 text-[0.85em] text-muted">Or type this code</p>
      <p className="tnum mt-1 font-mono text-[1.4em] font-semibold tracking-[0.18em] text-text">K7M 2QD</p>
      <p className="mt-3 text-[0.85em] text-muted">Lasts 10 minutes. No account needed.</p>
    </div>
  );
}
