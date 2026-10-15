# Product spec: Thought Dock / DeskOS

**Capture now. Organize later.**

## Problem
Students are overwhelmed by thoughts, assignments, links, screenshots, tasks and deadlines.
Existing tools ask them to categorize at the exact moment they can't spare the attention, so
thoughts get lost or carried around in their heads.

## Users
Overwhelmed students, with particular attention to attention difficulties, decision fatigue,
executive-function friction, anxiety and cognitive overload. It's built so it works for every
student and doesn't claim to treat one diagnosis.

## Core flow
1. **Pair** (once): open `/desk` on a laptop, click "Pair phone", scan the QR code (or type the
   6-character code) on the phone. No account.
2. **Capture** (all day, phone, `/capture`): type, paste, speak (with a live transcript) or snap a
   photo, then Save. Nothing else is asked.
3. **Process** (when ready, desk, `/desk`): open the Inbox or start **Sort**. For each thought:
   Make a Task (optional due date), Make an Event (date and time, Add to Calendar), Move to Space,
   Develop (add notes), Connect (link related thoughts), Keep (file as idea / note / resource), or
   Archive. A trained classifier suggests a kind; the user decides.
4. **Work**: Today, Tasks, Calendar and Spaces views. Everything is undoable. Archive is
   restorable.

## Scope
| MVP (built) | Stretch |
|---|---|
| Responsive capture, persistent inbox, editing | Link title fetching / summaries |
| Classification (user-confirmed) | Suggested connections |
| Personal spaces, task conversion, events + .ics | Accounts / sign-in |
| Archive + undo, connections | Google Calendar sync |
| Voice notes + transcript, photos | Push reminders |
| Offline capture queue | |
| Seeded demo dock | |

## Screens
`/` landing · `/capture` phone capture · `/desk` DeskOS · `/jared` process portfolio ·
`/brag` launch video.

## Locked constraints
- Software only, with no required device.
- The user keeps final control over every suggestion. Nothing moves or gets deleted automatically.
- No chatbot-first layout, no streaks, no guilt mechanics, no color-only meaning.
- The demo works without API keys. With Redis env vars absent, the server falls back to memory.

## Acceptance (definition of done)
A teammate can run the app from the README, demonstrate capture → desk → task/space/archive
without fragile services, operate the core controls by keyboard, show reduced motion, and follow
DEMO_SCRIPT.md.
