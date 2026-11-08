import type { Metadata } from "next";
import CoveragePage from "@/components/coverage-page";

export const metadata: Metadata = {
  title: "Meme coin risk coverage",
  description:
    "Attention-market coverage graded on concentration, order-book depth and narrative half-life — with hard position caps.",
};

export default function MemeCoinsPage() {
  return <CoveragePage kind="meme" />;
}
