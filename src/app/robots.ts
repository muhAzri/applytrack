import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL, localizedPath } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: routing.locales.map((locale) => localizedPath(locale, "/dashboard")),
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
