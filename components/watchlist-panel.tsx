"use client";

import Link from "next/link";
import Sparkline from "@/components/sparkline";
import { useWatchlist } from "@/lib/use-watchlist";
import { LivePrice, LiveChange } from "@/components/live-price";
import { stanceColor, type Row } from "@/lib/market";

export default function WatchlistPanel({ rows }: { rows: Row[] }) {
  const { symbols, ready, toggle } = useWatchlist();
  const tracked = rows.filter((r) => symbols.includes(r.symbol));

  if (!ready) {
    return <p className="text-sm text-muted">Loading your watchlist…</p>;
  }

  if (!tracked.length) {
    return (
      <div className="rounded-xl border border-dashed border-line bg-ink-900/60 p-10 text-center">
        <p className="font-display text-xl text-bone">Your watchlist is empty</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
          Add assets from any coverage page or from an individual trend report. Your watchlist is
          stored in this browser only — no account required.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/markets"
            className="rounded-full bg-gold px-4 py-2 text-sm font-medium text-ink-950 transition hover:bg-gold-bright"
          >
            Browse equities
          </Link>
          <Link
            href="/crypto"
            className="rounded-full border border-line px-4 py-2 text-sm text-bone transition hover:border-gold/40"
          >
            Browse crypto
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <table className="w-full text-left">
        <thead className="bg-ink-900 text-[10px] uppercase tracking-[0.16em] text-muted">
          <tr>
            <th className="px-4 py-3 font-medium">Asset</th>
            <th className="px-4 py-3 text-right font-medium">Price</th>
            <th className="hidden px-4 py-3 text-right font-medium sm:table-cell">24h</th>
            <th className="hidden px-4 py-3 font-medium md:table-cell">60-day</th>
            <th className="px-4 py-3 text-right font-medium">Score</th>
            <th className="px-4 py-3 text-right font-medium">Stance</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-line/70">
          {tracked.map((row) => (
            <tr key={row.symbol} className="group transition-colors hover:bg-ink-850/60">
              <td className="px-4 py-3.5">
                <Link href={`/ticker/${row.symbol}`} className="flex flex-col">
                  <span className="font-mono text-sm font-semibold text-bone group-hover:text-gold-bright">
                    {row.symbol}
                  </span>
                  <span className="text-xs text-muted">{row.name}</span>
                </Link>
              </td>
              <td className="px-4 py-3.5 text-right font-mono text-sm text-bone">
                <LivePrice symbol={row.symbol} base={row.price} />
              </td>
              <td className="hidden px-4 py-3.5 text-right font-mono text-sm sm:table-cell">
                <LiveChange symbol={row.symbol} change={row.change24h} />
              </td>
              <td className="hidden px-4 py-3.5 md:table-cell">
                <Sparkline values={row.spark} />
              </td>
              <td className="px-4 py-3.5 text-right font-mono text-sm text-bone">{row.score}</td>
              <td className="px-4 py-3.5 text-right">
                <span className={`inline-block rounded-full border px-2.5 py-1 text-[11px] ${stanceColor(row.stance)}`}>
                  {row.stance}
                </span>
              </td>
              <td className="px-4 py-3.5 text-right">
                <button
                  type="button"
                  onClick={() => toggle(row.symbol)}
                  className="text-xs text-muted transition hover:text-down"
                  aria-label={`Remove ${row.symbol} from watchlist`}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
