"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useTranslations } from "next-intl";
import { DotsThreeVertical, PencilSimple, Trash, ArrowSquareOut, MapPin } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { JobApplication } from "@/types/application";

const DATE_LOCALE: Record<string, string> = { id: "id-ID", en: "en-US" };

function formatShortDate(iso: string, locale: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString(DATE_LOCALE[locale] ?? "en-US", {
    day: "numeric",
    month: "short",
  });
}

interface KanbanCardProps {
  app: JobApplication;
  locale: string;
  dragging?: boolean;
  onEdit: (app: JobApplication) => void;
  onDelete: (app: JobApplication) => void;
}

export function KanbanCard({ app, locale, dragging, onEdit, onDelete }: KanbanCardProps) {
  const t = useTranslations("Dashboard");
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: app.id,
  });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      data-card-id={app.id}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "touch-none rounded-xl border bg-card p-3.5 shadow-sm transition-shadow select-none",
        "hover:shadow-md active:cursor-grabbing",
        isDragging && "opacity-40",
        dragging && "rotate-2 shadow-lg"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{app.company}</p>
          <p className="truncate text-sm text-muted-foreground">{app.position}</p>
        </div>
        <div onPointerDown={(e) => e.stopPropagation()} className="shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={t("actionsLabel")}
              className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              render={<button type="button" />}
            >
              <DotsThreeVertical weight="bold" className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(app)}>
                <PencilSimple className="size-4" />
                {t("editAction")}
              </DropdownMenuItem>
              {app.jobUrl && (
                <DropdownMenuItem
                  render={<a href={app.jobUrl} target="_blank" rel="noopener noreferrer" />}
                >
                  <ArrowSquareOut className="size-4" />
                  {t("openListingAction")}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem variant="destructive" onClick={() => onDelete(app)}>
                <Trash className="size-4" />
                {t("deleteAction")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex min-w-0 items-center gap-1">
          {app.location && (
            <>
              <MapPin weight="bold" className="size-3 shrink-0" />
              <span className="truncate">{app.location}</span>
            </>
          )}
        </span>
        <span className="shrink-0 tabular-nums">{formatShortDate(app.appliedDate, locale)}</span>
      </div>
    </div>
  );
}
