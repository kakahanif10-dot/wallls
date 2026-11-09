"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import LiveClock from "@/components/live-clock";
import FeedBadge from "@/components/feed-badge";

const LINKS = [
  { href: "/markets", label: "Markets" },
  { href: "/crypto", label: "Crypto" },
  { href: "/meme-coins", label: "Meme coins" },
  { href: "/research", label: "Research" },
  { href: "/academy", label: "Academy" },
  { href: "/pricing", label: "Pricing" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-ink-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5">
        <Link href="/" className="group flex items-baseline gap-2" onClick={() => setOpen(false)}>
          <span className="font-display text-[1.35rem] tracking-tight text-bone">
            Next<span className="text-gold-bright">Wall</span>Street
          </span>
          <span className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-muted sm:inline">
            Research
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                isActive(link.href)
                  ? "bg-ink-800 text-bone"
                  : "text-muted hover:bg-ink-850 hover:text-bone"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <span className="h-4 w-px bg-line" />
          <LiveClock />
          <FeedBadge className="text-[10px] uppercase tracking-[0.14em] text-muted" />
          <span className="h-4 w-px bg-line" />
          <Link
            href="/watchlist"
            className="text-sm text-muted transition-colors hover:text-bone"
          >
            Watchlist
          </Link>
          <Link
            href="/pricing"
            className="rounded-full border border-gold/50 bg-gold/10 px-4 py-2 text-sm font-medium text-gold-bright transition-colors hover:bg-gold/20"
          >
            Subscribe
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-line text-bone lg:hidden"
        >
          <span className="sr-only">Menu</span>
          <div className="space-y-1.5">
            <span className={`block h-px w-5 bg-bone transition ${open ? "translate-y-[6px] rotate-45" : ""}`} />
            <span className={`block h-px w-5 bg-bone transition ${open ? "opacity-0" : ""}`} />
            <span className={`block h-px w-5 bg-bone transition ${open ? "-translate-y-[6px] -rotate-45" : ""}`} />
          </div>
        </button>
      </div>

      {open && (
        <nav className="border-t border-line/70 bg-ink-900 px-5 pb-5 pt-3 lg:hidden">
          <div className="mb-3 flex items-center justify-between border-b border-line/60 pb-3">
            <LiveClock />
            <FeedBadge className="text-[10px] uppercase tracking-[0.14em] text-muted" />
          </div>
          <div className="grid gap-1">
            {[...LINKS, { href: "/watchlist", label: "Watchlist" }].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-md px-3 py-2.5 text-sm ${
                  isActive(link.href) ? "bg-ink-800 text-bone" : "text-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
