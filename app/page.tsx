import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Icons";
import { HeroVisual } from "@/components/landing/HeroVisual";
import { PairCrop } from "@/components/landing/PairCrop";
import { CaptureCrop } from "@/components/landing/PhoneMock";
import { RevealOnScroll } from "@/components/landing/Reveal";
import { Key, SortMock, SuggestionChip } from "@/components/landing/SortMock";
import s from "@/components/landing/landing.module.css";

export const metadata: Metadata = {
  title: { absolute: "Thought Dock: Capture now. Organize later." },
  description:
    "Put every thought down on your phone in one tap. Sort it at your desk when you're ready, one at a time. Free, no account.",
};

const primary =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-[18px] py-2 text-[15px] font-medium text-on-ink hover:bg-ink/85";
const secondary =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-surface px-[18px] py-2 text-[15px] font-medium text-text ring-1 ring-line-strong hover:bg-surface-2";
const link = "font-medium text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent";
const wrap = "mx-auto w-full max-w-[1080px] px-4 md:px-6";
const h2 = "text-[clamp(2rem,4.6vw,3rem)] font-semibold tracking-[-0.03em] text-text";
const lede = "mt-4 max-w-[38rem] text-[17px] text-text-2 md:text-[19px]";

const STEPS = [
  {
    n: "1",
    title: "Capture",
    where: "On your phone",
    body: "Type it, say it, or snap a photo, then tap Save. Voice notes show a live transcript while you talk. There are no folders, tags, or dates to choose.",
    crop: <CaptureCrop />,
  },
  {
    n: "2",
    title: "Pair",
    where: "Once, in ten seconds",
    body: "Open your desk on a laptop and scan its QR code with your phone. That links the two. No account, no email, no password.",
    crop: <PairCrop />,
  },
  {
    n: "3",
    title: "Sort",
    where: "At your desk, when you choose",
    body: "Everything you caught is waiting in one inbox. Make it a task, put it on your calendar, or file it in a space like Classes, Engineering, or College Apps.",
    crop: <SortMock compact />,
  },
];

const A11Y = [
  ["Keyboard for everything", "Put the mouse away. Tab reaches every control, and every Sort action has a single key."],
  ["A focus ring you can see", "Press Tab. Whatever has focus gets a 3px blue outline, in light and dark."],
  ["AA contrast in both themes", "Body text meets WCAG 2.2 AA (4.5:1) on light and dark. Switch your system theme to compare."],
  ["Reduced motion respected", "Turn on Reduce Motion in your system or in Settings. Movement stops; gentle fades stay."],
  ["Meaning never by color alone", "Every kind of thought shows an icon and a word, never just a tint."],
  ["Undo everything", "Change anything in Sort, then press ⌘Z or U. Archive keeps things; nothing is deleted."],
  ["Gentle language", "No streaks, no scores, no red overdue alarms. A missed date reads “Was due Tue.”"],
] as const;

export default function Home() {
  return (
    <>
      <a href="#main" className="sr-only-focusable fixed left-4 top-2 z-50 rounded-full bg-ink px-4 py-2.5 text-[15px] font-medium text-on-ink">
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-line bg-bg">
        <nav aria-label="Main" className={`${wrap} flex h-14 items-center gap-2`}>
          <Link href="/" className="mr-auto flex min-h-11 items-center gap-2 text-[17px] font-semibold tracking-[-0.02em] text-text">
            <Logo size={26} />
            Thought Dock
          </Link>
          <ul className="hidden items-center gap-1 text-[14px] text-text-2 md:flex">
            <li><a href="#how" className="flex min-h-11 items-center px-3 hover:text-text">How it works</a></li>
            <li><a href="#accessibility" className="flex min-h-11 items-center px-3 hover:text-text">Accessibility</a></li>
            <li><Link href="/jared" className="flex min-h-11 items-center px-3 hover:text-text">Process</Link></li>
          </ul>
          <Link href="/desk" className={`${primary} md:ml-3`}>Open your desk</Link>
        </nav>
      </header>

      <main id="main" tabIndex={-1} className="outline-none">
        {/* Hero */}
        <section aria-labelledby="hero-title" className="overflow-x-clip pt-16 md:pt-24">
          <div className={`${wrap} text-center`}>
            <h1 id="hero-title" className="mx-auto max-w-[12ch] text-[clamp(2.6rem,7vw,5rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-text">
              Capture now. Organize later.
            </h1>
            <p className="mx-auto mt-5 max-w-[34rem] text-[19px] leading-[1.4] text-text-2 md:text-[21px]">
              Put every thought down on your phone in one tap. Sort it at your desk when you&rsquo;re ready, one at a time.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/desk" className={primary}>Open your desk</Link>
              <Link href="/capture" className={secondary}>Capture on your phone</Link>
            </div>
            <p className="mt-4 text-[13px] text-muted">Free. No account. Runs in your browser.</p>
          </div>
          <figure className={`${wrap} mt-14 md:mt-20`}>
            <HeroVisual />
            <figcaption className="mx-auto mt-6 max-w-[40rem] text-center text-[13px] text-muted">
              A thought saved on the phone&rsquo;s Capture screen appears at the top of the DeskOS inbox, next to the
              sidebar of spaces and the actions for sorting it.
            </figcaption>
          </figure>
        </section>

        {/* Problem */}
        <section aria-labelledby="problem-title" className="py-24 md:py-32">
          <div className={`${wrap} ${s.reveal}`}>
            <div className="mx-auto max-w-[44rem]">
              <h2 id="problem-title" className={h2}>Your head is full. Your notes app wants a folder.</h2>
              <p className="mt-6 text-[19px] leading-[1.5] text-text-2 md:text-[21px]">
                Ideas, deadlines, and worries show up in the middle of lecture, on the bus, or at 1 a.m. Most tools ask
                you to pick a folder, a tag, and a due date right then, which is exactly when you have the least room to
                think. So the thought gets lost, or it stays in your head taking up space. Thought Dock splits the job in
                two: catch it in a second now, and decide what it is later, when you sit down on purpose.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" aria-labelledby="how-title" className="scroll-mt-16 pb-24 md:pb-32">
          <div className={wrap}>
            <div className={s.reveal}>
              <h2 id="how-title" className={h2}>How it works</h2>
              <p className={lede}>Two screens with two different jobs. Your phone catches. Your desk sorts.</p>
            </div>
            <ol className="mt-14 space-y-20 md:mt-20 md:space-y-28">
              {STEPS.map((step, i) => (
                <li key={step.n} className={`grid items-center gap-8 md:grid-cols-2 md:gap-16 ${s.reveal}`}>
                  <div className={i % 2 ? "md:order-2" : ""}>
                    <p className="text-[15px] font-medium text-accent">
                      <span className="tnum">{step.n}</span> · {step.where}
                    </p>
                    <h3 className="mt-2 text-[clamp(1.75rem,3.4vw,2.25rem)] text-text">{step.title}</h3>
                    <p className="mt-3 max-w-[30rem] text-text-2">{step.body}</p>
                  </div>
                  <div aria-hidden className="rounded-xl bg-bg-2 p-6 md:p-10">
                    {step.crop}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Sort spotlight */}
        <section aria-labelledby="sort-title" className="py-24 md:py-32">
          <div className={wrap}>
            <div className={s.reveal}>
              <h2 id="sort-title" className={h2}>Sort, one thought at a time.</h2>
              <p className={lede}>
                Sort shows a single thought, large, with every action under it. Each action has one key, so you can
                clear your inbox without reaching for the mouse. Every key is also a labeled button.
              </p>
            </div>
            <div className={`mt-12 rounded-xl bg-bg-2 p-4 sm:p-6 md:mt-16 md:p-10 ${s.reveal}`}>
              <div aria-hidden>
                <SortMock />
              </div>
              <p className="sr-only">
                The Sort view: one thought shown large, a suggestion that it looks like an Event, and seven actions with
                keys: T Task, E Event, M Move, D Develop, C Connect, K Keep, A Archive.
              </p>
            </div>
            <ol aria-label="A sort, by keyboard" className={`mt-8 grid gap-6 text-[15px] md:grid-cols-3 md:gap-8 ${s.reveal}`}>
              <li>
                <p className="flex gap-1 text-[22px]"><Key>E</Key></p>
                <p className="mt-2 text-text-2">Make it an Event. Pick Thursday at 6 PM and add it to any calendar.</p>
              </li>
              <li>
                <p className="flex gap-1 text-[22px]"><Key>⌘</Key><Key>Z</Key></p>
                <p className="mt-2 text-text-2">Changed your mind? Undo puts it right back where it was.</p>
              </li>
              <li>
                <p className="flex gap-1 text-[22px]"><Key>→</Key></p>
                <p className="mt-2 text-text-2">On to the next one. At the end: &ldquo;Inbox clear. Nothing&rsquo;s waiting on you.&rdquo;</p>
              </li>
            </ol>
          </div>
        </section>

        {/* Suggestions */}
        <section aria-labelledby="suggest-title" className="py-24 md:py-32">
          <div className={`${wrap} grid items-center gap-10 md:grid-cols-[1.1fr_1fr] md:gap-16 ${s.reveal}`}>
            <div>
              <h2 id="suggest-title" className={h2}>Suggestions you control.</h2>
              <p className={lede}>
                Thought Dock guesses what each thought is: a task, an event, an idea, a resource, or a note. The guess
                comes from a small model we trained from scratch, and it runs entirely on your device, so sorting never
                sends your words to an AI service.
              </p>
              <p className="mt-4 max-w-[38rem] text-[17px] text-text-2 md:text-[19px]">
                It only suggests. It never moves, files, or deletes anything on its own. When it isn&rsquo;t fairly sure,
                it stays quiet, and you can turn it off in Settings.
              </p>
            </div>
            <div aria-hidden className="rounded-xl bg-surface p-6 text-[17px] shadow-1 ring-1 ring-line md:p-8">
              <p className="text-[13px] text-muted">From your phone · 3 hours ago</p>
              <p className="mt-2 text-[22px] font-semibold leading-[1.25] tracking-[-0.02em] text-text">
                UC transfer application due Nov 30, need to finish personal insight questions
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <SuggestionChip kind="Task" />
                <span className="rounded-full bg-accent px-4 py-2 text-[15px] font-medium text-on-accent">Make it a Task</span>
                <span className="px-2 py-2 text-[15px] text-text-2">Not now</span>
              </div>
            </div>
          </div>
        </section>

        {/* Accessibility */}
        <section id="accessibility" aria-labelledby="a11y-title" className="scroll-mt-16 py-24 md:py-32">
          <div className={wrap}>
            <div className={s.reveal}>
              <h2 id="a11y-title" className={h2}>Accessible on purpose. Check it yourself.</h2>
              <p className={lede}>
                We built Thought Dock for ENGR 1, Making an Accessible World. Each commitment below comes with a way to
                test it in under a minute.
              </p>
            </div>
            <dl className={`mt-12 divide-y divide-line border-y border-line md:mt-16 ${s.reveal}`}>
              {A11Y.map(([what, how]) => (
                <div key={what} className="grid gap-1 py-5 md:grid-cols-[18rem_1fr] md:gap-8">
                  <dt className="font-semibold text-text">{what}</dt>
                  <dd className="text-text-2">{how}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8">
              <Link href="/jared" className={link}>See our process</Link>
            </p>
          </div>
        </section>

        {/* Closing CTA */}
        <section aria-labelledby="close-title" className="py-24 text-center md:py-32">
          <div className={`${wrap} ${s.reveal}`}>
            <h2 id="close-title" className={`${h2} mx-auto max-w-[16ch]`}>Put it down now. Pick it up when you&rsquo;re ready.</h2>
            <p className="mx-auto mt-4 max-w-[30rem] text-[17px] text-text-2 md:text-[19px]">Free, with no account. Open your desk, then pair your phone.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/desk" className={primary}>Open your desk</Link>
              <Link href="/capture" className={secondary}>Capture on your phone</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line py-10 text-[13px] text-muted">
        <div className={`${wrap} flex flex-col gap-6 md:flex-row md:items-start md:justify-between`}>
          <div className="max-w-[28rem]">
            <p className="flex items-center gap-2 text-[15px] font-semibold text-text">
              <Logo size={22} />
              Thought Dock
            </p>
            <p className="mt-2">
              Made by Luke, Nikhilesh, and Maryam for ENGR 1: Making an Accessible World. Free to use.
            </p>
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-2 text-[15px] text-text-2">
              <li className="md:hidden"><a href="#how" className="flex min-h-11 items-center px-2 hover:text-text">How it works</a></li>
              <li className="md:hidden"><a href="#accessibility" className="flex min-h-11 items-center px-2 hover:text-text">Accessibility</a></li>
              <li><Link href="/jared" className="flex min-h-11 items-center px-2 hover:text-text">Process</Link></li>
              <li><Link href="/brag" className="flex min-h-11 items-center px-2 hover:text-text">Launch video</Link></li>
              <li><a href="https://github.com/nikhilesh-s/thought-dock" className="flex min-h-11 items-center px-2 hover:text-text">GitHub</a></li>
            </ul>
          </nav>
        </div>
      </footer>

      <RevealOnScroll />
    </>
  );
}
