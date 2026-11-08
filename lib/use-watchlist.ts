"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "nws.watchlist.v1";
const EVENT = "nws:watchlist-change";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

export function useWatchlist() {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSymbols(read());
    setReady(true);
    const sync = () => setSymbols(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const write = useCallback((next: string[]) => {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — keep in-memory state only */
    }
    setSymbols(next);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const toggle = useCallback(
    (symbol: string) => {
      const current = read();
      const next = current.includes(symbol)
        ? current.filter((s) => s !== symbol)
        : [...current, symbol];
      write(next);
    },
    [write],
  );

  const has = useCallback((symbol: string) => symbols.includes(symbol), [symbols]);

  return { symbols, ready, toggle, has };
}
