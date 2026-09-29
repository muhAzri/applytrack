import type { ApplicationInput, JobApplication } from "@/types/application";

export interface ApplicationRow {
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

export function rowToApplication(row: ApplicationRow): JobApplication {
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

export function inputToRow(userId: string, input: ApplicationInput) {
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
