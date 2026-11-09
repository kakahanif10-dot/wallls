import "server-only";

import { CHAT_CHANNEL, insertMessage, lastAiTs, humanCountSince } from "@/lib/chat";
import { ensureMarketData, getCachedSnapshot } from "@/lib/market-data";
import { lookupAsset, metricsFor, ASSETS } from "@/lib/market";

export const BOT_NAME = "Nova · AI Moderator";

const ROTATION = [
  "movers",
  "risk",
  "levels",
  "prediction",
] as const;

function fmtPrice(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "—";
  if (value < 0.0001) return value.toExponential(2).replace("e", "e");
  if (value < 1) return value.toFixed(6).replace(/0+$/, "").replace(/\.$/, ".0");
  if (value < 100) return value.toFixed(2);
  return value.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

function fmtPct(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const pct = (value * 100).toFixed(2);
  return `${value >= 0 ? "+" : ""}${pct}%`;
}

function minuteBucket(ts: number): number {
  const d = new Date(ts);
  return Math.floor(d.getUTCMinutes() / 2) + (d.getUTCHours() % 2) * 30;
}

export async function maybePostModeratorMessage(): Promise<boolean> {
  const now = Date.now();
  const lastAi = await lastAiTs(CHAT_CHANNEL);
  const sixtySecondsAgo = now - 60_000;

  const hasHuman = (await humanCountSince(CHAT_CHANNEL, now - 5 * 60_000)) > 0;
  const quietTooLong = now - lastAi > 5 * 60_000;

  if (lastAi > sixtySecondsAgo) return false;
  if (!hasHuman && !quietTooLong) return false;

  let snapshot;
  try {
    snapshot = await ensureMarketData();
  } catch {
    return false;
  }
  snapshot = snapshot ?? getCachedSnapshot();
  if (!snapshot) return false;

  const entries = Object.entries(snapshot.quotes);
  if (entries.length < 2) return false;

  const movers = entries
    .map(([symbol, quote]) => ({ symbol, quote }))
    .sort((a, b) => Math.abs(b.quote.change) - Math.abs(a.quote.change))
    .slice(0, 3);
  const leaders = entries
    .map(([symbol, quote]) => ({ symbol, quote }))
    .sort((a, b) => b.quote.change - a.quote.change)
    .slice(0, 2);

  const btc = snapshot.quotes.BTC;
  const eth = snapshot.quotes.ETH;
  const nvda = snapshot.quotes.NVDA;

  const btcAsset = lookupAsset("BTC");
  let btcNote = "";
  if (btcAsset && btc) {
    const m = metricsFor(btcAsset);
    btcNote = `BTC ${fmtPrice(btc.price)} · 24h ${fmtPct(btc.change)} · RSI ${Math.round(m.rsi)} · score ${m.score} (${m.stance}).`;
  }

  const mode = ROTATION[minuteBucket(now) % ROTATION.length];
  const clock = new Date(now).toUTCString().slice(17, 25);
  const header = `[Nova brief · ${clock} UTC]`;

  let body = "";
  if (mode === "movers") {
    const parts = movers.map(
      (m) => `${m.symbol} ${fmtPct(m.quote.change)} (${fmtPrice(m.quote.price)})`,
    );
    const names = leaders.map((m) => m.symbol).join(" & ");
    body = `${header} Biggest moves right now: ${parts.join(" · ")}. Leading the tape: ${names}. BTC: ${btcNote}`;
  } else if (mode === "risk") {
    const risky = entries
      .filter(([, q]) => !q.delayed && Math.abs(q.change) > 0.04)
      .slice(0, 2)
      .map(([s]) => s)
      .join(" & ");
    body = `${header} Risk check: ${risky ? `${risky} is printing >4% swings — size down, not up.` : "no >4% single-name blow-ups in the 24 tracked quotes."} ${btcNote} Meme coins stay position-capped; this is tape-reading, not advice.`;
  } else if (mode === "levels") {
    const btcM = btcAsset ? metricsFor(btcAsset) : null;
    const sma50 = btcM ? fmtPrice(btcM.sma50) : "—";
    const sma200 = btcM ? fmtPrice(btcM.sma200) : "—";
    body = `${header} Levels: BTC 50-day ~${sma50}, 200-day ~${sma200}. ${btcNote} A reclaim-and-hold of the 50-day flips the read; until then rallies are counter-trend.`;
  } else {
    const bear = entries.some(([, q]) => q.change < -0.02);
    const bull = entries.some(([, q]) => q.change > 0.02);
    const read = bear && !bull ? "defensive" : bull && !bear ? "constructive" : "mixed";
    body = `${header} Prediction — next 60 min (model read, not advice): tape is ${read}. ${btcNote} Levels: a BTC reclaim of the 50-day flips the read constructive; failure there keeps rallies as exits.`;
  }

  const ok = await insertMessage(CHAT_CHANNEL, BOT_NAME, body.slice(0, 600), "ai");
  return ok;
}
