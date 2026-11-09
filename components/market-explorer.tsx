"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Sparkline from "@/components/sparkline";
import WatchlistButton from "@/components/watchlist-button";
import { LivePrice, LiveChange } from "@/components/live-price";
import { fmtPct, stanceColor, type Row } from "@/lib/market";

type SortKey = "score" | "change24h" | "change30d" | "name";

const STANCES = ["All", "Buy", "Accumulate", "Hold", "Trim", "Avoid"] as const;

export default function MarketExplorer({ rows }: { rows: Row[] }) {
  const [query, setQuery] = useState("");
  const [stance, setStance] = useState<(typeof STANCES)[number]>("All");
  const [sort, setSort] = useState<SortKey>("score");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = rows.filter((row) => {
      const matchesQuery =
        !q ||
        row.symbol.toLowerCase().includes(q) ||
        row.name.toLowerCase().includes(q) ||
        row.group.toLowerCase().includes(q);
      const matchesStance = stance === "All" || row.stance === stance;
      return matchesQuery && matchesStance;
    });

    return [...list].sort((a, b) => {
      if (sort === "name") return a.symbol.localeCompare(b.symbol);
      return (b[sort] as number) - (a[sort] as number);
    });
  }, [rows, query, stance, sort]);

  return (
    <div>
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {STANCES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStance(s)}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                stance === s
                  ? "border-gold/50 bg-gold/10 text-gold-bright"
                  : "border-line text-muted hover:border-line hover:text-bone"
              }`}
            >
              {s}
            </button>
          ))}
          <span className="ml-1 inline-flex items-center gap-1.5 rounded-full border border-up/30 bg-up/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-up">
            <span className="live-dot h-1 w-1 rounded-full bg-up" aria-hidden="true" />
            Live
          </span>
        </div>

        <div className="flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search symbol, name or theme"
            className="w-full rounded-full border border-line bg-ink-900 px-4 py-2 text-sm text-bone placeholder:text-muted/70 focus:border-gold/50 focus:outline-none lg:w-64"
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border border-line bg-ink-900 px-3 py-2 text-xs text-bone focus:border-gold/50 focus:outline-none"
            aria-label="Sort assets"
          >
            <option value="score">Sort: score</option>
            <option value="change24h">Sort: 24h</option>
            <option value="change30d">Sort: 30d</option>
            <option value="name">Sort: symbol</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-line">
        <table className="w-full text-left">
          <thead className="bg-ink-900 text-[10px] uppercase tracking-[0.16em] text-muted">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Asset</th>
              <th className="hidden px-4 py-3 text-left font-medium sm:table-cell">Theme</th>
              <th className="px-4 py-3 text-right font-medium">Price</th>
              <th className="px-4 py-3 text-right font-medium">24h</th>
              <th className="hidden px-4 py-3 text-right font-medium md:table-cell">30d</th>
              <th className="hidden px-4 py-3 font-medium lg:table-cell">Trend</th>
              <th className="px-4 py-3 text-right font-medium">Score</th>
              <th className="px-4 py-3 text-right font-medium">Stance</th>
              <th className="hidden px-4 py-3 md:table-cell" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line/70">
            {filtered.map((row) => (
              <tr key={row.symbol} className="group transition-colors hover:bg-ink-850/60">
                <td className="px-4 py-3.5">
                  <Link href={`/ticker/${row.symbol}`} className="flex items-center gap-3">
                    <span className="flex flex-col">
                      <span className="font-mono text-sm font-semibold text-bone group-hover:text-gold-bright">
                        {row.symbol}
                      </span>
                      <span className="text-xs text-muted">{row.name}</span>
                    </span>
                  </Link>
                </td>
                <td className="hidden px-4 py-3.5 text-xs text-muted sm:table-cell">{row.group}</td>
                <td className="px-4 py-3.5 text-right font-mono text-sm text-bone">
                  <LivePrice symbol={row.symbol} base={row.price} />
                </td>
                <td className="px-4 py-3.5 text-right font-mono text-sm">
                  <LiveChange symbol={row.symbol} change={row.change24h} />
                </td>
                <td className={`hidden px-4 py-3.5 text-right font-mono text-sm md:table-cell ${row.change30d >= 0 ? "text-up" : "text-down"}`}>
                  {fmtPct(row.change30d)}
                </td>
                <td className="hidden px-4 py-3.5 lg:table-cell">
                  <Sparkline values={row.spark} width={90} />
                </td>
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <div className="hidden h-1 w-14 overflow-hidden rounded-full bg-line sm:block">
                      <div
                        className={`h-full rounded-full ${row.score >= 66 ? "bg-up" : row.score >= 47 ? "bg-gold" : "bg-down"}`}
                        style={{ width: `${row.score}%` }}
                      />
                    </div>
                    <span className="font-mono text-sm text-bone">{row.score}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <span className={`inline-block rounded-full border px-2.5 py-1 text-[11px] ${stanceColor(row.stance)}`}>
                    {row.stance}
                  </span>
                </td>
                <td className="hidden px-4 py-3.5 text-right md:table-cell">
                  <WatchlistButton symbol={row.symbol} compact />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!filtered.length && (
          <p className="px-4 py-10 text-center text-sm text-muted">
            No assets match that filter. Try a different stance or clear the search.
          </p>
        )}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-muted/70">
        Quotes come from public market endpoints and refresh about once a minute; equity prices are
        delayed. Scores are outputs of the fixed, published methodology (see{" "}
        <Link href="/disclaimer" className="text-bone/80 underline decoration-line underline-offset-2 hover:text-gold-bright">
          methodology
        </Link>
        ), not predictions.
      </p>
    </div>
  );
}
