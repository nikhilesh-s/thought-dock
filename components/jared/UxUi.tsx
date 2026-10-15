import { KIND_ICON } from "@/components/Icons";
import { KINDS, KIND_LABEL } from "@/lib/types";
import { Method, Section, Sub, captionCls, tableCls, tdCls, thCls } from "./ui";

const PRINCIPLES = [
  ["Capture asks for nothing", "One field and Save. No lists, dates, or tags on the phone, ever."],
  ["One thing at a time", "Sort shows a single thought, large, with a short list of labeled actions."],
  ["Everything is reversible", "Undo on every action. Archive instead of delete. The original text is never changed."],
  ["Words, not colors", "Status is always said in words with an icon. No red for overdue work."],
  ["Calm by default", "System type, one accent, motion only where it explains where a thought went."],
];

// [name, css var, light, dark, role]
const TOKENS: [string, string, string, string, string][] = [
  ["bg", "--bg", "#f5f5f7", "#000000", "Page"],
  ["surface", "--surface", "#ffffff", "#1c1c1e", "Cards"],
  ["raised", "--raised", "#ffffff", "#2c2c2e", "Sheets, Dock"],
  ["text", "--text", "#1d1d1f", "#f5f5f7", "Body text"],
  ["text-2", "--text-2", "#424245", "#d2d2d7", "Secondary text"],
  ["muted", "--muted", "#6e6e73", "#a1a1a6", "Metadata, 13px+"],
  ["accent", "--accent", "#0071e3", "#2997ff", "Primary, focus, links"],
  ["ink", "--ink", "#1d1d1f", "#f5f5f7", "Black pill buttons"],
  ["warn", "--warn", "#b25000", "#ff9f0a", "Real errors only"],
];

const KIND_HEX: Record<string, [string, string]> = {
  task: ["#0071e3", "#2997ff"], event: ["#b2380b", "#ff8a5c"], idea: ["#8a5a00", "#ffd60a"], resource: ["#1d7d36", "#30d158"], note: ["#6e6e73", "#a1a1a6"],
};

const TYPE: [string, string, string][] = [
  ["Hero", "clamp(2.6rem, 7vw, 5rem) · 600 · −0.03em", "text-[clamp(2.2rem,5vw,3.6rem)] font-semibold tracking-[-0.03em] leading-none"],
  ["Section title", "~3.4rem · 600 · −0.03em", "text-[2.25rem] font-semibold tracking-[-0.03em] leading-[1.05]"],
  ["Sort card", "28px · 500 · −0.02em", "text-[28px] font-medium tracking-[-0.02em] leading-[1.2]"],
  ["Body", "17px / 1.47", "text-[17px]"],
  ["Metadata", "13px, muted, never body copy", "text-[13px] text-muted"],
  ["Keys", "SF Mono 12px", "font-mono text-[12px]"],
];

const ACTIONS: [string, string[], string][] = [
  ["Make a Task", ["T"], "Kind becomes task, optional due date; stays until done"],
  ["Make an Event", ["E"], "Date and time; Add to Calendar downloads an .ics file"],
  ["Move to Space", ["M"], "Pick a space, type to filter, Enter to create one"],
  ["Develop", ["D"], "Notes under the original text, which never changes"],
  ["Connect", ["C"], "Link to other thoughts; links show both ways"],
  ["Keep", ["K"], "File as Idea, Note, or Resource without making a task"],
  ["Archive", ["A"], "Out of the way, never deleted, restorable"],
  ["Undo", ["⌘Z", "U"], "Reverses the last action; a toast says what was undone"],
  ["Next / previous", ["J", "K", "↓", "↑"], "Moves instantly, no animation. In Sort: → and ←"],
  ["Capture", ["N", "⌘K"], "Focuses the Dock"],
  ["Shortcuts", ["?"], "Sheet listing every key"],
];

const A11Y = [
  ["Contrast", "WCAG 2.2 AA in both themes: body text 4.5:1 or better, large text and icons 3:1. Muted gray is only for secondary text."],
  ["Focus", "A visible 3 px accent focus ring on every control. Every action is a real button with a label."],
  ["Reduced motion", "Follows the system setting and has its own in-app toggle. Movement is removed; gentle fades remain."],
  ["No color-only meaning", "Kinds always show an icon and a word. Overdue is “Was due Tue”, in words, not red."],
  ["Reversible actions", "Undo everywhere; Archive instead of Delete. Hard delete only from Archive, with a confirm."],
  ["Gentle language", "“Inbox clear. Nothing’s waiting on you.” No streaks, scores, or guilt."],
];

export function UxUi() {
  return (
    <Section id="ux-ui" n="06" eyebrow="UX/UI design" title="Quiet by design."
      lead="We wrote a one-page design contract before building any screen. Every color, size, label, and animation in the app comes from it.">
      <Method
        what="UX design decides how the product works: structure, flows, and behavior. UI design decides how it looks and reads: type, color, spacing, and motion. A design system keeps both consistent."
        how="We picked Apple's Human Interface Guidelines as the reference, set tokens for light and dark, fixed one label and one key per action, and wrote the accessibility floor as testable rules."
        changed="The contract settled arguments quickly. When a feature needed a new color or a hidden gesture, the answer was already written down: no."
      />

      <div className="mt-20">
        <Sub>Design principles</Sub>
        <ol className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map(([t, d], i) => (
            <li key={t} className="border-t border-line-strong pt-4">
              <p className="text-[13px] text-muted tnum">{i + 1}</p>
              <p className="mt-1 text-[19px] font-semibold tracking-[-0.02em] text-text">{t}</p>
              <p className="mt-1.5 text-[15px] text-text-2">{d}</p>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-24">
        <Sub>Tokens, light and dark</Sub>
        <p className="mt-2 text-[15px] text-text-2">Each swatch shows the light value on the left and the dark value on the right. The dot is the live value in your current theme.</p>
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {TOKENS.map(([name, v, l, d, role]) => (
            <li key={name}>
              <div className="relative flex h-20 overflow-hidden rounded-md border border-line">
                <span className="flex-1" style={{ background: l }} />
                <span className="flex-1" style={{ background: d }} />
                <span aria-hidden className="absolute right-2 bottom-2 size-4 rounded-full border-2 border-surface" style={{ background: `var(${v})` }} />
              </div>
              <p className="mt-2 font-mono text-[12px] text-text">{v}</p>
              <p className="text-[13px] text-muted">{role}</p>
              <p className="font-mono text-[11px] text-muted">{l} · {d}</p>
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <p className="text-[13px] font-semibold text-text">Kind tints. Always with the kind&apos;s icon and its word.</p>
          <ul className="mt-4 flex flex-wrap gap-3">
            {KINDS.map((k) => {
              const I = KIND_ICON[k];
              return (
                <li key={k} className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 text-[15px] text-text">
                  <span style={{ color: `var(--k-${k})` }}><I size={18} /></span> {KIND_LABEL[k]}
                  <span className="font-mono text-[11px] text-muted">{KIND_HEX[k][0]} · {KIND_HEX[k][1]}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="mt-24 grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <Sub>Type scale</Sub>
          <p className="mt-2 text-[15px] text-text-2">System font only, so it renders as SF Pro on Apple devices.</p>
          <ul className="mt-8 divide-y divide-line border-y border-line">
            {TYPE.map(([n, spec, cls]) => (
              <li key={n} className="flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                <span className={`${cls} truncate text-text`}>{n === "Keys" ? "⌘K  T  E  M" : n}</span>
                <span className="shrink-0 text-[13px] text-muted">{spec}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <Sub>Accessibility decisions</Sub>
          <dl className="mt-8 space-y-5">
            {A11Y.map(([k, v]) => (
              <div key={k}>
                <dt className="text-[17px] font-semibold tracking-[-0.02em] text-text">{k}</dt>
                <dd className="mt-1 text-[15px] text-text-2">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-24 overflow-x-auto">
        <table className={`${tableCls} min-w-[640px]`}>
          <caption className={captionCls}>
            <span className="text-[1.5rem] font-semibold tracking-[-0.03em] text-text">Processing actions and keys</span>
            <span className="mt-1 block">Same label and same key everywhere. Keys are shortcuts, never the only way: every action is also a visible button.</span>
          </caption>
          <thead><tr><th scope="col" className={thCls}>Action</th><th scope="col" className={thCls}>Key</th><th scope="col" className={thCls}>What it does</th></tr></thead>
          <tbody>
            {ACTIONS.map(([a, k, d]) => (
              <tr key={a}>
                <th scope="row" className={`${tdCls} font-semibold whitespace-nowrap text-text`}>{a}</th>
                <td className={`${tdCls} whitespace-nowrap`}>
                  {k.map((s, i) => (
                    <kbd key={i} className="mr-1 inline-block rounded-sm border border-line bg-bg px-1.5 py-0.5 font-mono text-[12px] text-text">{s}</kbd>
                  ))}
                </td>
                <td className={tdCls}>{d}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <figure className="mt-24">
        <Sub>Screen map</Sub>
        <div className="mt-8 overflow-x-auto rounded-xl border border-line bg-surface p-4 sm:p-8">
          <ScreenMap />
        </div>
        <figcaption className={`${captionCls} mt-3`}>Information architecture: every thought enters through Capture and the Inbox, and leaves through one labeled action.</figcaption>
      </figure>
    </Section>
  );
}

function ScreenMap() {
  const box = "fill-[var(--surface-2)] stroke-[var(--line-strong)]";
  const dests: [string, string][] = [
    ["Tasks · Today", "Make a Task  T"],
    ["Calendar + .ics", "Make an Event  E"],
    ["Spaces", "Move to Space  M"],
    ["Kept: Idea, Note, Resource", "Keep  K"],
    ["Archive (restorable)", "Archive  A"],
    ["Same thought, more detail", "Develop  D · Connect  C"],
  ];
  return (
    <svg viewBox="0 0 900 380" className="h-auto w-full min-w-[720px] text-text" role="img" aria-labelledby="ia-t ia-d">
      <title id="ia-t">Thought Dock screen map</title>
      <desc id="ia-d">Capture on the phone sends thoughts to the Inbox on the desk. From the Inbox, Sort shows one thought at a time and six actions send it to Tasks and Today, Calendar, Spaces, Kept, Archive, or keep it in place with Develop and Connect. Pairing links phone and desk with a QR code. Settings hold theme, reduce motion, and suggestions.</desc>
      <defs>
        <marker id="ia-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill="currentColor" />
        </marker>
      </defs>
      <g fontSize="13" fill="currentColor">
        <rect x="20" y="30" width="440" height="46" rx="12" className="fill-none stroke-[var(--line-strong)]" strokeDasharray="5 5" />
        <text x="40" y="58">Pair phone · scan a QR code or type a short code, no account</text>

        <text x="20" y="128" fontSize="12" className="fill-[var(--muted)]">PHONE</text>
        <text x="230" y="128" fontSize="12" className="fill-[var(--muted)]">DESK</text>
        <rect x="20" y="140" width="160" height="78" rx="14" className="fill-none stroke-[var(--accent)]" strokeWidth="1.5" />
        <text x="40" y="172" fontSize="17" fontWeight="600">Capture</text>
        <text x="40" y="196" className="fill-[var(--muted)]">/capture · one field</text>

        <rect x="230" y="140" width="160" height="78" rx="14" className={box} />
        <text x="250" y="172" fontSize="17" fontWeight="600">Inbox</text>
        <text x="250" y="196" className="fill-[var(--muted)]">everything lands here</text>

        <rect x="440" y="140" width="150" height="78" rx="14" className={box} />
        <text x="460" y="172" fontSize="17" fontWeight="600">Sort</text>
        <text x="460" y="196" className="fill-[var(--muted)]">one at a time</text>

        <path d="M180 179h44" stroke="var(--accent)" strokeWidth="1.5" markerEnd="url(#ia-ar)" className="text-accent" />
        <path d="M390 179h44" stroke="currentColor" strokeWidth="1.2" markerEnd="url(#ia-ar)" />
        <path d="M310 218v40h-0" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 4" opacity=".6" />
        <text x="322" y="252" fontSize="12" className="fill-[var(--muted)]">or process from the list + detail pane</text>

        {dests.map(([t, a], i) => {
          const y = 20 + i * 58;
          return (
            <g key={t}>
              <path d={`M590 179C620 179 615 ${y + 24} 646 ${y + 24}`} fill="none" stroke="currentColor" strokeWidth="1.2" markerEnd="url(#ia-ar)" />
              <rect x="652" y={y} width="232" height="48" rx="12" className={box} />
              <text x="668" y={y + 21} fontWeight="600">{t}</text>
              <text x="668" y={y + 38} fontSize="11.5" className="fill-[var(--muted)] font-mono">{a}</text>
            </g>
          );
        })}

        <rect x="20" y="300" width="570" height="50" rx="12" className="fill-none stroke-[var(--line-strong)]" />
        <text x="40" y="330">Settings · Light / Dark / System · Reduce motion · Show suggestions</text>
      </g>
    </svg>
  );
}
