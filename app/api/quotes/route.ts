import {
  ensureMarketData,
  ensureSymbols,
  getCachedSnapshot,
} from "@/lib/market-data";

export const dynamic = "force-dynamic";

export async function GET(request?: Request) {
  // Subset mode: ?symbols=SYMBOL,SYMBOL — fetches only what the page asked for
  // (used by the 300-symbol universe tables and live-chat ticker tape).
  const symbolsParam = new URL(request?.url ?? "http://local").searchParams.get("symbols");
  const symbols = (symbolsParam ?? "")
    .split(",")
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean)
    .slice(0, 60);

  let entries: Record<string, { price: number; change: number; previousClose: number; delayed: boolean; provider: string }> = {};
  let source = "";

  if (symbols.length) {
    await ensureSymbols(symbols);
    const snap = getCachedSnapshot();
    const quotes = snap?.quotes ?? {};
    for (const symbol of symbols) {
      const quote = quotes[symbol];
      if (quote) {
        entries[symbol] = {
          price: quote.price,
          change: quote.change,
          previousClose: quote.previousClose,
          delayed: quote.delayed,
          provider: quote.provider,
        };
      }
    }
    source = "Nasdaq + Coinbase";
  } else {
    const snapshot = await ensureMarketData();
    for (const [symbol, quote] of Object.entries(snapshot.quotes)) {
      entries[symbol] = {
        price: quote.price,
        change: quote.change,
        previousClose: quote.previousClose,
        delayed: quote.delayed,
        provider: quote.provider,
      };
    }
    source = snapshot.sources.join(" + ");
  }

  const list = Object.entries(entries);

  if (!list.length) {
    return Response.json(
      { mode: "unavailable", source: "", asOf: null, delayed: true, quotes: {} },
      { headers: { "cache-control": "no-store" } },
    );
  }

  return Response.json(
    {
      mode: "live",
      source,
      asOf: new Date().toISOString(),
      delayed: list.some(([, quote]) => quote.delayed),
      quotes: entries,
    },
    {
      headers: {
        "cache-control": "public, s-maxage=30, stale-while-revalidate=120",
      },
    },
  );
}
