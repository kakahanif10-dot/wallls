"use client";

import { useQuote } from "@/components/live-prices";
import { fmtPct, fmtPrice } from "@/lib/market";

function flashFor(dir: number): string {
  if (dir > 0) return "flash-up";
  if (dir < 0) return "flash-down";
  return "";
}

export function LivePrice({
  symbol,
  base,
  className = "",
}: {
  symbol: string;
  base: number;
  className?: string;
}) {
  const quote = useQuote(symbol);
  const price = quote?.price ?? base;
  const flash = flashFor(quote?.dir ?? 0);

  return (
    <span
      key={`price-${quote?.tick ?? 0}`}
      className={`inline-block tabular-nums ${flash} ${className}`}
    >
      {fmtPrice(price)}
    </span>
  );
}

export function LiveChange({
  symbol,
  change,
  className = "",
}: {
  symbol: string;
  change: number;
  className?: string;
}) {
  const quote = useQuote(symbol);
  const value = quote?.change ?? change;
  const flash = flashFor(quote?.dir ?? 0);

  return (
    <span
      key={`change-${quote?.tick ?? 0}`}
      className={`inline-block tabular-nums ${flash} ${value >= 0 ? "text-up" : "text-down"} ${className}`}
    >
      {fmtPct(value)}
    </span>
  );
}
