import { NextResponse } from "next/server";
import { dockExists, getMedia, ID_RE, MAX_MEDIA, setMedia } from "@/lib/dock";

type Ctx = { params: Promise<{ id: string; item: string }> };
const DATA_URL = /^data:(audio|image)\/[a-z0-9.+-]+(;codecs=[a-z0-9.,"-]+)?;base64,[A-Za-z0-9+/=]+$/i;

// GET returns the raw bytes so <audio>/<img> can point straight at this URL.
export async function GET(_: Request, { params }: Ctx) {
  const { id, item } = await params;
  if (!ID_RE.test(item)) return new NextResponse(null, { status: 404 });
  const data = await getMedia(id, item);
  if (!data) return new NextResponse(null, { status: 404 });
  const [head, b64] = data.split(",");
  const mime = head.slice(5).split(";")[0];
  return new NextResponse(Buffer.from(b64, "base64"), {
    headers: { "content-type": mime, "cache-control": "private, max-age=86400" },
  });
}

// PUT body: { dataUrl }
export async function PUT(req: Request, { params }: Ctx) {
  const { id, item } = await params;
  if (!ID_RE.test(item) || !(await dockExists(id))) return NextResponse.json({ error: "not found" }, { status: 404 });
  const body = await req.json().catch(() => null);
  const dataUrl = body?.dataUrl;
  if (typeof dataUrl !== "string" || dataUrl.length > MAX_MEDIA || !DATA_URL.test(dataUrl)) {
    return NextResponse.json({ error: "media too large or invalid" }, { status: 400 });
  }
  await setMedia(id, item, dataUrl);
  return NextResponse.json({ ok: true });
}
