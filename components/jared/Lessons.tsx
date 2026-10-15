import { Logo } from "@/components/Icons";
import { LINKS } from "@/lib/links";
import { Pending, Section } from "./ui";

const SO_FAR = [
  ["Cutting is a design decision.", "Saying no to the hardware dock and to automatic AI filing gave us the time to make the core flow accessible."],
  ["Write the rules before the screens.", "A one-page design contract kept a multi-agent build looking like one product."],
  ["Honesty scales better than polish.", "Marking what is assumed or not yet tested made the page easier to trust and easier to finish."],
];

export function Lessons() {
  return (
    <Section id="lessons" n="10" eyebrow="Lessons learned" title="What we're taking with us."
      lead="This section is still being written. These are early lessons; each of us will add our own after the usability test.">
      <ul className="grid gap-x-10 gap-y-8 md:grid-cols-3">
        {SO_FAR.map(([t, d]) => (
          <li key={t} className="border-t border-line-strong pt-4">
            <p className="text-[19px] font-semibold tracking-[-0.02em] text-text">{t}</p>
            <p className="mt-1.5 text-[15px] text-text-2">{d}</p>
          </li>
        ))}
      </ul>
      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {["Luke", "Nik", "Maryam"].map((n) => (
          <div key={n} className="rounded-lg border border-dashed border-line-strong p-6">
            <p className="text-[17px] font-semibold text-text">{n}</p>
            <p className="mt-2 text-[15px] text-muted">Personal reflection to come.</p>
          </div>
        ))}
      </div>
      <div className="mt-6"><Pending>Each teammate adds 2–3 lessons in their own words for the design report.</Pending></div>
    </Section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1120px] flex-col gap-8 px-4 py-14 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="max-w-[46ch]">
          <p className="flex items-center gap-2.5 text-[15px] font-semibold"><Logo size={24} /> Thought Dock</p>
          <p className="mt-3 text-[13px] text-muted">
            Luke, Nikhilesh, and Maryam · ENGR 1 Mini-Hackathon · “Making an Accessible World: Every Dog Has Its Day.”
            Built with Claude Code as design lead and builder; the product decisions are the team&apos;s.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
          <a className="text-text-2 hover-underline" href={LINKS.app}>Open the app</a>
          <a className="text-text-2 hover-underline" href={LINKS.capture}>Capture</a>
          <a className="text-text-2 hover-underline" href={LINKS.repo} target="_blank" rel="noreferrer">GitHub</a>
          <a className="text-text-2 hover-underline" href={LINKS.project} target="_blank" rel="noreferrer">Project board</a>
          <a className="text-text-2 hover-underline" href={LINKS.brag}>Launch video</a>
          <a className="text-text-2 hover-underline" href="#top">Back to top</a>
        </nav>
      </div>
    </footer>
  );
}
