export interface ScrapedJob {
  company: string;
  position: string;
  location: string | null;
  jobUrl: string;
  salaryRange: string | null;
  source: string;
}

export type ExtensionMessage =
  | { type: "JOB_CAPTURED"; payload: ScrapedJob }
  | { type: "JOB_SAVED"; payload: ScrapedJob };

export const PENDING_CAPTURE_KEY = "pendingCapture";
