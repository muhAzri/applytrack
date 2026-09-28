import { useTranslations } from "next-intl";
import { Check, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/reveal";

export function GuestVsAccount() {
  const t = useTranslations("GuestVsAccount");

  const guestPoints = [t("guestPoint1"), t("guestPoint2"), t("guestPoint3")];
  const accountPoints = [t("accountPoint1"), t("accountPoint2"), t("accountPoint3")];

  return (
    <section id="mode" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-24">
      <Reveal>
        <h2 className="max-w-lg text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          {t("heading")}
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        <Reveal>
          <div className="flex h-full flex-col rounded-2xl border p-7">
            <span className="w-fit rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {t("guestLabel")}
            </span>
            <ul className="mt-6 flex flex-1 flex-col gap-3.5">
              {guestPoints.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <Check weight="bold" className="mt-0.5 size-4 shrink-0 text-foreground" />
                  {point}
                </li>
              ))}
            </ul>
            <Button
              render={<Link href="/dashboard" />}
              nativeButton={false}
              variant="outline"
              className="mt-7 w-fit"
            >
              {t("ctaGuest")}
              <ArrowRight weight="bold" className="size-4" />
            </Button>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="flex h-full flex-col rounded-2xl border border-primary/30 bg-primary/[0.04] p-7">
            <span className="w-fit rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
              {t("accountLabel")}
            </span>
            <ul className="mt-6 flex flex-1 flex-col gap-3.5">
              {accountPoints.map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <Check weight="bold" className="mt-0.5 size-4 shrink-0 text-primary" />
                  {point}
                </li>
              ))}
            </ul>
            <Button render={<Link href="/signup" />} nativeButton={false} className="mt-7 w-fit">
              {t("ctaAccount")}
              <ArrowRight weight="bold" className="size-4" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
