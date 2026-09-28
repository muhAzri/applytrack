"use client";

import { useDroppable } from "@dnd-kit/core";
import { useTranslations } from "next-intl";
import { Plus } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { STATUS_DOT_CLASS, type ApplicationStatus, type JobApplication } from "@/types/application";
import { KanbanCard } from "@/components/dashboard/kanban-card";

interface KanbanColumnProps {
  status: ApplicationStatus;
  apps: JobApplication[];
  locale: string;
  onEdit: (app: JobApplication) => void;
  onDelete: (app: JobApplication) => void;
  onAdd: (status: ApplicationStatus) => void;
}

export function KanbanColumn({ status, apps, locale, onEdit, onDelete, onAdd }: KanbanColumnProps) {
  const tStatus = useTranslations("Status");
  const tDashboard = useTranslations("Dashboard");
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex w-72 shrink-0 flex-col sm:w-80">
      <div className="flex items-center gap-2 px-1 pb-3">
        <span className={cn("size-1.5 rounded-full", STATUS_DOT_CLASS[status])} />
        <h3 className="text-sm font-medium">{tStatus(status)}</h3>
        <span className="text-xs text-muted-foreground tabular-nums">{apps.length}</span>
        <button
          type="button"
          onClick={() => onAdd(status)}
          aria-label={`${tDashboard("addButton")} (${tStatus(status)})`}
          className="ml-auto flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Plus weight="bold" className="size-4" />
        </button>
      </div>
      <div
        ref={setNodeRef}
        data-column={status}
        className={cn(
          "flex min-h-40 flex-1 flex-col gap-2 rounded-2xl border border-dashed p-2 transition-colors",
          "max-h-[calc(100vh-19rem)] overflow-y-auto",
          isOver ? "border-primary/50 bg-primary/5" : "border-border/70 bg-secondary/20"
        )}
      >
        {apps.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-8 text-center text-xs text-muted-foreground">
            {tDashboard("boardColumnEmpty")}
          </div>
        ) : (
          apps.map((app) => (
            <KanbanCard key={app.id} app={app} locale={locale} onEdit={onEdit} onDelete={onDelete} />
          ))
        )}
      </div>
    </div>
  );
}
