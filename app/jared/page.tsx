import type { Metadata } from "next";
import "./jared.css";
import { JaredNav } from "@/components/jared/JaredNav";
import { Hero } from "@/components/jared/Hero";
import { Marketing } from "@/components/jared/Marketing";
import { DesignThinking } from "@/components/jared/DesignThinking";
import { Personas } from "@/components/jared/Personas";
import { ProductDesign } from "@/components/jared/ProductDesign";
import { Prototyping } from "@/components/jared/Prototyping";
import { UxUi } from "@/components/jared/UxUi";
import { ProjectManagement } from "@/components/jared/ProjectManagement";
import { LongHorizon } from "@/components/jared/LongHorizon";
import { Coding } from "@/components/jared/Coding";
import { Footer, Lessons } from "@/components/jared/Lessons";

export const metadata: Metadata = {
  title: "How we built it",
  description: "Process portfolio for Thought Dock: marketing, design thinking, personas, 3D product design, prototyping, UX/UI, project management, the AI build, and code.",
};

export default function JaredPage() {
  return (
    <div className="jared-page min-h-dvh bg-bg text-text">
      <a href="#main" className="sr-only-focusable fixed top-2 left-2 z-50 rounded-full bg-ink px-4 py-2 text-[15px] font-medium text-on-ink">
        Skip to content
      </a>
      <JaredNav />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <Marketing />
        <DesignThinking />
        <Personas />
        <ProductDesign />
        <Prototyping />
        <UxUi />
        <ProjectManagement />
        <LongHorizon />
        <Coding />
        <Lessons />
      </main>
      <Footer />
    </div>
  );
}
