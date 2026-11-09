import Link from "next/link";
import MarketExplorer from "@/components/market-explorer";
import UniverseTable from "@/components/universe-table";
import { byKind, metricsFor, rowsFor, universeFor, type Kind } from "@/lib/market";
import { ensureMarketData } from "@/lib/market-data";

const COPY: Record<
  Kind,
  { eyebrow: string; title: string; sub: string; note: string; stats: { label: string; hint: string }[] }
> = {
  stock: {
    eyebrow: "Equity coverage",
    title: "US equities, scored on trend",
    sub: "The 800 most liquid US names by market cap (S&P 500 + Nasdaq), with the 12 most-covered franchises scored in depth. Every price here comes from a live quote, and every score from real daily closes.",
    note: "Coverage is deliberately concentrated: twelve names we can maintain a view on, surfaced inside an 800-name universe you can scan and drill into.",
    stats: [
      { label: "Names covered", hint: "top 800 by market cap" },
      { label: "Median score", hint: "cross-sector" },
      { label: "Above 50-day", hint: "trend participation" },
      { label: "Avg. volatility", hint: "60-day realised" },
    ],
  },
  crypto: {
    eyebrow: "Digital assets",
    title: "Digital assets, without the narrative tax",
    sub: "800 digital assets listed on Coinbase Exchange, Binance and OKX, led by Bitcoin, Ethereum and the infrastructure layers where real usage settles. Valued on flow, float and liquidity — the only durable variables in an asset class with no cash flows.",
    note: "Crypto has no valuation floor. It has a liquidity ceiling. Every stance here is sized around that difference.",
    stats: [
      { label: "Assets covered", hint: "L1s, L2s, oracles" },
      { label: "Median score", hint: "sector composite" },
      { label: "Above 50-day", hint: "trend participation" },
      { label: "Avg. volatility", hint: "60-day realised" },
    ],
  },
  meme: {
    eyebrow: "Speculative markets",
    title: "Meme coins, graded as risk — not investments",
    sub: "174 meme coins — every Coinbase-listed pair plus Pump.fun trending tokens priced live on DexScreener, graded on the tape. There is no fundamental case to make here: only concentration, depth and narrative half-life.",
    note: "Our conviction ceiling for this sector is deliberately low. A high score means the tape is working, not that the asset is sound.",
    stats: [
      { label: "Assets covered", hint: "attention markets" },
      { label: "Median score", hint: "sector composite" },
      { label: "Above 50-day", hint: "trend participation" },
      { label: "Avg. volatility", hint: "60-day realised" },
    ],
  },
};

export default async function CoveragePage({ kind }: { kind: Kind }) {
  await ensureMarketData();
  const copy = COPY[kind];
  const rows = rowsFor(kind);
  const metrics = byKind(kind).map((a) => metricsFor(a));
  const median = [...metrics].sort((a, b) => a.score - b.score)[Math.floor(metrics.length / 2)]?.score ?? 0;
  const above50 = metrics.filter((m) => m.last > m.sma50).length;
  const avgVol = metrics.reduce((a, m) => a + m.vol, 0) / metrics.length;
  const universe = universeFor(kind);
  const values = [universe.length, median, `${above50}/${metrics.length}`, `${(avgVol * 100).toFixed(0)}%`];

  return (
    <div>
      <section className="grain border-b border-line/60">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">{copy.eyebrow}</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-tight text-bone sm:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted">{copy.sub}</p>

          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-4">
            {copy.stats.map((stat, i) => (
              <div key={stat.label} className="bg-ink-900 px-5 py-4">
                <dd className="font-mono text-2xl text-bone">{values[i]}</dd>
                <dt className="mt-1 text-xs text-muted">{stat.label}</dt>
                <p className="mt-0.5 text-[10px] uppercase tracking-[0.12em] text-muted/60">{stat.hint}</p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <MarketExplorer rows={rows} />
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16">
        <h2 className="mb-6 font-display text-2xl text-bone">
          Full {copy.eyebrow.toLowerCase()} universe — {universe.length} real assets
        </h2>
        <UniverseTable symbols={universe.map((a) => ({ symbol: a.symbol, name: a.name }))} />
      </section>

      <section className="mx-auto max-w-7xl px-5">
        <div className="rounded-xl border border-line bg-ink-900/60 p-7 lg:p-9">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">Desk note</p>
          <p className="mt-3 max-w-3xl font-display text-xl leading-relaxed text-bone/90">{copy.note}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/disclaimer"
              className="rounded-full border border-line px-4 py-2 text-xs text-bone transition hover:border-gold/40"
            >
              Read the scoring methodology
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-gold/50 bg-gold/10 px-4 py-2 text-xs font-medium text-gold-bright transition hover:bg-gold/20"
            >
              Unlock full stance reports
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
