"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CircleNotch } from "@phosphor-icons/react";
import {
  APPLICATION_STATUSES,
  COMMON_SOURCE_PLATFORMS,
  type ApplicationInput,
  type ApplicationStatus,
  type JobApplication,
} from "@/types/application";

const EMPTY_FORM = {
  company: "",
  position: "",
  status: "applied" as ApplicationStatus,
  appliedDate: new Date().toISOString().slice(0, 10),
  location: "",
  jobUrl: "",
  salaryRange: "",
  source: "",
  notes: "",
};

type FormState = typeof EMPTY_FORM;

function toFormState(app: JobApplication): FormState {
  return {
    company: app.company,
    position: app.position,
    status: app.status,
    appliedDate: app.appliedDate,
    location: app.location ?? "",
    jobUrl: app.jobUrl ?? "",
    salaryRange: app.salaryRange ?? "",
    source: app.source ?? "",
    notes: app.notes ?? "",
  };
}

interface ApplicationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: JobApplication | null;
  onSubmit: (input: ApplicationInput) => Promise<unknown>;
}

export function ApplicationFormDialog({
  open,
  onOpenChange,
  editing,
  onSubmit,
}: ApplicationFormDialogProps) {
  const t = useTranslations("Dashboard.form");
  const tStatus = useTranslations("Status");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Reset the form whenever the dialog opens (or switches which item it's
  // editing) by adjusting state during render, per React's guidance for
  // syncing state to a changing prop instead of doing it in an effect.
  const openKey = open ? editing?.id ?? "__new__" : null;
  const [syncedKey, setSyncedKey] = useState<string | null>(null);
  if (openKey !== null && openKey !== syncedKey) {
    setSyncedKey(openKey);
    setForm(editing ? toFormState(editing) : EMPTY_FORM);
    setError(null);
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.company.trim() || !form.position.trim()) {
      setError(t("requiredError"));
      return;
    }
    if (!form.appliedDate) {
      setError(t("dateRequiredError"));
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        company: form.company.trim(),
        position: form.position.trim(),
        status: form.status,
        appliedDate: form.appliedDate,
        location: form.location.trim() || null,
        jobUrl: form.jobUrl.trim() || null,
        salaryRange: form.salaryRange.trim() || null,
        source: form.source.trim() || null,
        notes: form.notes.trim() || null,
      });
      toast.success(editing ? t("editSuccess") : t("addSuccess"));
      onOpenChange(false);
    } catch {
      toast.error(t("saveError"));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editing ? t("editTitle") : t("addTitle")}</DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="company">{t("companyLabel")}</Label>
                <Input
                  id="company"
                  value={form.company}
                  onChange={(e) => set("company", e.target.value)}
                  placeholder={t("companyPlaceholder")}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="position">{t("positionLabel")}</Label>
                <Input
                  id="position"
                  value={form.position}
                  onChange={(e) => set("position", e.target.value)}
                  placeholder={t("positionPlaceholder")}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="status">{t("statusLabel")}</Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => set("status", v as ApplicationStatus)}
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue>
                      {(value: ApplicationStatus) => tStatus(value)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {APPLICATION_STATUSES.map((status) => (
                      <SelectItem key={status} value={status}>
                        {tStatus(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="appliedDate">{t("dateLabel")}</Label>
                <Input
                  id="appliedDate"
                  type="date"
                  value={form.appliedDate}
                  onChange={(e) => set("appliedDate", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="location">{t("locationLabel")}</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => set("location", e.target.value)}
                  placeholder={t("locationPlaceholder")}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="salaryRange">{t("salaryLabel")}</Label>
                <Input
                  id="salaryRange"
                  value={form.salaryRange}
                  onChange={(e) => set("salaryRange", e.target.value)}
                  placeholder={t("salaryPlaceholder")}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="source">{t("sourceLabel")}</Label>
                <Input
                  id="source"
                  list="source-suggestions"
                  value={form.source}
                  onChange={(e) => set("source", e.target.value)}
                  placeholder={t("sourcePlaceholder")}
                />
                <datalist id="source-suggestions">
                  {COMMON_SOURCE_PLATFORMS.map((s) => (
                    <option key={s} value={s} />
                  ))}
                  <option value={t("sourceReferral")} />
                  <option value={t("sourceCompanyWebsite")} />
                </datalist>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="jobUrl">{t("urlLabel")}</Label>
                <Input
                  id="jobUrl"
                  type="url"
                  value={form.jobUrl}
                  onChange={(e) => set("jobUrl", e.target.value)}
                  placeholder={t("urlPlaceholder")}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="notes">{t("notesLabel")}</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
                placeholder={t("notesPlaceholder")}
                rows={3}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <Button type="submit" disabled={submitting} className="min-w-28">
              {submitting && <CircleNotch className="size-4 animate-spin" />}
              {editing ? t("submitEdit") : t("submitAdd")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
