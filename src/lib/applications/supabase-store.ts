import type { SupabaseClient } from "@supabase/supabase-js";
import type { ApplicationInput, JobApplication } from "@/types/application";
import {
  inputToRow,
  rowToApplication,
  type ApplicationRow,
} from "./row-mapping";

const TABLE = "applications";

export const supabaseApplicationStore = {
  async list(supabase: SupabaseClient, userId: string): Promise<JobApplication[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("user_id", userId)
      .order("applied_date", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as ApplicationRow[]).map(rowToApplication);
  },

  async create(
    supabase: SupabaseClient,
    userId: string,
    input: ApplicationInput
  ): Promise<JobApplication> {
    const { data, error } = await supabase
      .from(TABLE)
      .insert(inputToRow(userId, input))
      .select()
      .single();
    if (error) throw error;
    return rowToApplication(data as ApplicationRow);
  },

  async update(
    supabase: SupabaseClient,
    id: string,
    patch: Partial<ApplicationInput>
  ): Promise<JobApplication> {
    const row: Record<string, unknown> = {};
    if (patch.company !== undefined) row.company = patch.company;
    if (patch.position !== undefined) row.position = patch.position;
    if (patch.status !== undefined) row.status = patch.status;
    if (patch.location !== undefined) row.location = patch.location;
    if (patch.jobUrl !== undefined) row.job_url = patch.jobUrl;
    if (patch.salaryRange !== undefined) row.salary_range = patch.salaryRange;
    if (patch.source !== undefined) row.source = patch.source;
    if (patch.appliedDate !== undefined) row.applied_date = patch.appliedDate;
    if (patch.notes !== undefined) row.notes = patch.notes;

    const { data, error } = await supabase
      .from(TABLE)
      .update(row)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return rowToApplication(data as ApplicationRow);
  },

  async remove(supabase: SupabaseClient, id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) throw error;
  },

  async bulkCreate(
    supabase: SupabaseClient,
    userId: string,
    inputs: ApplicationInput[]
  ): Promise<void> {
    if (inputs.length === 0) return;
    const { error } = await supabase
      .from(TABLE)
      .insert(inputs.map((input) => inputToRow(userId, input)));
    if (error) throw error;
  },
};
