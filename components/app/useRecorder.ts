"use client";
import { useCallback, useEffect, useRef, useState } from "react";

export const MAX_SECONDS = 60;
export type Clip = { blob: Blob; mime: string; ms: number; url: string };
type RecStatus = "idle" | "recording" | "denied" | "unsupported";

// Minimal Web Speech typing (not in lib.dom for webkit-prefixed Safari/Chrome).
type SR = {
  continuous: boolean; interimResults: boolean; lang: string;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  start(): void; stop(): void;
};
type SRCtor = new () => SR;

/** Voice note: MediaRecorder (webm/opus, mp4 on iOS) + live transcript from SpeechRecognition when available. */
export function useRecorder(onTranscript: (text: string) => void) {
  const [status, setStatus] = useState<RecStatus>("idle");
  const [left, setLeft] = useState(MAX_SECONDS);
  const [clip, setClip] = useState<Clip | null>(null);
  const mr = useRef<MediaRecorder | null>(null);
  const sr = useRef<SR | null>(null);
  const timer = useRef(0);
  const done = useRef<((c: Clip | null) => void) | null>(null);
  const onT = useRef(onTranscript);
  useEffect(() => { onT.current = onTranscript; });

  /** Stops recording; resolves with the finished clip (null if nothing was recording). */
  const stop = useCallback((): Promise<Clip | null> => {
    clearInterval(timer.current);
    try { sr.current?.stop(); } catch {}
    sr.current = null;
    if (mr.current?.state !== "recording") return Promise.resolve(null);
    const p = new Promise<Clip | null>((res) => { done.current = res; });
    mr.current.stop();
    return p;
  }, []);

  const start = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setStatus("unsupported");
      return;
    }
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      const name = (e as DOMException)?.name;
      setStatus(name === "NotAllowedError" || name === "SecurityError" ? "denied" : "unsupported");
      return;
    }
    const mime = ["audio/webm;codecs=opus", "audio/mp4", "audio/webm"].find((m) => MediaRecorder.isTypeSupported(m));
    const rec = new MediaRecorder(stream, { ...(mime ? { mimeType: mime } : {}), audioBitsPerSecond: 24000 });
    const chunks: Blob[] = [];
    const began = Date.now();
    rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
    rec.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      const full = rec.mimeType || mime || "audio/webm";
      // Strip codec params so the data URL is plain "data:audio/webm;base64,…".
      const blob = new Blob(chunks, { type: full.split(";")[0].trim() });
      const c = { blob, mime: full, ms: Date.now() - began, url: URL.createObjectURL(blob) };
      setClip(c);
      setStatus("idle");
      done.current?.(c);
      done.current = null;
    };
    rec.start(1000);
    mr.current = rec;
    setClip(null);
    setLeft(MAX_SECONDS);
    setStatus("recording");
    timer.current = window.setInterval(() => {
      const l = MAX_SECONDS - Math.floor((Date.now() - began) / 1000);
      setLeft(Math.max(0, l));
      if (l <= 0) stop();
    }, 250);

    const w = window as unknown as { SpeechRecognition?: SRCtor; webkitSpeechRecognition?: SRCtor };
    const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    if (Ctor) {
      const s = new Ctor();
      s.continuous = true;
      s.interimResults = true;
      s.lang = navigator.language || "en-US";
      s.onresult = (e) => {
        let t = "";
        for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript;
        onT.current(t.trim());
      };
      s.onerror = () => {};
      try { s.start(); sr.current = s; } catch {}
    }
  }, [stop]);

  const discard = useCallback(() => {
    setClip((c) => {
      if (c) URL.revokeObjectURL(c.url);
      return null;
    });
  }, []);

  useEffect(() => () => {
    clearInterval(timer.current);
    if (mr.current?.state === "recording") mr.current.stop();
    try { sr.current?.stop(); } catch {}
  }, []);

  return { status, left, clip, start, stop, discard, resetStatus: () => setStatus("idle") };
}

/** Downscale to ≤1280px JPEG (q≈0.7) so it fits the ~600KB media limit. Returns a data URL. */
export async function downscaleImage(file: Blob): Promise<string> {
  const bmp = await createImageBitmap(file);
  let max = 1280;
  let q = 0.7;
  for (;;) {
    const s = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * s);
    c.height = Math.round(bmp.height * s);
    c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height);
    const url = c.toDataURL("image/jpeg", q);
    if (url.length < 800_000 || max <= 640) {
      bmp.close();
      return url;
    }
    max = Math.round(max * 0.8);
    q = 0.6;
  }
}
