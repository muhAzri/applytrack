import { ImageResponse } from "next/og";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SITE_NAME } from "@/lib/seo";

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "Metadata" });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#009966",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <svg width="112" height="112" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="9" fill="#FAFAFA" />
            <path
              d="M9 17.5L13.2 21.5L23 10.5"
              stroke="#009966"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, color: "#FAFAFA" }}>
            {SITE_NAME}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 34,
            color: "rgba(250, 250, 250, 0.88)",
            maxWidth: 920,
            lineHeight: 1.4,
          }}
        >
          {t("description")}
        </div>
      </div>
    ),
    { ...size }
  );
}
