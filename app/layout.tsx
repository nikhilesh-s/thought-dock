import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Thought Dock", template: "%s · Thought Dock" },
  description: "Capture now. Organize later. A calm place to put every thought down, and a desk to sort it when you're ready.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Thought Dock", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f7" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  viewportFit: "cover",
};

// Applies saved theme/motion prefs before paint so there's no flash.
const prefs = `try{var t=localStorage.getItem("td:theme");if(t)document.documentElement.dataset.theme=t;var m=localStorage.getItem("td:motion");if(m)document.documentElement.dataset.motion=m}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: prefs }} />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
