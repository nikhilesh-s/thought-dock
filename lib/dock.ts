import "server-only";
import { Redis } from "@upstash/redis";
import { randomBytes } from "node:crypto";
import { KINDS, type Dock, type Item, type Op, type Space } from "./types";
import { seedDemo } from "./seed";

// Storage: Upstash Redis via the Vercel Marketplace (free tier). One hash per dock for items,
// one for spaces, so phone and desk writes to different items never clobber each other.
// ponytail: in-memory fallback when Redis env is absent (local dev only; not shared across instances).
const redis =
  process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN
    ? new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN })
    : process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
      ? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
      : null;

type Mem = { meta: { createdAt: number }; items: Map<string, Item>; spaces: Map<string, Space>; media: Map<string, string> };
const g = globalThis as unknown as { __tdMem?: Map<string, Mem>; __tdPair?: Map<string, { dock: string; exp: number }> };
const mem = (g.__tdMem ??= new Map());
const pairMem = (g.__tdPair ??= new Map());

const TTL = 60 * 60 * 24 * 180; // docks live 180 days after last write
const PAIR_TTL = 60 * 10;
export const MAX_TEXT = 10_000;
export const MAX_MEDIA = 900_000; // base64 chars (~650KB binary); Upstash free tier caps requests at 1MB

const k = {
  meta: (d: string) => `td:${d}:meta`,
  items: (d: string) => `td:${d}:items`,
  spaces: (d: string) => `td:${d}:spaces`,
  media: (d: string, i: string) => `td:${d}:media:${i}`,
  pair: (c: string) => `td:pair:${c}`,
};

export const ID_RE = /^[A-Za-z0-9_-]{6,40}$/;
const B62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
export function secretId(len = 22) {
  const b = randomBytes(len);
  let s = "";
  for (let i = 0; i < len; i++) s += B62[b[i] % 62];
  return s;
}

export async function createDock(demo = false): Promise<Dock> {
  const id = secretId();
  const createdAt = Date.now();
  if (redis) await redis.set(k.meta(id), { createdAt }, { ex: TTL });
  else mem.set(id, { meta: { createdAt }, items: new Map(), spaces: new Map(), media: new Map() });
  const seed = seedDemo(createdAt, demo);
  await applyOps(id, [
    ...seed.spaces.map((space): Op => ({ op: "putSpace", space })),
    ...seed.items.map((item): Op => ({ op: "put", item })),
  ]);
  return (await getDock(id))!;
}

export async function getDock(id: string): Promise<Dock | null> {
  if (!ID_RE.test(id)) return null;
  if (!redis) {
    const m = mem.get(id);
    if (!m) return null;
    return { id, createdAt: m.meta.createdAt, items: [...m.items.values()], spaces: [...m.spaces.values()] };
  }
  const [meta, items, spaces] = await Promise.all([
    redis.get<{ createdAt: number }>(k.meta(id)),
    redis.hgetall<Record<string, Item>>(k.items(id)),
    redis.hgetall<Record<string, Space>>(k.spaces(id)),
  ]);
  if (!meta) return null;
  return { id, createdAt: meta.createdAt, items: Object.values(items ?? {}), spaces: Object.values(spaces ?? {}) };
}

export async function dockExists(id: string) {
  if (!ID_RE.test(id)) return false;
  return redis ? (await redis.exists(k.meta(id))) === 1 : mem.has(id);
}

// --- validation at the trust boundary -------------------------------------------------
const str = (v: unknown, max: number) => typeof v === "string" && v.length <= max;
const optStr = (v: unknown, max: number) => v === undefined || v === null || str(v, max);

export function validItem(i: unknown): i is Item {
  if (!i || typeof i !== "object") return false;
  const x = i as Record<string, unknown>;
  return (
    str(x.id, 40) && ID_RE.test(x.id as string) &&
    str(x.text, MAX_TEXT) &&
    optStr(x.body, MAX_TEXT * 2) &&
    typeof x.createdAt === "number" && typeof x.updatedAt === "number" &&
    ["inbox", "kept", "archived"].includes(x.status as string) &&
    (x.kind === undefined || x.kind === null || (KINDS as readonly string[]).includes(x.kind as string)) &&
    optStr(x.spaceId, 40) && optStr(x.due, 10) && optStr(x.at, 16) && optStr(x.url, 2048) &&
    Array.isArray(x.links) && x.links.length <= 200 && x.links.every((l) => str(l, 40))
  );
}
function validSpace(s: unknown): s is Space {
  if (!s || typeof s !== "object") return false;
  const x = s as Record<string, unknown>;
  return str(x.id, 40) && ID_RE.test(x.id as string) && str(x.name, 60) && (x.name as string).trim().length > 0 && typeof x.createdAt === "number";
}
export function validOp(o: unknown): o is Op {
  if (!o || typeof o !== "object") return false;
  const x = o as Record<string, unknown>;
  switch (x.op) {
    case "put": return validItem(x.item);
    case "putSpace": return validSpace(x.space);
    case "del":
    case "delSpace": return str(x.id, 40) && ID_RE.test(x.id as string);
    default: return false;
  }
}

export async function applyOps(id: string, ops: Op[]) {
  if (!redis) {
    const m = mem.get(id);
    if (!m) return;
    for (const o of ops) {
      if (o.op === "put") m.items.set(o.item.id, o.item);
      else if (o.op === "del") { m.items.delete(o.id); m.media.delete(o.id); }
      else if (o.op === "putSpace") m.spaces.set(o.space.id, o.space);
      else m.spaces.delete(o.id);
    }
    return;
  }
  const p = redis.pipeline();
  for (const o of ops) {
    if (o.op === "put") p.hset(k.items(id), { [o.item.id]: o.item });
    else if (o.op === "del") { p.hdel(k.items(id), o.id); p.del(k.media(id, o.id)); }
    else if (o.op === "putSpace") p.hset(k.spaces(id), { [o.space.id]: o.space });
    else p.hdel(k.spaces(id), o.id);
  }
  for (const key of [k.meta(id), k.items(id), k.spaces(id)]) p.expire(key, TTL);
  await p.exec();
}

// --- media (voice notes, screenshots) stored as data URLs, one key per item ------------
export async function setMedia(dock: string, item: string, dataUrl: string) {
  if (redis) await redis.set(k.media(dock, item), dataUrl, { ex: TTL });
  else mem.get(dock)?.media.set(item, dataUrl);
}
export async function getMedia(dock: string, item: string): Promise<string | null> {
  if (redis) return await redis.get<string>(k.media(dock, item));
  return mem.get(dock)?.media.get(item) ?? null;
}

// --- pairing: short code shown on the desk, typed or scanned on the phone ---------------
const PAIR_ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export async function createPair(dock: string) {
  const b = randomBytes(6);
  let code = "";
  for (let i = 0; i < 6; i++) code += PAIR_ALPHA[b[i] % PAIR_ALPHA.length];
  if (redis) await redis.set(k.pair(code), dock, { ex: PAIR_TTL });
  else pairMem.set(code, { dock, exp: Date.now() + PAIR_TTL * 1000 });
  return { code, expiresAt: Date.now() + PAIR_TTL * 1000 };
}
export async function resolvePair(code: string): Promise<string | null> {
  code = code.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (code.length !== 6) return null;
  if (redis) return await redis.get<string>(k.pair(code));
  const p = pairMem.get(code);
  return p && p.exp > Date.now() ? p.dock : null;
}

export const storage = redis ? "redis" : "memory";
