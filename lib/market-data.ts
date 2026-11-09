import "server-only";

import { ASSETS, type Asset, type Point } from "@/lib/market";

/**
 * Real market data, fetched server-side from public endpoints. No price on the
 * site is generated locally: if a source is unavailable the last real value is
 * reused, or the symbol is reported as missing and the UI says so.
 *
 *  - US equities: api.nasdaq.com quote info + one year of daily closes
 *  - Crypto / meme coins: OKX daily candles + 24h ticker, CoinGecko as fallback
 */

export type FeedQuote = {
  price: number;
  previousClose: number;
  change: number;
  delayed: boolean;
  asOf: string;
  provider: string;
};

export type MarketSnapshot = {
  quotes: Record<string, FeedQuote>;
  points: Record<string, Point[]>;
  fetchedAt: number;
  sources: string[];
  missing: string[];
};

const COINGECKO_IDS: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  LINK: "chainlink",
  AVAX: "avalanche-2",
  ARB: "arbitrum",
  DOGE: "dogecoin",
  SHIB: "shiba-inu",
  PEPE: "pepe",
  WIF: "dogwifcoin",
  BONK: "bonk",
  FLOKI: "floki",
};

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

const QUOTE_TTL = 45_000;
const HISTORY_TTL = 6 * 60 * 60 * 1000;
const TIMEOUT_MS = 8000;
const CONCURRENCY = 4;

const STOCK_HEADERS = { Origin: "https://www.nasdaq.com", Referer: "https://www.nasdaq.com/" };

async function getJson<T>(
  url: string,
  headers: Record<string, string> = {},
  revalidate = 60,
): Promise<T> {
  const response = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "application/json", ...headers },
    // A no-store fetch marks the whole route dynamic and aborts static
    // prerendering, so rely on Next's revalidating cache instead.
    next: { revalidate },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return (await response.json()) as T;
}

async function retry<T>(work: () => Promise<T>, attempts = 2): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await work();
    } catch (error) {
      lastError = error;
      if (i < attempts - 1) await new Promise((resolve) => setTimeout(resolve, 500 * (i + 1)));
    }
  }
  throw lastError;
}

/** Run tasks with a small concurrency ceiling so public endpoints don't throttle us. */
async function limited<T>(tasks: (() => Promise<T>)[], limit = CONCURRENCY): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let cursor = 0;

  const workers = Array.from({ length: Math.min(limit, tasks.length) }, async () => {
    while (cursor < tasks.length) {
      const index = cursor++;
      results[index] = await tasks[index]();
    }
  });

  await Promise.all(workers);
  return results;
}

function toNumber(raw: string | null | undefined): number | null {
  if (!raw) return null;
  const value = Number(raw.replace(/[$,%\s]/g, ""));
  return Number.isFinite(value) ? value : null;
}

function sortPoints(points: Point[]): Point[] {
  return points.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/* ------------------------------- equities -------------------------------- */

type NasdaqInfo = {
  data?: {
    primaryData?: {
      lastSalePrice?: string;
      netChange?: string;
      lastTradeTimestamp?: string;
      isRealTime?: boolean;
    };
  } | null;
};

type NasdaqHistory = {
  data?: { tradesTable?: { rows?: { date?: string; close?: string }[] } | null } | null;
};

async function fetchStockQuote(symbol: string): Promise<FeedQuote> {
  const payload = await retry(() =>
    getJson<NasdaqInfo>(`https://api.nasdaq.com/api/quote/${symbol}/info?assetclass=stocks`, STOCK_HEADERS),
  );

  const primary = payload.data?.primaryData;
  const price = toNumber(primary?.lastSalePrice);
  const change = toNumber(primary?.netChange);
  if (price === null || price <= 0) throw new Error(`no price for ${symbol}`);

  const previousClose = change === null ? price : price - change;

  return {
    price,
    previousClose,
    change: previousClose > 0 ? price / previousClose - 1 : 0,
    delayed: primary?.isRealTime !== true,
    asOf: new Date().toISOString(),
    provider: "Nasdaq",
  };
}

async function fetchStockHistory(symbol: string): Promise<Point[]> {
  // Nasdaq only returns rows for an ISO `fromdate`; MM/DD/YYYY yields an empty table.
  const fromDate = new Date(Date.now() - 380 * 86_400_000).toISOString().slice(0, 10);

  const payload = await retry(() =>
    getJson<NasdaqHistory>(
      `https://api.nasdaq.com/api/quote/${symbol}/historical?assetclass=stocks&fromdate=${fromDate}&limit=400`,
      STOCK_HEADERS,
      3600,
    ),
  );

  const points: Point[] = [];
  for (const row of payload.data?.tradesTable?.rows ?? []) {
    const close = toNumber(row.close);
    if (close === null || close <= 0 || !row.date) continue;
    const [month, day, year] = row.date.split("/").map(Number);
    if (!month || !day || !year) continue;
    points.push({ close, date: new Date(Date.UTC(year, month - 1, day)) });
  }

  if (points.length < 30) throw new Error(`thin history for ${symbol}`);
  return sortPoints(points);
}

/* -------------------------------- crypto --------------------------------- */

type CoinbaseStats = { open?: string; last?: string };

async function fetchCoinbaseQuote(symbol: string): Promise<FeedQuote> {
  const payload = await retry(() =>
    getJson<CoinbaseStats>(`https://api.exchange.coinbase.com/products/${symbol}-USD/stats`),
  );

  const price = Number(payload.last);
  const open24h = Number(payload.open);
  if (!Number.isFinite(price) || price <= 0) throw new Error(`no coinbase price for ${symbol}`);

  return {
    price,
    previousClose: Number.isFinite(open24h) && open24h > 0 ? open24h : price,
    change: Number.isFinite(open24h) && open24h > 0 ? price / open24h - 1 : 0,
    delayed: false,
    asOf: new Date().toISOString(),
    provider: "Coinbase",
  };
}

async function fetchCoinbaseHistory(symbol: string): Promise<Point[]> {
  const payload = await retry(() =>
    getJson<number[][]>(
      `https://api.exchange.coinbase.com/products/${symbol}-USD/candles?granularity=86400`,
      {},
      3600,
    ),
  );

  const points: Point[] = [];
  for (const row of payload) {
    const close = Number(row?.[4]);
    const timestamp = Number(row?.[0]);
    if (!Number.isFinite(close) || close <= 0 || !Number.isFinite(timestamp)) continue;
    points.push({ close, date: new Date(timestamp * 1000) });
  }

  if (points.length < 30) throw new Error(`thin coinbase history for ${symbol}`);
  return sortPoints(points);
}

type OkxTicker = { data?: { last?: string; open24h?: string; ts?: string }[] };
type OkxCandles = { data?: string[][] };

async function fetchOkxQuote(symbol: string): Promise<FeedQuote> {
  const payload = await retry(() =>
    getJson<OkxTicker>(`https://www.okx.com/api/v5/market/ticker?instId=${symbol}-USDT`),
  );

  const row = payload.data?.[0];
  const price = Number(row?.last);
  const open24h = Number(row?.open24h);
  if (!Number.isFinite(price) || price <= 0) throw new Error(`no okx price for ${symbol}`);

  return {
    price,
    previousClose: Number.isFinite(open24h) && open24h > 0 ? open24h : price,
    change: Number.isFinite(open24h) && open24h > 0 ? price / open24h - 1 : 0,
    delayed: false,
    asOf: new Date().toISOString(),
    provider: "OKX",
  };
}

async function fetchOkxHistory(symbol: string): Promise<Point[]> {
  const payload = await retry(() =>
    getJson<OkxCandles>(
      `https://www.okx.com/api/v5/market/candles?instId=${symbol}-USDT&bar=1D&limit=365`,
      {},
      3600,
    ),
  );

  const points: Point[] = [];
  for (const row of payload.data ?? []) {
    const close = Number(row[4]);
    const timestamp = Number(row[0]);
    if (!Number.isFinite(close) || close <= 0 || !Number.isFinite(timestamp)) continue;
    points.push({ close, date: new Date(timestamp) });
  }

  if (points.length < 30) throw new Error(`thin okx history for ${symbol}`);
  return sortPoints(points);
}

type CoinGeckoMarket = {
  id: string;
  current_price: number;
  price_change_percentage_24h: number | null;
};

async function fetchCoinGeckoQuotes(): Promise<Record<string, FeedQuote>> {
  const ids = Object.values(COINGECKO_IDS);
  const payload = await retry(() =>
    getJson<CoinGeckoMarket[]>(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids.join(",")}&price_change_percentage=24h`,
    ),
  );

  const byId = new Map(payload.map((row) => [row.id, row]));
  const out: Record<string, FeedQuote> = {};

  for (const [symbol, id] of Object.entries(COINGECKO_IDS)) {
    const row = byId.get(id);
    if (!row || !Number.isFinite(row.current_price) || row.current_price <= 0) continue;
    const change = (row.price_change_percentage_24h ?? 0) / 100;
    out[symbol] = {
      price: row.current_price,
      previousClose: row.current_price / (1 + change),
      change,
      delayed: false,
      asOf: new Date().toISOString(),
      provider: "CoinGecko",
    };
  }

  return out;
}

type CoinGeckoChart = { prices?: [number, number][] };

async function fetchCoinGeckoHistory(symbol: string): Promise<Point[]> {
  const id = COINGECKO_IDS[symbol];
  if (!id) throw new Error(`unknown crypto symbol ${symbol}`);

  const payload = await retry(
    () =>
      getJson<CoinGeckoChart>(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=365&interval=daily`,
        {},
        3600,
      ),
    3,
  );

  const points: Point[] = [];
  const seen = new Set<string>();
  for (const [timestamp, price] of payload.prices ?? []) {
    if (!Number.isFinite(price) || price <= 0) continue;
    const date = new Date(timestamp);
    const key = date.toISOString().slice(0, 10);
    if (seen.has(key)) continue;
    seen.add(key);
    points.push({ close: price, date });
  }

  if (points.length < 30) throw new Error(`thin coingecko history for ${symbol}`);
  return sortPoints(points);
}

/* --------------------------------- cache --------------------------------- */

type CacheEntry<T> = { value: T; ts: number };

const quoteCache = new Map<string, CacheEntry<FeedQuote>>();
const historyCache = new Map<string, CacheEntry<Point[]>>();

let snapshot: MarketSnapshot | null = null;
let inflight: Promise<MarketSnapshot> | null = null;

function fresh<T>(entry: CacheEntry<T> | undefined, ttl: number): entry is CacheEntry<T> {
  return Boolean(entry && Date.now() - entry.ts < ttl);
}

async function loadQuotes(): Promise<Record<string, FeedQuote>> {
  const out: Record<string, FeedQuote> = {};
  const stocks = ASSETS.filter((asset) => asset.kind === "stock");
  const crypto = ASSETS.filter((asset) => asset.kind !== "stock");

  const stockResults = await limited(
    stocks.map((asset) => async () => {
      try {
        const quote = await fetchStockQuote(asset.symbol);
        quoteCache.set(asset.symbol, { value: quote, ts: Date.now() });
        return [asset.symbol, quote] as const;
      } catch {
        const cached = quoteCache.get(asset.symbol);
        return cached ? ([asset.symbol, cached.value] as const) : null;
      }
    }),
  );

  for (const row of stockResults) if (row) out[row[0]] = row[1];

  const cryptoResults = await limited(
    crypto.map((asset) => async () => {
      for (const fetcher of [fetchCoinbaseQuote, fetchOkxQuote]) {
        try {
          const quote = await fetcher(asset.symbol);
          quoteCache.set(asset.symbol, { value: quote, ts: Date.now() });
          return [asset.symbol, quote] as const;
        } catch {
          // Try the next venue for this symbol.
        }
      }
      return null;
    }),
  );

  for (const row of cryptoResults) if (row) out[row[0]] = row[1];

  // One CoinGecko call backfills any crypto symbol OKX did not return.
  const missingCrypto = crypto.filter((asset) => !out[asset.symbol]);
  if (missingCrypto.length) {
    try {
      const fallback = await fetchCoinGeckoQuotes();
      for (const asset of missingCrypto) {
        const quote = fallback[asset.symbol];
        if (quote) {
          quoteCache.set(asset.symbol, { value: quote, ts: Date.now() });
          out[asset.symbol] = quote;
        }
      }
    } catch {
      for (const asset of missingCrypto) {
        const cached = quoteCache.get(asset.symbol);
        if (cached) out[asset.symbol] = cached.value;
      }
    }
  }

  return out;
}

async function loadHistory(): Promise<Record<string, Point[]>> {
  const out: Record<string, Point[]> = {};
  const stale = ASSETS.filter((asset) => !fresh(historyCache.get(asset.symbol), HISTORY_TTL));

  await limited(
    stale.map((asset: Asset) => async () => {
      const fetchers =
        asset.kind === "stock"
          ? [() => fetchStockHistory(asset.symbol)]
          : [
              () => fetchCoinbaseHistory(asset.symbol),
              () => fetchOkxHistory(asset.symbol),
              () => fetchCoinGeckoHistory(asset.symbol),
            ];

      for (const fetcher of fetchers) {
        try {
          const points = await fetcher();
          historyCache.set(asset.symbol, { value: points, ts: Date.now() });
          out[asset.symbol] = points;
          return;
        } catch {
          // Try the next source for this symbol.
        }
      }

      const cached = historyCache.get(asset.symbol);
      if (cached) out[asset.symbol] = cached.value;
    }),
  );

  return out;
}

function withLiveClose(points: Point[], quote: FeedQuote | undefined): Point[] {
  if (!points.length) return points;
  const next = points.slice();
  if (quote) next[next.length - 1] = { close: quote.price, date: next[next.length - 1].date };
  return next;
}

async function buildSnapshot(): Promise<MarketSnapshot> {
  const [quotes, history] = await Promise.all([loadQuotes(), loadHistory()]);

  const points: Record<string, Point[]> = {};
  for (const [symbol, series] of Object.entries(history)) {
    points[symbol] = withLiveClose(series, quotes[symbol]);
  }

  const missing = ASSETS.filter((asset) => !points[asset.symbol]?.length).map((asset) => asset.symbol);
  const sources = [...new Set(Object.values(quotes).map((quote) => quote.provider))];

  return { quotes, points, fetchedAt: Date.now(), sources, missing };
}

/**
 * Guarantees the market model has real data. Safe to call from multiple
 * components: concurrent callers share one in-flight request.
 */
export async function ensureMarketData(force = false): Promise<MarketSnapshot> {
  if (!force && snapshot && Date.now() - snapshot.fetchedAt < QUOTE_TTL) return snapshot;
  if (inflight) return inflight;

  inflight = buildSnapshot()
    .then(async (next) => {
      const { setMarketData } = await import("@/lib/market");
      setMarketData(next.points, next.quotes);
      snapshot = next;
      return next;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

export function getCachedSnapshot(): MarketSnapshot | null {
  return snapshot;
}
