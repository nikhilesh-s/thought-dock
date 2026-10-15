import Link from "next/link";
import { Logo } from "@/components/Icons";

export const metadata = { title: "Launch video" };

const link = "font-medium text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent";
const primary =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-[18px] py-2 text-[15px] font-medium text-on-ink hover:bg-ink/85";

// What appears on screen, in order. The video has music but no narration, so this is the full text alternative.
const SCENES = [
  ["0:00", "The Thought Dock logo, then the words “Capture now. Organize later.”"],
  [
    "0:03",
    "A phone shows the Capture screen. “remember to email Professor Lee about missing Thursday’s lab” is typed into the one field, Save is tapped, and a toast says “Saved to your inbox” with Undo. Beside it: “One field. One Save. Type it, say it, or snap a photo. Voice notes show a live transcript. No folders, tags, or dates.”",
  ],
  ["0:09", "“Later, it’s waiting in your inbox.” A screenshot of DeskOS shows that thought at the top of the Inbox."],
  [
    "0:11",
    "“Sort one thought at a time. A small model we trained suggests what it is. You decide.” The Sort view shows “study group for ENGR 1 thursday 6pm library room 204” with the hint “Looks like an Event” and seven actions: Make a Task (T), Make an Event (E), Move to Space (M), Develop (D), Connect (C), Keep (K), Archive (A). E is pressed, the toast says “Made an event”, and the next thought appears with “Looks like a Task”. Then ⌘Z is pressed: “Undone: Made an event”, and the first thought comes back.",
  ],
  ["0:18", "The Pair your phone dialog with its QR code, next to “Pair with a QR code. No account. Keyboard for everything. Light and dark. Reduced motion.”"],
  ["0:22", "“Thought Dock. Capture now. Organize later. Made by Luke, Nikhilesh and Maryam for ENGR 1.”"],
] as const;

export default function BragPage() {
  return (
    <main className="mx-auto w-full max-w-[1080px] px-4 py-12 md:px-6 md:py-20">
      <nav aria-label="Main" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[15px]">
        <Link href="/" className="mr-auto flex min-h-11 items-center gap-2 text-[17px] font-semibold tracking-[-0.02em] text-text">
          <Logo size={26} />
          Thought Dock
        </Link>
        <Link href="/desk" className={link}>Open your desk</Link>
        <Link href="/jared" className={link}>Our process</Link>
      </nav>

      <h1 className="mt-12 text-[clamp(2.2rem,5.5vw,3.75rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-balance text-text md:mt-16">
        Thought Dock, in 25 seconds.
      </h1>
      <p className="mt-4 max-w-[38rem] text-[17px] text-text-2 md:text-[19px]">
        Catch a thought on your phone, then sort it at your desk. Music only, no narration; everything on screen is written out below.
      </p>

      <video
        src="/brag.mp4"
        poster="/brag.jpg"
        controls
        playsInline
        preload="metadata"
        aria-label="Thought Dock launch video, 25 seconds, music only. A text description follows the video."
        aria-describedby="video-description"
        className="mt-10 aspect-video w-full rounded-xl bg-surface shadow-1 ring-1 ring-line"
      />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a href="/brag.mp4" download="thought-dock-launch.mp4" className={primary}>
          Download video (MP4, 4 MB)
        </a>
        <Link href="/" className={link}>Back to the home page</Link>
      </div>

      <section id="video-description" aria-labelledby="desc-title" className="mt-16">
        <h2 id="desc-title" className="text-[clamp(1.5rem,3vw,2rem)] font-semibold tracking-[-0.03em] text-text">
          What the video shows
        </h2>
        <ol className="mt-6 divide-y divide-line border-y border-line">
          {SCENES.map(([time, text]) => (
            <li key={time} className="grid gap-1 py-4 md:grid-cols-[5rem_1fr] md:gap-6">
              <span className="tnum font-mono text-[15px] text-muted">{time}</span>
              <p className="max-w-[68ch] text-text-2">{text}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
