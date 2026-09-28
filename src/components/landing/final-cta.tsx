import { useTranslations } from "next-intl";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";

export function FinalCta() {
  const t = useTranslations("FinalCta");

  return (
    <section className="border-t bg-secondary/40 py-20 sm:py-24">
      <Reveal className="mx-auto max-w-2xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {t("heading")}
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">{t("subtext")}</p>
        <Button
          render={<Link href="/dashboard" />}
          nativeButton={false}
          size="lg"
          className="mt-8 h-12 px-6 text-base"
        >
          {t("cta")}
          <ArrowRight weight="bold" className="size-4" />
        </Button>
      </Reveal>
    </section>
  );
}
