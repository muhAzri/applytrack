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
}: PageProps<"/[locale]/login">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "Auth" });
  return {
    title: t("loginPageTitle"),
    description: t("loginPageDescription"),
    alternates: { canonical: localizedUrl(locale, "/login") },
  };
}

export default async function LoginPage() {
  const t = await getTranslations("Auth");

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <LogoMark className="size-8" />
          <span className="text-base font-semibold tracking-tight">ApplyTrack</span>
        </Link>
        <div className="rounded-2xl border bg-card p-7 shadow-sm">
          <h1 className="text-xl font-semibold">{t("loginTitle")}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{t("loginSubtitle")}</p>
          <div className="mt-6">
            <AuthForm mode="login" />
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t("noAccount")}{" "}
          <Link href="/signup" className="font-medium text-foreground underline underline-offset-2">
            {t("toSignup")}
          </Link>
        </p>
      </div>
    </div>
  );
}
