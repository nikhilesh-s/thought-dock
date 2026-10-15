import { NextResponse } from "next/server";
import { createDock } from "@/lib/dock";

// POST /api/dock  { demo?: boolean } -> new dock (the id is the bearer secret; keep it private)
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const dock = await createDock(Boolean(body?.demo));
  return NextResponse.json(dock);
}
