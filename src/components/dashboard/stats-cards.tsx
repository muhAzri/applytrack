import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  APPLICATION_STATUSES,
  STATUS_DOT_CLASS,
  type JobApplication,
} from "@/types/application";

export function StatsCards({ applications }: { applications: JobApplication[] }) {
  const tStatus = useTranslations("Status");
  const tDashboard = useTranslations("Dashboard");
  const total = applications.length;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <div className="rounded-xl border bg-card px-4 py-3.5">
        <p className="text-2xl font-semibold tabular-nums">{total}</p>
        <p className="text-xs text-muted-foreground">{tDashboard("totalLabel")}</p>
      </div>
      {APPLICATION_STATUSES.map((status) => {
        const count = applications.filter((app) => app.status === status).length;
        return (
          <div key={status} className="rounded-xl border bg-card px-4 py-3.5">
            <div className="flex items-center gap-1.5">
              <span className={cn("size-1.5 rounded-full", STATUS_DOT_CLASS[status])} />
              <p className="text-2xl font-semibold tabular-nums">{count}</p>
            </div>
            <p className="text-xs text-muted-foreground">{tStatus(status)}</p>
          </div>
        );
      })}
    </div>
  );
}
