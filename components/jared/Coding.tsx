import { LINKS } from "@/lib/links";
import { Method, Section, Sub, TextLink } from "./ui";

const STACK: [string, string][] = [
  ["Framework", "Next.js 16 (App Router), React 19, TypeScript"],
  ["Styling", "Tailwind CSS v4 with design tokens as CSS variables"],
  ["Storage", "Upstash Redis through the Vercel Marketplace (free tier); in-memory fallback for local dev"],
  ["Hosting", "Vercel: static pages plus API route functions"],
  ["Pairing", "QR code (qrcode.react) or a 6-character code that expires in 10 minutes"],
  ["Classifier", "Logistic regression written from scratch in TypeScript, trained on synthetic labeled data"],
  ["3D", "three.js for the dock viewer and STL export"],
];

const TYPES = `type Item = {
  id: string;
  text: string;          // captured verbatim, never edited
  body?: string;         // "Develop" notes
  status: "inbox" | "kept" | "archived";
  kind?: "task" | "event" | "idea" | "resource" | "note";
  spaceId?: string | null;
  due?: string;          // task, YYYY-MM-DD
  at?: string;           // event, local datetime
  links: string[];       // connected thoughts, kept symmetric
  media?: { type: "audio" | "image"; mime: string };
  source?: "phone" | "desk";
  createdAt: number; updatedAt: number;
};

type Space = { id: string; name: string; createdAt: number };

// Every change is an operation; undo replays the inverse.
type Op =
  | { op: "put"; item: Item }
  | { op: "del"; id: string }
  | { op: "putSpace"; space: Space }
  | { op: "delSpace"; id: string };`;

const RUN = `npm ci
npm run dev            # http://localhost:3000
# optional: real storage
# KV_REST_API_URL=…  KV_REST_API_TOKEN=…  (from Vercel → Upstash)

npx tsc --noEmit       # typecheck
npm run lint           # eslint
npm run build          # production build
node scripts/export-stl.ts   # dock STL + drawing (self-checked)`;

export function Coding() {
  return (
    <Section id="coding" n="09" eyebrow="Coding" band title="Small, boring, and reliable."
      lead="Two web pages, four API routes, one Redis database, and a model small enough to run in the browser.">
      <Method
        what="Software architecture decides where code runs, where data lives, and how the pieces talk. A clear data model keeps every screen working from the same facts."
        how="Both screens use one hook that applies every change instantly, queues it locally, and syncs it through API routes. The desk polls every 4 seconds while visible. No accounts: a dock ID is the key."
        changed="Choosing operations (put, del) instead of whole-document saves meant phone and desk can edit different thoughts at once without overwriting each other, and Undo came almost for free."
      />

      <figure className="mt-20">
        <div className="overflow-x-auto rounded-xl border border-line bg-surface p-4 sm:p-8">
          <Architecture />
        </div>
        <figcaption className="mt-3 text-[13px] text-muted">Architecture. Solid arrows carry data; the dashed arrow is the one-time pairing step.</figcaption>
      </figure>

      <div className="mt-20 grid gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div className="min-w-0">
          <Sub>Data model</Sub>
          <p className="mt-2 text-[15px] text-text-2">From <code className="font-mono text-[14px]">lib/types.ts</code>, lightly condensed.</p>
          <pre className="mt-6 overflow-x-auto rounded-lg border border-line bg-surface p-5 font-mono text-[13px] leading-[1.6] text-text-2"><code>{TYPES}</code></pre>
        </div>
        <div className="min-w-0">
          <Sub>Tech stack</Sub>
          <dl className="mt-6 divide-y divide-line border-y border-line">
            {STACK.map(([k, v]) => (
              <div key={k} className="grid gap-1 py-3 sm:grid-cols-[110px_1fr] sm:gap-4">
                <dt className="text-[15px] font-semibold text-text">{k}</dt>
                <dd className="text-[15px] text-text-2">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-20 grid gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div className="min-w-0">
          <Sub>How to run it</Sub>
          <pre className="mt-6 overflow-x-auto rounded-lg bg-ink p-5 font-mono text-[13px] leading-[1.7] text-on-ink"><code>{RUN}</code></pre>
        </div>
        <div>
          <Sub>Testing</Sub>
          <ul className="mt-6 space-y-4 text-[15px] text-text-2">
            <li><span className="font-semibold text-text">Static checks.</span> Typecheck, lint, and a production build must pass on every branch before merge.</li>
            <li><span className="font-semibold text-text">Classifier.</span> Trained and evaluated on held-out synthetic data. Metrics and limits are in the{" "}
              <TextLink href={`${LINKS.repo}/blob/main/docs/MODEL_CARD.md`}>model card</TextLink>. It only ever suggests.</li>
            <li><span className="font-semibold text-text">3D export.</span> The export script checks that the mesh volume matches the volume computed from the dimensions.</li>
            <li><span className="font-semibold text-text">People.</span> The <a className="text-accent" href="#usability-test">usability test</a> is the one that matters most, and it hasn&apos;t run yet.</li>
          </ul>
          <p className="mt-6 text-[15px]"><TextLink href={LINKS.repo}>Browse the code on GitHub</TextLink></p>
        </div>
      </div>
    </Section>
  );
}

function Architecture() {
  const box = "fill-[var(--surface-2)] stroke-[var(--line-strong)]";
  return (
    <svg viewBox="0 0 960 400" className="h-auto w-full min-w-[760px] text-text" role="img" aria-labelledby="arch-t arch-d">
      <title id="arch-t">Thought Dock architecture</title>
      <desc id="arch-d">The phone runs Capture with an offline queue in local storage. The desk runs DeskOS, which polls every 4 seconds and runs the classifier in the browser. Both send batches of operations to Next.js API routes on Vercel, which read and write Upstash Redis: one hash for items and one for spaces per dock. Pairing uses a short code or QR from the desk that the phone redeems once.</desc>
      <defs>
        <marker id="arch-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill="currentColor" />
        </marker>
      </defs>
      <g fontSize="13" fill="currentColor">
        <text x="24" y="28" fontSize="12" className="fill-[var(--muted)]">BROWSER</text>
        <text x="392" y="28" fontSize="12" className="fill-[var(--muted)]">VERCEL</text>
        <text x="730" y="28" fontSize="12" className="fill-[var(--muted)]">DATA</text>

        <rect x="24" y="44" width="290" height="140" rx="16" className={box} />
        <text x="44" y="76" fontSize="17" fontWeight="600">Phone · Capture</text>
        <text x="44" y="102">/capture · text, voice, photo</text>
        <text x="44" y="124" className="fill-[var(--muted)]">offline queue in localStorage</text>
        <text x="44" y="146" className="fill-[var(--muted)]">optimistic: saved before the network</text>

        <rect x="24" y="226" width="290" height="150" rx="16" className={box} />
        <text x="44" y="258" fontSize="17" fontWeight="600">Desk · DeskOS</text>
        <text x="44" y="284">/desk · Inbox, Sort, Spaces, Archive</text>
        <text x="44" y="306" className="fill-[var(--muted)]">polls every 4 s while visible</text>
        <rect x="44" y="322" width="250" height="36" rx="10" fill="var(--accent-soft)" stroke="var(--accent)" />
        <text x="58" y="345">Classifier runs in the browser</text>

        <rect x="392" y="44" width="270" height="332" rx="16" className="fill-none stroke-[var(--line-strong)]" />
        <text x="412" y="76" fontSize="17" fontWeight="600">Next.js API routes</text>
        {[
          ["POST /api/dock", "create a dock"],
          ["GET /api/dock/:id", "load items + spaces"],
          ["PATCH /api/dock/:id", "apply ≤200 ops"],
          ["…/media/:item", "voice + photo blobs"],
          ["/api/pair", "short code ↔ dock"],
        ].map(([r, d], i) => (
          <g key={r}>
            <text x="412" y={112 + i * 52} className="font-mono" fontSize="12.5">{r}</text>
            <text x="412" y={130 + i * 52} fontSize="12" className="fill-[var(--muted)]">{d}</text>
          </g>
        ))}

        <rect x="730" y="120" width="210" height="160" rx="16" className={box} />
        <text x="750" y="152" fontSize="17" fontWeight="600">Upstash Redis</text>
        <text x="750" y="178" className="fill-[var(--muted)]">per dock:</text>
        <text x="750" y="200" className="font-mono" fontSize="12">td:id:items  (hash)</text>
        <text x="750" y="220" className="font-mono" fontSize="12">td:id:spaces (hash)</text>
        <text x="750" y="246" className="fill-[var(--muted)]">kept 180 days after</text>
        <text x="750" y="264" className="fill-[var(--muted)]">the last write</text>

        <path d="M314 114H386" stroke="currentColor" strokeWidth="1.4" markerEnd="url(#arch-ar)" />
        <text x="322" y="106" fontSize="11.5">ops</text>
        <path d="M314 290H386" stroke="currentColor" strokeWidth="1.4" markerStart="url(#arch-ar)" markerEnd="url(#arch-ar)" />
        <text x="322" y="282" fontSize="11.5">poll + ops</text>
        <path d="M662 200H724" stroke="currentColor" strokeWidth="1.4" markerStart="url(#arch-ar)" markerEnd="url(#arch-ar)" />
        <path d="M120 222V188" stroke="var(--accent)" strokeWidth="1.4" strokeDasharray="4 4" markerEnd="url(#arch-ar)" />
        <text x="130" y="210" fontSize="11.5" fill="var(--accent)">pair once: QR or code</text>
      </g>
    </svg>
  );
}
