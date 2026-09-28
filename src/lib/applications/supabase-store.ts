import type { SupabaseClient } from "@supabase/supabase-js";
import type { ApplicationInput, JobApplication } from "@/types/application";

interface ApplicationRow {
  id: string;
  user_id: string;
  company: string;
  position: string;
  status: JobApplication["status"];
  location: string | null;
  job_url: string | null;
  salary_range: string | null;
  source: string | null;
  applied_date: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

function rowToApplication(row: ApplicationRow): JobApplication {
  return {
    id: row.id,
    company: row.company,
    position: row.position,
    status: row.status,
    location: row.location,
    jobUrl: row.job_url,
    salaryRange: row.salary_range,
    source: row.source,
    appliedDate: row.applied_date,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function inputToRow(userId: string, input: ApplicationInput) {
  return {
    user_id: userId,
    company: input.company,
    position: input.position,
    status: input.status,
    location: input.location,
    job_url: input.jobUrl,
    salary_range: input.salaryRange,
    source: input.source,
    applied_date: input.appliedDate,
    notes: input.notes,
  };
}

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
