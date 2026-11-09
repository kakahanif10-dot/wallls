import { ensureMarketData } from "@/lib/market-data";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = await ensureMarketData();
  const entries = Object.entries(snapshot.quotes);

  if (!entries.length) {
    return Response.json(
      { mode: "unavailable", source: "", asOf: null, delayed: true, quotes: {} },
      { headers: { "cache-control": "no-store" } },
    );
  }

  const quotes: Record<string, { price: number; change: number; previousClose: number; delayed: boolean; provider: string }> = {};
  for (const [symbol, quote] of entries) {
    quotes[symbol] = {
      price: quote.price,
      change: quote.change,
      previousClose: quote.previousClose,
      delayed: quote.delayed,
      provider: quote.provider,
    };
  }

  return Response.json(
    {
      mode: "live",
      source: snapshot.sources.join(" + "),
      asOf: new Date(snapshot.fetchedAt).toISOString(),
      delayed: entries.some(([, quote]) => quote.delayed),
      quotes,
    },
    {
      headers: {
        "cache-control": "public, s-maxage=30, stale-while-revalidate=120",
      },
    },
  );
}
