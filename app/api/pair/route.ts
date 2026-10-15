import { NextResponse } from "next/server";
import { createPair, dockExists, resolvePair } from "@/lib/dock";

// POST { dock } -> { code, expiresAt }   (desk asks for a short code to show)
// GET ?code=ABC123 -> { dock }           (phone redeems it)
// ponytail: no rate limit; 32^6 codes with a 10-minute TTL. Add Upstash ratelimit if abused.
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (typeof body?.dock !== "string" || !(await dockExists(body.dock))) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  return NextResponse.json(await createPair(body.dock));
}

export async function GET(req: Request) {
  const code = new URL(req.url).searchParams.get("code") ?? "";
  const dock = await resolvePair(code);
  if (!dock) return NextResponse.json({ error: "That code didn't match. Codes last 10 minutes." }, { status: 404 });
  return NextResponse.json({ dock });
}
