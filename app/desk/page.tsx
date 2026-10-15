import type { Metadata } from "next";
import { DeskApp } from "@/components/app/DeskApp";

export const metadata: Metadata = { title: "Desk" };

export default function DeskPage() {
  return <DeskApp />;
}
