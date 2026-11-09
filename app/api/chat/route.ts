import { NextResponse } from "next/server";
import {
  CHAT_CHANNEL,
  authorLastTs,
  heartbeat,
  insertMessage,
  listMessages,
  onlineCount,
} from "@/lib/chat";
import { maybePostModeratorMessage } from "@/lib/moderator";

export const dynamic = "force-dynamic";

function json(payload: unknown, status = 200) {
  return NextResponse.json(payload, {
    status,
    headers: { "cache-control": "no-store" },
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const after = Number(url.searchParams.get("after") ?? 0) || 0;
  const limit = Math.min(Number(url.searchParams.get("limit") ?? 100) || 100, 200);
  const peer = url.searchParams.get("peer");

  // Fire the moderator tick on read: it self-gates to roughly one message per
  // minute while the room is active, so there is no cron to configure.
  maybePostModeratorMessage();

  if (peer) await heartbeat(peer.slice(0, 64));

  const messages = await listMessages(CHAT_CHANNEL, after, limit);
  const online = await onlineCount();

  return json({
    mode: "live",
    messages,
    online,
    asOf: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  let body: { author?: string; message?: string; body?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const author = (body.author ?? "").trim().slice(0, 24);
  const text = (body.message ?? body.body ?? "").trim().slice(0, 300);

  if (!author) return json({ error: "Name required" }, 400);
  if (!text) return json({ error: "Message is empty" }, 400);
  if (/https?:\/\//i.test(text)) return json({ error: "Links are not allowed in this room" }, 400);

  const lastTs = await authorLastTs(author);
  if (Date.now() - lastTs < 2000) {
    return json({ error: "Slow down — one message every 2 seconds" }, 429);
  }

  const ok = await insertMessage(CHAT_CHANNEL, author, text, "user");
  if (!ok) return json({ mode: "unavailable" }, 503);

  return json({ ok: true });
}
