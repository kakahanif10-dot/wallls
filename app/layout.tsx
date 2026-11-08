import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import LivePricesProvider from "@/components/live-prices";
import { liveSeed } from "@/lib/market";

export const metadata: Metadata = {
  metadataBase: new URL("https://nextwallstreet.com"),
  title: {
    default: "NextWall Street — market trend analysis, research and education",
    template: "%s — NextWall Street",
  },
  description:
    "Trend scores, research and education for stocks, crypto and meme coins. A transparent, rules-based read on what is working — not a tip sheet.",
  keywords: [
    "market trend analysis",
    "stock research",
    "crypto analysis",
    "meme coin risk",
    "investment education",
    "subscription research",
  ],
  openGraph: {
    title: "NextWall Street",
    description:
      "Rules-based trend analysis across equities, crypto and meme coins, with the education to use it.",
    type: "website",
    url: "https://nextwallstreet.com",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <LivePricesProvider seed={liveSeed()}>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
        </LivePricesProvider>
      </body>
    </html>
  );
}
