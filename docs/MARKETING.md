# Thought Dock: marketing

Owner: Luke, Nikhilesh, Maryam (ENGR 1, Making an Accessible World). Landing page: `app/page.tsx`.

## Positioning statement

For students who feel buried by everything they're supposed to remember, Thought Dock is a two-part
thinking tool that separates catching a thought from deciding what it is. Unlike notes apps and to-do
lists that ask you to choose a folder, tag and date the moment an idea shows up, Thought Dock gives
your phone one field and one Save button, and gives your laptop a calm desk (DeskOS) where you sort
everything later, one thought at a time, with every action undoable.

## Audience

- **Primary:** community college and university students juggling classes, labs, jobs and applications
  (transfer apps, internships). They capture on a phone between things and work on a laptop.
- **Especially:** students who describe themselves as overwhelmed, scattered or "bad at staying organized",
  including students with ADHD, anxiety or executive-function differences, and students who rely on a
  keyboard, screen reader, reduced motion or high contrast.
- **Not for (yet):** teams, shared projects, heavy note-taking or long documents.

## Tagline

**Capture now. Organize later.**

Alternates for posters and social: "Put it down now. Pick it up when you're ready." / "One field. One Save."

## Messaging pillars

1. **Nothing to decide right now.** One field and Save on your phone. Voice notes with a live transcript,
   photos, no folders, tags or dates. *Proof:* the Capture screen has no other inputs.
2. **A calm desk for when you're ready.** DeskOS shows one thought at a time in Sort, with a single key per
   action (Task, Event, Move, Develop, Connect, Keep, Archive). Events go to any calendar. Archive never
   deletes, and everything can be undone. *Proof:* Sort view, ⌘Z, Archive.
3. **Built to be accessible and kind.** Keyboard for everything, a visible 3px focus ring, AA contrast in
   light and dark, reduced motion, no color-only meaning, and no-guilt language: no streaks, no red overdue
   alarms. Suggestions come from a small model we trained from scratch that runs on your device and never
   acts on its own. *Proof:* the checkable list on the landing page and our process page (`/jared`).

Words we use: capture, sort, desk, inbox, space, undo, calm, gentle, your device.
Words we avoid: productivity hacks, crush, streak, overdue, AI-powered, revolutionary, seamless.

## Campus launch plan

Goal for the first three weeks: 100 students who capture at least five thoughts, and 15 short feedback
conversations we can bring back to ENGR 1.

| When | What | Who | Measure |
|---|---|---|---|
| Week 0 | Ship landing page + `/brag` launch video; record a 30-second screen demo of Sort | Team | Page live, video posted |
| Week 1 | Demo table outside the library and at the ENGR 1 showcase: open the desk on a laptop, let people pair their own phone with the QR code and capture one thought | All three | Pairings, captures |
| Week 1 | Posters with the tagline and a QR code to `/capture` in study rooms, tutoring center, Disability Resource Center lobby (with permission) | Maryam | QR scans |
| Week 2 | Ask the Disability Resource Center, tutoring center and study-skills workshop leads if they'd try it and share feedback, not endorse it | Nikhilesh | Conversations held |
| Week 2 | Post in class Discords and student club channels (engineering club, transfer club) using the posts below | Luke | Click-throughs |
| Week 3 | 15-minute feedback sessions: watch someone sort five thoughts, note where they hesitate | All three | Issues logged in the repo |

Rules for the launch: no fake testimonials, no invented numbers, no claims about grades or mental health.
Quote real students only with their written OK.

## Sample social posts

1. *(Instagram / story, with the hero image)*
   Ever had a thought in the middle of lecture and nowhere to put it? Thought Dock: type it on your phone,
   hit Save, and sort it later at your laptop. No folders, no account. Free. Link in bio.

2. *(Class Discord / club channel)*
   We built a thing for ENGR 1. Thought Dock is one text box on your phone and a quiet desk on your laptop.
   Capture now, organize later. Pair them with a QR code, no sign-up. Try it and tell us what's confusing:
   [link]

3. *(Short video caption, showing Sort with the keyboard)*
   Five thoughts from today, sorted in under a minute. T makes a task, E puts it on your calendar, A archives
   it (nothing gets deleted), ⌘Z undoes anything. Thought Dock is free: [link]

## Copy deck (as used on the landing page)

**Nav:** Thought Dock · How it works · Accessibility · Process · [Open your desk]

**Hero**
- H1: Capture now. Organize later.
- Sub: Put every thought down on your phone in one tap. Sort it at your desk when you're ready, one at a time.
- CTAs: [Open your desk] [Capture on your phone]
- Note: Free. No account. Runs in your browser.
- Image caption: A thought saved on the phone's Capture screen appears at the top of the DeskOS inbox, next to
  the sidebar of spaces and the actions for sorting it.

**Problem**
- H2: Your head is full. Your notes app wants a folder.
- Body: Ideas, deadlines, and worries show up in the middle of lecture, on the bus, or at 1 a.m. Most tools ask
  you to pick a folder, a tag, and a due date right then, which is exactly when you have the least room to
  think. So the thought gets lost, or it stays in your head taking up space. Thought Dock splits the job in
  two: catch it in a second now, and decide what it is later, when you sit down on purpose.

**How it works**
- H2: How it works. Sub: Two screens with two different jobs. Your phone catches. Your desk sorts.
- 1 · On your phone. **Capture.** Type it, say it, or snap a photo, then tap Save. Voice notes show a live
  transcript while you talk. There are no folders, tags, or dates to choose.
- 2 · Once, in ten seconds. **Pair.** Open your desk on a laptop and scan its QR code with your phone. That
  links the two. No account, no email, no password.
- 3 · At your desk, when you choose. **Sort.** Everything you caught is waiting in one inbox. Make it a task,
  put it on your calendar, or file it in a space like Classes, Engineering, or College Apps.

**Sort spotlight**
- H2: Sort, one thought at a time.
- Body: Sort shows a single thought, large, with every action under it. Each action has one key, so you can
  clear your inbox without reaching for the mouse. Every key is also a labeled button.
- Keys: T Task · E Event · M Move · D Develop · C Connect · K Keep · A Archive
- Strip: **E** Make it an Event. Pick Thursday at 6 PM and add it to any calendar. / **⌘Z** Changed your mind?
  Undo puts it right back where it was. / **→** On to the next one. At the end: "Inbox clear. Nothing's
  waiting on you."

**Suggestions**
- H2: Suggestions you control.
- Body: Thought Dock guesses what each thought is: a task, an event, an idea, a resource, or a note. The guess
  comes from a small model we trained from scratch, and it runs entirely on your device, so sorting never
  sends your words to an AI service.
- Body: It only suggests. It never moves, files, or deletes anything on its own. When it isn't fairly sure, it
  stays quiet, and you can turn it off in Settings.
- Chip: Looks like a **Task** · [Make it a Task] · Not now

**Accessibility**
- H2: Accessible on purpose. Check it yourself.
- Intro: We built Thought Dock for ENGR 1, Making an Accessible World. Each commitment below comes with a way
  to test it in under a minute.
- Keyboard for everything: Put the mouse away. Tab reaches every control, and every Sort action has a single key.
- A focus ring you can see: Press Tab. Whatever has focus gets a 3px blue outline, in light and dark.
- AA contrast in both themes: Body text meets WCAG 2.2 AA (4.5:1) on light and dark. Switch your system theme to compare.
- Reduced motion respected: Turn on Reduce Motion in your system or in Settings. Movement stops; gentle fades stay.
- Meaning never by color alone: Every kind of thought shows an icon and a word, never just a tint.
- Undo everything: Change anything in Sort, then press ⌘Z or U. Archive keeps things; nothing is deleted.
- Gentle language: No streaks, no scores, no red overdue alarms. A missed date reads "Was due Tue."
- Link: See our process → `/jared`

**Closing**
- H2: Put it down now. Pick it up when you're ready.
- Body: Free, with no account. Open your desk, then pair your phone.
- CTAs: [Open your desk] [Capture on your phone]

**Footer:** Thought Dock. Made by Luke, Nikhilesh, and Maryam for ENGR 1: Making an Accessible World. Free to
use. · Process · Launch video · GitHub

**Open Graph:** "Capture now. Organize later." / "One field on your phone. A calm desk to sort it. Free, no account."
