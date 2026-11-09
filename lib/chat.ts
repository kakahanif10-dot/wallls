import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";

export type ChatMessage = {
  id: number;
  channel: string;
  author: string;
  body: string;
  kind: "user" | "ai";
  ts: number;
};

export const CHAT_CHANNEL = "general";

type D1 = {
  prepare: (query: string) => {
    bind: (...args: unknown[]) => {
      all: () => Promise<{ results?: ChatMessage[] }>;
      run: () => Promise<unknown>;
      first: () => Promise<{ ts?: number } | null>;
    };
  };
};

async function db(): Promise<D1 | null> {
  try {
    const { env } = await getCloudflareContext();
    const binding = (env as Record<string, unknown>).DB as D1 | undefined;
    return binding ?? null;
  } catch {
    return null;
  }
}

let schemaReady = false;

async function ensureSchema(database: D1): Promise<void> {
  if (schemaReady) return;
  await database
    .prepare(
      `CREATE TABLE IF NOT EXISTS chat_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        channel TEXT NOT NULL,
        author TEXT NOT NULL,
        body TEXT NOT NULL,
        kind TEXT NOT NULL,
        ts INTEGER NOT NULL
      )`,
    )
    .bind()
    .run();
  await database
    .prepare(`CREATE INDEX IF NOT EXISTS idx_chat_ts ON chat_messages (channel, ts)`)
    .bind()
    .run();
  await database
    .prepare(
      `CREATE TABLE IF NOT EXISTS chat_peers (
        id TEXT PRIMARY KEY,
        last INTEGER NOT NULL
      )`,
    )
    .bind()
    .run();
  schemaReady = true;
}

export async function listMessages(
  channel: string,
  afterTs: number,
  limit = 100,
): Promise<ChatMessage[]> {
  const database = await db();
  if (!database) return [];
  try {
    await ensureSchema(database);
    const result = await database
      .prepare(
        `SELECT id, channel, author, body, kind, ts FROM chat_messages
         WHERE channel = ? AND ts > ? ORDER BY ts ASC LIMIT ?`,
      )
      .bind(channel, afterTs, limit)
      .all();
    return result.results ?? [];
  } catch {
    return [];
  }
}

export async function insertMessage(
  channel: string,
  author: string,
  body: string,
  kind: ChatMessage["kind"],
): Promise<boolean> {
  const database = await db();
  if (!database) return false;
  try {
    await ensureSchema(database);
    await database
      .prepare(
        `INSERT INTO chat_messages (channel, author, body, kind, ts) VALUES (?, ?, ?, ?, ?)`,
      )
      .bind(channel, author, body, kind, Date.now())
      .run();
    return true;
  } catch {
    return false;
  }
}

export async function lastAiTs(channel: string): Promise<number> {
  const database = await db();
  if (!database) return 0;
  try {
    await ensureSchema(database);
    const row = await database
      .prepare(
        `SELECT ts FROM chat_messages WHERE channel = ? AND kind = 'ai' ORDER BY ts DESC LIMIT 1`,
      )
      .bind(channel)
      .first();
    return row?.ts ?? 0;
  } catch {
    return 0;
  }
}

export async function humanCountSince(channel: string, sinceTs: number): Promise<number> {
  const database = await db();
  if (!database) return 0;
  try {
    await ensureSchema(database);
    const row = await database
      .prepare(
        `SELECT ts FROM chat_messages WHERE channel = ? AND kind = 'user' AND ts > ? ORDER BY ts DESC LIMIT 1`,
      )
      .bind(channel, sinceTs)
      .first();
    return row?.ts ? 1 : 0;
  } catch {
    return 0;
  }
}

export async function authorLastTs(author: string): Promise<number> {
  const database = await db();
  if (!database) return 0;
  try {
    await ensureSchema(database);
    const row = await database
      .prepare(
        `SELECT ts FROM chat_messages WHERE author = ? AND kind = 'user' ORDER BY ts DESC LIMIT 1`,
      )
      .bind(author)
      .first();
    return row?.ts ?? 0;
  } catch {
    return 0;
  }
}

export async function heartbeat(peerId: string): Promise<void> {
  const database = await db();
  if (!database) return;
  try {
    await ensureSchema(database);
    await database
      .prepare(
        `INSERT INTO chat_peers (id, last) VALUES (?, ?)
         ON CONFLICT(id) DO UPDATE SET last = excluded.last`,
      )
      .bind(peerId, Date.now())
      .run();
  } catch {
    // Presence is best-effort.
  }
}

export async function onlineCount(): Promise<number> {
  const database = await db();
  if (!database) return 0;
  try {
    await ensureSchema(database);
    const result = await database
      .prepare(`SELECT ts FROM chat_peers WHERE last > ?`)
      .bind(Date.now() - 60_000)
      .all();
    return result.results?.length ?? 0;
  } catch {
    return 0;
  }
}
