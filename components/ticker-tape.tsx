"use client";

import FeedBadge from "@/components/feed-badge";
import { useFeedMeta, useQuote } from "@/components/live-prices";
import { fmtPct, fmtPrice, type Row } from "@/lib/market";

function TapeItem({ row }: { row: Row }) {
  const quote = useQuote(row.symbol);
  const price = quote?.price ?? row.price;
  const change = quote?.change ?? row.change24h;
  const flash = quote?.dir && quote.dir > 0 ? "flash-up" : quote?.dir && quote.dir < 0 ? "flash-down" : "";

  return (
    <span className="flex items-center gap-2 whitespace-nowrap text-xs">
      <span className="font-mono font-semibold tracking-wide text-bone/90">{row.symbol}</span>
      <span key={`tp-${quote?.tick ?? 0}`} className={`inline-block font-mono tabular-nums text-muted ${flash}`}>
        {fmtPrice(price)}
      </span>
      <span
        key={`tc-${quote?.tick ?? 0}`}
        className={`inline-block font-mono tabular-nums ${change >= 0 ? "text-up" : "text-down"} ${flash}`}
      >
        {fmtPct(change)}
      </span>
      <span className="text-line">|</span>
    </span>
  );
}

export default function TickerTape({ rows }: { rows: Row[] }) {
  const { mode } = useFeedMeta();
  const doubled = [...rows, ...rows];

  return (
    <div className="overflow-hidden border-y border-line/70 bg-ink-900/70">
      <div className="flex items-stretch">
        <div className="z-10 flex shrink-0 items-center gap-1.5 border-r border-line/70 bg-ink-900 px-3">
          <span
            className={`live-dot h-1.5 w-1.5 rounded-full ${mode === "live" ? "bg-up" : "bg-gold"}`}
            aria-hidden="true"
          />
          <FeedBadge className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted" />
        </div>
        <div className="marquee-track flex items-center gap-8 py-2.5">
          {doubled.map((row, i) => (
            <TapeItem key={`${row.symbol}-${i}`} row={row} />
          ))}
        </div>
      </div>
    </div>
  );
}
