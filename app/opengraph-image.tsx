import { ImageResponse } from "next/og";

export const alt = "Thought Dock: Capture now. Organize later.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Light-theme token values (globals.css): bg #f5f5f7, ink #1d1d1f, muted #6e6e73, accent #0071e3.
export default function Image() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#f5f5f7", padding: 80 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: 20, background: "#1d1d1f", display: "flex", position: "relative" }}>
            <div style={{ position: "absolute", left: 28, top: 18, width: 16, height: 16, borderRadius: 8, background: "#0071e3" }} />
            <div style={{ position: "absolute", left: 16, top: 40, width: 40, height: 14, borderRadius: 7, background: "#ffffff" }} />
          </div>
          <div style={{ fontSize: 40, fontWeight: 600, color: "#1d1d1f", letterSpacing: -1 }}>Thought Dock</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 600, color: "#1d1d1f", letterSpacing: -3, lineHeight: 1.05 }}>Capture now.</div>
          <div style={{ fontSize: 96, fontWeight: 600, color: "#1d1d1f", letterSpacing: -3, lineHeight: 1.05 }}>Organize later.</div>
          <div style={{ marginTop: 28, fontSize: 32, color: "#6e6e73" }}>One field on your phone. A calm desk to sort it. Free, no account.</div>
        </div>
      </div>
    ),
    size,
  );
}
