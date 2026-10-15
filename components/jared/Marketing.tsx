import { LINKS } from "@/lib/links";
import { Card, Method, Section, Sub, Tag, TextLink, captionCls, tableCls, tdCls, thCls } from "./ui";

const PILLARS = [
  { t: "Nothing to decide", d: "One field and a Save button. No lists, dates, or tags while you're walking to class." },
  { t: "Sort when you sit down", d: "The desk shows one thought at a time with big labeled actions, so the pile has an end." },
  { t: "You stay in charge", d: "Suggestions are a quiet chip you can ignore. Every action can be undone. Nothing is filed for you." },
  { t: "Free, no account", d: "Pair your phone with a QR code. No sign-up, no subscription, no extra device to buy." },
];

const LAUNCH = [
  ["Week 1", "ENGR 1 demo and class group chats", "Show the 60-second capture-to-task flow live", "Who asks to try it after class"],
  ["Week 1", "Study groups and STEM club channels", "Post the launch video with the /capture link", "Replies and questions in the thread"],
  ["Week 2", "Tutoring and learning center", "Ask to leave a QR flyer at the front desk", "Whether staff agree to share it"],
  ["Week 2", "Disability resource center", "Offer it as one optional tool, ask for feedback first", "Their accessibility notes, before any wider push"],
  ["Week 3", "Campus newsletter or student Instagram", "Short story: why capture and sorting are separate", "Whether it runs; feedback we receive"],
];

export function Marketing() {
  return (
    <Section id="marketing" n="01" eyebrow="Marketing" title="Capture now. Organize later."
      lead="We wrote the positioning before the first screen, so every design argument could be settled by asking whether it kept that promise.">
      <Method
        what="Positioning names who the product is for, the problem it solves, and how it differs from what they already use. Messaging pillars are the few claims every piece of copy has to support."
        how="We wrote one positioning statement, picked a four-word tagline, and drafted the landing page, a launch video, and a campus launch plan from the same four pillars."
        changed="The tagline became the product's structure: two screens, two moments. It also ruled out features that pull organizing back into capture, like a category picker on the phone."
      />

      <div className="mt-20 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-7 sm:p-10">
          <p className="text-[13px] font-semibold text-muted">Positioning statement</p>
          <blockquote className="mt-4 text-[clamp(1.25rem,2.2vw,1.6rem)] leading-[1.35] font-medium tracking-[-0.02em] text-text">
            For students who think faster than they can organize, Thought Dock is a two-part notes app that keeps
            capturing and sorting apart. To-do apps want a list, a date, and a tag before you can save. Thought Dock
            saves first and lets you decide later, at a desk, one thought at a time.
          </blockquote>
        </Card>
        <Card className="p-7 sm:p-10">
          <p className="text-[13px] font-semibold text-muted">Audience</p>
          <p className="mt-4 text-[17px] text-text">
            Students juggling classes, work, and commutes, from community college to university.
          </p>
          <p className="mt-3 text-[15px] text-text-2">
            It is built to help students with attention difficulties, anxiety, executive-function friction, or decision
            fatigue. We don&apos;t market it as an ADHD app: it should feel useful to every overwhelmed student, and nobody
            should have to identify with a label to use it.
          </p>
        </Card>
      </div>

      <div className="mt-20">
        <Sub>Messaging pillars</Sub>
        <ol className="mt-8 grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {PILLARS.map((p, i) => (
            <li key={p.t} className="flex gap-5">
              <span className="tnum mt-0.5 text-[15px] font-semibold text-muted">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="text-[19px] font-semibold tracking-[-0.02em] text-text">{p.t}</p>
                <p className="mt-1.5 text-[15px] text-text-2">{p.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-20 grid gap-6 md:grid-cols-2">
        <Artifact href="/" label="Landing page" note="The public home page, written from the four pillars. One promise, one primary action.">
          <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="text-[22px] font-semibold tracking-[-0.03em] text-text">Capture now.<br />Organize later.</p>
            <span className="rounded-full bg-ink px-4 py-1.5 text-[12px] font-medium text-on-ink">Start capturing</span>
          </div>
        </Artifact>
        <Artifact href={LINKS.brag} label="Launch video" note="A short launch video for class group chats and club channels, built from the app itself.">
          <div className="flex h-full items-center justify-center">
            <span className="grid size-14 place-items-center rounded-full bg-ink text-on-ink">
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden><path d="M8 5.5v13l10.5-6.5z" fill="currentColor" /></svg>
            </span>
          </div>
        </Artifact>
      </div>

      <div className="mt-20 overflow-x-auto">
        <table className={`${tableCls} min-w-[720px]`}>
          <caption className={captionCls}>
            <span className="text-[1.5rem] font-semibold tracking-[-0.03em] text-text">Launch plan: campus channels</span>
            <span className="mt-1 block">Small, permission-first, and measured by what people actually say back.</span>
          </caption>
          <thead>
            <tr><th scope="col" className={thCls}>When</th><th scope="col" className={thCls}>Channel</th><th scope="col" className={thCls}>What we post or ask</th><th scope="col" className={thCls}>What we watch</th></tr>
          </thead>
          <tbody>
            {LAUNCH.map((r) => (
              <tr key={r[1]}>
                <td className={`${tdCls} whitespace-nowrap text-text`}>{r[0]}</td>
                <td className={`${tdCls} text-text`}>{r[1]}</td>
                <td className={tdCls}>{r[2]}</td>
                <td className={tdCls}>{r[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-20 grid gap-6 md:grid-cols-2">
        <Card className="p-7">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold text-muted">Sample post · Instagram / student page</p>
            <Tag>Draft</Tag>
          </div>
          <div className="mt-4 space-y-3 text-[16px] leading-[1.5] text-text">
            <p>You remember the deadline while you&apos;re on the bus. By the time you&apos;re home, it&apos;s gone.</p>
            <p>Thought Dock is a free app from three ENGR 1 students. Type or say the thought on your phone and put it away. Later, at your laptop, sort everything in a few minutes: tasks, events, class spaces.</p>
            <p>No account. Pair with a QR code. Capture now, organize later.</p>
          </div>
        </Card>
        <Card className="p-7">
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-semibold text-muted">Sample post · class Discord</p>
            <Tag>Draft</Tag>
          </div>
          <div className="mt-4 space-y-3 text-[16px] leading-[1.5] text-text">
            <p>hey all, we built a thing for our hackathon and would love a few people to break it</p>
            <p>it&apos;s an inbox for random thoughts. phone side is one text box. desk side lets you turn stuff into tasks or calendar events one at a time. works offline, no login.</p>
            <p>link for your phone: [/capture link]. tell us what&apos;s confusing</p>
          </div>
        </Card>
      </div>
      <p className="mt-6 text-[13px] text-muted">
        Copy drafts are for Luke and Maryam to rewrite in their own voice before anything is posted. Nothing has been published yet.
        Source for every link: <TextLink href={LINKS.repo}>GitHub</TextLink>.
      </p>
    </Section>
  );
}

function Artifact({ href, label, note, children }: { href: string; label: string; note: string; children: React.ReactNode }) {
  return (
    <a href={href} className="group block rounded-lg border border-line bg-surface p-3 hover-soft">
      <div aria-hidden className="h-48 rounded-md border border-line bg-bg">{children}</div>
      <div className="px-3 pt-4 pb-2">
        <p className="text-[17px] font-semibold tracking-[-0.02em] text-text">{label} <span className="text-accent" aria-hidden>→</span></p>
        <p className="mt-1 text-[15px] text-text-2">{note}</p>
      </div>
    </a>
  );
}
