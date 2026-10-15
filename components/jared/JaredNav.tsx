"use client";
// Sticky top bar: wordmark, section jump list (scrolls sideways on small screens), and one CTA.
// Highlights the section in view; no animation on the highlight itself.
import { useEffect, useState } from "react";
import { Logo } from "@/components/Icons";
import { LINKS } from "@/lib/links";

export const SECTIONS = [
  ["marketing", "Marketing"],
  ["design-thinking", "Design thinking"],
  ["personas", "Personas"],
  ["product-design", "3D design"],
  ["prototyping", "Prototyping"],
  ["ux-ui", "UX/UI"],
  ["project-management", "Project mgmt"],
  ["ai-build", "AI build"],
  ["coding", "Code"],
  ["lessons", "Lessons"],
] as const;

export function JaredNav() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = ["top", ...SECTIONS.map(([id]) => id)].map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id === "top" ? null : e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  // Keep the active link visible inside the horizontal scroller (instant, no smooth scroll).
  useEffect(() => {
    if (!active) return;
    const link = document.querySelector<HTMLElement>(`[data-nav="${active}"]`);
    const bar = link?.parentElement?.parentElement;
    if (!link || !bar || bar.scrollWidth <= bar.clientWidth) return;
    bar.scrollLeft = link.offsetLeft - bar.clientWidth / 2 + link.offsetWidth / 2;
  }, [active]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      <nav aria-label="Process sections" className="mx-auto flex max-w-[1120px] flex-wrap items-center gap-x-4 px-4 sm:px-6">
        <a href="#top" className="flex h-12 items-center gap-2.5 text-[15px] font-semibold tracking-[-0.02em]">
          <Logo size={24} />
          <span>Thought Dock</span>
          <span className="font-normal text-muted">Process</span>
        </a>
        <div className="no-bar order-last -mx-4 w-[calc(100%+2rem)] overflow-x-auto border-t border-line sm:-mx-6 sm:w-[calc(100%+3rem)] lg:order-none lg:mx-0 lg:w-auto lg:flex-1 lg:border-0">
          <ul className="flex w-max items-center px-2 sm:px-4 lg:px-0">
            {SECTIONS.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`} data-nav={id} aria-current={active === id ? "true" : undefined}
                  className="nav-link relative flex h-11 items-center whitespace-nowrap px-3 text-[13px] text-muted">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <a href={LINKS.app} className="ml-auto inline-flex h-8 items-center rounded-full bg-ink px-3.5 text-[13px] font-medium text-on-ink hover-dim lg:ml-0">
          Open the app
        </a>
      </nav>
    </header>
  );
}
