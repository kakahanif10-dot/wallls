import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PremiumGate from "@/components/premium-gate";
import { ARTICLES, ARTICLE_BY_SLUG, type Block } from "@/lib/content";
import { fmtPct, fmtPrice, metricsFor, ASSET_BY_SYMBOL } from "@/lib/market";
import { ensureMarketData } from "@/lib/market-data";

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLE_BY_SLUG[slug];
  if (!article) return { title: "Article not found" };
  return { title: article.title, description: article.dek };
}

function renderBlocks(blocks: Block[]) {
  return blocks.map((block, i) => {
    if (block.type === "h2") return <h2 key={i}>{block.text}</h2>;
    if (block.type === "p") return <p key={i}>{block.text}</p>;
    if (block.type === "quote")
      return (
        <blockquote
          key={i}
          className="my-7 border-l-2 border-gold/70 pl-5 font-display text-xl leading-snug text-bone/90"
        >
          {block.text}
        </blockquote>
      );
    return (
      <ul key={i}>
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = ARTICLE_BY_SLUG[slug];
  if (!article) notFound();

  await ensureMarketData();

  const [first, ...remainder] = article.body;
  const more = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <div>
      <article className="mx-auto max-w-7xl px-5 py-12">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_0.6fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-muted">
              <Link href="/research" className="text-gold hover:text-gold-bright">Research</Link>
              <span className="text-line">/</span>
              {article.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>

            <h1 className="mt-5 max-w-3xl font-display text-4xl leading-tight text-bone sm:text-5xl">
              {article.title}
            </h1>
            <p className="mt-5 max-w-2xl font-display text-xl leading-relaxed text-muted">
              {article.dek}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-line/60 py-3 text-xs text-muted">
              <span className="text-bone/85">{article.author}</span>
              <span className="text-muted/60">{article.role}</span>
              <span className="text-line">·</span>
              <span>
                {new Date(article.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="text-line">·</span>
              <span>{article.readMinutes} min read</span>
              {article.premium && (
                <span className="ml-auto rounded border border-gold/40 px-2 py-0.5 text-[10px] text-gold">
                  Premium
                </span>
              )}
            </div>

            <div className="prose-editorial mt-8 max-w-3xl">
              <div>{renderBlocks([first])}</div>
              {article.premium ? (
                <PremiumGate issue={article.title}>{renderBlocks(remainder)}</PremiumGate>
              ) : (
                <div>{renderBlocks(remainder)}</div>
              )}
            </div>

            <div className="mt-12 rounded-xl border border-line bg-ink-900/60 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">Disclosure</p>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                This article is analysis and education, not investment advice, and contains no
                recommendation to transact. The desk holds no positions in the instruments discussed.
                Figures referenced are as of publication; live quotes and scores appear on the{" "}
                <Link href="/markets" className="text-bone/80 underline decoration-line underline-offset-2">
                  coverage pages
                </Link>
                . Read the{" "}
                <Link href="/disclaimer" className="text-bone/80 underline decoration-line underline-offset-2">
                  methodology
                </Link>
                .
              </p>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border border-line bg-ink-900/70 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                Referenced assets
              </p>
              <ul className="mt-3 space-y-2">
                {article.tickers.map((symbol) => {
                  const asset = ASSET_BY_SYMBOL[symbol];
                  if (!asset) return null;
                  const m = metricsFor(asset);
                  return (
                    <li key={symbol}>
                      <Link
                        href={`/ticker/${symbol}`}
                        className="group flex items-center justify-between rounded-lg border border-line/70 px-3 py-2.5 transition hover:border-gold/40"
                      >
                        <span className="flex flex-col">
                          <span className="font-mono text-xs text-bone group-hover:text-gold-bright">{symbol}</span>
                          <span className="text-[10px] text-muted">{asset.group}</span>
                        </span>
                        <span className="text-right">
                          <span className="block font-mono text-xs text-bone">{fmtPrice(m.last)}</span>
                          <span className={`block font-mono text-[10px] ${m.change24h >= 0 ? "text-up" : "text-down"}`}>
                            {fmtPct(m.change24h)}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-xl border border-gold/30 bg-gold/[0.05] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gold">
                Get the full desk view
              </p>
              <p className="mt-2 text-sm leading-relaxed text-bone/85">
                Premium includes every research piece, stance and invalidation level across all 26
                tracked assets, plus the full Academy curriculum.
              </p>
              <Link
                href="/pricing"
                className="mt-4 inline-block rounded-full bg-gold px-4 py-2 text-xs font-semibold text-ink-950 transition hover:bg-gold-bright"
              >
                View plans
              </Link>
            </div>

            <div className="rounded-xl border border-line bg-ink-900/70 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">Read next</p>
              <ul className="mt-3 space-y-3">
                {more.map((item) => (
                  <li key={item.slug}>
                    <Link href={`/research/${item.slug}`} className="group block">
                      <p className="text-sm leading-snug text-bone/90 group-hover:text-gold-bright">
                        {item.title}
                      </p>
                      <p className="mt-1 text-[11px] text-muted">{item.readMinutes} min</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
