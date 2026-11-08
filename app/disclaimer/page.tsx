import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Methodology, terms and risk disclosure",
  description:
    "How NextWall Street computes trend scores, what the stance bands mean, and the full risk disclosure for our research and education products.",
};

const WEIGHTS = [
  { input: "Price vs 20-day average", weight: "22%", reads: "Short-term positioning" },
  { input: "20-day vs 50-day average", weight: "20%", reads: "Medium-term direction" },
  { input: "50-day vs 200-day average", weight: "18%", reads: "Structural regime" },
  { input: "30-session rate of change", weight: "25%", reads: "Momentum persistence" },
  { input: "RSI positioning (14-day)", weight: "15%", reads: "Stretch within the trend" },
];

const BANDS = [
  { band: "78 – 100", stance: "Buy", meaning: "Trend is established across all horizons. Size normally, manage against the invalidation level." },
  { band: "66 – 77", stance: "Accumulate", meaning: "Trend is improving but not confirmed. Scale in on strength, keep the position below target." },
  { band: "47 – 65", stance: "Hold", meaning: "No directional edge. Existing positions may be held; new entries have no statistical support." },
  { band: "34 – 46", stance: "Trim", meaning: "Trend is deteriorating. Reduce exposure and require a reclaim before re-engaging." },
  { band: "0 – 33", stance: "Avoid", meaning: "Downtrend across horizons. Counter-trend rallies are exits, not entries." },
];

export default function DisclaimerPage() {
  return (
    <div>
      <section className="grain border-b border-line/60">
        <div className="mx-auto max-w-4xl px-5 py-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">Transparency</p>
          <h1 className="mt-3 font-display text-4xl leading-tight text-bone">
            Methodology, terms and risk disclosure
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-muted">
            If you cannot audit the model, you cannot rely on it. This page publishes the score
            construction, the stance bands and the limits of what we do.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-12">
        <h2 className="font-display text-2xl text-bone">1. How the trend score is built</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Each input is normalised to a 0–100 scale and combined with fixed weights. Weights changed
          only once since inception; every change is logged for Institutional subscribers. Momentum
          carries the largest weight because it leads price, while the 200-day relationship is treated
          as a regime filter rather than a signal.
        </p>

        <div className="mt-6 overflow-hidden rounded-xl border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-ink-900 text-[10px] uppercase tracking-[0.14em] text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Input</th>
                <th className="px-4 py-3 text-center font-medium">Weight</th>
                <th className="px-4 py-3 font-medium">What it reads</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {WEIGHTS.map((w) => (
                <tr key={w.input}>
                  <td className="px-4 py-3 text-bone/85">{w.input}</td>
                  <td className="px-4 py-3 text-center font-mono text-xs text-gold">{w.weight}</td>
                  <td className="px-4 py-3 text-muted">{w.reads}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="mt-12 font-display text-2xl text-bone">2. What the stance bands mean</h2>
        <div className="mt-5 space-y-2.5">
          {BANDS.map((b) => (
            <div key={b.stance} className="rounded-lg border border-line bg-ink-900/50 px-4 py-3">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-mono text-xs text-muted">{b.band}</span>
                <span className="font-display text-base text-bone">{b.stance}</span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-muted">{b.meaning}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-12 font-display text-2xl text-bone">3. Conviction, risk and sizing</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Conviction scales with the distance of the score from neutral and with position in the
          52-week range; it never implies certainty. Risk grade is derived from 60-day realised
          volatility and drives position sizing guidance. A high-volatility asset receives a
          proportionally smaller notional for the same risk contribution — that is the entire point of
          grading it.
        </p>

        <h2 className="mt-12 font-display text-2xl text-bone">4. Data in this build</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          This deployment runs on a deterministic sample dataset generated from a fixed seed per
          asset. It is internally consistent and stable, which makes the product demonstrable end to
          end, but it is <strong className="text-bone/90">not live market data</strong> and must not be
          used for trading decisions. Production requires a licensed market-data feed and a reviewed
          pricing and distribution agreement.
        </p>

        <h2 className="mt-12 font-display text-2xl text-bone">5. Risk disclosure</h2>
        <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
          <p>
            NextWall Street publishes market analysis and educational material only. Nothing on this
            site constitutes investment advice, a personal recommendation, a solicitation, or an offer
            to buy or sell any security, token, derivative or other financial instrument. We do not
            manage client money, we do not execute orders, and we hold no positions in the assets we
            cover.
          </p>
          <p>
            Investing and trading involve a substantial risk of loss, up to and including the total
            loss of capital. Leverage amplifies both gains and losses. Speculative assets, including
            meme coins and small-cap tokens, can lose their entire value and may be subject to
            liquidity constraints, custody risk or fraud. Past performance does not predict future
            results, and no model — including ours — has a guaranteed edge.
          </p>
          <p>
            Scores are mechanical outputs from historical price data. They do not account for your
            circumstances, tax position, objectives, time horizon or risk tolerance. Where a decision
            matters, consult a licensed financial adviser in your jurisdiction. You are responsible for
            your own due diligence and for every order you place.
          </p>
          <p>
            Information is provided in good faith from what we believe to be reliable sources, but no
            warranty is given as to accuracy, completeness or timeliness, and content may become
            outdated without notice. Where affiliate or sponsorship relationships exist in future, they
            will be disclosed on the piece itself.
          </p>
        </div>

        <div className="mt-10 rounded-xl border border-line bg-ink-900/50 p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">Questions</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Methodology questions are welcome and answered by the desk. See{" "}
            <Link href="/research" className="text-bone/85 underline decoration-line underline-offset-2 hover:text-gold-bright">
              research
            </Link>{" "}
            for recent pieces or{" "}
            <Link href="/pricing" className="text-bone/85 underline decoration-line underline-offset-2 hover:text-gold-bright">
              plans
            </Link>{" "}
            for access.
          </p>
        </div>
      </section>
    </div>
  );
}
