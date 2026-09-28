import { useTranslations } from "next-intl";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { HeroPreview } from "@/components/landing/hero-preview";
import { Reveal } from "@/components/reveal";

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-16 pb-20 sm:px-6 sm:pt-20 sm:pb-28 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
      <Reveal>
        <div className="max-w-2xl">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
            {t("headline")}
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
            {t("subtext")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              render={<Link href="/dashboard" />}
              nativeButton={false}
              size="lg"
              className="h-12 px-6 text-base"
            >
              {t("ctaPrimary")}
              <ArrowRight weight="bold" className="size-4" />
            </Button>
            <Button
              render={<a href="#cara-kerja" />}
              nativeButton={false}
              size="lg"
              variant="outline"
              className="h-12 px-6 text-base"
            >
              {t("ctaSecondary")}
            </Button>
          </div>
        </div>
      </Reveal>
      <Reveal delay={0.1} className="flex justify-center lg:justify-end">
        <HeroPreview />
      </Reveal>
    </section>
  );
}
