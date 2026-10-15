"use client";
import { useEffect } from "react";
import s from "./landing.module.css";

/** Fades `.reveal` blocks up once as they enter the viewport. Renders nothing.
 *  Skipped entirely under reduced motion, and blocks already on screen are never hidden. */
export function RevealOnScroll() {
  useEffect(() => {
    const reduce =
      matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.dataset.motion === "reduce";
    if (reduce || !("IntersectionObserver" in window)) return;

    const els = [...document.querySelectorAll<HTMLElement>(`.${CSS.escape(s.reveal)}`)].filter(
      (el) => el.getBoundingClientRect().top > innerHeight,
    );
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.removeAttribute("data-pending");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    for (const el of els) {
      el.setAttribute("data-pending", "");
      io.observe(el);
    }
    return () => {
      io.disconnect();
      for (const el of els) el.removeAttribute("data-pending");
    };
  }, []);
  return null;
}
