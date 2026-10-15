import type { Metadata } from "next";
import { CaptureApp } from "@/components/app/CaptureApp";

export const metadata: Metadata = { title: "Capture" };

export default function CapturePage() {
  return <CaptureApp />;
}
