import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { AppHeader } from "@/components/dashboard/app-header";
import { SITE_NAME } from "@/lib/seo";

export async function generateMetadata({
  params,
}: LayoutProps<"/[locale]/dashboard">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "Dashboard" });
  return {
    title: `${t("title")} - ${SITE_NAME}`,
    robots: { index: false, follow: false },
  };
}

export default function DashboardLayout({ children }: LayoutProps<"/[locale]/dashboard">) {
  return (
    <div className="flex flex-1 flex-col bg-secondary/20">
      <AppHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
