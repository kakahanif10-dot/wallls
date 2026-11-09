"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import FeedBadge from "@/components/feed-badge";
import { fmtPct, fmtPrice } from "@/lib/market";

const PAGE_SIZE = 50;
const POLL_MS = 30_000;

type Quote = {
  price: number;
  change: number;
  previousClose: number;
  delayed: boolean;
  provider: string;
};

export default function UniverseTable({
  symbols,
}: {
  symbols: { symbol: string; name: string }[];
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
  const [loading, setLoading] = useState(true);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return symbols;
    return symbols.filter(
      (s) =>
        s.symbol.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q),
    );
  }, [query, symbols]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pages - 1);
  const slice = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const load = useCallback(async () => {
    if (!slice.length) {
      setLoading(false);
      return;
    }
    const param = slice.map((s) => s.symbol).join(",");
    try {
      const res = await fetch(`/api/quotes?symbols=${encodeURIComponent(param)}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (data.quotes) setQuotes((prev) => ({ ...prev, ...data.quotes }));
    } catch {
      // Keep last real values; the badge reports when the feed is down.
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slice.map((s) => s.symbol).join(",")]);

  useEffect(() => {
    load();
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  }, [load]);

  useEffect(() => {
    setPage(0);
  }, [query]);

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">
          <span className="font-mono text-bone">{filtered.length}</span> assets tracked — prices from real
          quotes, delayed where the exchange is.
        </p>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search symbol or name"
          className="w-full rounded-full border border-line bg-ink-900 px-4 py-2 text-sm text-bone placeholder:text-muted/70 focus:border-gold/50 focus:outline-none sm:w-64"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-line">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-ink-900/70 text-[11px] uppercase tracking-[0.12em] text-muted">
              <th className="px-4 py-3 font-medium">Asset</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Price</th>
              <th className="px-4 py-3 font-medium">24h</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Feed</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line/50">
            {slice.map(({ symbol, name }) => {
              const q = quotes[symbol];
              const up = (q?.change ?? 0) >= 0;
              return (
                <tr key={symbol} className="transition-colors hover:bg-ink-900/50">
                  <td className="px-4 py-3">
                    <Link href={`/ticker/${symbol}`} className="block">
                      <span className="font-mono text-bone">{symbol}</span>
                      <span className="mt-0.5 block max-w-[220px] truncate text-xs text-muted">
                        {name}
                      </span>
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3 font-mono text-bone/90 sm:table-cell">
                    {q ? fmtPrice(q.price) : <span className="text-muted/60">{loading ? "…" : "—"}</span>}
                  </td>
                  <td className={`px-4 py-3 font-mono ${up ? "text-up" : "text-down"}`}>
                    {q ? fmtPct(q.change) : <span className="text-muted/60">—</span>}
                  </td>
                  <td className="hidden px-4 py-3 text-xs text-muted/80 md:table-cell">
                    {q ? `${q.provider}${q.delayed ? " · delayed" : ""}` : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/ticker/${symbol}`}
                      className="text-xs text-gold transition-colors hover:text-gold-bright"
                    >
                      Open score →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted">
        <span>
          Page {safePage + 1} of {pages}
        </span>
        <div className="flex items-center gap-2">
          <FeedBadge className="mr-2 text-[11px] text-muted/70" />
          <button
            type="button"
            disabled={safePage === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="rounded-full border border-line px-3 py-1.5 text-bone disabled:opacity-40"
          >
            Prev
          </button>
          <button
            type="button"
            disabled={safePage >= pages - 1}
            onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
            className="rounded-full border border-line px-3 py-1.5 text-bone disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
