import type { MetadataRoute } from "next";
import { released } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: SITE_URL, priority: 1 },
    { url: `${SITE_URL}/he`, priority: 0.9 },
  ];
  for (const s of released) {
    pages.push({ url: `${SITE_URL}/sessions/${s.slug}`, priority: 0.8 });
    pages.push({ url: `${SITE_URL}/he/sessions/${s.slug}`, priority: 0.7 });
  }
  return pages;
}
