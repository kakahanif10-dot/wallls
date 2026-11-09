"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

export type LiveSeedEntry = { price: number; change: number; vol: number };
export type LiveSeed = Record<string, LiveSeedEntry>;

export type Quote = {
  price: number;
  open: number;
  change: number;
  dir: -1 | 0 | 1;
  tick: number;
};

export type FeedMeta = {
  mode: "live" | "unavailable";
  source: string;
  asOf: string | null;
  delayed: boolean;
};

type FeedResponse = {
  mode?: "live" | "unavailable";
  source?: string;
  asOf?: string | null;
  delayed?: boolean;
  quotes?: Record<string, { price: number; change: number; previousClose: number }>;
};

const QuoteContext = createContext<Record<string, Quote> | null>(null);
const FeedContext = createContext<FeedMeta>({
  mode: "live",
  source: "",
  asOf: null,
  delayed: true,
});

const POLL_MS = 30_000;

/**
 * Quotes come from the server feed only. There is deliberately no client-side
 * price simulation: a number on screen is either a real quote or the last real
 * quote we received, never an invented walk.
 */
export default function LivePricesProvider({
  seed,
  source = "",
  delayed = true,
  children,
}: {
  seed: LiveSeed;
  source?: string;
  delayed?: boolean;
  children: React.ReactNode;
}) {
  const initial = useMemo(() => {
    const out: Record<string, Quote> = {};
    for (const [symbol, entry] of Object.entries(seed)) {
      const denominator = 1 + entry.change;
      out[symbol] = {
        price: entry.price,
        open: entry.price / (denominator > 0 ? denominator : 1),
        change: entry.change,
        dir: 0,
        tick: 0,
      };
    }
    return out;
  }, [seed]);

  const [quotes, setQuotes] = useState<Record<string, Quote>>(initial);
  const [meta, setMeta] = useState<FeedMeta>({
    mode: "live",
    source,
    asOf: null,
    delayed,
  });
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    let cancelled = false;

    const load = async () => {
      try {
        const response = await fetch("/api/quotes", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as FeedResponse;
        if (cancelled) return;

        if (data?.mode !== "live" || !data.quotes) {
          setMeta((prev) => ({ ...prev, mode: "unavailable" }));
          return;
        }

        setMeta({
          mode: "live",
          source: data.source || "",
          asOf: data.asOf ?? null,
          delayed: data.delayed ?? false,
        });

        setQuotes((prev) => {
          const next = { ...prev };
          for (const [symbol, row] of Object.entries(data.quotes!)) {
            if (!row || typeof row.price !== "number" || row.price <= 0) continue;
            const previous = prev[symbol];
            next[symbol] = {
              price: row.price,
              open: row.previousClose > 0 ? row.previousClose : (previous?.open ?? row.price),
              change:
                row.previousClose > 0
                  ? row.price / row.previousClose - 1
                  : (previous?.change ?? 0),
              dir: !previous || row.price === previous.price ? 0 : row.price > previous.price ? 1 : -1,
              tick: (previous?.tick ?? 0) + 1,
            };
          }
          return next;
        });
      } catch {
        // Keep the last real quote rather than degrade to a synthetic one.
      }
    };

    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      mounted.current = false;
      clearInterval(id);
    };
  }, []);

  return (
    <FeedContext.Provider value={meta}>
      <QuoteContext.Provider value={quotes}>{children}</QuoteContext.Provider>
    </FeedContext.Provider>
  );
}

export function useQuote(symbol: string): Quote | undefined {
  const context = useContext(QuoteContext);
  return context ? context[symbol] : undefined;
}

export function useFeedMeta(): FeedMeta {
  return useContext(FeedContext);
}
