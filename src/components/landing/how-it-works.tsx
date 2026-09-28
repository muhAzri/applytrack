import { useTranslations } from "next-intl";
import { PlusCircle, PencilSimpleLine, Binoculars } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/reveal";

const STEPS = [
  { icon: PlusCircle, titleKey: "step1Title", bodyKey: "step1Body" },
  { icon: PencilSimpleLine, titleKey: "step2Title", bodyKey: "step2Body" },
  { icon: Binoculars, titleKey: "step3Title", bodyKey: "step3Body" },
] as const;

export function HowItWorks() {
  const t = useTranslations("HowItWorks");

  return (
    <section id="cara-kerja" className="border-t bg-secondary/40 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <h2 className="max-w-lg text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {t("heading")}
          </h2>
        </Reveal>
        <div className="relative mt-12 grid gap-10 sm:grid-cols-3">
          <div
            aria-hidden="true"
            className="absolute top-6 right-0 left-0 hidden h-px bg-border sm:block"
          />
          {STEPS.map((step, i) => (
            <Reveal key={step.titleKey} delay={i * 0.08} className="relative">
              <div className="relative z-10 flex size-12 items-center justify-center rounded-full border bg-background">
                <step.icon weight="bold" className="size-5 text-primary" />
              </div>
              <h3 className="mt-5 font-semibold">{t(step.titleKey)}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {t(step.bodyKey)}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
