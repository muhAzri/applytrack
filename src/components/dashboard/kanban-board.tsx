"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EmptyState } from "@/components/dashboard/empty-state";
import { KanbanColumn } from "@/components/dashboard/kanban-column";
import { KanbanCard } from "@/components/dashboard/kanban-card";
import {
  APPLICATION_STATUSES,
  type ApplicationInput,
  type ApplicationStatus,
  type JobApplication,
} from "@/types/application";

interface KanbanBoardProps {
  applications: JobApplication[];
  hasAny: boolean;
  locale: string;
  onEdit: (app: JobApplication) => void;
  onDelete: (id: string) => Promise<unknown>;
  onUpdate: (id: string, patch: Partial<ApplicationInput>) => Promise<unknown>;
  onAdd: (status?: ApplicationStatus) => void;
}

export function KanbanBoard({
  applications,
  hasAny,
  locale,
  onEdit,
  onDelete,
  onUpdate,
  onAdd,
}: KanbanBoardProps) {
  const t = useTranslations("Dashboard");
  const tStatus = useTranslations("Status");
  const [activeApp, setActiveApp] = useState<JobApplication | null>(null);
  const [pendingDelete, setPendingDelete] = useState<JobApplication | null>(null);
  const [deleting, setDeleting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  function handleDragStart(event: DragStartEvent) {
    const app = applications.find((a) => a.id === event.active.id);
    setActiveApp(app ?? null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveApp(null);
    if (!over) return;

    const newStatus = over.id as ApplicationStatus;
    const app = applications.find((a) => a.id === active.id);
    if (!app || app.status === newStatus) return;

    try {
      await onUpdate(app.id, { status: newStatus });
      toast.success(t("statusChangedTo", { status: tStatus(newStatus) }));
    } catch {
      toast.error(t("form.saveError"));
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await onDelete(pendingDelete.id);
      toast.success(t("deleteSuccess"));
      setPendingDelete(null);
    } catch {
      toast.error(t("deleteError"));
    } finally {
      setDeleting(false);
    }
  }

  if (!hasAny) {
    return <EmptyState onAdd={() => onAdd()} />;
  }

  return (
    <>
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {APPLICATION_STATUSES.map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              apps={applications.filter((app) => app.status === status)}
              locale={locale}
              onEdit={onEdit}
              onDelete={setPendingDelete}
              onAdd={onAdd}
            />
          ))}
        </div>
        <DragOverlay>
          {activeApp && (
            <KanbanCard
              app={activeApp}
              locale={locale}
              dragging
              onEdit={onEdit}
              onDelete={setPendingDelete}
            />
          )}
        </DragOverlay>
      </DndContext>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete &&
                t("deleteDescription", {
                  position: pendingDelete.position,
                  company: pendingDelete.company,
                })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("deleteCancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={deleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {t("deleteConfirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
