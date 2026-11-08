import type { MetadataRoute } from "next";
import { ASSETS } from "@/lib/market";
import { ARTICLES, COURSES } from "@/lib/content";

const BASE = "https://nextwallstreet.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/markets", "/crypto", "/meme-coins", "/research", "/academy", "/pricing", "/watchlist", "/disclaimer"];

  return [
    ...staticPages.map((path) => ({
      url: `${BASE}${path}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...ASSETS.map((asset) => ({
      url: `${BASE}/ticker/${asset.symbol}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    ...ARTICLES.map((article) => ({
      url: `${BASE}/research/${article.slug}`,
      lastModified: new Date(article.date),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...COURSES.map((course) => ({
      url: `${BASE}/academy/${course.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
