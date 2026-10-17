"""Generates the report's diagram figures as SVG (docs/report/figures/*.svg).
Dimensions come from measurements of the live app (2026-10-16) at 1440x900 and 390x844 CSS px.
Run: uv run python docs/report/make_figures.py   (then render_figures.mjs turns SVG into PNG)
"""
from pathlib import Path

OUT = Path(__file__).parent / "figures"
OUT.mkdir(exist_ok=True)

INK, MUTED, ACCENT, LINE, FILL, DIM = "#1d1d1f", "#6e6e73", "#0066cc", "#c7c7cc", "#f5f5f7", "#b2380b"
FONT = "font-family='-apple-system, Helvetica, Arial, sans-serif'"
ARROW = f"""<defs><marker id='a' viewBox='0 0 10 10' refX='10' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'>
<path d='M0,1 L10,5 L0,9 z' fill='{DIM}'/></marker>
<marker id='f' viewBox='0 0 10 10' refX='10' refY='5' markerWidth='8' markerHeight='8' orient='auto'>
<path d='M0,1 L10,5 L0,9 z' fill='{INK}'/></marker></defs>"""


def svg(w, h, body, title):
    return (f"<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 {w} {h}' width='{w}' height='{h}' {FONT}>"
            f"<title>{title}</title>{ARROW}<rect width='{w}' height='{h}' fill='white'/>{body}</svg>")


def rect(x, y, w, h, r=0, fill="white", stroke=LINE, sw=1.2, extra=""):
    return f"<rect x='{x}' y='{y}' width='{w}' height='{h}' rx='{r}' fill='{fill}' stroke='{stroke}' stroke-width='{sw}' {extra}/>"


def text(x, y, s, size=13, fill=INK, anchor="start", weight=400, extra=""):
    return f"<text x='{x}' y='{y}' font-size='{size}' fill='{fill}' text-anchor='{anchor}' font-weight='{weight}' {extra}>{s}</text>"


def hdim(x1, x2, y, label, ext_from=None, size=12):
    """Horizontal dimension with extension lines from ext_from (y of the feature) to the dim line."""
    out = ""
    if ext_from is not None:
        for x in (x1, x2):
            out += f"<line x1='{x}' y1='{ext_from}' x2='{x}' y2='{y + (4 if y > ext_from else -4)}' stroke='{DIM}' stroke-width='0.8'/>"
    out += f"<line x1='{x1}' y1='{y}' x2='{x2}' y2='{y}' stroke='{DIM}' stroke-width='1' marker-start='url(#a)' marker-end='url(#a)'/>"
    out += f"<rect x='{(x1 + x2) / 2 - len(label) * 3.6 - 4}' y='{y - 9}' width='{len(label) * 7.2 + 8}' height='16' fill='white'/>"
    out += text((x1 + x2) / 2, y + 4, label, size, DIM, "middle", 600)
    return out


def vdim(y1, y2, x, label, ext_from=None, size=12):
    out = ""
    if ext_from is not None:
        for y in (y1, y2):
            out += f"<line x1='{ext_from}' y1='{y}' x2='{x + (4 if x > ext_from else -4)}' y2='{y}' stroke='{DIM}' stroke-width='0.8'/>"
    out += f"<line x1='{x}' y1='{y1}' x2='{x}' y2='{y2}' stroke='{DIM}' stroke-width='1' marker-start='url(#a)' marker-end='url(#a)'/>"
    cy = (y1 + y2) / 2
    out += f"<g transform='translate({x},{cy}) rotate(-90)'><rect x='{-len(label) * 3.6 - 4}' y='-9' width='{len(label) * 7.2 + 8}' height='16' fill='white'/>"
    out += text(0, 4, label, size, DIM, "middle", 600) + "</g>"
    return out


def callout(x, y, tx, ty, label):
    return (f"<line x1='{x}' y1='{y}' x2='{tx}' y2='{ty}' stroke='{DIM}' stroke-width='0.8'/>"
            f"<circle cx='{x}' cy='{y}' r='2.5' fill='{DIM}'/>" + text(tx + (4 if tx >= x else -4), ty + 4, label, 11.5, DIM, "start" if tx >= x else "end", 600))


def balloon(x, y, n):
    return (f"<circle cx='{x}' cy='{y}' r='11' fill='white' stroke='{DIM}' stroke-width='1.4'/>"
            + text(x, y + 4.5, str(n), 12, DIM, "middle", 700))


def legend(x, y, items, width=330):
    out = text(x, y, "NOTES", 9.5, MUTED, weight=700)
    for i, t in enumerate(items, 1):
        yy = y + 14 + (i - 1) * 34
        out += balloon(x + 11, yy + 8, i)
        words, line, lines = t.split(), "", []
        for w in words:
            if len(line) + len(w) > 44:
                lines.append(line); line = w
            else:
                line = (line + " " + w).strip()
        lines.append(line)
        for j, l in enumerate(lines):
            out += text(x + 30, yy + 12 + j * 14, l, 11.5, INK)
    return out


def title_block(x, y, w, title, scale, fig):
    rows = [("TITLE", title), ("UNITS", "CSS px (1 px = 1/96 in at 100% zoom)"), ("SCALE", scale), ("DRAWN BY", "Team Thought Dock"), ("DATE", "2026-10-16"), ("FIG.", fig)]
    out = rect(x, y, w, len(rows) * 18 + 4, 0, "white", INK, 1)
    for i, (k, v) in enumerate(rows):
        yy = y + 16 + i * 18
        out += text(x + 8, yy, k, 9.5, MUTED, weight=600) + text(x + 82, yy, v, 11)
        if i:
            out += f"<line x1='{x}' y1='{yy - 13}' x2='{x + w}' y2='{yy - 13}' stroke='{LINE}'/>"
    return out


# ---------- Figure: Capture screen, dimensioned (390 x 844 viewport) ----------
def capture_layout():
    s = 0.85  # drawing scale
    ox, oy = 110, 60
    P = lambda v: v * s  # noqa: E731
    W, H = 390, 844
    b = rect(ox, oy, P(W), P(H), P(44), "white", INK, 2)
    # header
    b += rect(ox + P(20), oy + P(23), P(22), P(22), 6, INK, INK)
    b += text(ox + P(50), oy + P(39), "Thought Dock", 14, INK, weight=600)
    b += text(ox + P(370), oy + P(39), "Open your desk", 13, ACCENT, "end")
    b += text(ox + P(20), oy + P(70), "✓ Saved", 12, MUTED)
    # textarea
    b += rect(ox + P(20), oy + P(87), P(350), P(287), P(18), FILL, ACCENT, 2)
    b += text(ox + P(40), oy + P(125), "What's on your mind?", 17, MUTED)
    # today's captures
    b += text(ox + P(20), oy + P(418), "Today's captures", 12, MUTED, weight=600)
    for i in range(4):
        yy = oy + P(440 + i * 72)
        b += rect(ox + P(20), yy, P(350), P(60), 0, "none", "none")
        b += f"<line x1='{ox + P(20)}' y1='{yy + P(64)}' x2='{ox + P(370)}' y2='{yy + P(64)}' stroke='{LINE}'/>"
        b += rect(ox + P(20), yy + P(12), P(250), P(12), 4, "#e5e5ea", "none") + rect(ox + P(300), yy + P(12), P(70), P(12), 4, "#e5e5ea", "none")
    # dock
    b += rect(ox + P(16), oy + P(762), P(358), P(66), P(33), "#fbfbfd", LINE, 1.2)
    b += rect(ox + P(25), oy + P(771), P(102), P(48), P(24), "white", LINE) + text(ox + P(76), oy + P(800), "Voice", 13, INK, "middle")
    b += rect(ox + P(133), oy + P(771), P(105), P(48), P(24), "white", LINE) + text(ox + P(185), oy + P(800), "Photo", 13, INK, "middle")
    b += rect(ox + P(271), oy + P(771), P(94), P(48), P(24), ACCENT, ACCENT) + text(ox + P(318), oy + P(800), "Save", 14, "white", "middle", 600)
    # dimensions
    b += hdim(ox, ox + P(W), oy - 22, "390", oy)
    b += vdim(oy, oy + P(H), ox - 40, "844", ox)
    b += hdim(ox + P(20), ox + P(370), oy + P(395), "350", None)
    b += vdim(oy + P(87), oy + P(374), ox + P(W) + 30, "287", ox + P(370))
    b += vdim(oy + P(762), oy + P(828), ox + P(W) + 30, "66", ox + P(374))
    b += vdim(oy + P(771), oy + P(819), ox - 14, "48", ox + P(25))
    b += hdim(ox + P(271), ox + P(365), oy + P(H) + 26, "94", oy + P(819))
    b += hdim(ox + P(16), ox + P(374), oy + P(H) + 54, "358", oy + P(828))
    # callouts
    b += balloon(ox + P(352), oy + P(108), 1) + balloon(ox + P(250), oy + P(414), 2) + balloon(ox + P(250), oy + P(745), 3) + balloon(ox + P(318), oy + P(752), 4) + balloon(ox + P(76), oy + P(752), 5)
    b += legend(ox + P(W) + 90, oy + 20, [
        "Capture field: R18 corners, 20 px type, autofocused, 3 px focus ring.",
        "Today's captures: read-only list, 17 px body text. Nothing to organize here.",
        "The Dock: 358 × 66 pill, fully rounded (R33), safe-area padded.",
        "Save: #0066cc on white = 5.57:1 contrast (WCAG AA). 94 × 48 target.",
        "Voice and Photo: 48 px tall, above the 44 px minimum touch target.",
    ])
    b += title_block(ox + P(W) + 90, oy + P(H) - 110, 330, "Capture screen layout", "1 : 1.18", "7")
    return svg(880, 860, b, "Capture screen, dimensioned layout")


# ---------- Figure: DeskOS, dimensioned (1440 x 900 viewport) ----------
def desk_layout():
    s = 0.62
    ox, oy = 70, 70
    P = lambda v: v * s  # noqa: E731
    W, H = 1440, 900
    b = rect(ox, oy, P(W), P(H), 10, "white", INK, 2)
    b += rect(ox, oy, P(248), P(H), 10, FILL, LINE)
    b += f"<line x1='{ox + P(608)}' y1='{oy}' x2='{ox + P(608)}' y2='{oy + P(H)}' stroke='{LINE}'/>"
    for i, lab in enumerate(["Inbox", "Today", "Tasks", "Calendar"]):
        yy = oy + P(64 + i * 46)
        if i == 0:
            b += rect(ox + P(12), yy, P(223), P(44), 8, "#e6f0fa", "none")
        b += text(ox + P(48), yy + P(28), lab, 11, ACCENT if i == 0 else INK)
    b += text(ox + P(22), oy + P(286), "SPACES", 8.5, MUTED, weight=600)
    for i, lab in enumerate(["Classes", "Engineering", "College Apps", "Personal"]):
        b += text(ox + P(48), oy + P(330 + i * 46), lab, 11)
    b += rect(ox + P(12), oy + P(769), P(223), P(44), P(22), "white", LINE) + text(ox + P(124), oy + P(797), "Pair phone", 11, INK, "middle")
    # list
    b += text(ox + P(264), oy + P(42), "Inbox", 14, INK, weight=600)
    b += rect(ox + P(506), oy + P(14), P(85), P(40), P(20), INK, INK) + text(ox + P(548), oy + P(40), "Sort", 10.5, "white", "middle", 600)
    for i in range(5):
        yy = oy + P(64 + i * 86)
        b += rect(ox + P(256), yy, P(343), P(84), 8, "#e6f0fa" if i == 0 else "white", "none")
        b += rect(ox + P(268), yy + P(20), P(300), P(10), 3, "#d1d1d6", "none") + rect(ox + P(268), yy + P(40), P(200), P(10), 3, "#d1d1d6", "none")
    # detail
    b += rect(ox + P(700), oy + P(90), P(560), P(16), 4, "#d1d1d6", "none")
    labels = ["Make a Task  T", "Make an Event  E", "Move to Space  M", "Develop  D", "Connect  C", "Keep  K", "Archive  A"]
    xs = [700, 866, 1048, 700, 839, 980, 1099]
    ys = [182, 182, 182, 228, 228, 228, 228]
    for lab, x, y in zip(labels, xs, ys):
        w = len(lab) * 9.6 + 20
        b += rect(ox + P(x), oy + P(y), P(w), P(40), P(20), "white", LINE) + text(ox + P(x) + P(w) / 2, oy + P(y) + P(26), lab, 9.5, INK, "middle")
    b += rect(ox + P(700), oy + P(317), P(648), P(154), 10, FILL, LINE) + text(ox + P(714), oy + P(345), "Notes", 9.5, MUTED)
    # dock pill
    b += rect(ox + P(564), oy + P(822), P(560), P(58), P(29), "white", LINE, 1.4, f"filter='drop-shadow(0 4px 8px rgba(0,40,100,.15))'")
    b += text(ox + P(611), oy + P(857), "What's on your mind?", 10.5, MUTED)
    b += rect(ox + P(1031), oy + P(829), P(86), P(44), P(22), "#9ec5ee", "none") + text(ox + P(1074), oy + P(856), "Save", 10.5, "white", "middle", 600)
    # dims
    T = oy - 30
    b += hdim(ox, ox + P(W), T - 18, "1440", oy)
    b += hdim(ox, ox + P(248), T + 8, "248", oy)
    b += hdim(ox + P(248), ox + P(608), T + 8, "360", oy)
    b += hdim(ox + P(608), ox + P(W), T + 8, "832 (flexible)", oy)
    b += vdim(oy, oy + P(H), ox - 36, "900", ox)
    b += hdim(ox + P(564), ox + P(1124), oy + P(H) + 26, "560", oy + P(880))
    b += vdim(oy + P(822), oy + P(880), ox + P(W) + 24, "58", ox + P(1124))
    b += vdim(oy + P(182), oy + P(222), ox + P(684), "40", ox + P(700))
    b += vdim(oy + P(64), oy + P(148), ox + P(608) + 18, "84", ox + P(599))
    b += balloon(ox + P(226), oy + P(64), 1) + balloon(ox + P(470), oy + P(34), 2) + balloon(ox + P(1300), oy + P(202), 3) + balloon(ox + P(1366), oy + P(394), 4) + balloon(ox + P(1150), oy + P(851), 5) + balloon(ox + P(124), oy + P(745), 6)
    b += legend(ox + P(W) + 40, oy + 10, [
        "Sidebar 248 px: translucent, 44 px rows, counts in tabular figures, no red badges.",
        "Inbox list 360 px: rows 84 px tall, newest first. Sort opens one-at-a-time view.",
        "Action keys: 40 px pills (R20) with label + key. Above the 24 px WCAG 2.5.8 minimum.",
        "Detail column flexes; notes field and text kept to about 68 characters per line.",
        "The Dock: 560 × 58 pill (R29), 20 px above the bottom edge. N or ⌘K focuses it.",
        "Pair phone: opens the QR code and 6-character code dialog.",
    ])
    b += title_block(ox + P(W) + 40, oy + P(H) - 110, 330, "DeskOS layout (desktop ≥1024 px)", "1 : 1.61", "8")
    return svg(1350, 720, b, "DeskOS, dimensioned layout")


# ---------- Figure: system architecture ----------
def architecture():
    b = ""
    def box(x, y, w, h, head, lines, fill="white", stroke=INK):
        o = rect(x, y, w, h, 14, fill, stroke, 1.5) + text(x + w / 2, y + 26, head, 15, INK, "middle", 700)
        for i, l in enumerate(lines):
            o += text(x + w / 2, y + 50 + i * 19, l, 12, MUTED, "middle")
        return o
    def arrow(x1, y1, x2, y2, label="", dy=-8):
        o = f"<line x1='{x1}' y1='{y1}' x2='{x2}' y2='{y2}' stroke='{INK}' stroke-width='1.6' marker-end='url(#f)'/>"
        if label:
            o += text((x1 + x2) / 2, (y1 + y2) / 2 + dy, label, 11.5, ACCENT, "middle", 600)
        return o
    b += box(30, 70, 220, 150, "Phone: /capture", ["Text, voice (MediaRecorder)", "Live transcript (Web Speech)", "Photo (downscaled JPEG)", "Offline queue (localStorage)"])
    b += box(370, 70, 240, 150, "Vercel: Next.js API", ["POST /api/dock", "GET · PATCH /api/dock/:id", "PUT /api/dock/:id/media/:item", "POST · GET /api/pair"], "#f5f9ff", ACCENT)
    b += box(730, 70, 220, 150, "Upstash Redis", ["td:{dock}:items (hash)", "td:{dock}:spaces (hash)", "td:{dock}:media:{item}", "td:pair:{code} (10 min TTL)"])
    b += box(370, 300, 240, 150, "Desk: /desk (DeskOS)", ["Polls every 4 s + on focus", "Optimistic ops + undo stack", "Classifier runs in browser", ".ics export for events"])
    b += box(730, 300, 220, 150, "On-device model", ["Softmax regression", "836 features × 5 kinds", "lib/model.json (42 KB)", "Suggests; user decides"], FILL)
    b += arrow(250, 130, 370, 130, "ops (JSON)")
    b += arrow(610, 130, 730, 130, "HSET / HGETALL")
    b += arrow(490, 220, 490, 300, "", 0) + text(500, 265, "dock JSON", 11.5, ACCENT, "start", 600)
    b += f"<line x1='470' y1='300' x2='470' y2='222' stroke='{INK}' stroke-width='1.6' marker-end='url(#f)'/>" + text(460, 265, "ops", 11.5, ACCENT, "end", 600)
    b += arrow(730, 375, 612, 375, "suggestKind(text)")
    b += arrow(140, 220, 140, 520, "", 0)
    b += f"<line x1='140' y1='520' x2='488' y2='520' stroke='{INK}' stroke-width='1.6' stroke-dasharray='5 4'/><line x1='488' y1='520' x2='488' y2='452' stroke='{INK}' stroke-width='1.6' stroke-dasharray='5 4' marker-end='url(#f)'/>"
    b += text(300, 540, "Pairing: desk shows QR / 6-character code → phone redeems it → both hold the same 22-character dock key", 12, MUTED, "middle")
    b += text(490, 36, "Thought Dock system architecture", 17, INK, "middle", 700)
    return svg(980, 570, b, "System architecture")


# ---------- Figure: user flow ----------
def user_flow():
    b = text(560, 34, "Capture now → organize later: user flow", 17, INK, "middle", 700)
    def node(x, y, w, label, sub="", shape="rect", fill="white"):
        if shape == "pill":
            o = rect(x, y, w, 52, 26, fill, INK, 1.5)
        elif shape == "diamond":
            cx, cy = x + w / 2, y + 26
            o = f"<polygon points='{cx},{y - 8} {x + w},{cy} {cx},{y + 60} {x},{cy}' fill='{fill}' stroke='{INK}' stroke-width='1.5'/>"
        else:
            o = rect(x, y, w, 52, 10, fill, INK, 1.5)
        o += text(x + w / 2, y + (24 if sub else 31), label, 13, INK, "middle", 600)
        if sub:
            o += text(x + w / 2, y + 41, sub, 10.5, MUTED, "middle")
        return o
    def ar(x1, y1, x2, y2, lab=""):
        o = f"<line x1='{x1}' y1='{y1}' x2='{x2}' y2='{y2}' stroke='{INK}' stroke-width='1.4' marker-end='url(#f)'/>"
        if lab:
            o += text((x1 + x2) / 2 + 6, (y1 + y2) / 2 - 6, lab, 10.5, ACCENT, "middle", 600)
        return o
    # lane labels
    b += rect(20, 60, 1080, 120, 12, "#fbfbfd", LINE) + text(36, 82, "PHONE (anytime)", 10.5, MUTED, weight=700)
    b += rect(20, 200, 1080, 325, 12, "#fbfbfd", LINE) + text(36, 222, "DESK (when the student chooses)", 10.5, MUTED, weight=700)
    b += node(40, 100, 150, "Thought appears", "class, bus, 1 a.m.", "pill", "#e6f0fa")
    b += node(240, 100, 170, "Open /capture", "already paired")
    b += node(460, 100, 190, "Type · speak · photo", "no folders, tags, dates")
    b += node(700, 100, 120, "Save", "1 tap", "rect", "#e6f0fa")
    b += node(870, 100, 200, "Toast: Saved · Undo", "queued if offline")
    b += ar(190, 126, 240, 126) + ar(410, 126, 460, 126) + ar(650, 126, 700, 126) + ar(820, 126, 870, 126)
    b += node(40, 250, 170, "Open /desk", "Inbox shows count")
    b += f"<path d='M970,152 C970,200 125,190 125,250' fill='none' stroke='{INK}' stroke-width='1.4' stroke-dasharray='5 4' marker-end='url(#f)'/>" + text(985, 172, "syncs within ~4 s", 10.5, ACCENT, "start", 600)
    b += node(260, 250, 170, "Sort", "one thought at a time")
    b += node(480, 250, 200, "Suggestion chip", "\"Looks like a Task\"")
    b += ar(210, 276, 260, 276) + ar(430, 276, 480, 276)
    b += node(730, 245, 150, "Student decides", "", "diamond", "#fff7e6")
    b += ar(680, 276, 730, 271)
    b += f"<line x1='805' y1='305' x2='805' y2='335' stroke='{INK}' stroke-width='1.4'/>"
    b += f"<line x1='150' y1='335' x2='960' y2='335' stroke='{INK}' stroke-width='1.4'/>"
    row1 = [("Task (T)", "due date optional"), ("Event (E)", ".ics to calendar"), ("Move (M)", "to a Space"), ("Keep (K)", "idea / note / resource")]
    for i, (a, sub) in enumerate(row1):
        x = 40 + i * 270
        b += f"<line x1='{x + 110}' y1='335' x2='{x + 110}' y2='358' stroke='{INK}' stroke-width='1.4' marker-end='url(#f)'/>" + node(x, 360, 220, a, sub)
    row2 = [("Develop (D)", "add notes"), ("Connect (C)", "link related thoughts"), ("Archive (A)", "never deleted")]
    for i, (a, sub) in enumerate(row2):
        cx = 285 + i * 270
        b += f"<line x1='{cx}' y1='335' x2='{cx}' y2='448' stroke='{INK}' stroke-width='1.4' marker-end='url(#f)'/>" + node(cx - 110, 450, 220, a, sub)
    b += text(560, 548, "⌘Z (or U) undoes any step. Nothing is ever deleted without a confirm.", 12.5, ACCENT, "middle", 700)
    return svg(1120, 570, b, "User flow")


for name, fn in {"fig3-capture-layout": capture_layout, "fig4-desk-layout": desk_layout, "fig6-architecture": architecture, "fig7-user-flow": user_flow}.items():
    (OUT / f"{name}.svg").write_text(fn(), encoding="utf-8")
    print("wrote", name)
