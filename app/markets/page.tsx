import type { Metadata } from "next";
import CoveragePage from "@/components/coverage-page";

export const metadata: Metadata = {
  title: "US equity coverage",
  description:
    "Trend scores, stances and risk grades for twelve large-cap US equities across AI infrastructure, software, financials, energy and consumer.",
};

export default function MarketsPage() {
  return <CoveragePage kind="stock" />;
}
