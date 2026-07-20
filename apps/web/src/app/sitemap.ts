import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL.href,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: new URL("/about", SITE_URL).href,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: new URL("/features", SITE_URL).href,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
