import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/applications/status-badge";
import type { ApplicationStatus } from "@/types/application";

const SAMPLE_ROWS: Array<{
  company: string;
  position: string;
  status: ApplicationStatus;
  date: string;
}> = [
  { company: "Mitra Digital Nusantara", position: "Frontend Engineer", status: "interview", date: "12 Sep" },
  { company: "Bank Sentosa Indonesia", position: "Product Analyst", status: "applied", date: "8 Sep" },
  { company: "Karya Teknologi", position: "UI/UX Designer", status: "offer", date: "2 Sep" },
  { company: "Lintas Data Prima", position: "Backend Engineer", status: "wishlist", date: "1 Sep" },
];

export function HeroPreview() {
  const t = useTranslations("Hero");

  return (
    <Card className="w-full max-w-md gap-0 overflow-hidden py-0 shadow-xl shadow-zinc-950/5 dark:shadow-black/30">
      <div className="flex items-center justify-between border-b px-5 py-4">
        <div>
          <p className="text-sm font-semibold">{t("previewTitle")}</p>
          <p className="text-xs text-muted-foreground">{t("previewSubtitle")}</p>
        </div>
        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          {t("previewBadge")}
        </span>
      </div>
      <ul className="divide-y">
        {SAMPLE_ROWS.map((row) => (
          <li key={row.company} className="flex items-center gap-3 px-5 py-3.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-semibold text-secondary-foreground">
              {row.company.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{row.position}</p>
              <p className="truncate text-xs text-muted-foreground">{row.company}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <StatusBadge status={row.status} />
              <span className="text-[11px] text-muted-foreground">{row.date}</span>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
