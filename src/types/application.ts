export type ApplicationStatus =
  | "wishlist"
  | "applied"
  | "interview"
  | "offer"
  | "rejected";

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "wishlist",
  "applied",
  "interview",
  "offer",
  "rejected",
];

export const STATUS_BADGE_CLASS: Record<ApplicationStatus, string> = {
  wishlist:
    "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700",
  applied:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900",
  interview:
    "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900",
  offer:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-900",
  rejected:
    "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-900",
};

export const STATUS_DOT_CLASS: Record<ApplicationStatus, string> = {
  wishlist: "bg-zinc-400",
  applied: "bg-blue-500",
  interview: "bg-amber-500",
  offer: "bg-emerald-500",
  rejected: "bg-rose-500",
};

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

export const COMMON_SOURCE_PLATFORMS = ["LinkedIn", "JobStreet", "Indeed", "Glints", "Kalibrr"];
