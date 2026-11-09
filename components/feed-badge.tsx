"use client";

import { useFeedMeta } from "@/components/live-prices";

export default function FeedBadge({ className = "" }: { className?: string }) {
  const { mode, source, delayed } = useFeedMeta();

  const label =
    mode === "unavailable"
      ? "Data unavailable"
      : `${delayed ? "Delayed" : "Live"} · ${source || "market data"}`;

  return <span className={className}>{label}</span>;
}
