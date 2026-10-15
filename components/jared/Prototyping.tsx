import { LINKS } from "@/lib/links";
import { Method, Pill, Section, Tag } from "./ui";
import { UsabilityTest } from "./UsabilityTest";

const wf = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function WireCapture() {
  return (
    <svg viewBox="0 0 180 320" className="h-auto w-full" role="img" aria-labelledby="wf-cap-t wf-cap-d">
      <title id="wf-cap-t">Low-fidelity wireframe of the Capture screen</title>
      <desc id="wf-cap-d">A phone with a wordmark and sync status at the top, one large text area, crossed-out category and due date controls, and a bottom bar with mic, photo, and a Save button.</desc>
      <rect {...wf} x="4" y="4" width="172" height="312" rx="26" />
      <path {...wf} d="M22 30h40M128 30h30" opacity=".6" />
      <rect {...wf} x="18" y="48" width="144" height="120" rx="8" strokeDasharray="4 4" />
      <text x="28" y="72" fontSize="11" fill="currentColor">What&apos;s on your mind?</text>
      <g opacity=".55">
        <rect {...wf} x="18" y="182" width="68" height="22" rx="6" />
        <rect {...wf} x="94" y="182" width="68" height="22" rx="6" />
        <text x="26" y="197" fontSize="9" fill="currentColor">Category ▾</text>
        <text x="102" y="197" fontSize="9" fill="currentColor">Due date</text>
        <path {...wf} d="M14 193h152" stroke="var(--accent)" strokeWidth="2" />
      </g>
      <text x="18" y="222" fontSize="9" fill="var(--accent)">cut: asks for a decision</text>
      <rect {...wf} x="14" y="266" width="152" height="36" rx="18" />
      <circle {...wf} cx="34" cy="284" r="10" />
      <circle {...wf} cx="60" cy="284" r="10" />
      <rect x="104" y="272" width="54" height="24" rx="12" fill="currentColor" />
    </svg>
  );
}

function WireSort() {
  return (
    <svg viewBox="0 0 320 220" className="h-auto w-full" role="img" aria-labelledby="wf-sort-t wf-sort-d">
      <title id="wf-sort-t">Low-fidelity wireframe of the Sort view</title>
      <desc id="wf-sort-d">A desktop window with a progress label, one large card holding a single thought, a suggestion chip, and a row of five labeled action buttons with keyboard keys.</desc>
      <rect {...wf} x="4" y="4" width="312" height="212" rx="12" />
      <path {...wf} d="M4 26h312" opacity=".5" />
      <circle cx="18" cy="15" r="3" fill="currentColor" opacity=".4" />
      <circle cx="28" cy="15" r="3" fill="currentColor" opacity=".4" />
      <text x="24" y="48" fontSize="9" fill="currentColor" opacity=".7">Sort · 3 of 7</text>
      <rect {...wf} x="24" y="58" width="272" height="84" rx="14" />
      <path {...wf} d="M42 84h190M42 100h140" />
      <rect {...wf} x="42" y="114" width="78" height="16" rx="8" stroke="var(--accent)" />
      <text x="50" y="125" fontSize="8" fill="var(--accent)">Looks like a Task</text>
      {["Task T", "Event E", "Space M", "Keep K", "Archive A"].map((t, i) => (
        <g key={t}>
          <rect {...wf} x={24 + i * 55} y="160" width="49" height="24" rx="12" />
          <text x={48.5 + i * 55} y="175" fontSize="8" textAnchor="middle" fill="currentColor">{t}</text>
        </g>
      ))}
      <text x="24" y="204" fontSize="8" fill="currentColor" opacity=".6">← → next / previous · U undo</text>
    </svg>
  );
}

const ROUNDS = [
  {
    n: "Round 1", t: "Paper and wireframes", tag: "Low fidelity",
    did: "Sketched Capture and Sort as gray boxes to test the structure before any color or code.",
    taught: "The capture screen only works if it asks for nothing. Category and date controls were considered and cut. Sort needed one big card and labeled actions, not a list with tiny icons.",
    art: <div className="grid grid-cols-[0.5fr_1fr] items-center gap-5 text-text-2"><WireCapture /><WireSort /></div>,
  },
  {
    n: "Round 2", t: "High-fidelity screens", tag: "High fidelity",
    did: "Applied the design contract: system type, one blue accent, black pills, the floating Dock, light and dark.",
    taught: "Every action needed both a visible label and a key. The suggestion chip had to be quiet enough to ignore, and overdue items needed words like “Was due Tue” instead of red.",
    art: (
      <div className="flex flex-col items-start gap-3">
        <p className="text-[15px] text-text-2">Open them live. They are the real app.</p>
        <div className="flex flex-wrap gap-2">
          <Pill href={LINKS.capture} primary>Capture (phone)</Pill>
          <Pill href={LINKS.app}>DeskOS (desktop)</Pill>
        </div>
      </div>
    ),
  },
  {
    n: "Round 3", t: "Coded prototype", tag: "Working software",
    did: "Connected phone and desk through Next.js API routes and Upstash Redis, with QR pairing, an offline queue, voice and photo capture, and .ics export.",
    taught: "Sync had to be optimistic: show the change instantly, queue it, retry when back online. Undo is only trustworthy if every action stores its exact inverse.",
    art: (
      <ul className="space-y-2 text-[15px] text-text-2">
        <li><span className="font-semibold text-text">Pair:</span> scan a QR code or type a short code, no account</li>
        <li><span className="font-semibold text-text">Offline:</span> captures queue locally and sync later</li>
        <li><span className="font-semibold text-text">Undo:</span> every change carries its inverse</li>
      </ul>
    ),
  },
];

export function Prototyping() {
  return (
    <Section id="prototyping" n="05" eyebrow="Prototyping" title="Each round got a little more real."
      lead="We climbed the fidelity ladder one rung at a time and only moved up when the cheaper version had nothing left to teach.">
      <Method
        what="Prototyping makes an idea concrete enough to learn from. Low fidelity is fast and disposable; high fidelity looks real; a coded prototype behaves real."
        how="Wireframes for structure, high-fidelity screens for look and language, then a working build with real sync between phone and desk."
        changed="Each round removed something: decisions from capture, color-only signals from the desk, and data-loss risks from sync."
      />
      <ol className="mt-20 space-y-6">
        {ROUNDS.map((r) => (
          <li key={r.n} className="grid gap-8 rounded-xl border border-line bg-surface p-6 sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-[13px] font-semibold text-muted">{r.n}</span>
                <Tag>{r.tag}</Tag>
              </div>
              <h3 className="mt-3 text-[1.75rem] leading-[1.1]">{r.t}</h3>
              <p className="mt-3 text-[16px] text-text-2">{r.did}</p>
              <p className="mt-5 border-t border-line pt-4 text-[15px] text-text-2">
                <span className="font-semibold text-text">What it taught us. </span>{r.taught}
              </p>
            </div>
            <div className="rounded-lg bg-bg p-6">{r.art}</div>
          </li>
        ))}
      </ol>
      <UsabilityTest />
    </Section>
  );
}
