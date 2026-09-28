"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import {
  DotsThreeVertical,
  PencilSimple,
  Trash,
  ArrowSquareOut,
} from "@phosphor-icons/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "@/components/applications/status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/dashboard/empty-state";
import type { JobApplication } from "@/types/application";

const DATE_LOCALE: Record<string, string> = { id: "id-ID", en: "en-US" };

function formatDate(iso: string, locale: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString(
    DATE_LOCALE[locale] ?? "en-US",
    { day: "numeric", month: "short", year: "numeric" }
  );
}

interface ApplicationsTableProps {
  applications: JobApplication[];
  loading: boolean;
  hasAny: boolean;
  onEdit: (app: JobApplication) => void;
  onDelete: (id: string) => Promise<unknown>;
  onAdd: () => void;
}

export function ApplicationsTable({
  applications,
  loading,
  hasAny,
  onEdit,
  onDelete,
  onAdd,
}: ApplicationsTableProps) {
  const locale = useLocale();
  const t = useTranslations("Dashboard");
  const [pendingDelete, setPendingDelete] = useState<JobApplication | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border bg-card">
        <div className="divide-y">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="ml-auto h-5 w-20 rounded-full" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!hasAny) {
    return <EmptyState onAdd={onAdd} />;
  }

  if (applications.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed px-6 py-16 text-center text-sm text-muted-foreground">
        {t("noResults")}
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>{t("columnCompanyPosition")}</TableHead>
              <TableHead className="hidden md:table-cell">{t("columnLocation")}</TableHead>
              <TableHead>{t("columnStatus")}</TableHead>
              <TableHead className="hidden sm:table-cell">{t("columnDate")}</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell>
                  <p className="font-medium">{app.company}</p>
                  <p className="text-sm text-muted-foreground">{app.position}</p>
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                  {app.location || t("locationFallback")}
                </TableCell>
                <TableCell>
                  <StatusBadge status={app.status} />
                </TableCell>
                <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                  {formatDate(app.appliedDate, locale)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      aria-label={t("actionsLabel")}
                      className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
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
                          render={
                            <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" />
                          }
                        >
                          <ArrowSquareOut className="size-4" />
                          {t("openListingAction")}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setPendingDelete(app)}
                      >
                        <Trash className="size-4" />
                        {t("deleteAction")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
