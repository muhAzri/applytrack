import { useTranslations } from "next-intl";
import {
  ListChecks,
  ShieldCheck,
  ArrowsClockwise,
  ChartLineUp,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/reveal";

export function Features() {
  const t = useTranslations("Features");

  return (
    <section id="fitur" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <Reveal>
        <h2 className="max-w-lg text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {t("heading")}
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
        <Reveal className="lg:col-span-2 lg:row-span-2">
          <div className="flex h-full flex-col justify-between rounded-2xl border bg-card p-7">
            <ListChecks weight="duotone" className="size-8 text-primary" />
            <div className="mt-8">
              <h3 className="text-xl font-semibold">{t("listTitle")}</h3>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
                {t("listBody")}
              </p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="flex h-full flex-col justify-between rounded-2xl border bg-card p-7">
            <ChartLineUp weight="duotone" className="size-8 text-primary" />
            <div className="mt-8">
              <h3 className="font-semibold">{t("statusTitle")}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t("statusBody")}
              </p>
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex h-full flex-col justify-between rounded-2xl border bg-primary p-7 text-primary-foreground">
            <ArrowsClockwise weight="duotone" className="size-8" />
            <div className="mt-8">
              <h3 className="font-semibold">{t("syncTitle")}</h3>
              <p className="mt-2 text-sm leading-relaxed opacity-90">{t("syncBody")}</p>
            </div>
          </div>
        </Reveal>
      </div>
      <Reveal delay={0.15} className="mt-4">
        <div className="flex items-center gap-4 rounded-2xl border bg-card p-6">
          <ShieldCheck weight="duotone" className="size-8 shrink-0 text-primary" />
          <p className="text-sm leading-relaxed text-muted-foreground">{t("securityBody")}</p>
        </div>
      </Reveal>
    </section>
  );
}
