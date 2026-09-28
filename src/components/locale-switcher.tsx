"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("LocaleSwitcher");

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={cn(
        "inline-flex items-center rounded-full border p-0.5 text-xs font-medium",
        className
      )}
    >
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => router.replace(pathname, { locale: loc })}
          aria-pressed={locale === loc}
          className={cn(
            "rounded-full px-2 py-1 uppercase transition-colors",
            locale === loc
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {loc}
        </button>
      ))}
    </div>
  );
}
