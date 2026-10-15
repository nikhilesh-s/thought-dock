import { NextResponse } from "next/server";
import { applyOps, dockExists, getDock, validOp } from "@/lib/dock";

type Ctx = { params: Promise<{ id: string }> };
const noStore = { "cache-control": "no-store" };

export async function GET(_: Request, { params }: Ctx) {
  const { id } = await params;
  const dock = await getDock(id);
  if (!dock) return NextResponse.json({ error: "not found" }, { status: 404, headers: noStore });
  return NextResponse.json(dock, { headers: noStore });
}

// PATCH /api/dock/:id  { ops: Op[] }
export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  if (!(await dockExists(id))) return NextResponse.json({ error: "not found" }, { status: 404 });
  const body = await req.json().catch(() => null);
  const ops = body?.ops;
  if (!Array.isArray(ops) || ops.length === 0 || ops.length > 200 || !ops.every(validOp)) {
    return NextResponse.json({ error: "bad ops" }, { status: 400 });
  }
  await applyOps(id, ops);
  return NextResponse.json({ ok: true, at: Date.now() });
}
