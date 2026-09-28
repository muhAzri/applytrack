import { useTranslations } from "next-intl";
import { Briefcase } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

export function EmptyState({ onAdd }: { onAdd: () => void }) {
  const t = useTranslations("Dashboard");

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-20 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-secondary">
        <Briefcase weight="duotone" className="size-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 font-semibold">{t("emptyTitle")}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{t("emptyBody")}</p>
      <Button onClick={onAdd} className="mt-5">
        {t("emptyCta")}
      </Button>
    </div>
  );
}
