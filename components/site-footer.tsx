import Link from "next/link";

const COLUMNS = [
  {
    title: "Coverage",
    links: [
      { href: "/markets", label: "US equities" },
      { href: "/crypto", label: "Digital assets" },
      { href: "/meme-coins", label: "Meme coins" },
      { href: "/ticker/BTC", label: "Bitcoin trend score" },
      { href: "/ticker/NVDA", label: "NVIDIA trend score" },
    ],
  },
  {
    title: "Research",
    links: [
      { href: "/research", label: "All research" },
      { href: "/research/ai-capex-cycle-second-derivative", label: "AI capex cycle" },
      { href: "/research/bitcoin-liquidity-regime", label: "Bitcoin & liquidity" },
      { href: "/research/breadth-divergence-playbook", label: "Narrow market playbook" },
    ],
  },
  {
    title: "Academy",
    links: [
      { href: "/academy", label: "All courses" },
      { href: "/academy/reading-trends", label: "Reading a Trend" },
      { href: "/academy/crypto-without-hype", label: "Crypto Without Hype" },
      { href: "/academy/portfolio-construction", label: "Portfolio Construction" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/pricing", label: "Plans & pricing" },
      { href: "/watchlist", label: "Your watchlist" },
      { href: "/disclaimer", label: "Disclaimer & methodology" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line/70 bg-ink-900">
      <div className="mx-auto max-w-7xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="font-display text-xl text-bone">
              Next<span className="text-gold-bright">Wall</span>Street
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Rules-based trend analysis and research across equities, digital assets and
              speculative markets — plus the education to use it responsibly.
            </p>
            <p className="mt-5 text-xs leading-relaxed text-muted/70">
              1,774 tracked assets · 6 research desks · 4 courses
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-bone/75 transition-colors hover:text-gold-bright"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-line/70 pt-8">
          <p className="max-w-4xl text-xs leading-relaxed text-muted/80">
            <strong className="text-bone/80">Not investment advice.</strong> NextWall Street
            publishes market analysis and educational material only. Nothing here is a
            recommendation, solicitation or offer to buy or sell any security, token or derivative.
            Quotes are sourced from public market endpoints; equity prices are delayed and may be
            unavailable outside trading hours. Investing and trading involve
            substantial risk of loss, including total loss of capital. Past performance does not
            predict future results. Do your own research and consult a licensed adviser where
            appropriate.
          </p>
          <div className="mt-6 flex flex-col gap-3 text-xs text-muted/70 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} NextWall Street. All rights reserved.</p>
            <div className="flex gap-5">
              <Link href="/disclaimer" className="hover:text-bone">
                Methodology
              </Link>
              <Link href="/disclaimer" className="hover:text-bone">
                Terms
              </Link>
              <Link href="/disclaimer" className="hover:text-bone">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
