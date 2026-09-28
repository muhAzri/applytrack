import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
  STATUS_BADGE_CLASS,
  STATUS_DOT_CLASS,
  type ApplicationStatus,
} from "@/types/application";

export function StatusBadge({
  status,
  className,
}: {
  status: ApplicationStatus;
  className?: string;
}) {
  const t = useTranslations("Status");

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        STATUS_BADGE_CLASS[status],
        className
      )}
    >
      <span className={cn("size-1.5 rounded-full", STATUS_DOT_CLASS[status])} />
      {t(status)}
    </span>
  );
}
