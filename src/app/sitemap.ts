import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { localizedUrl } from "@/lib/seo";

const ROUTES: Array<{
  pathname: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { pathname: "/", changeFrequency: "weekly", priority: 1 },
  { pathname: "/login", changeFrequency: "monthly", priority: 0.3 },
  { pathname: "/signup", changeFrequency: "monthly", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ pathname, changeFrequency, priority }) => ({
    url: localizedUrl(routing.defaultLocale, pathname),
    changeFrequency,
    priority,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [locale, localizedUrl(locale, pathname)])
      ),
    },
  }));
}
