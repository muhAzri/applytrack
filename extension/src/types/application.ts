// Mirrors ../../../src/types/application.ts — the extension has no build-time
// access to the Next app's source, so keep these two definitions in sync by hand.
export type ApplicationStatus =
  | "wishlist"
  | "applied"
  | "interview"
  | "offer"
  | "rejected";

export interface JobApplication {
  id: string;
  company: string;
  position: string;
  status: ApplicationStatus;
  location: string | null;
  jobUrl: string | null;
  salaryRange: string | null;
  source: string | null;
  appliedDate: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ApplicationInput = Omit<
  JobApplication,
  "id" | "createdAt" | "updatedAt"
>;
