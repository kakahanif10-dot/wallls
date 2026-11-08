import type { Metadata } from "next";
import Link from "next/link";
import { PLANS } from "@/lib/content";

export const metadata: Metadata = {
  title: "Plans and pricing",
  description:
    "Reader is free. Premium is $29/month for every research piece, stance and course. Institutional adds multi-seat access, signal history and API.",
};

const FAQ = [
  {
    q: "Is this investment advice?",
    a: "No. NextWall Street publishes market analysis and education. We describe what the tape is doing, how the model scores it and where the call breaks. We do not manage money, do not take positions in the names we cover and do not tell you what to buy.",
  },
  {
    q: "How are the trend scores calculated?",
    a: "A weighted composite of five inputs: price versus the 20-day, the 20-versus-50-day, the 50-versus-200-day, 30-session rate of change and RSI positioning. Weights are published on the methodology page, and each asset page shows the component breakdown.",
  },
  {
    q: "Do you cover meme coins seriously?",
    a: "Seriously, but not as investments. The sector has no cash flows, so we score concentration, order-book depth and narrative decay, and we cap conviction deliberately. Our coverage is designed to keep subscribers out of the worst outcomes, not to talk them into positions.",
  },
  {
    q: "Can I cancel?",
    a: "Yes, at any time, from the account page. Access continues until the end of the paid period and your watchlist stays intact.",
  },
  {
    q: "Do you offer a trial?",
    a: "Premium includes a 14-day trial with full access. No card is charged if you cancel before it ends.",
  },
];

export default function PricingPage() {
  return (
    <div>
      <section className="grain border-b border-line/60">
        <div className="mx-auto max-w-7xl px-5 py-14 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">Plans</p>
          <h1 className="mx-auto mt-4 max-w-2xl font-display text-4xl leading-tight text-bone sm:text-5xl">
            Analysis you can audit. Pricing without theatre.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted">
            One desk, one methodology, three ways to read it. No upsell to a “pro” tier that hides the
            part you actually need.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-5 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-xl border p-7 ${
                plan.highlight
                  ? "border-gold/50 bg-gradient-to-b from-gold/[0.08] to-ink-900"
                  : "border-line bg-ink-900/50"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-7 rounded-full bg-gold px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink-950">
                  Most popular
                </span>
              )}
              <h2 className="font-display text-2xl text-bone">{plan.name}</h2>
              <p className="mt-1 text-xs text-muted">{plan.tagline}</p>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-4xl text-bone">
                  {plan.price === 0 ? "Free" : `$${plan.price}`}
                </span>
                <span className="text-xs text-muted">{plan.cadence}</span>
              </div>

              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm leading-relaxed text-bone/80">
                    <span className={`mt-1.5 ${plan.highlight ? "text-gold" : "text-up"}`}>✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={`mt-7 w-full rounded-full px-5 py-3 text-sm font-semibold transition ${
                  plan.highlight
                    ? "bg-gold text-ink-950 hover:bg-gold-bright"
                    : "border border-line text-bone hover:border-gold/40"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="mt-5 rounded-lg border border-line/70 bg-ink-900/40 px-4 py-3 text-[11px] leading-relaxed text-muted/70">
          Demonstration build: checkout and account billing are not connected, so the buttons above do
          not charge anyone. Wiring Stripe subscriptions is the next step before launch.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-12">
        <h2 className="font-display text-2xl text-bone">What each plan includes</h2>
        <div className="mt-5 overflow-x-auto rounded-xl border border-line">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-ink-900 text-[10px] uppercase tracking-[0.14em] text-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Feature</th>
                <th className="px-5 py-3 text-center font-medium">Reader</th>
                <th className="px-5 py-3 text-center font-medium text-gold">Premium</th>
                <th className="px-5 py-3 text-center font-medium">Institutional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/70">
              {[
                ["Trend scores (26 assets)", true, true, true],
                ["Research pieces per month", "2", "Unlimited", "Unlimited"],
                ["Stance, conviction & invalidation level", false, true, true],
                ["Meme-coin risk grading", false, true, true],
                ["Academy courses", "Foundation", "All four", "All four"],
                ["Watchlist & score-change alerts", false, true, true],
                ["Model portfolios", false, true, true],
                ["Multi-seat access", false, false, true],
                ["Signal history CSV export", false, false, true],
                ["Monthly desk call", false, false, true],
                ["API access to trend scores", false, false, true],
              ].map((row) => {
                const [label, ...rest] = row;
                return (
                  <tr key={String(label)} className="bg-ink-950/40">
                    <td className="px-5 py-3 text-bone/85">{label}</td>
                    {rest.map((value, i) => (
                      <td key={i} className="px-5 py-3 text-center text-muted">
                        {value === true ? (
                          <span className={i === 1 ? "text-gold" : "text-up"}>✓</span>
                        ) : value === false ? (
                          <span className="text-muted/40">—</span>
                        ) : (
                          String(value)
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-8">
        <h2 className="font-display text-2xl text-bone">Questions</h2>
        <div className="mt-5 divide-y divide-line/60 rounded-xl border border-line bg-ink-900/40">
          {FAQ.map((item) => (
            <details key={item.q} className="group px-5 py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-bone">
                {item.q}
                <span className="text-muted transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted">
          Still deciding? Read{" "}
          <Link href="/research" className="text-bone/85 underline decoration-line underline-offset-2 hover:text-gold-bright">
            free research
          </Link>{" "}
          or start with the{" "}
          <Link href="/academy/reading-trends" className="text-bone/85 underline decoration-line underline-offset-2 hover:text-gold-bright">
            foundation course
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
