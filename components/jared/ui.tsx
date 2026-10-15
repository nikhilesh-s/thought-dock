// Small shared building blocks for the /jared process portfolio.
import type { ReactNode } from "react";

export function Section({ id, n, eyebrow, title, lead, children, band = false }: {
  id: string; n: string; eyebrow: string; title: ReactNode; lead?: ReactNode; children: ReactNode; band?: boolean;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className={`scroll-mt-28 border-t border-line ${band ? "bg-surface-2" : ""}`}>
      <div className="mx-auto max-w-[1120px] px-4 py-24 sm:px-6 md:py-32">
        <p className="text-[13px] font-medium tracking-[0.02em] text-muted">
          <span className="tnum">{n}</span> <span aria-hidden>·</span> {eyebrow}
        </p>
        <h2 id={`${id}-h`} className="mt-3 max-w-[18ch] text-[clamp(2.1rem,4.6vw,3.4rem)]">{title}</h2>
        {lead ? <p className="mt-5 max-w-[60ch] text-[1.3125rem] leading-[1.42] text-text-2">{lead}</p> : null}
        <div className="mt-14 md:mt-16">{children}</div>
      </div>
    </section>
  );
}

/** "What it is / How we used it / What it changed": the spine of every method section. */
export function Method({ what, how, changed }: { what: ReactNode; how: ReactNode; changed: ReactNode }) {
  const rows: [string, ReactNode][] = [["The method", what], ["How we used it", how], ["What it changed", changed]];
  return (
    <dl className="grid gap-x-10 gap-y-8 md:grid-cols-3">
      {rows.map(([k, v]) => (
        <div key={k} className="border-t border-line-strong pt-4">
          <dt className="text-[13px] font-semibold text-text">{k}</dt>
          <dd className="mt-2 text-[15px] leading-[1.55] text-text-2">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Sub({ children, id }: { children: ReactNode; id?: string }) {
  return <h3 id={id} className="text-[1.5rem] leading-[1.15]">{children}</h3>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-lg border border-line bg-surface ${className}`}>{children}</div>;
}

export function Tag({ children, tone = "plain" }: { children: ReactNode; tone?: "plain" | "accent" | "ink" }) {
  const t = tone === "accent" ? "bg-accent-soft text-accent" : tone === "ink" ? "bg-ink text-on-ink" : "bg-bg-2 text-text-2";
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px] font-medium ${t}`}>{children}</span>;
}

/** Marks content the team still has to supply. Words, not color, carry the meaning. */
export function Pending({ children }: { children: ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 rounded-md border border-dashed border-line-strong px-3 py-2 text-[13px] text-text-2">
      <span className="font-semibold text-text">Pending</span> {children}
    </p>
  );
}

export function Pill({ href, children, primary = false, external = false }: {
  href: string; children: ReactNode; primary?: boolean; external?: boolean;
}) {
  const cls = primary
    ? "bg-ink text-on-ink hover-dim"
    : "border border-line-strong text-text hover-soft";
  return (
    <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={`inline-flex min-h-11 items-center gap-2 rounded-full px-5 text-[15px] font-medium ${cls}`}>
      {children}
      {external ? <span className="sr-only">(opens in a new tab)</span> : null}
    </a>
  );
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  const ext = href.startsWith("http");
  return (
    <a href={href} className="font-medium text-accent underline decoration-accent/30 underline-offset-[3px] hover-underline"
      {...(ext ? { target: "_blank", rel: "noreferrer" } : {})}>
      {children}
      {ext ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  );
}

export function Caption({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-[13px] text-muted">{children}</p>;
}

export const tableCls = "relative w-full border-collapse text-left text-[15px]";
export const thCls = "border-b border-line-strong px-4 py-3 text-[13px] font-semibold text-text align-bottom";
export const tdCls = "border-b border-line px-4 py-3 align-top text-text-2";
export const captionCls = "caption-top pb-3 text-left text-[13px] text-muted";
