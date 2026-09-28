import { routing } from "@/i18n/routing";

export const SITE_NAME = "ApplyTrack";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const OG_LOCALES: Record<string, string> = {
  id: "id_ID",
  en: "en_US",
};

export function ogLocale(locale: string) {
  return OG_LOCALES[locale] ?? locale;
}

/** Builds a pathname for `locale`, respecting the "as-needed" prefix strategy (default locale is unprefixed). */
export function localizedPath(locale: string, pathname: string) {
  if (locale === routing.defaultLocale) return pathname;
  return pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
}

export function localizedUrl(locale: string, pathname: string) {
  return new URL(localizedPath(locale, pathname), SITE_URL).toString();
}
