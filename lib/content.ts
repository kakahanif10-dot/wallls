export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] };

export type Article = {
  slug: string;
  title: string;
  dek: string;
  author: string;
  role: string;
  date: string;
  readMinutes: number;
  tags: string[];
  premium: boolean;
  tickers: string[];
  body: Block[];
};

export const ARTICLES: Article[] = [
  {
    slug: "ai-capex-cycle-second-derivative",
    title: "The AI capex cycle is now a second-derivative trade",
    dek: "Growth is still growth. But in semis, the market has stopped paying for the level of spending and started paying for the rate of change. That distinction decides the next twelve months.",
    author: "Daniel Okafor",
    role: "Head of Equity Strategy",
    date: "2026-11-06",
    readMinutes: 9,
    tags: ["Semiconductors", "AI", "Positioning"],
    premium: true,
    tickers: ["NVDA", "AVGO", "MSFT", "AMZN"],
    body: [
      {
        type: "p",
        text: "For two years the trade was simple: own the compute. Every quarterly capex raise from the hyperscalers was read as a green light, and every accelerator name re-rated in sympathy. That regime is ending, not because spending is falling, but because the market has learned to price the spending in advance.",
      },
      {
        type: "p",
        text: "When a sector trades at 30 times forward earnings, the level of demand is no longer the question. The question is whether the pace of demand growth is accelerating or merely high. Those are different trades with different holders, and the transition between them is where most of the damage happens.",
      },
      { type: "h2", text: "What the order books actually say" },
      {
        type: "p",
        text: "Order backlog for advanced accelerators still runs ahead of deliverable supply, and networking attach rates are climbing as clusters get larger. But the incremental growth rate has decelerated for three consecutive quarters across the leading merchant supplier. Nothing about that is bearish on the business. It is simply bearish on a multiple that assumed the second derivative stays positive indefinitely.",
      },
      {
        type: "p",
        text: "The tell is in the guidance cadence rather than the absolute numbers. Companies that can still raise guidance mid-quarter are operating in a demand-constrained market. Companies that guide conservatively and beat are operating in a supply-normalising market. Watch which pattern shows up next quarter.",
      },
      {
        type: "quote",
        text: "In a cyclical boom, the multiple peaks before the earnings do. That is not a reason to short — it is a reason to size differently.",
      },
      { type: "h2", text: "The three names that carry the beta" },
      {
        type: "p",
        text: "Exposure to AI compute is concentrated in a handful of tickers, and their trends are highly correlated. If you own three of them, you own one position at triple weight. Our trend model currently grades the accelerator complex as a hold-to-accumulate: price above the 50-day, 50-day above the 200-day, but momentum decelerating into the print.",
      },
      {
        type: "list",
        items: [
          "Merchant accelerator exposure is the highest-beta expression and the first to break if guidance disappoints.",
          "Custom silicon programmes are a second lane, but they are customer-concentrated and lumpy by contract.",
          "Software and networking attach is the quiet compounder — lower beta, better multiple durability.",
        ],
      },
      { type: "h2", text: "How we are positioned" },
      {
        type: "p",
        text: "We are not fading the trend. We are reducing concentration and shifting weight toward the infrastructure layer where revenue is recognised on usage rather than unit shipments. If the capex cycle merely plateaus, the usage-linked names keep compounding while the unit-linked names de-rate. If it re-accelerates, both work.",
      },
      {
        type: "p",
        text: "The invalidation is clean: a break of the 50-day on heavy volume across the complex, followed by a lower high. Until that happens, the trend is still up — it is just no longer early.",
      },
    ],
  },
  {
    slug: "bitcoin-liquidity-regime",
    title: "Bitcoin is trading the liquidity regime, not the halving",
    dek: "Spot flows changed the buyer base. They did not change the fact that this asset is a high-beta claim on global liquidity — and liquidity is turning.",
    author: "Mara Lindqvist",
    role: "Digital Assets Strategist",
    date: "2026-11-04",
    readMinutes: 8,
    tags: ["Crypto", "Bitcoin", "Macro"],
    premium: true,
    tickers: ["BTC", "ETH", "SOL"],
    body: [
      {
        type: "p",
        text: "Every cycle produces a story that explains the last move. In 2021 it was institutional adoption. In this cycle it is the spot vehicle flow, which is a genuine structural change: a persistent, rules-based buyer that does not care about price. It is also the most overused explanation in the market right now.",
      },
      {
        type: "p",
        text: "Flows matter at the margin, and at the margin they dominate. But the reason flows arrive is the same reason equities rally: liquidity conditions. When real yields fall and the dollar softens, the marginal dollar moves out the risk curve, and bitcoin sits at the far end of that curve.",
      },
      { type: "h2", text: "What the trend model sees" },
      {
        type: "p",
        text: "Bitcoin holds above its 50-day and 200-day averages with a positive slope on both. The 30-day rate of change is positive but decelerating, and realised volatility has compressed from the cycle highs. Compression preceding expansion is a neutral signal; it tells you the next move will be large without telling you the direction.",
      },
      {
        type: "p",
        text: "Drawdowns of 30% or more within a bull cycle are normal, not exceptional. Any allocation must be sized so that a 40% drawdown is survivable without forced selling. That is a risk-management statement, not a forecast.",
      },
      { type: "h2", text: "The rotation question" },
      {
        type: "p",
        text: "Once bitcoin establishes a range, capital tends to rotate down the risk curve into large-cap smart-contract platforms and then into higher-beta assets. That rotation is visible in relative strength: ether and solana tend to outperform in the middle of a liquidity expansion and underperform sharply when it ends.",
      },
      {
        type: "list",
        items: [
          "Bitcoin is the reserve asset of the sector — lowest beta, deepest liquidity, most institutional access.",
          "Ether is a carry trade with a technology option attached; staking yield anchors part of the return.",
          "Solana is the high-throughput bet on consumer and trading activity actually settling on-chain.",
        ],
      },
      {
        type: "quote",
        text: "Crypto does not have a valuation floor. It has a liquidity ceiling. Position accordingly.",
      },
      { type: "h2", text: "Risk controls that actually work" },
      {
        type: "p",
        text: "Use volatility-scaled position sizes rather than fixed dollar allocations. At current realised volatility, a 5% target contribution to portfolio risk implies a materially smaller notional than it did a year ago. Rebalance on a schedule rather than on conviction, because conviction is exactly what fails at cycle extremes.",
      },
    ],
  },
  {
    slug: "meme-coins-attention-market",
    title: "Meme coins are an attention market with a liquidity problem",
    dek: "There is no cash flow to analyse, so the only honest framework is flow, float and the half-life of a narrative. Here is how we score them without pretending they are investments.",
    author: "Daniel Okafor",
    role: "Head of Equity Strategy",
    date: "2026-11-01",
    readMinutes: 7,
    tags: ["Meme coins", "Crypto", "Risk"],
    premium: true,
    tickers: ["DOGE", "SHIB", "PEPE", "WIF", "BONK"],
    body: [
      {
        type: "p",
        text: "We include meme coins in coverage because subscribers ask, and because pretending they do not exist is not analysis. But the framework has to be honest about what is being measured. There is no discounted cash flow here. There is no moat, no pricing power, no earnings revision cycle. There is attention, liquidity and float.",
      },
      { type: "h2", text: "The three variables that matter" },
      {
        type: "list",
        items: [
          "Concentration: how much of the float sits in the top 100 wallets. High concentration means the exit is narrower than the entry.",
          "Depth: how much capital it takes to move price 5%. Thin books make both directions violent.",
          "Narrative half-life: how long the current story has been running. Meme narratives decay; the price follows with a lag.",
        ],
      },
      {
        type: "p",
        text: "Everything else — the roadmap, the mascot, the community — is marketing. Marketing can extend a narrative, but it cannot create bid depth when holders decide to leave at the same time.",
      },
      {
        type: "quote",
        text: "A meme coin is a liquidity event wearing a community label. Treat position size as the entire risk control.",
      },
      { type: "h2", text: "Where the sector is in this cycle" },
      {
        type: "p",
        text: "Sector breadth is narrow and the leaders are concentrated in the two largest ecosystems. That pattern typically appears in the later innings of a risk-appetite expansion: capital crowds into the most recognisable names rather than dispersing. It does not mean an immediate reversal. It means the payoff distribution is asymmetric against new entries.",
      },
      {
        type: "p",
        text: "Our scoring for this sector caps conviction deliberately. A high trend score here means the tape is working, not that the asset is sound. The distinction must survive contact with a screen that shows a 300% 30-day return.",
      },
      { type: "h2", text: "Rules we apply to ourselves" },
      {
        type: "list",
        items: [
          "Total meme exposure never exceeds a fixed, written percentage of the portfolio — typically under 2%.",
          "No averaging down. The thesis is momentum only, so a broken trend ends the position.",
          "Take partial profits mechanically at predetermined levels; narratives do not announce their top.",
        ],
      },
    ],
  },
  {
    slug: "software-multiple-compression",
    title: "Software is cheaper than it has been in a decade — but not uniformly",
    dek: "Seat-based models face an AI pricing reset. Usage-based and infrastructure-adjacent names are absorbing it better. The screen, the numbers and the trap.",
    author: "Priya Raghunathan",
    role: "Software Analyst",
    date: "2026-10-28",
    readMinutes: 10,
    tags: ["Software", "Valuation", "AI"],
    premium: true,
    tickers: ["MSFT", "GOOGL", "META"],
    body: [
      {
        type: "p",
        text: "Multiple compression in software has been relentless and, for large-cap quality, arguably overdone. But the reason for the compression is not purely rate-driven. It is that the unit of software consumption is changing from seats to tokens, and the market is unsure which pricing models survive that shift.",
      },
      { type: "h2", text: "Why seats are vulnerable" },
      {
        type: "p",
        text: "A seat-based model assumes value scales with headcount. If a single operator with an AI assistant can do the work of three, headcount growth decelerates — and so does the revenue line. This is not a 2026 problem. It is a 2028 problem that the market is pricing today.",
      },
      {
        type: "p",
        text: "Usage-based models invert that: revenue scales with consumption, which AI increases. The trade-off is predictability. Buyers dislike variable bills, which is why hybrid pricing — a platform fee plus consumption — is emerging as the consensus structure.",
      },
      {
        type: "quote",
        text: "The businesses with a consumption meter inside them are the ones that benefit from AI adoption rather than being cannibalised by it.",
      },
      { type: "h2", text: "Where to look" },
      {
        type: "list",
        items: [
          "Infrastructure and platform names where AI workloads already appear as metered consumption.",
          "Data and distribution owners: proprietary data plus a distribution channel is the durable combination.",
          "Avoid pure seat-expansion stories where AI is a feature rather than a pricing mechanism.",
        ],
      },
      { type: "h2", text: "The valuation trap" },
      {
        type: "p",
        text: "Cheap software is often cheap for a reason, and the forward estimates that make it look cheap are exactly the ones that get revised down first. We prefer businesses trading at a modest premium to the group where estimate revisions are positive. Revision direction leads multiple direction; the reverse is rarely true.",
      },
      {
        type: "p",
        text: "Our screen requires three things simultaneously: positive 90-day estimate revisions, expanding gross margin, and a trend score above 60. That filter removes most of the value traps and most of the momentum traps at the same time.",
      },
    ],
  },
  {
    slug: "breadth-divergence-playbook",
    title: "The playbook for a narrow market",
    dek: "When five names carry the index, the index is a misleading signal. Here is how to read breadth, and what to do when it diverges from price.",
    author: "Mara Lindqvist",
    role: "Digital Assets Strategist",
    date: "2026-10-24",
    readMinutes: 6,
    tags: ["Strategy", "Breadth", "Risk"],
    premium: false,
    tickers: ["NVDA", "MSFT", "AAPL", "COST"],
    body: [
      {
        type: "p",
        text: "Index strength built on a handful of mega-caps is not the same as a healthy market. It can persist for a long time, which is why the naive contrarian version of this argument loses money. But it changes what a sensible portfolio looks like: you own the leaders, and you own protection against the index-level illusion.",
      },
      { type: "h2", text: "Three breadth measures worth tracking" },
      {
        type: "list",
        items: [
          "Percentage of constituents above their 200-day average. Below 50% while the index makes highs is a warning.",
          "Equal-weight versus cap-weight relative performance. A falling equal-weight ratio is concentration, quantified.",
          "New highs minus new lows on a 20-day smoothing. Sharp divergence from price is the earliest tell.",
        ],
      },
      {
        type: "p",
        text: "None of these are timing tools. They are sizing tools. Narrow breadth argues for owning fewer, larger positions in the names that are working, with explicit stop levels, rather than a broad basket of laggards hoping for rotation.",
      },
      {
        type: "quote",
        text: "In a narrow market you do not buy the laggard because it is cheap. You buy the leader because it is working, and you size it so being wrong is survivable.",
      },
      {
        type: "p",
        text: "The rotation, when it comes, is usually violent and fast. It is better to miss the first week of a broadening than to spend six months in names that go nowhere while the leaders compound.",
      },
    ],
  },
  {
    slug: "risk-sizing-volatility",
    title: "Position sizing is the only free lunch in a volatile tape",
    dek: "Most investors spend their time on selection and almost none on sizing. At current volatility, sizing explains more of your outcome than stock picking does.",
    author: "Priya Raghunathan",
    role: "Software Analyst",
    date: "2026-10-19",
    readMinutes: 5,
    tags: ["Risk", "Education", "Portfolio"],
    premium: false,
    tickers: ["TSLA", "BTC", "NVDA"],
    body: [
      {
        type: "p",
        text: "Two portfolios hold the same nine names in the same order. One returns 14% and the other 3% purely because of weight. Selection gets the attention; weighting gets the results. In a tape where a single mega-cap prints 8% daily ranges, that gap widens.",
      },
      { type: "h2", text: "Volatility-scaled sizing" },
      {
        type: "p",
        text: "Assign each position a target risk contribution, then divide by its realised volatility. A name with 60% annualised volatility gets roughly a third of the notional of a name with 20%. When volatility rises, the position shrinks automatically — you sell into strength and buy into calm, which is the opposite of what intuition suggests.",
      },
      {
        type: "list",
        items: [
          "Measure realised volatility over 60 sessions, not intraday noise.",
          "Cap any single position at a hard percentage regardless of what the model says.",
          "Recompute monthly. Sizing drift is the most common source of unintended concentration.",
        ],
      },
      {
        type: "p",
        text: "This is not a return-enhancing trick. It is a survival mechanism. The investor who is still present after the drawdown gets to compound; the one who is forced out does not.",
      },
    ],
  },
];

export const ARTICLE_BY_SLUG: Record<string, Article> = Object.fromEntries(
  ARTICLES.map((a) => [a.slug, a]),
);

export type Lesson = {
  title: string;
  minutes: number;
  summary: string;
  points: string[];
};

export type Course = {
  slug: string;
  title: string;
  level: "Foundation" | "Intermediate" | "Advanced";
  instructor: string;
  instructorRole: string;
  summary: string;
  lessons: Lesson[];
  outcomes: string[];
};

export const COURSES: Course[] = [
  {
    slug: "reading-trends",
    title: "Reading a Trend: From Structure to Signal",
    level: "Foundation",
    instructor: "Daniel Okafor",
    instructorRole: "Head of Equity Strategy",
    summary:
      "The four-course foundation of the NextWall Street method. Learn to read structure with moving averages, momentum with rate of change, and conviction with volatility — then combine them into a single score you can defend.",
    outcomes: [
      "Build a repeatable trend classification instead of a gut feeling",
      "Understand why the 200-day is a regime filter, not a signal",
      "Read RSI and momentum without the common misinterpretations",
      "Combine indicators into one score with explicit weights",
    ],
    lessons: [
      {
        title: "Structure before signals",
        minutes: 11,
        summary:
          "A trend is a sequence of higher highs and higher lows until it is not. Defining structure first prevents you from arguing with the tape.",
        points: [
          "Mark the last three swing highs and lows before looking at any indicator.",
          "A trend is intact until a prior swing low breaks on a closing basis.",
          "Indicators confirm structure; they never replace it.",
        ],
      },
      {
        title: "The 200-day as a regime filter",
        minutes: 14,
        summary:
          "The 200-day average is a blunt instrument used badly by most retail traders. Used as a regime switch rather than a crossover signal, it removes the majority of catastrophic entries.",
        points: [
          "Above a rising 200-day: trade long bias, ignore short signals.",
          "Below a falling 200-day: rallies are counter-trend until proven otherwise.",
          "Flat 200-day means no regime — reduce size and wait.",
        ],
      },
      {
        title: "Momentum: rate of change over RSI",
        minutes: 13,
        summary:
          "RSI tells you how stretched price is, not where it is going. Rate of change tells you the direction and the speed. Use them together or not at all.",
        points: [
          "RSI above 70 is not a sell signal in a strong trend; it is a strength signal.",
          "Divergence matters only at extremes, and only with structure confirmation.",
          "Rate of change over 30 sessions is the most predictive single input in our model.",
        ],
      },
      {
        title: "Building one score you can defend",
        minutes: 16,
        summary:
          "A weighted composite beats five indicators giving contradictory advice. Here is the exact weighting we use and why each component earns its place.",
        points: [
          "Short-term positioning, medium-term trend, long-term regime — one weight each.",
          "Momentum gets the largest single weight because it leads.",
          "Any score must come with an invalidation level, or it is just an opinion.",
        ],
      },
    ],
  },
  {
    slug: "crypto-without-hype",
    title: "Crypto Without the Hype",
    level: "Intermediate",
    instructor: "Mara Lindqvist",
    instructorRole: "Digital Assets Strategist",
    summary:
      "A framework for allocating to digital assets when there are no cash flows to discount. Macro liquidity, on-chain flow and volatility sizing replace the story-telling that dominates crypto commentary.",
    outcomes: [
      "Map crypto exposure to liquidity conditions rather than narratives",
      "Read on-chain flow and float dynamics",
      "Size positions using realised volatility",
      "Separate protocol value from token value",
    ],
    lessons: [
      {
        title: "Liquidity is the only macro variable that matters",
        minutes: 12,
        summary:
          "Real yields and the dollar drive the marginal dollar's position on the risk curve. Crypto sits at the far end of it.",
        points: [
          "Falling real yields historically coincide with crypto expansion.",
          "Dollar strength is the most reliable headwind for the sector.",
          "Position for the regime, not for the halving calendar.",
        ],
      },
      {
        title: "Flows, float and market structure",
        minutes: 15,
        summary:
          "Who is buying, how much of the supply is actually available, and where the leverage sits. This is the entire fundamental case for most digital assets.",
        points: [
          "Spot vehicle flows are price-insensitive buyers at the margin.",
          "Float, not total supply, determines how fast price moves.",
          "Funding rates tell you who is crowded before the liquidation does.",
        ],
      },
      {
        title: "Sizing a 3x-volatility asset",
        minutes: 10,
        summary:
          "The maths of allocating to something that routinely draws down 40% without ending your portfolio.",
        points: [
          "Size to a risk contribution, not a dollar amount.",
          "Assume a 40% drawdown is normal and survive it without selling.",
          "Rebalance mechanically — conviction fails at extremes.",
        ],
      },
    ],
  },
  {
    slug: "meme-coin-risk",
    title: "Meme Coins: The Risk Module",
    level: "Advanced",
    instructor: "Daniel Okafor",
    instructorRole: "Head of Equity Strategy",
    summary:
      "Not a recommendation engine — a risk protocol. If you are going to participate in attention markets, the only defensible edge is sizing, exit discipline and honest labelling of what you own.",
    outcomes: [
      "Score a meme asset on concentration, depth and narrative decay",
      "Apply hard portfolio caps and mechanical profit-taking",
      "Recognise the distribution phase before it completes",
    ],
    lessons: [
      {
        title: "Three variables, no fundamentals",
        minutes: 12,
        summary:
          "Concentration, order-book depth and narrative half-life. Everything else is marketing.",
        points: [
          "Top-100 wallet concentration above 40% means the exit is narrow.",
          "Depth determines slippage; check it before, not after.",
          "Narrative half-life shortens as a sector matures.",
        ],
      },
      {
        title: "The distribution phase",
        minutes: 11,
        summary:
          "Volume diverging from price while the crowd celebrates is the most reliable warning in this sector.",
        points: [
          "Rising price on falling volume is a liquidity warning, not strength.",
          "Social volume peaks before price peaks, almost always.",
          "Take partials mechanically; nobody sells the top on purpose.",
        ],
      },
    ],
  },
  {
    slug: "portfolio-construction",
    title: "Portfolio Construction for Retail and Institutional",
    level: "Advanced",
    instructor: "Priya Raghunathan",
    instructorRole: "Software Analyst",
    summary:
      "From a list of good ideas to a portfolio that survives. Correlation clusters, risk budgets, rebalancing rules and the reporting discipline that keeps behaviour honest.",
    outcomes: [
      "Group holdings into risk clusters instead of sectors",
      "Set and enforce a risk budget across equities, crypto and cash",
      "Design a rebalancing rule you will actually follow",
    ],
    lessons: [
      {
        title: "Correlation clusters, not sectors",
        minutes: 13,
        summary:
          "Six AI names are one position. Building clusters prevents the illusion of diversification that blows up in a single-factor drawdown.",
        points: [
          "Group by the factor that actually drives returns.",
          "Cap total exposure per cluster, not per ticker.",
          "Review cluster weights after every large move.",
        ],
      },
      {
        title: "The risk budget",
        minutes: 14,
        summary:
          "Decide how much of your total risk goes to equities, crypto and cash before you pick a single name.",
        points: [
          "Risk contribution, not capital allocation, is the real constraint.",
          "High-volatility sleeves need proportionally smaller notional.",
          "Cash is a position with an expected return and a volatility of zero.",
        ],
      },
      {
        title: "Rebalancing you will actually do",
        minutes: 9,
        summary:
          "Calendar plus threshold beats pure optimisation. Simplicity is what makes a rule survive a drawdown.",
        points: [
          "Quarterly review with a 25% drift trigger.",
          "Rebalance into strength, never into a broken thesis.",
          "Write the rule down before you need it.",
        ],
      },
    ],
  },
];

export const COURSE_BY_SLUG: Record<string, Course> = Object.fromEntries(
  COURSES.map((c) => [c.slug, c]),
);

export type Video = {
  id: string;
  title: string;
  channel: string;
  course: string;
  minutes: number;
  note: string;
};

/**
 * Real, playable trading-education videos from established educators on
 * YouTube. They are embedded via youtube-nocookie so the site stays
 * privacy-friendly, and each card links out to the original upload.
 */
export const VIDEOS: Video[] = [
  {
    id: "dMOcrLMfDFM",
    title: "How the Stock Market Actually Works (For Beginners)",
    channel: "Martik Finance",
    course: "reading-trends",
    minutes: 10,
    note: "Exchanges, IPOs, order types and how prices are actually set — the 10-minute version of your first lesson. Watch this before lesson 1.",
  },
  {
    id: "0wf-yybAh7k",
    title: "What Is Market Timing? Investing Basics Explained",
    channel: "Investopedia",
    course: "reading-trends",
    minutes: 2,
    note: "Why predicting the market rarely works — the exact mistake the trend-score method is designed to avoid.",
  },
  {
    id: "f2_CzvABe4M",
    title: "Options Trading Basics — How to Buy & Sell Calls and Puts",
    channel: "Pandrea Money",
    course: "reading-trends",
    minutes: 39,
    note: "Buying calls and puts with real stock examples, plus when selling options makes sense. Advanced watch — pairs with lesson 4's scoring weights.",
  },
  {
    id: "uQLMSU2NNlk",
    title: "Call vs Put Options Basics — Options Trading For Beginners",
    channel: "Option Alpha",
    course: "reading-trends",
    minutes: 17,
    note: "The two contract types everything else is built on: max loss, profit potential and breakevens, explained simply.",
  },
  {
    id: "iAMbSs68rbI",
    title: "Option Trading Basic to Advanced — Learn Trading in Stock Market",
    channel: "Pushkar Raj Thakur",
    course: "reading-trends",
    minutes: 40,
    note: "A full basic-to-advanced walkthrough for later: concepts, strategies and techniques in one sitting.",
  },
  {
    id: "hXkiAfjFtgU",
    title: "What is Bitcoin? — Bitcoin Explained for Beginners",
    channel: "Ali Abdaal",
    course: "crypto-without-hype",
    minutes: 23,
    note: "How Bitcoin and crypto work, why it's controversial, and how to get started — the single best primer before the crypto course.",
  },
  {
    id: "gMJ1v-cRDsk",
    title: "Investing Basics: Cryptocurrency",
    channel: "Charles Schwab",
    course: "crypto-without-hype",
    minutes: 4,
    note: "A major brokerage's own explainer on crypto as an asset class: what it is, how it trades and the risks to price in.",
  },
  {
    id: "OqE4cG5jAOQ",
    title: "What is a Memecoin? (Crypto Beginners)",
    channel: "Crypto Beginners",
    course: "meme-coin-risk",
    minutes: 8,
    note: "The simplest honest definition of a memecoin and why value comes from culture and community, not fundamentals — read this before touching the risk module.",
  },
  {
    id: "LsHcR52gIs8",
    title: "Index Funds For Beginners — The Best Stock Market Investment",
    channel: "ClearValue Tax",
    course: "portfolio-construction",
    minutes: 14,
    note: "Why index funds beat stock-picking for most investors — the perfect counterpoint to our cluster-based construction method.",
  },
];

export const PLANS = [
  {
    id: "reader",
    name: "Reader",
    price: 0,
    cadence: "Free forever",
    tagline: "For learning the framework.",
    features: [
      "Daily trend scores across 1,774 tracked assets",
      "Two free research pieces per month",
      "Foundation course: Reading a Trend",
      "Weekly market pulse newsletter",
    ],
    cta: "Start free",
    highlight: false,
  },
  {
    id: "premium",
    name: "Premium",
    price: 29,
    cadence: "per month",
    tagline: "For the active self-directed investor.",
    features: [
      "Every research piece, uncut",
      "Stance, conviction and invalidation level on every asset",
      "Full crypto and meme-coin coverage with risk grading",
      "All four Academy courses",
      "Watchlist with score-change alerts",
      "Model portfolios: core, tactical, digital assets",
    ],
    cta: "Start 14-day trial",
    highlight: true,
  },
  {
    id: "institutional",
    name: "Institutional",
    price: 249,
    cadence: "per seat / month",
    tagline: "For teams who need the audit trail.",
    features: [
      "Everything in Premium",
      "Multi-seat access with shared watchlists",
      "Signal history and model-change log (CSV)",
      "Monthly strategy call with the research desk",
      "Event calendar: earnings, unlocks, macro prints",
      "API access to trend scores",
    ],
    cta: "Talk to the desk",
    highlight: false,
  },
];
