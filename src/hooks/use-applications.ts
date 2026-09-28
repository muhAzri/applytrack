"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/auth-context";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { localApplicationStore } from "@/lib/applications/local-store";
import { supabaseApplicationStore } from "@/lib/applications/supabase-store";
import type { ApplicationInput, JobApplication } from "@/types/application";

export function useApplications() {
  const t = useTranslations("Dashboard");
  const { user, loading: authLoading, isConfigured } = useAuth();
  const mode: "guest" | "cloud" = user ? "cloud" : "guest";

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const syncLockRef = useRef(false);

  const refetch = useCallback(async () => {
    if (!user) {
      setApplications(localApplicationStore.getAll());
      setLoading(false);
      return;
    }
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;
    setLoading(true);
    try {
      const rows = await supabaseApplicationStore.list(supabase, user.id);
      setApplications(rows);
    } catch {
      toast.error(t("loadError"));
    } finally {
      setLoading(false);
    }
  }, [user, t]);

  useEffect(() => {
    if (authLoading) return;
    void (async () => {
      await refetch();
    })();
  }, [authLoading, refetch]);

  // Auto-sync: when a guest signs in/up, push whatever is in localStorage
  // into their Supabase account, then clear the local copy.
  useEffect(() => {
    if (authLoading || !user || syncLockRef.current) return;
    const guestApps = localApplicationStore.getAll();
    if (guestApps.length === 0) return;

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    syncLockRef.current = true;
    (async () => {
      setSyncing(true);
      try {
        await supabaseApplicationStore.bulkCreate(
          supabase,
          user.id,
          guestApps.map(
            ({
              company,
              position,
              status,
              location,
              jobUrl,
              salaryRange,
              source,
              appliedDate,
              notes,
            }) => ({
              company,
              position,
              status,
              location,
              jobUrl,
              salaryRange,
              source,
              appliedDate,
              notes,
            })
          )
        );
        localApplicationStore.clear();
        toast.success(t("syncSuccess", { count: guestApps.length }));
        await refetch();
      } catch {
        toast.error(t("syncError"));
      } finally {
        setSyncing(false);
      }
    })();
  }, [authLoading, user, refetch, t]);

  const create = useCallback(
    async (input: ApplicationInput) => {
      if (!user) {
        const item = localApplicationStore.create(input);
        setApplications((prev) => [item, ...prev]);
        return item;
      }
      const supabase = getSupabaseBrowserClient();
      if (!supabase) throw new Error("Supabase belum dikonfigurasi.");
      const item = await supabaseApplicationStore.create(
        supabase,
        user.id,
        input
      );
      setApplications((prev) => [item, ...prev]);
      return item;
    },
    [user]
  );

  const update = useCallback(
    async (id: string, patch: Partial<ApplicationInput>) => {
      if (!user) {
        const item = localApplicationStore.update(id, patch);
        if (item) {
          setApplications((prev) =>
            prev.map((app) => (app.id === id ? item : app))
          );
        }
        return item;
      }
      const supabase = getSupabaseBrowserClient();
      if (!supabase) throw new Error("Supabase belum dikonfigurasi.");
      const item = await supabaseApplicationStore.update(supabase, id, patch);
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? item : app))
      );
      return item;
    },
    [user]
  );

  const remove = useCallback(
    async (id: string) => {
      if (!user) {
        localApplicationStore.remove(id);
        setApplications((prev) => prev.filter((app) => app.id !== id));
        return;
      }
      const supabase = getSupabaseBrowserClient();
      if (!supabase) throw new Error("Supabase belum dikonfigurasi.");
      await supabaseApplicationStore.remove(supabase, id);
      setApplications((prev) => prev.filter((app) => app.id !== id));
    },
    [user]
  );

  return {
    applications,
    loading: loading || authLoading,
    syncing,
    mode,
    isConfigured,
    create,
    update,
    remove,
    refetch,
  };
}
