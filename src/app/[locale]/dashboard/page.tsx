"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { MagnifyingGlass, Plus, CloudArrowUp, Table as TableIcon, Kanban } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { ApplicationsTable } from "@/components/dashboard/applications-table";
import { KanbanBoard } from "@/components/dashboard/kanban-board";
import { ApplicationFormDialog } from "@/components/dashboard/application-form-dialog";
import { useApplications } from "@/hooks/use-applications";
import { cn } from "@/lib/utils";
import {
  APPLICATION_STATUSES,
  type ApplicationStatus,
  type JobApplication,
} from "@/types/application";

type FilterValue = "all" | ApplicationStatus;
type View = "table" | "board";

const VIEW_STORAGE_KEY = "applytrack:view";

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const tStatus = useTranslations("Status");
  const locale = useLocale();
  const { applications, loading, syncing, create, update, remove } = useApplications();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterValue>("all");
  const [view, setView] = useState<View>(() => {
    if (typeof window === "undefined") return "board";
    const stored = window.localStorage.getItem(VIEW_STORAGE_KEY);
    return stored === "table" || stored === "board" ? stored : "board";
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<JobApplication | null>(null);

  function changeView(next: View) {
    setView(next);
    window.localStorage.setItem(VIEW_STORAGE_KEY, next);
  }

  const searched = useMemo(() => {
    if (!search.trim()) return applications;
    const q = search.trim().toLowerCase();
    return applications.filter(
      (app) =>
        app.company.toLowerCase().includes(q) || app.position.toLowerCase().includes(q)
    );
  }, [applications, search]);

  const tableFiltered = useMemo(() => {
    if (filter === "all") return searched;
    return searched.filter((app) => app.status === filter);
  }, [searched, filter]);

  function openCreate() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(app: JobApplication) {
    setEditing(app);
    setDialogOpen(true);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      {syncing && (
        <div className="mb-5 flex items-center gap-2.5 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm text-primary">
          <CloudArrowUp weight="bold" className="size-4 animate-pulse" />
          {t("syncingBanner")}
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <Button onClick={openCreate} className="w-fit">
          <Plus weight="bold" className="size-4" />
          {t("addButton")}
        </Button>
      </div>

      <div className="mt-6">
        <StatsCards applications={applications} />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {view === "table" ? (
          <Tabs value={filter} onValueChange={(v) => setFilter(v as FilterValue)}>
            <TabsList className="w-full overflow-x-auto sm:w-fit">
              <TabsTrigger value="all">{t("allFilter")}</TabsTrigger>
              {APPLICATION_STATUSES.map((status) => (
                <TabsTrigger key={status} value={status}>
                  {tStatus(status)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        ) : (
          <div />
        )}
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <MagnifyingGlass className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="pl-9"
            />
          </div>
          <div role="group" className="inline-flex items-center gap-0.5 rounded-lg border p-0.5">
            <button
              type="button"
              aria-pressed={view === "table"}
              onClick={() => changeView("table")}
              className={cn(
                "flex size-7 items-center justify-center rounded-md transition-colors",
                view === "table"
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title={t("viewTable")}
            >
              <TableIcon weight="bold" className="size-4" />
            </button>
            <button
              type="button"
              aria-pressed={view === "board"}
              onClick={() => changeView("board")}
              className={cn(
                "flex size-7 items-center justify-center rounded-md transition-colors",
                view === "board"
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title={t("viewBoard")}
            >
              <Kanban weight="bold" className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        {view === "table" ? (
          <ApplicationsTable
            applications={tableFiltered}
            loading={loading}
            hasAny={applications.length > 0}
            onEdit={openEdit}
            onDelete={remove}
            onAdd={openCreate}
          />
        ) : loading ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {APPLICATION_STATUSES.map((status) => (
              <div key={status} className="h-64 w-72 shrink-0 animate-pulse rounded-2xl bg-secondary/40 sm:w-80" />
            ))}
          </div>
        ) : (
          <KanbanBoard
            applications={searched}
            hasAny={applications.length > 0}
            locale={locale}
            onEdit={openEdit}
            onDelete={remove}
            onUpdate={update}
            onAdd={openCreate}
          />
        )}
      </div>

      <ApplicationFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editing={editing}
        onSubmit={(input) =>
          editing ? update(editing.id, input) : create(input)
        }
      />
    </div>
  );
}
