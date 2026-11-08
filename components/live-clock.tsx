"use client";

import { useEffect, useState } from "react";

function formatUtc(date: Date): string {
  return date.toLocaleTimeString("en-GB", {
    timeZone: "UTC",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function sessionFor(date: Date): { label: string; tone: string } {
  const day = date.getUTCDay();
  const minutes = date.getUTCHours() * 60 + date.getUTCMinutes();

  if (day === 0 || day === 6) return { label: "Closed · weekend", tone: "text-muted border-line" };
  if (minutes >= 810 && minutes < 1200) return { label: "US session", tone: "text-up border-up/40 bg-up/10" };
  if (minutes >= 540 && minutes < 810) return { label: "Pre-market", tone: "text-gold border-gold/40 bg-gold/10" };
  if (minutes >= 1200) return { label: "After hours", tone: "text-gold border-gold/40 bg-gold/10" };
  return { label: "Overnight", tone: "text-muted border-line" };
}

export default function LiveClock({ compact = false }: { compact?: boolean }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const session = now ? sessionFor(now) : null;

  return (
    <div className="flex items-center gap-2 text-xs" title={now ? now.toUTCString() : undefined}>
      <span className="live-dot h-1.5 w-1.5 shrink-0 rounded-full bg-up" aria-hidden="true" />
      <span className="font-mono tabular-nums text-bone/90">
        {now ? formatUtc(now) : "--:--:--"}
        <span className="ml-1 text-muted">UTC</span>
      </span>
      {!compact && session && (
        <span className={`rounded-full border px-2 py-0.5 text-[10px] ${session.tone}`}>{session.label}</span>
      )}
    </div>
  );
}
