import Link from "next/link";
import TickerTape from "@/components/ticker-tape";
import Sparkline from "@/components/sparkline";
import { LivePrice, LiveChange } from "@/components/live-price";
import { ARTICLES, COURSES } from "@/lib/content";
import { marketPulse, rowsFor, stanceColor, type Row } from "@/lib/market";
import { ensureMarketData } from "@/lib/market-data";

function BoardRow({ row }: { row: Row }) {
  return (
    <Link
      href={`/ticker/${row.symbol}`}
      className="group flex items-center justify-between gap-4 border-b border-line/60 py-3.5 last:border-0"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="w-14 shrink-0 font-mono text-sm font-semibold text-bone group-hover:text-gold-bright">
          {row.symbol}
        </span>
        <span className="hidden truncate text-xs text-muted sm:block">{row.group}</span>
      </div>
      <div className="flex items-center gap-4">
        <Sparkline values={row.spark} width={70} height={22} className="hidden sm:block" />
        <span className="w-24 text-right">
          <LivePrice symbol={row.symbol} base={row.price} className="font-mono text-sm text-bone" />
        </span>
        <span className="w-16 text-right">
          <LiveChange symbol={row.symbol} change={row.change24h} className="font-mono text-xs" />
        </span>
        <span className={`hidden w-24 rounded-full border px-2 py-1 text-center text-[11px] sm:inline-block ${stanceColor(row.stance)}`}>
          {row.stance}
        </span>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  await ensureMarketData();
  const pulse = marketPulse();
  const board = rowsFor("stock").slice(0, 5);
  const featured = ARTICLES.slice(0, 3);
  const courses = COURSES.slice(0, 3);

  return (
    <div>
      <section className="grain relative overflow-hidden border-b border-line/60">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
          <div className="rise">
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-ink-900 px-3 py-1.5 text-[11px] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-up" />
              Independent research · no sponsored calls
            </div>

            <h1 className="mt-6 font-display text-[2.75rem] leading-[1.05] text-bone sm:text-6xl">
              Know which
              <br />
              trends are real.
            </h1>

            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted">
              NextWall Street scores the trend, names the stance and publishes the invalidation
              level — across equities, crypto and meme coins. Then it teaches you the method, so you
              never have to take our word for it.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/pricing"
                className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink-950 transition hover:bg-gold-bright"
              >
                Start 14-day trial
              </Link>
              <Link
                href="/markets"
                className="rounded-full border border-line px-6 py-3 text-sm text-bone transition hover:border-gold/40"
              >
                See today&apos;s board
              </Link>
            </div>

            <p className="mt-5 text-xs text-muted/70">
              Analysis and education only. Not investment advice. Equities are delayed; crypto quotes
              update continuously.
            </p>

            <dl className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-line/60 pt-7">
              {[
                { k: "1,774", v: "assets tracked" },
                { k: "6", v: "research desks" },
                { k: "4", v: "academy courses" },
              ].map((item) => (
                <div key={item.v}>
                  <dt className="font-display text-3xl text-bone">{item.k}</dt>
                  <dd className="mt-1 text-xs text-muted">{item.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="rise rounded-xl border border-line bg-ink-900/80 p-6 backdrop-blur">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                  Market pulse
                </p>
                <p className="mt-1 text-xs text-muted">Composite of equity trend scores</p>
              </div>
              <span className="rounded-full border border-up/40 bg-up/10 px-2.5 py-1 text-[11px] text-up">
                {pulse.label}
              </span>
            </div>

            <div className="mt-6 flex items-end gap-3">
              <span className="font-mono text-5xl text-bone">{pulse.score}</span>
              <span className="pb-2 text-xs text-muted">/ 100</span>
            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-gradient-to-r from-gold/60 to-up"
                style={{ width: `${pulse.score}%` }}
              />
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-line bg-ink-850 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted">Breadth</p>
                <p className="mt-1 font-mono text-lg text-bone">{pulse.breadth}%</p>
                <p className="text-[10px] text-muted/70">names scoring 60+</p>
              </div>
              <div className="rounded-lg border border-line bg-ink-850 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.14em] text-muted">Risk regime</p>
                <p className="mt-1 font-mono text-lg text-bone">Elevated</p>
                <p className="text-[10px] text-muted/70">size down, not out</p>
              </div>
            </div>

            <div className="mt-6 border-t border-line/60 pt-4">
              <Link
                href="/research/breadth-divergence-playbook"
                className="group flex items-start gap-3"
              >
                <span className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">
                  Latest
                </span>
                <span className="text-sm leading-snug text-bone/90 group-hover:text-gold-bright">
                  The playbook for a narrow market — when five names carry the index.
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <TickerTape rows={rowsFor().slice(0, 18)} />

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 className="font-display text-3xl leading-tight text-bone sm:text-4xl">
              One score. One stance. One invalidation level.
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
              Most market commentary gives you a direction without a mechanism. We publish the
              composite maths behind every score, the exact level at which the call is wrong, and a
              confidence figure that shrinks when the tape gets noisy.
            </p>

            <div className="mt-8 space-y-5">
              {[
                {
                  n: "01",
                  t: "Structure",
                  d: "Price relative to the 20-, 50- and 200-day averages, with the slope of each.",
                },
                {
                  n: "02",
                  t: "Momentum",
                  d: "Thirty-session rate of change and RSI positioning, weighted for trend persistence.",
                },
                {
                  n: "03",
                  t: "Risk",
                  d: "Realised volatility, position in the 52-week range and a risk grade that drives sizing.",
                },
              ].map((step) => (
                <div key={step.n} className="flex gap-4 border-t border-line/60 pt-5">
                  <span className="font-mono text-xs text-gold">{step.n}</span>
                  <div>
                    <p className="text-sm font-medium text-bone">{step.t}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{step.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-line bg-ink-900/60 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-bone">Today&apos;s board — equities</h3>
              <Link href="/markets" className="text-xs text-muted transition hover:text-gold-bright">
                View all →
              </Link>
            </div>
            <div className="mt-3">
              {board.map((row) => (
                <BoardRow key={row.symbol} row={row} />
              ))}
            </div>
            <p className="mt-4 text-[11px] leading-relaxed text-muted/70">
              Ranked by composite trend score. Stances are model output, not personal
              recommendations.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-line/60 bg-ink-900/40">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <h2 className="font-display text-3xl text-bone sm:text-4xl">Three markets. Three honest frameworks.</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                href: "/markets",
                eyebrow: "Equities",
                title: "Twelve franchises we can defend",
                body: "AI infrastructure, software, financials, energy and consumer staples — scored on structure and momentum with fundamentals as context.",
                meta: "12 names · daily updates",
              },
              {
                href: "/crypto",
                eyebrow: "Digital assets",
                title: "Flow, float and liquidity",
                body: "No cash flow to discount, so we price the regime instead: real yields, dollar direction, ETF flow and on-chain activity.",
                meta: "8 assets · volatility sized",
              },
              {
                href: "/meme-coins",
                eyebrow: "Speculative",
                title: "Attention markets, graded as risk",
                body: "Concentration, order-book depth and narrative half-life. Hard position caps and mechanical exits, not conviction plays.",
                meta: "6 assets · risk-first",
              },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group flex flex-col justify-between rounded-xl border border-line bg-ink-900 p-6 transition hover:border-gold/40"
              >
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                    {card.eyebrow}
                  </p>
                  <h3 className="mt-3 font-display text-xl text-bone group-hover:text-gold-bright">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{card.body}</p>
                </div>
                <p className="mt-6 text-[11px] uppercase tracking-[0.12em] text-muted/60">{card.meta}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">Research</p>
            <h2 className="mt-3 font-display text-3xl text-bone sm:text-4xl">This week from the desk</h2>
          </div>
          <Link href="/research" className="hidden text-sm text-muted transition hover:text-gold-bright sm:block">
            All research →
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {featured.map((article) => (
            <Link
              key={article.slug}
              href={`/research/${article.slug}`}
              className="group flex flex-col rounded-xl border border-line bg-ink-900/60 p-6 transition hover:border-gold/40"
            >
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-muted">
                <span className="text-gold">{article.tags[0]}</span>
                <span className="text-line">·</span>
                <span>{article.readMinutes} min</span>
                {article.premium && (
                  <span className="ml-auto rounded border border-gold/40 px-1.5 py-0.5 text-[9px] text-gold">
                    Premium
                  </span>
                )}
              </div>
              <h3 className="mt-4 font-display text-xl leading-snug text-bone group-hover:text-gold-bright">
                {article.title}
              </h3>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{article.dek}</p>
              <p className="mt-5 text-xs text-muted/70">
                {article.author} · {article.role}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-line/60 bg-ink-900/40">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">The Academy</p>
            <h2 className="mt-3 font-display text-3xl leading-tight text-bone sm:text-4xl">
              A subscription is a view. Education is a skill.
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted">
              Every paid plan unlocks the full curriculum: structure reading, momentum interpretation,
              crypto liquidity, speculative risk and portfolio construction. Written by the same desk
              that publishes the scores — no recycled course content.
            </p>
            <Link
              href="/academy"
              className="mt-7 inline-block rounded-full border border-line px-5 py-2.5 text-sm text-bone transition hover:border-gold/40"
            >
              Explore the curriculum
            </Link>
          </div>

          <div className="space-y-3">
            {courses.map((course) => (
              <Link
                key={course.slug}
                href={`/academy/${course.slug}`}
                className="group flex items-center justify-between gap-4 rounded-xl border border-line bg-ink-900 px-5 py-4 transition hover:border-gold/40"
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-gold">{course.level}</p>
                  <p className="mt-1 text-sm font-medium text-bone group-hover:text-gold-bright">
                    {course.title}
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    {course.lessons.length} lessons ·{" "}
                    {course.lessons.reduce((a, l) => a + l.minutes, 0)} min · {course.instructor}
                  </p>
                </div>
                <span className="text-muted transition group-hover:translate-x-1 group-hover:text-gold-bright">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              quote:
                "The invalidation level is the part nobody else publishes. It changes how you size, not just what you buy.",
              name: "Self-directed investor",
              detail: "Premium, 14 months",
            },
            {
              quote:
                "I finally understand why my RSI sell signals kept failing in strong trends. The Academy course paid for the subscription.",
              name: "Retail trader",
              detail: "Premium, 8 months",
            },
            {
              quote:
                "We use the signal history CSV in our Monday risk meeting. It is the only retail product our compliance team approved.",
              name: "Family office analyst",
              detail: "Institutional, 2 seats",
            },
          ].map((t) => (
            <figure key={t.name} className="rounded-xl border border-line bg-ink-900/60 p-6">
              <blockquote className="font-display text-lg leading-snug text-bone/90">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-4 text-xs text-muted">
                {t.name} · {t.detail}
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="mt-4 text-[11px] text-muted/60">
          Illustrative subscriber feedback shown for this build.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-4">
        <div className="grain overflow-hidden rounded-2xl border border-line bg-ink-900 px-7 py-12 text-center lg:px-16">
          <h2 className="mx-auto max-w-2xl font-display text-3xl leading-tight text-bone sm:text-4xl">
            Read the market the way the desk does.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted">
            Fourteen days free, then $29 a month. Cancel any time. Every score is published with its
            maths, and every call with the level that proves it wrong.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/pricing"
              className="rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink-950 transition hover:bg-gold-bright"
            >
              Compare plans
            </Link>
            <Link
              href="/research"
              className="rounded-full border border-line px-6 py-3 text-sm text-bone transition hover:border-gold/40"
            >
              Read free research
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
