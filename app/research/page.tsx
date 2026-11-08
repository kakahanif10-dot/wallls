import type { Metadata } from "next";
import Link from "next/link";
import { ARTICLES } from "@/lib/content";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Macro, equity and digital-asset research from the NextWall Street desk. Full-position reasoning, invalidation levels and model breakdowns.",
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function ResearchPage() {
  const [lead, ...rest] = ARTICLES;

  return (
    <div>
      <section className="grain border-b border-line/60">
        <div className="mx-auto max-w-7xl px-5 py-14">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">The desk</p>
          <h1 className="mt-4 font-display text-4xl text-bone sm:text-5xl">Research</h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
            Six current pieces across equity strategy, digital assets and risk management. Every
            premium piece carries the position reasoning and the level at which the thesis breaks.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12">
        <Link
          href={`/research/${lead.slug}`}
          className="group grid gap-8 rounded-xl border border-line bg-ink-900/60 p-7 transition hover:border-gold/40 lg:grid-cols-[1.3fr_0.7fr] lg:p-9"
        >
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-muted">
              <span className="text-gold">Latest</span>
              <span className="text-line">·</span>
              <span>{lead.tags.join(" · ")}</span>
              {lead.premium && (
                <span className="rounded border border-gold/40 px-1.5 py-0.5 text-[9px] text-gold">Premium</span>
              )}
            </div>
            <h2 className="mt-4 max-w-2xl font-display text-3xl leading-tight text-bone group-hover:text-gold-bright sm:text-4xl">
              {lead.title}
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">{lead.dek}</p>
            <p className="mt-6 text-xs text-muted/70">
              {lead.author} · {lead.role} · {fmtDate(lead.date)} · {lead.readMinutes} min read
            </p>
          </div>
          <div className="flex flex-col justify-between gap-4 border-t border-line/60 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-muted">Tickers in this piece</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {lead.tickers.map((t) => (
                  <Link
                    key={t}
                    href={`/ticker/${t}`}
                    className="rounded-md border border-line bg-ink-850 px-2.5 py-1 font-mono text-xs text-bone transition hover:border-gold/40 hover:text-gold-bright"
                  >
                    {t}
                  </Link>
                ))}
              </div>
            </div>
            <span className="text-sm text-muted transition group-hover:text-gold-bright">Read the piece →</span>
          </div>
        </Link>

        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((article) => (
            <Link
              key={article.slug}
              href={`/research/${article.slug}`}
              className="group flex flex-col justify-between rounded-xl border border-line bg-ink-900/40 p-6 transition hover:border-gold/40"
            >
              <div>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-muted">
                  <span className="text-gold">{article.tags[0]}</span>
                  <span className="text-line">·</span>
                  <span>{article.readMinutes} min</span>
                  {article.premium ? (
                    <span className="ml-auto rounded border border-gold/40 px-1.5 py-0.5 text-[9px] text-gold">
                      Premium
                    </span>
                  ) : (
                    <span className="ml-auto rounded border border-line px-1.5 py-0.5 text-[9px] text-muted">
                      Free
                    </span>
                  )}
                </div>
                <h3 className="mt-3 font-display text-xl leading-snug text-bone group-hover:text-gold-bright">
                  {article.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">{article.dek}</p>
              </div>
              <p className="mt-5 text-[11px] text-muted/70">
                {article.author} · {fmtDate(article.date)}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
