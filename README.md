# NextWall Street

Market trend analysis, research and education across US equities, crypto and meme coins. Built with Next.js (App Router) and Tailwind, deployed to Freebuff Sites on Cloudflare Workers via OpenNext.

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Market data

All prices, charts and indicators are computed from real market data fetched server-side. There is
no sample dataset and no client-side price simulation.

| Asset class | Source | Notes |
| --- | --- | --- |
| US equities | `api.nasdaq.com` quote info + daily history | ~1 year of daily closes; quotes are delayed and show the last close outside US hours |
| Crypto & meme coins | OKX `market/ticker` + daily candles | 24/7, 365 daily closes |
| Crypto fallback | CoinGecko `coins/markets` + `market_chart` | used when OKX does not return a symbol |

`lib/market-data.ts` fetches both classes concurrently with a small concurrency ceiling, retries
transient failures, and caches quotes for 45 seconds and daily history for 6 hours. Responses are
also cached by Next (`revalidate` 60s for quotes, 1h for history). Pages revalidate every two
minutes (`app/layout.tsx`), so the rendered HTML refreshes rather than staying frozen at build time.

`lib/market.ts` holds the asset universe and the scoring model. `setMarketData()` hands real daily
closes to the model, so the 52-week range, realised volatility, moving averages, RSI and the trend
score are all derived from actual closes. If a symbol has no history, `series()` returns an empty
array, the model returns neutral values and the UI reports missing data instead of inventing one.

No API keys are required. If you later add a licensed feed, wire it into `loadQuotes()` and
`loadHistory()`; the rest of the site is source-agnostic.

### Licensing

Nasdaq's public endpoint and OKX's public API are fine for development and evaluation, but a paid
product that redistributes quotes should use a licensed provider (for example a commercial Nasdaq
or Polygon agreement). Add the licence terms to `/disclaimer` before charging for access.

## Layout

- `lib/market.ts` — asset universe, scoring model, formatters, market model store
- `lib/market-data.ts` — real data sources, caching, snapshot assembly
- `lib/content.ts` — research articles, academy courses, pricing plans
- `components/live-prices.tsx` — quote provider fed by `/api/quotes`, polled every 30s
- `app/api/quotes/route.ts` — quotes endpoint (JSON, 30s CDN cache)
