import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { LogoMark } from "@/components/logo-mark";
import { AuthForm } from "@/components/auth/auth-form";
import { localizedUrl } from "@/lib/seo";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/signup">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "Auth" });
  return {
    title: t("signupPageTitle"),
    description: t("signupPageDescription"),
    alternates: { canonical: localizedUrl(locale, "/signup") },
  };
}

export default async function SignupPage() {
  const t = await getTranslations("Auth");

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <LogoMark className="size-8" />
          <span className="text-base font-semibold tracking-tight">ApplyTrack</span>
        </Link>
        <div className="rounded-2xl border bg-card p-7 shadow-sm">
          <h1 className="text-xl font-semibold">{t("signupTitle")}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{t("signupSubtitle")}</p>
          <div className="mt-6">
            <AuthForm mode="signup" />
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t("hasAccount")}{" "}
          <Link href="/login" className="font-medium text-foreground underline underline-offset-2">
            {t("toLogin")}
          </Link>
        </p>
      </div>
    </div>
  );
}
