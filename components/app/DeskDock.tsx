"use client";
import { useState } from "react";
import { Logo } from "@/components/Icons";

/** The Dock on the desk: same floating pill as the phone. N or ⌘K focuses it, Enter saves. */
export function DeskDock({ onSave }: { onSave: (text: string) => void }) {
  const [text, setText] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSave(text);
        setText("");
      }}
      className="fixed bottom-5 left-1/2 z-30 flex w-[min(92vw,560px)] -translate-x-1/2 items-center gap-2 rounded-full border border-line bg-sidebar p-1.5 pl-4 shadow-2 backdrop-blur-xl has-[input:focus]:outline-3 has-[input:focus]:outline-offset-2 has-[input:focus]:outline-accent lg:left-[calc(50%+124px)]"
    >
      <Logo size={22} className="shrink-0" />
      <label htmlFor="dock-input" className="sr-only">Capture a thought</label>
      <input
        id="dock-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Escape") e.currentTarget.blur(); }}
        placeholder="What's on your mind?"
        autoComplete="off"
        className="min-h-11 min-w-0 flex-1 bg-transparent text-[17px] placeholder:text-muted focus-visible:outline-none"
      />
      <kbd className="hidden shrink-0 rounded-sm border border-line px-1.5 font-mono text-[13px] text-muted sm:block" aria-hidden>N</kbd>
      <button type="submit" disabled={!text.trim()}
        className="min-h-11 shrink-0 rounded-full bg-accent px-6 font-semibold text-on-accent [@media(hover:hover)]:hover:bg-accent-hover">
        Save
      </button>
    </form>
  );
}
