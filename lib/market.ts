export type Kind = "stock" | "crypto" | "meme";

export type Asset = {
  symbol: string;
  name: string;
  kind: Kind;
  group: string;
  base: number;
  blurb: string;
  bull: string[];
  bear: string[];
  catalysts: string[];
};

export type Point = { close: number; date: Date };

export type Metrics = {
  last: number;
  change24h: number;
  change7d: number;
  change30d: number;
  change90d: number;
  change1y: number;
  high52: number;
  low52: number;
  vol: number;
  rsi: number;
  sma20: number;
  sma50: number;
  sma200: number;
  score: number;
  confidence: number;
  stance: "Buy" | "Accumulate" | "Hold" | "Trim" | "Avoid";
  riskGrade: "Low" | "Moderate" | "Elevated" | "High";
  percentile: number;
};

export const ASSETS: Asset[] = [
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    kind: "stock",
    group: "Semiconductors",
    base: 187.4,
    blurb:
      "The reference holding for AI compute demand. Data-centre revenue growth has decelerated from triple digits, but the order book still runs ahead of supply.",
    bull: [
      "Hyperscaler capex guidance for the next four quarters still implies double-digit server spend growth.",
      "Software and networking attach rates are lifting gross margin mix away from pure GPU pricing.",
      "Forward multiple has compressed while earnings estimates have risen — a rarer combination than it looks.",
    ],
    bear: [
      "Customer concentration: four buyers account for the majority of data-centre revenue.",
      "Any digestion pause in accelerator orders would hit the first derivative of growth hard.",
      "Export-control headlines remain an unhedgeable overnight gap risk.",
    ],
    catalysts: ["Quarterly data-centre revenue print", "Hyperscaler capex updates", "Export policy revisions"],
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    kind: "stock",
    group: "Software",
    base: 512.8,
    blurb:
      "The most durable cash-flow compounder in the AI trade, with Azure growth, Copilot monetisation and an annuity-like enterprise base.",
    bull: [
      "Azure AI consumption is still the fastest-growing line item in the business.",
      "Copilot seats convert a per-user base into a per-user price increase.",
      "Capital returns remain fully funded by operating cash flow.",
    ],
    bear: [
      "Capex intensity is compressing free cash flow conversion versus history.",
      "Seat-based Copilot adoption is slower in mid-market accounts.",
      "Premium multiple leaves little room for a cloud growth deceleration.",
    ],
    catalysts: ["Azure growth disclosure", "Copilot seat additions", "Capex guidance"],
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    kind: "stock",
    group: "Hardware",
    base: 264.1,
    blurb:
      "A services-led re-rating story trading on installed base and pricing power rather than unit growth.",
    bull: [
      "Services gross margin keeps the blended margin structure intact despite flat hardware units.",
      "Installed base refresh cycle is overdue, creating a hardware replacement runway.",
      "Buyback cadence mechanically lifts earnings per share.",
    ],
    bear: [
      "Greater China demand is the swing factor and the least forecastable one.",
      "Regulatory pressure on App Store take rates is a slow margin leak.",
      "AI feature differentiation is arriving later than peers.",
    ],
    catalysts: ["China demand commentary", "Services growth", "Product cycle launches"],
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    kind: "stock",
    group: "Consumer / Cloud",
    base: 241.6,
    blurb:
      "Two engines: AWS re-acceleration and a retail segment whose margins are being engineered upward by regionalisation.",
    bull: [
      "AWS backlog growth is the cleanest read on enterprise AI adoption.",
      "Retail fulfilment regionalisation is structurally lifting operating margin.",
      "Advertising is a high-margin line growing faster than the core.",
    ],
    bear: [
      "Aggressive AI capex is a multi-year drag on free cash flow optics.",
      "Consumer trade-down risk in discretionary categories.",
      "Retail margin gains are partly cyclical, not purely structural.",
    ],
    catalysts: ["AWS growth and backlog", "Advertising revenue", "Capex plan"],
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    kind: "stock",
    group: "Internet",
    base: 215.7,
    blurb:
      "Search cash flow funding an increasingly credible model, cloud and silicon stack — the cheapest of the mega-cap AI franchises.",
    bull: [
      "Search query monetisation has held up better than the bear case assumed.",
      "Cloud backlog and margin expansion are now material to group earnings.",
      "Custom silicon lowers long-run inference cost.",
    ],
    bear: [
      "Search distribution economics face structural questions from AI assistants.",
      "Regulatory remedies could alter default placement deals.",
      "Cloud share gains are being bought with capex.",
    ],
    catalysts: ["Search revenue per query", "Cloud margin", "Antitrust remedy decisions"],
  },
  {
    symbol: "META",
    name: "Meta Platforms Inc.",
    kind: "stock",
    group: "Internet",
    base: 689.3,
    blurb:
      "Ad-ranking gains plus AI-driven creative tools are compounding revenue per impression faster than impression growth.",
    bull: [
      "Ranking improvements keep lifting ad conversion without extra inventory.",
      "Reels monetisation gap to feed has closed materially.",
      "Capex guidance is aggressive but tied to measurable ad ROI.",
    ],
    bear: [
      "Reality Labs losses remain a persistent drag on the consolidated multiple.",
      "Ad spend is cyclical and sensitive to small-business confidence.",
      "Any engagement decline in a core surface would be punished quickly.",
    ],
    catalysts: ["Ad impressions and pricing", "Capex commentary", "Reality Labs losses"],
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    kind: "stock",
    group: "Autos / Energy",
    base: 402.5,
    blurb:
      "Priced as an autonomy and robotics option with a car business attached. The trend is real; the valuation requires belief.",
    bull: [
      "Energy storage deployments are growing faster than autos and carry better margins.",
      "Autonomy progress would reprice the entire equity if commercialised.",
      "Cost per vehicle continues to fall on vertical integration.",
    ],
    bear: [
      "Auto gross margin ex-credits is under pressure from price cuts.",
      "Competitive intensity in China is structurally higher than in 2021.",
      "Autonomy timelines have slipped repeatedly, so optionality is priced, not proven.",
    ],
    catalysts: ["Deliveries and margin", "Autonomy milestones", "Energy storage bookings"],
  },
  {
    symbol: "AVGO",
    name: "Broadcom Inc.",
    kind: "stock",
    group: "Semiconductors",
    base: 352.9,
    blurb:
      "Custom accelerator and networking exposure with a software annuity bolted on from the VMware acquisition.",
    bull: [
      "Custom ASIC programmes give it a second lane beside merchant GPUs.",
      "Networking silicon is the toll road for cluster build-outs.",
      "Software renewal pricing is proving stickier than feared.",
    ],
    bear: [
      "Leverage from the software deal limits flexibility if a cycle turns.",
      "Customer concentration in custom silicon is extreme.",
      "Integration churn risk among enterprise software customers.",
    ],
    catalysts: ["AI revenue guidance", "Custom silicon wins", "Software renewal rates"],
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    kind: "stock",
    group: "Financials",
    base: 268.4,
    blurb:
      "The balance-sheet standard for the sector: best-in-class returns, but earnings quality depends on credit and the curve.",
    bull: [
      "Net interest income resilience has beaten guidance repeatedly.",
      "Capital markets fee pools are recovering on higher activity.",
      "Fortress balance sheet allows share gains during stress.",
    ],
    bear: [
      "Credit normalisation in card is a slow-moving headwind.",
      "Deposit repricing squeezes the funding advantage.",
      "Regulatory capital proposals could constrain buybacks.",
    ],
    catalysts: ["Net interest income guide", "Card charge-off data", "Capital rule changes"],
  },
  {
    symbol: "XOM",
    name: "Exxon Mobil Corp.",
    kind: "stock",
    group: "Energy",
    base: 118.6,
    blurb:
      "Low-cost barrel exposure with a disciplined capital return policy — the cash-return leg of an energy allocation.",
    bull: [
      "Break-even cost per barrel keeps the dividend covered at mid-cycle oil.",
      "Guyana and Permian volumes are lower-cost incremental supply.",
      "Refining spreads are structurally tighter than history, but chemicals are recovering.",
    ],
    bear: [
      "Crude direction dominates the equity regardless of operational execution.",
      "Chemicals overcapacity is a persistent drag.",
      "Capital intensity limits upside torque versus smaller peers.",
    ],
    catalysts: ["Crude curve", "Production volumes", "Refining margins"],
  },
  {
    symbol: "UNH",
    name: "UnitedHealth Group",
    kind: "stock",
    group: "Healthcare",
    base: 341.2,
    blurb:
      "A managed-care compounder working through a cost-trend reset — the classic case of a broken trend with intact franchise value.",
    bull: [
      "Optum health services diversifies away from pure insurance economics.",
      "Medical cost trend resets have historically been followed by repricing power.",
      "Valuation has de-rated to a decade-low multiple.",
    ],
    bear: [
      "Utilisation and acuity trends remain hard to forecast.",
      "Policy risk around reimbursement is elevated into an election cycle.",
      "Multiple quarters of guidance revisions have damaged credibility.",
    ],
    catalysts: ["Medical loss ratio", "Guidance resets", "Medicare reimbursement rates"],
  },
  {
    symbol: "COST",
    name: "Costco Wholesale",
    kind: "stock",
    group: "Consumer Staples",
    base: 912.4,
    blurb:
      "Membership-fee economics make this a defensive compounder, though the multiple has become the main risk.",
    bull: [
      "Renewal rates are near all-time highs, giving revenue visibility.",
      "Traffic is resilient through consumer slowdowns.",
      "E-commerce and pharmacy are additive without capex strain.",
    ],
    bear: [
      "Valuation embeds near-perfect execution.",
      "Membership fee increases are infrequent and already priced.",
      "Wage inflation pressures the operating margin buffer.",
    ],
    catalysts: ["Comparable sales ex-fuel", "Membership renewal rate", "Fee increase cadence"],
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    kind: "crypto",
    group: "Store of value",
    base: 96850,
    blurb:
      "The benchmark digital asset: the cleanest expression of liquidity conditions, now with an institutional bid through spot vehicles.",
    bull: [
      "Spot ETF flows have created a persistent, price-insensitive buyer base.",
      "Supply issuance halves on a fixed schedule; the float is genuinely tight.",
      "Correlation to liquidity conditions makes it a policy trade as much as a tech trade.",
    ],
    bear: [
      "Realised volatility remains 3-4x large-cap equities.",
      "Drawdowns of 30-40% are normal within bull cycles, not exceptional.",
      "Regulatory and custody risk is reduced, not eliminated.",
    ],
    catalysts: ["Spot ETF net inflows", "Liquidity conditions", "Halving supply dynamics"],
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    kind: "crypto",
    group: "Smart contract",
    base: 3412,
    blurb:
      "The settlement layer for tokenised assets and DeFi. The bet is on fee-generating usage, not just narrative.",
    bull: [
      "Layer-2 growth expands total throughput, even at the cost of mainnet fee revenue.",
      "Staking yield gives a native carry that BTC lacks.",
      "Tokenisation and stablecoin settlement increasingly default to Ethereum rails.",
    ],
    bear: [
      "Fee burn collapsed relative to L2 migration, weakening the supply narrative.",
      "Competing L1s and L2s fragment liquidity and developer attention.",
      "Underperforms BTC in risk-off phases.",
    ],
    catalysts: ["Staking and ETF flows", "L2 activity", "Tokenisation launches"],
  },
  {
    symbol: "SOL",
    name: "Solana",
    kind: "crypto",
    group: "Smart contract",
    base: 214.3,
    blurb:
      "The high-throughput chain where consumer and trading activity actually settles — high beta, high relevance.",
    bull: [
      "Low fees have concentrated retail trading and app usage on-chain.",
      "Developer activity and fee revenue have grown faster than any major peer.",
      "Consumer app flywheel is the strongest outside Ethereum.",
    ],
    bear: [
      "Outage history creates a reliability discount.",
      "Fee revenue is heavily concentrated in trading activity.",
      "High beta means amplified drawdowns in risk-off.",
    ],
    catalysts: ["Fee revenue", "Consumer app growth", "Network reliability record"],
  },
  {
    symbol: "LINK",
    name: "Chainlink",
    kind: "crypto",
    group: "Oracles",
    base: 24.85,
    blurb:
      "Infrastructure rather than a narrative coin: price feeds and cross-chain messaging that other protocols depend on.",
    bull: [
      "Oracles are non-discretionary infrastructure with recurring integration demand.",
      "Cross-chain interoperability standardisation work gives it a policy-adjacent moat.",
      "Revenue is tied to usage rather than speculative volume.",
    ],
    bear: [
      "Token capture of network value has historically lagged usage growth.",
      "Competing oracle networks compete on price in commodity feeds.",
      "Liquid staking and restaking narratives outbid it for attention.",
    ],
    catalysts: ["Integration count", "Cross-chain volume", "Staking economics"],
  },
  {
    symbol: "AVAX",
    name: "Avalanche",
    kind: "crypto",
    group: "Smart contract",
    base: 38.9,
    blurb:
      "Subnet architecture aimed at institutional and gaming deployments, with a smaller but loyal on-chain base.",
    bull: [
      "Subnets let institutions launch permissioned chains while settling to a public network.",
      "Gaming and tokenised fund deployments give differentiated usage.",
      "Relatively low valuation versus throughput capacity.",
    ],
    bear: [
      "Token unlock schedule is a persistent supply overhang.",
      "Active addresses have lagged price in prior rallies.",
      "Subnet adoption has been slower than roadmap promises.",
    ],
    catalysts: ["Subnet launches", "Unlock schedule", "TVL trend"],
  },
  {
    symbol: "ARB",
    name: "Arbitrum",
    kind: "crypto",
    group: "Layer 2",
    base: 1.12,
    blurb:
      "The largest optimistic rollup by usage, monetising Ethereum scaling without owning the settlement layer.",
    bull: [
      "Deepest DeFi liquidity among L2s gives it a durable network effect.",
      "Sequencer revenue scales with activity.",
      "Governance treasury funds incentive programmes during slow periods.",
    ],
    bear: [
      "Fee compression from blobs and competition squeezes sequencer margin.",
      "Token demand is weakly linked to network usage.",
      "Large unlock calendar.",
    ],
    catalysts: ["Sequencer revenue", "TVL share", "Governance incentives"],
  },
  {
    symbol: "DOGE",
    name: "Dogecoin",
    kind: "meme",
    group: "Meme",
    base: 0.284,
    blurb:
      "The original meme asset and the highest-beta expression of retail risk appetite. Pure sentiment, no cash flow.",
    bull: [
      "Deepest liquidity and widest recognition of any meme asset.",
      "Payment integration headlines repeatedly re-rate the narrative.",
      "Historically leads meme rallies by a wide margin.",
    ],
    bear: [
      "Inflationary supply schedule with no burn mechanism.",
      "No protocol revenue or usage-based demand.",
      "Drawdowns of 70-90% are the historical norm after peaks.",
    ],
    catalysts: ["Retail sentiment", "Payment adoption headlines", "BTC trend"],
  },
  {
    symbol: "SHIB",
    name: "Shiba Inu",
    kind: "meme",
    group: "Meme",
    base: 0.0000214,
    blurb:
      "A large-supply community token whose ecosystem expansions have not yet changed its demand profile materially.",
    bull: [
      "Enormous holder base keeps distribution and exchange support broad.",
      "Ecosystem tokens and layer-2 plans create optionality.",
      "Historically trades with a lag to DOGE rallies.",
    ],
    bear: [
      "Token supply is so large that price appreciation requires sustained new capital.",
      "Burn mechanisms have been immaterial relative to float.",
      "Utility remains largely aspirational.",
    ],
    catalysts: ["Burn data", "Exchange listings", "Retail sentiment"],
  },
  {
    symbol: "PEPE",
    name: "Pepe",
    kind: "meme",
    group: "Meme",
    base: 0.0000128,
    blurb:
      "Pure attention economics. The cleanest read on speculative appetite in the crypto market.",
    bull: [
      "Consistently among the highest-volume meme assets per unit market cap.",
      "No team allocation overhang to speak of.",
      "Leads narrative shifts in the meme sector.",
    ],
    bear: [
      "Zero fundamental anchor — only flows and sentiment.",
      "Liquidity thins dramatically in drawdowns.",
      "Extremely sensitive to exchange listing and delisting changes.",
    ],
    catalysts: ["Memecoin sector rotation", "Exchange activity", "Retail participation"],
  },
  {
    symbol: "WIF",
    name: "dogwifhat",
    kind: "meme",
    group: "Meme",
    base: 1.84,
    blurb:
      "A Solana-native meme with strong community identity and high volatility relative to its liquidity.",
    bull: [
      "Solana retail activity gives it a persistent audience.",
      "Strong cultural recall and community cohesion.",
      "Often moves first in Solana meme rotations.",
    ],
    bear: [
      "Thin order books amplify both directions.",
      "Holder concentration among top wallets is significant.",
      "Narrative half-life for individual memes is short.",
    ],
    catalysts: ["Solana on-chain activity", "Meme sector rotation", "Holder distribution"],
  },
  {
    symbol: "BONK",
    name: "Bonk",
    kind: "meme",
    group: "Meme",
    base: 0.0000342,
    blurb:
      "A Solana distribution experiment turned memecoin, with wide airdrop reach and heavy trading volume.",
    bull: [
      "Deep integration across Solana wallets and apps.",
      "Large distributed holder base supports organic volume.",
      "Benefits directly from Solana fee activity.",
    ],
    bear: [
      "Emissions schedule still adds supply.",
      "Utility is limited to community incentives.",
      "Volume collapses quickly in risk-off conditions.",
    ],
    catalysts: ["Solana app integrations", "Emission schedule", "DEX volume"],
  },
  {
    symbol: "FLOKI",
    name: "Floki",
    kind: "meme",
    group: "Meme",
    base: 0.000178,
    blurb:
      "A meme token marketed with real product wrappers — a valhalla game, a debit card and a treasury strategy.",
    bull: [
      "Product wrappers give it more persistent attention than pure memes.",
      "Treasury and buyback announcements create event-driven squeezes.",
      "Broad exchange coverage.",
    ],
    bear: [
      "Products have not translated into measurable demand for the token.",
      "Marketing-heavy flow is fragile.",
      "High correlation to sector rotation, low independence.",
    ],
    catalysts: ["Product launches", "Treasury announcements", "Sector rotation"],
  },
];

export const ASSET_BY_SYMBOL: Record<string, Asset> = Object.fromEntries(
  ASSETS.map((a) => [a.symbol, a]),
);

/**
 * Universe assets: top 800 liquid names from Nasdaq's screener (S&P 500 +
 * Nasdaq), top 800 digital assets across Coinbase Exchange + Binance + OKX,
 * and 174 meme coins (Coinbase pairs plus Pump.fun trending tokens with
 * live DexScreener prices). Copy is deliberately generic and honest: scores
 * are computed from real daily closes on the ticker page; there is no
 * per-name fundamental view to fabricate here.
 */
import { NWS_MEME_VENUES, NWS_UNIVERSE } from "./nws-universe";

function universeAsset(symbol: string, name: string, kind: Kind): Asset {
  if (kind === "meme") name = NWS_MEME_VENUES[symbol]?.name ?? symbol;
  const label = kind === "stock" ? "equities" : kind === "crypto" ? "digital assets" : "meme coins";
  return {
    symbol,
    name,
    kind,
    group:
      kind === "stock" ? "Universe" : kind === "crypto" ? "Coinbase" : "Meme",
    base: 0,
    blurb: `${name} is tracked in the ${label} universe. Its trend score is computed from real daily closes and refreshes with the feed.`,
    bull: [
      "Trend score is derived from real daily closes — no modelled prices.",
      "More liquidity than the meme tail of the market.",
    ],
    bear: [
      "Scores are lagging indicators, not predictions.",
      "Risk grades scale with realised volatility, which is highest in this tier.",
    ],
    catalysts: ["Feed refresh (about every minute)"],
  };
}

export const UNIVERSE_ASSETS: Asset[] = [
  ...NWS_UNIVERSE.stocks.map((s) => universeAsset(s.symbol, s.name, "stock")),
  ...NWS_UNIVERSE.crypto.map((s) => universeAsset(s, s, "crypto")),
  ...NWS_UNIVERSE.meme.map((s) => universeAsset(s, s, "meme")),
];

/** Every tracked asset: the 24 featured names plus the full universe. */
export const ALL_ASSETS: Asset[] = [
  ...ASSETS,
  ...UNIVERSE_ASSETS.filter((a) => !ASSET_BY_SYMBOL[a.symbol]),
];

export const ALL_BY_SYMBOL: Record<string, Asset> = Object.fromEntries(
  ALL_ASSETS.map((a) => [a.symbol, a]),
);

/** Resolve any tracked symbol to its asset definition. */
export function lookupAsset(symbol: string): Asset | undefined {
  return ALL_BY_SYMBOL[symbol];
}

/** Universe symbols for one kind (excludes the featured 24 already scored). */
export function universeFor(kind: Kind): Asset[] {
  return ALL_ASSETS.filter((a) => a.kind === kind);
}

/**
 * Real market data, hydrated once per request by `ensureMarketData()` in
 * `lib/market-data.ts`. Nothing here is generated: if a symbol has no fetched
 * history, `series()` returns an empty array and the UI reports missing data
 * rather than inventing a price.
 */
export type FeedQuote = {
  price: number;
  previousClose: number;
  change: number;
  delayed: boolean;
  asOf: string;
  provider: string;
};

const REAL_POINTS: Record<string, Point[]> = {};
const REAL_QUOTES: Record<string, FeedQuote> = {};

export function setMarketData(
  points: Record<string, Point[]>,
  quotes: Record<string, FeedQuote>,
): void {
  for (const [symbol, history] of Object.entries(points)) REAL_POINTS[symbol] = history;
  for (const [symbol, quote] of Object.entries(quotes)) REAL_QUOTES[symbol] = quote;
}

export function quoteFor(symbol: string): FeedQuote | undefined {
  return REAL_QUOTES[symbol];
}

export function hasMarketData(symbol: string): boolean {
  return (REAL_POINTS[symbol]?.length ?? 0) > 1;
}

export function series(asset: Asset, days = 260): Point[] {
  const history = REAL_POINTS[asset.symbol];
  if (!history?.length) return [];
  return history.slice(-days);
}

function mean(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function clamp(v: number, lo = 0, hi = 100): number {
  return Math.min(hi, Math.max(lo, v));
}

function smaAt(values: number[], window: number): number {
  const slice = values.slice(Math.max(0, values.length - window));
  return mean(slice);
}

function rsi(values: number[], period = 14): number {
  const recent = values.slice(-(period + 1));
  let gains = 0;
  let losses = 0;
  for (let i = 1; i < recent.length; i++) {
    const diff = recent[i] - recent[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  if (losses === 0) return 100;
  const rs = gains / period / (losses / period);
  return 100 - 100 / (1 + rs);
}

const NO_DATA: Metrics = {
  last: 0,
  change24h: 0,
  change7d: 0,
  change30d: 0,
  change90d: 0,
  change1y: 0,
  high52: 0,
  low52: 0,
  vol: 0,
  rsi: 50,
  sma20: 0,
  sma50: 0,
  sma200: 0,
  score: 0,
  confidence: 0,
  stance: "Hold",
  riskGrade: "High",
  percentile: 0,
};

export function metricsFor(asset: Asset): Metrics {
  const pts = series(asset);
  const values = pts.map((p) => p.close);
  if (values.length < 30) return NO_DATA;
  const last = values[values.length - 1];
  const sma20 = smaAt(values, 20);
  const sma50 = smaAt(values, 50);
  const sma200 = smaAt(values, 200);
  const rsi14 = rsi(values);
  const window = values.slice(-252);
  const high52 = Math.max(...window);
  const low52 = Math.min(...window);

  const ret = (n: number) => {
    const idx = Math.max(0, values.length - 1 - n);
    return last / values[idx] - 1;
  };

  const dailyReturns: number[] = [];
  for (let i = Math.max(1, values.length - 60); i < values.length; i++) {
    dailyReturns.push(values[i] / values[i - 1] - 1);
  }
  const dailyVol = Math.sqrt(mean(dailyReturns.map((r) => r * r)));
  const vol = dailyVol * Math.sqrt(365);

  const c1 = clamp((last / sma20 - 1) * 380 + 50);
  const c2 = clamp((sma20 / sma50 - 1) * 460 + 50);
  const c3 = clamp((sma50 / sma200 - 1) * 340 + 50);
  const c4 = clamp(ret(30) * 240 + 50);
  const c5 = clamp((rsi14 - 50) * 1.1 + 50);
  const rawScore = 0.22 * c1 + 0.2 * c2 + 0.18 * c3 + 0.25 * c4 + 0.15 * c5;
  const score = Math.round(clamp(rawScore));

  const stance: Metrics["stance"] =
    score >= 78 ? "Buy" : score >= 66 ? "Accumulate" : score >= 47 ? "Hold" : score >= 34 ? "Trim" : "Avoid";

  const riskGrade: Metrics["riskGrade"] =
    vol < 0.24 ? "Low" : vol < 0.42 ? "Moderate" : vol < 0.75 ? "Elevated" : "High";

  const posInRange = (last - low52) / Math.max(high52 - low52, 1e-9);
  const confidence = Math.round(clamp(52 + Math.abs(score - 50) * 0.8 + posInRange * 12, 50, 94));

  return {
    last,
    change24h: ret(1),
    change7d: ret(7),
    change30d: ret(30),
    change90d: ret(90),
    change1y: ret(250),
    high52,
    low52,
    vol,
    rsi: rsi14,
    sma20,
    sma50,
    sma200,
    score,
    confidence,
    stance,
    riskGrade,
    percentile: Math.round(posInRange * 100),
  };
}

export function fmtPrice(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "—";
  if (value >= 1000) return `$${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (value >= 10) return `$${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  if (value >= 0.01) return `$${value.toFixed(4)}`;
  return `$${value.toFixed(7)}`;
}

export function fmtPct(value: number, digits = 2): string {
  if (!Number.isFinite(value)) return "—";
  const v = value * 100;
  return `${v >= 0 ? "+" : ""}${v.toFixed(digits)}%`;
}

export function fmtCompact(value: number): string {
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toFixed(2);
}

export function toneClass(value: number): string {
  return value >= 0 ? "text-up" : "text-down";
}

export function stanceColor(stance: Metrics["stance"]): string {
  switch (stance) {
    case "Buy":
      return "text-up border-up/40 bg-up/10";
    case "Accumulate":
      return "text-gold-bright border-gold/40 bg-gold/10";
    case "Hold":
      return "text-bone border-line bg-ink-800";
    case "Trim":
      return "text-[#e7a86b] border-[#e7a86b]/40 bg-[#e7a86b]/10";
    default:
      return "text-down border-down/40 bg-down/10";
  }
}

export function byKind(kind: Kind): Asset[] {
  return ASSETS.filter((a) => a.kind === kind);
}

export type Row = {
  symbol: string;
  name: string;
  kind: Kind;
  group: string;
  price: number;
  change24h: number;
  change30d: number;
  score: number;
  stance: Metrics["stance"];
  risk: Metrics["riskGrade"];
  spark: number[];
};

export function rowsFor(kind?: Kind): Row[] {
  const list = kind ? byKind(kind) : ASSETS;
  return list
    .map((asset) => {
      const m = metricsFor(asset);
      const spark = series(asset, 60).map((p) => p.close);
      return {
        symbol: asset.symbol,
        name: asset.name,
        kind: asset.kind,
        group: asset.group,
        price: m.last,
        change24h: m.change24h,
        change30d: m.change30d,
        score: m.score,
        stance: m.stance,
        risk: m.riskGrade,
        spark,
      };
    })
    .sort((a, b) => b.score - a.score);
}

export type LiveSeed = Record<string, { price: number; change: number; vol: number }>;

/** Server-rendered opening quotes, so the first paint already shows real prices. */
export function liveSeed(): LiveSeed {
  const out: LiveSeed = {};
  for (const asset of ASSETS) {
    const quote = quoteFor(asset.symbol);
    const m = metricsFor(asset);
    if (!quote && !hasMarketData(asset.symbol)) continue;
    out[asset.symbol] = {
      price: quote?.price ?? m.last,
      change: quote?.change ?? m.change24h,
      vol: Math.min(0.0042, Math.max(0.00035, m.vol * 0.0035)),
    };
  }
  return out;
}

export function marketPulse(): { score: number; label: string; breadth: number } {
  const stockScores = byKind("stock").map((a) => metricsFor(a).score);
  const score = Math.round(mean(stockScores));
  const breadth = Math.round((stockScores.filter((s) => s >= 60).length / stockScores.length) * 100);
  const label = score >= 70 ? "Risk-on" : score >= 55 ? "Constructive" : score >= 42 ? "Mixed" : "Risk-off";
  return { score, label, breadth };
}

export function narrativeFor(asset: Asset, m: Metrics): string[] {
  const above = (price: number, ref: number) => (price >= ref ? "above" : "below");
  const trendWord =
    m.score >= 78
      ? "a confirmed uptrend"
      : m.score >= 66
        ? "an improving uptrend"
        : m.score >= 47
          ? "a range-bound tape"
          : m.score >= 34
            ? "a deteriorating trend"
            : "a confirmed downtrend";

  const first = `${asset.symbol} is trading ${above(m.last, m.sma20)} its 20-day average and ${above(
    m.last,
    m.sma50,
  )} its 50-day average, which puts the tape in ${trendWord}. The 200-day sits at ${fmtPrice(
    m.sma200,
  )} and remains the line that defines the structural trend for this name.`;

  const second = `Realised volatility is running near ${(m.vol * 100).toFixed(
    0,
  )}% annualised with a 14-day RSI of ${m.rsi.toFixed(0)}. Price is ${m.percentile}% of the way up its 52-week range (${fmtPrice(
    m.low52,
  )} to ${fmtPrice(m.high52)}), so the position-sizing question matters more than the direction question right now.`;

  const third =
    m.score >= 66
      ? `Our trend model grades this ${m.stance.toLowerCase()} with ${m.confidence}% conviction. The risk to the call is not a single bad session but a break of the 50-day followed by a lower high, which would flip momentum regardless of the story.`
      : m.score >= 47
        ? `Our trend model grades this a hold with ${m.confidence}% conviction. There is no edge in forcing a position while the moving averages converge; wait for a decisive close out of the range.`
        : `Our trend model grades this ${m.stance.toLowerCase()} with ${m.confidence}% conviction. Until price reclaims the 50-day and holds it for several sessions, rallies are counter-trend and should be treated as exits rather than entries.`;

  return [first, second, third];
}

export function scoreBreakdown(m: Metrics): { label: string; value: number }[] {
  const c1 = clamp((m.last / m.sma20 - 1) * 380 + 50);
  const c2 = clamp((m.sma20 / m.sma50 - 1) * 460 + 50);
  const c3 = clamp((m.sma50 / m.sma200 - 1) * 340 + 50);
  const c4 = clamp(m.change30d * 240 + 50);
  const c5 = clamp((m.rsi - 50) * 1.1 + 50);
  return [
    { label: "Price vs 20-day", value: Math.round(c1) },
    { label: "20 vs 50-day", value: Math.round(c2) },
    { label: "50 vs 200-day", value: Math.round(c3) },
    { label: "30-day momentum", value: Math.round(c4) },
    { label: "RSI positioning", value: Math.round(c5) },
  ];
}
