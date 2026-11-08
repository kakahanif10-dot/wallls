"use client";

import { useState } from "react";

export default function PremiumGate({
  children,
  issue,
}: {
  children: React.ReactNode;
  issue: string;
}) {
  const [unlocked, setUnlocked] = useState(false);

  if (unlocked) {
    return (
      <div>
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-gold/30 bg-gold/5 px-4 py-2.5 text-xs text-gold-bright">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          Preview unlocked for this session. In production this issue is served to Premium
          subscribers only.
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="relative">
      <div aria-hidden="true" className="pointer-events-none max-h-72 select-none overflow-hidden opacity-60 blur-[3px]">
        {children}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 via-ink-950/90 to-transparent" />
      <div className="relative -mt-16 rounded-xl border border-line bg-ink-900/95 p-7 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">Premium research</p>
        <h3 className="mt-2 font-display text-2xl text-bone">Continue reading “{issue}”</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
          Full-position reasoning, invalidation levels and the model breakdown are available on the
          Premium plan.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/pricing"
            className="rounded-full bg-gold px-5 py-2.5 text-sm font-medium text-ink-950 transition hover:bg-gold-bright"
          >
            View plans
          </a>
          <button
            type="button"
            onClick={() => setUnlocked(true)}
            className="rounded-full border border-line px-5 py-2.5 text-sm text-bone transition hover:border-gold/40"
          >
            Preview this issue
          </button>
        </div>
        <p className="mt-4 text-[11px] text-muted/60">
          Demo build: checkout is not connected, so the preview button bypasses the paywall.
        </p>
      </div>
    </div>
  );
}
