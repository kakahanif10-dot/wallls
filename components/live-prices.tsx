"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type LiveSeedEntry = { price: number; change: number; vol: number };
export type LiveSeed = Record<string, LiveSeedEntry>;

export type Quote = {
  price: number;
  open: number;
  change: number;
  dir: -1 | 0 | 1;
  tick: number;
};

const QuoteContext = createContext<Record<string, Quote> | null>(null);

const TICK_MS = 1500;

export default function LivePricesProvider({
  seed,
  children,
}: {
  seed: LiveSeed;
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

  useEffect(() => {
    const id = setInterval(() => {
      setQuotes((prev) => {
        const next: Record<string, Quote> = {};
        for (const [symbol, quote] of Object.entries(prev)) {
          const step = seed[symbol]?.vol ?? 0.0008;
          const roll = (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;
          const jump = Math.random() < 0.05 ? (Math.random() - 0.5) * 6 : 1;
          const price = Math.max(quote.price * (1 + roll * step * jump), 1e-12);
          next[symbol] = {
            price,
            open: quote.open,
            change: price / quote.open - 1,
            dir: price > quote.price ? 1 : -1,
            tick: quote.tick + 1,
          };
        }
        return next;
      });
    }, TICK_MS);

    return () => clearInterval(id);
  }, [seed]);

  return <QuoteContext.Provider value={quotes}>{children}</QuoteContext.Provider>;
}

export function useQuote(symbol: string): Quote | undefined {
  const context = useContext(QuoteContext);
  return context ? context[symbol] : undefined;
}
