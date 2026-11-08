import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import TrendChart from "@/components/trend-chart";
import ScoreDial from "@/components/score-dial";
import WatchlistButton from "@/components/watchlist-button";
import LiveClock from "@/components/live-clock";
import { LivePrice, LiveChange } from "@/components/live-price";
import { ARTICLES } from "@/lib/content";
import {
  ASSETS,
  ASSET_BY_SYMBOL,
  fmtPct,
  fmtPrice,
  metricsFor,
  narrativeFor,
  scoreBreakdown,
  series,
  stanceColor,
  type Kind,
} from "@/lib/market";

const KIND_PATH: Record<Kind, string> = {
  stock: "/markets",
  crypto: "/crypto",
  meme: "/meme-coins",
};

const KIND_LABEL: Record<Kind, string> = {
  stock: "Equities",
  crypto: "Digital assets",
  meme: "Meme coins",
};

export function generateStaticParams() {
  return ASSETS.map((asset) => ({ symbol: asset.symbol }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ symbol: string }>;
}): Promise<Metadata> {
  const { symbol } = await params;
  const asset = ASSET_BY_SYMBOL[symbol];
  if (!asset) return { title: "Asset not found" };
  return {
    title: `${asset.symbol} trend score and stance`,
    description: `${asset.name}: composite trend score, stance, risk grade and invalidation level. ${asset.blurb.slice(0, 110)}`,
  };
}

export default async function TickerPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params;
  const asset = ASSET_BY_SYMBOL[symbol];
  if (!asset) notFound();

  const m = metricsFor(asset);
  const pts = series(asset);
  const narrative = narrativeFor(asset, m);
  const breakdown = scoreBreakdown(m);
  const related = ARTICLES.filter((a) => a.tickers.includes(asset.symbol)).slice(0, 3);
  const peers = ASSETS.filter((a) => a.kind === asset.kind && a.symbol !== asset.symbol).slice(0, 4);

  const trigger =
    m.score >= 47
      ? { label: "Model invalidation", value: Math.min(m.sma20, m.sma50) * 0.975, note: "A close below this level ends the constructive read." }
      : { label: "Model re-entry", value: Math.max(m.sma20, m.sma50) * 1.02, note: "A close above this level would put the trend back on the long side." };

  return (
    <div>
      <div className="border-b border-line/60 bg-ink-900/40">
        <div className="mx-auto max-w-7xl px-5 py-4">
          <nav className="flex items-center gap-2 text-xs text-muted">
            <Link href="/" className="hover:text-bone">Home</Link>
            <span className="text-line">/</span>
            <Link href={KIND_PATH[asset.kind]} className="hover:text-bone">{KIND_LABEL[asset.kind]}</Link>
            <span className="text-line">/</span>
            <span className="text-bone/80">{asset.symbol}</span>
          </nav>
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-5 pt-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-4xl text-bone">{asset.symbol}</h1>
              <span className={`rounded-full border px-2.5 py-1 text-[11px] ${stanceColor(m.stance)}`}>
                {m.stance}
              </span>
              <span className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted">
                {asset.group}
              </span>
              <span className="rounded-full border border-line px-2.5 py-1 text-[11px] text-muted">
                Risk: {m.riskGrade}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">{asset.name}</p>

            <div className="mt-5 flex flex-wrap items-end gap-4">
              <span className="font-mono text-4xl text-bone">
                <LivePrice symbol={asset.symbol} base={m.last} />
              </span>
              <span className="pb-1.5 font-mono text-sm">
                <LiveChange symbol={asset.symbol} change={m.change24h} />{" "}
                <span className="text-muted">today</span>
              </span>
              <span className="flex items-center gap-2 pb-1.5">
                <LiveClock compact />
                <span className="text-[11px] text-muted/70">simulated feed</span>
              </span>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 lg:items-end">
            <WatchlistButton symbol={asset.symbol} />
            <p className="max-w-xs text-xs leading-relaxed text-muted lg:text-right">
              Report regenerates daily from the published scoring model. No position is disclosed
              because we hold none.
            </p>
          </div>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-5">
          {[
            { label: "24h", value: m.change24h },
            { label: "7d", value: m.change7d },
            { label: "30d", value: m.change30d },
            { label: "90d", value: m.change90d },
            { label: "1y", value: m.change1y },
          ].map((item) => (
            <div key={item.label} className="bg-ink-900 px-4 py-3.5">
              <p className="text-[10px] uppercase tracking-[0.14em] text-muted">{item.label}</p>
              <p className={`mt-1 font-mono text-sm ${item.value >= 0 ? "text-up" : "text-down"}`}>
                {fmtPct(item.value)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[1.65fr_0.85fr]">
        <div className="space-y-8">
          <div className="rounded-xl border border-line bg-ink-900/50 p-5">
            <TrendChart values={pts.map((p) => p.close)} label={`${asset.symbol} · daily close`} />
          </div>

          <div>
            <h2 className="font-display text-2xl text-bone">What the tape is saying</h2>
            <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-muted">
              {narrative.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-xl border border-up/25 bg-up/[0.04] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-up">Bull case</p>
              <ul className="mt-3 space-y-2.5">
                {asset.bull.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-relaxed text-bone/85">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-up" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-down/25 bg-down/[0.04] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-down">Bear case</p>
              <ul className="mt-3 space-y-2.5">
                {asset.bear.map((item) => (
                  <li key={item} className="flex gap-2 text-sm leading-relaxed text-bone/85">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-down" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-ink-900 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">What would change the call</p>
            <div className="mt-3 flex flex-wrap items-end gap-x-8 gap-y-3">
              <div>
                <p className="text-xs text-muted">{trigger.label}</p>
                <p className="font-mono text-2xl text-bone">{fmtPrice(trigger.value)}</p>
              </div>
              <p className="max-w-sm text-sm leading-relaxed text-muted">{trigger.note}</p>
            </div>
          </div>

          <div>
            <h2 className="font-display text-2xl text-bone">Context</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">{asset.blurb}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {asset.catalysts.map((c) => (
                <span key={c} className="rounded-full border border-line bg-ink-900 px-3 py-1.5 text-xs text-muted">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-line bg-ink-900/70 p-5">
            <ScoreDial score={m.score} stance={m.stance} confidence={m.confidence} />
            <div className="mt-5 space-y-3 border-t border-line/60 pt-4">
              {breakdown.map((row) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted">{row.label}</span>
                    <span className="font-mono text-bone/80">{row.value}</span>
                  </div>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-line">
                    <div
                      className={`h-full rounded-full ${row.value >= 66 ? "bg-up" : row.value >= 47 ? "bg-gold" : "bg-down"}`}
                      style={{ width: `${row.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-line bg-ink-900/70 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Risk panel</p>
            <dl className="mt-3 space-y-2.5 text-sm">
              {[
                { k: "Realised volatility", v: `${(m.vol * 100).toFixed(0)}%` },
                { k: "Risk grade", v: m.riskGrade },
                { k: "14-day RSI", v: m.rsi.toFixed(0) },
                { k: "52-week position", v: `${m.percentile}%` },
                { k: "52-week low", v: fmtPrice(m.low52) },
                { k: "52-week high", v: fmtPrice(m.high52) },
                { k: "50-day average", v: fmtPrice(m.sma50) },
                { k: "200-day average", v: fmtPrice(m.sma200) },
              ].map((row) => (
                <div key={row.k} className="flex items-center justify-between border-b border-line/50 pb-2 last:border-0">
                  <dt className="text-xs text-muted">{row.k}</dt>
                  <dd className="font-mono text-xs text-bone">{row.v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-gradient-to-r from-down via-gold to-up"
                style={{ width: `${m.percentile}%` }}
              />
            </div>
            <p className="mt-2 text-[10px] text-muted/70">Position within the 52-week range</p>
          </div>

          <div className="rounded-xl border border-gold/30 bg-gold/[0.05] p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">Premium desk note</p>
            <p className="mt-3 text-sm leading-relaxed text-bone/85">
              When the score sits between 45 and 60, the honest answer is that the tape has no edge.
              Premium subscribers get the full sizing worksheet and the historical hit rate of this
              exact score band for {asset.symbol}.
            </p>
            <Link
              href="/pricing"
              className="mt-4 inline-block rounded-full bg-gold px-4 py-2 text-xs font-semibold text-ink-950 transition hover:bg-gold-bright"
            >
              Unlock the desk note
            </Link>
          </div>

          {related.length > 0 && (
            <div className="rounded-xl border border-line bg-ink-900/70 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Related research</p>
              <ul className="mt-3 space-y-3">
                {related.map((article) => (
                  <li key={article.slug}>
                    <Link href={`/research/${article.slug}`} className="group block">
                      <p className="text-sm leading-snug text-bone/90 group-hover:text-gold-bright">
                        {article.title}
                      </p>
                      <p className="mt-1 text-[11px] text-muted">
                        {article.readMinutes} min · {article.author}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-xl border border-line bg-ink-900/70 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Peers</p>
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {peers.map((peer) => (
                <li key={peer.symbol}>
                  <Link
                    href={`/ticker/${peer.symbol}`}
                    className="flex items-center justify-between rounded-md border border-line/70 px-2.5 py-2 text-xs text-bone transition hover:border-gold/40 hover:text-gold-bright"
                  >
                    <span className="font-mono">{peer.symbol}</span>
                    <span className="text-muted">{metricsFor(peer).score}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-4">
        <p className="rounded-lg border border-line/70 bg-ink-900/40 px-4 py-3 text-[11px] leading-relaxed text-muted/70">
          This report is market analysis and education, not investment advice. It contains no
          recommendation to transact. Figures are generated from a deterministic sample dataset for
          this demonstration build and are not live prices. See the{" "}
          <Link href="/disclaimer" className="text-bone/80 underline decoration-line underline-offset-2">
            methodology
          </Link>{" "}
          for how scores are calculated.
        </p>
      </section>
    </div>
  );
}
