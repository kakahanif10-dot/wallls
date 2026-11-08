import type { Metadata } from "next";
import CoveragePage from "@/components/coverage-page";

export const metadata: Metadata = {
  title: "Digital asset coverage",
  description:
    "Bitcoin, Ethereum and infrastructure-layer trend scores with liquidity, flow and volatility context.",
};

export default function CryptoPage() {
  return <CoveragePage kind="crypto" />;
}
