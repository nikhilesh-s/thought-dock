import { LINKS } from "@/lib/links";
import { Method, Section, Sub, TextLink } from "./ui";

const GATES = [
  ["Typecheck", "npx tsc --noEmit"],
  ["Lint", "npx eslint …"],
  ["Build", "npm run build"],
  ["Tests", "classifier evaluation, export self-checks"],
];

const CONTROL = [
  ["Humans choose", "The problem, the concept, the design direction, and what gets cut were team decisions. The agent proposed; we picked."],
  ["Humans approve", "Nothing is pushed, posted, or deployed without a person saying yes. Merges happen after review."],
  ["Humans verify", "The usability test, decision-matrix scores, and report writing are ours, and the page says so where they're pending."],
];

export function LongHorizon() {
  return (
    <Section id="ai-build" n="08" eyebrow="Long-horizon AI task" title="One agent, many hours, many stages."
      lead="We built Thought Dock with AI agents, and we want to be clear about how. Claude Code acted as design lead and builder. The product decisions were ours.">
      <Method
        what="A long-horizon AI task is work an agent carries across hours and many steps: planning, building, checking its own output, and recovering from mistakes, instead of answering a single prompt."
        how="One orchestrating agent wrote the plan and the shared foundations, then split the build across parallel subagents, each in its own git worktree, with verification gates before anything could merge."
        changed="Writing the design contract and data layer first, before any fan-out, kept four parallel builders consistent. Every subagent read the same rules and called the same data functions."
      />

      <figure className="mt-20">
        <div className="overflow-x-auto rounded-xl border border-line bg-surface p-4 sm:p-8">
          <Timeline />
        </div>
        <figcaption className="mt-3 text-[13px] text-muted">How the build was run. Lanes are who did the work; diamonds are human checkpoints.</figcaption>
      </figure>

      <div className="mt-20 grid gap-12 lg:grid-cols-2">
        <div>
          <Sub>Checkpoints and logs</Sub>
          <p className="mt-4 text-[16px] text-text-2">
            Each stage ends in a commit, so any step can be inspected or rolled back. The agent keeps two running files in
            the repo: a run log of what it did and why, and a decision log of choices that a person should be able to question.
          </p>
          <ul className="mt-5 space-y-2 text-[16px]">
            <li><TextLink href={`${LINKS.repo}/blob/main/RUN_LOG.md`}>RUN_LOG.md</TextLink> <span className="text-text-2">· what happened, in order</span></li>
            <li><TextLink href={`${LINKS.repo}/blob/main/DECISIONS.md`}>DECISIONS.md</TextLink> <span className="text-text-2">· what was decided, by whom, and why</span></li>
            <li><TextLink href={`${LINKS.repo}/blob/main/DESIGN.md`}>DESIGN.md</TextLink> <span className="text-text-2">· the contract every subagent follows</span></li>
          </ul>
        </div>
        <div>
          <Sub>Verification gates</Sub>
          <p className="mt-4 text-[16px] text-text-2">A branch is only ready to merge when all of these pass on it.</p>
          <ol className="mt-5 divide-y divide-line border-y border-line">
            {GATES.map(([g, c], i) => (
              <li key={g} className="flex items-baseline justify-between gap-4 py-3">
                <span className="text-[16px] text-text"><span className="tnum mr-3 text-muted">{i + 1}</span>{g}</span>
                <code className="font-mono text-[12px] text-muted">{c}</code>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-20">
        <Sub>Where humans stayed in control</Sub>
        <dl className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-3">
          {CONTROL.map(([k, v]) => (
            <div key={k} className="border-t border-line-strong pt-4">
              <dt className="text-[17px] font-semibold tracking-[-0.02em] text-text">{k}</dt>
              <dd className="mt-1.5 text-[15px] text-text-2">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}

function Timeline() {
  const lanes: [string, number][] = [
    ["Team", 56], ["Orchestrator", 128], ["App UI", 196], ["Classifier", 236], ["Portfolio", 276], ["Landing + video", 316],
  ];
  const sub = lanes.slice(2);
  const check = (x: number, y: number) => <path d={`M${x} ${y - 8}l8 8-8 8-8-8z`} fill="var(--surface)" stroke="currentColor" strokeWidth="1.5" />;
  return (
    <svg viewBox="0 0 960 372" className="h-auto w-full min-w-[760px] text-text" role="img" aria-labelledby="tl-t tl-d">
      <title id="tl-t">Timeline of the multi-agent build</title>
      <desc id="tl-d">The orchestrator plans and writes the design contract, data layer, and API. It then forks four subagents in separate git worktrees: app UI, classifier, this portfolio, and the landing page with launch video. Each subagent passes typecheck, lint, build, and tests. The orchestrator reviews and merges, then runs a full build. The team checks in at four points: choosing the problem and concept, approving the design contract, choosing what merges, and running the usability test and scoring.</desc>
      <g fontSize="12.5" fill="currentColor">
        {["Plan", "Foundations", "Parallel build in worktrees", "Merge and verify"].map((s, i) => (
          <text key={s} x={[190, 340, 480, 770][i]} y="18" className="fill-[var(--muted)]" fontSize="12">{s.toUpperCase()}</text>
        ))}
        {[330, 465, 760].map((x) => <path key={x} d={`M${x} 26V356`} stroke="var(--line-strong)" strokeDasharray="2 4" />)}
        {lanes.map(([l, y]) => <text key={l} x="16" y={y + 4} fontWeight={y < 150 ? 600 : 400}>{l}</text>)}
        <text x="16" y="172" fontSize="11" className="fill-[var(--muted)]">SUBAGENTS</text>

        <path d="M180 56H940" stroke="var(--line-strong)" />
        {check(230, 56)}{check(400, 56)}{check(800, 56)}{check(905, 56)}
        <text x="214" y="86" fontSize="11">Problem + concept</text>
        <text x="372" y="86" fontSize="11">Design contract</text>
        <text x="750" y="86" fontSize="11">What merges</text>
        <text x="866" y="40" fontSize="11">Test + scoring</text>

        <rect x="180" y="116" width="280" height="24" rx="12" fill="var(--ink)" />
        <text x="196" y="132" fill="var(--on-ink)" fontSize="12">plan · tokens · data layer · API routes</text>
        <path d="M460 128H770" stroke="currentColor" strokeDasharray="4 4" opacity=".5" />
        <text x="540" y="122" fontSize="11" className="fill-[var(--muted)]">answers questions, watches logs</text>
        <rect x="770" y="116" width="170" height="24" rx="12" fill="var(--ink)" />
        <text x="786" y="132" fill="var(--on-ink)" fontSize="12">review · merge · full build</text>

        {sub.map(([l, y]) => (
          <g key={l}>
            <path d={`M462 140C470 ${y} 470 ${y} 482 ${y}`} fill="none" stroke="currentColor" opacity=".45" />
            <rect x="482" y={y - 11} width="236" height="22" rx="11" fill="var(--accent-soft)" stroke="var(--accent)" />
            <text x="496" y={y + 4} fontSize="12">own worktree + branch</text>
            {[0, 1, 2, 3].map((i) => (
              <circle key={i} cx={726 + i * 9} cy={y} r="3.2" fill="currentColor" />
            ))}
            <path d={`M766 ${y}C774 ${y} 772 140 776 140`} fill="none" stroke="currentColor" opacity=".45" />
          </g>
        ))}
        <text x="712" y="348" fontSize="11" className="fill-[var(--muted)]">● tsc · lint · build · tests</text>
      </g>
    </svg>
  );
}
