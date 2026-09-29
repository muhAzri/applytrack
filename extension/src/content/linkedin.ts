import type { ExtensionMessage, ScrapedJob } from "../types/messages";

// LinkedIn is a SPA: this script loads once and must keep working as the user
// navigates between job postings without a full page reload.
//
// Detection strategy: instead of parsing the Easy Apply modal's internal steps
// (which carry hashed, frequently-changing class names), we watch for the
// success *toast* LinkedIn raises after any submission ("Application sent" /
// "Your application was sent to ..."). The toast markup is shared app-wide and
// far more stable than the modal internals. Job details are then read from the
// job detail pane that's open behind the modal at that moment.
const TOAST_SELECTOR = ".artdeco-toast-item";
const SENT_PATTERN = /application (was )?sent/i;

const recentlyReported = new Map<string, number>();
const DEDUPE_WINDOW_MS = 15_000;

function firstText(selectors: string[]): string | null {
  for (const selector of selectors) {
    const el = document.querySelector(selector);
    const text = el?.textContent?.trim();
    if (text) return text;
  }
  return null;
}

function currentJobUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  const jobId = params.get("currentJobId");
  if (jobId) return `https://www.linkedin.com/jobs/view/${jobId}/`;
  const match = window.location.pathname.match(/\/jobs\/view\/(\d+)/);
  return match ? `https://www.linkedin.com/jobs/view/${match[1]}/` : null;
}

function scrapeCurrentJob(): ScrapedJob | null {
  const jobUrl = currentJobUrl();
  if (!jobUrl) return null;

  const position = firstText([
    ".job-details-jobs-unified-top-card__job-title h1",
    ".jobs-unified-top-card__job-title",
    "h1.t-24",
  ]);
  const company = firstText([
    ".job-details-jobs-unified-top-card__company-name a",
    ".job-details-jobs-unified-top-card__company-name",
    ".jobs-unified-top-card__company-name",
  ]);
  if (!position || !company) return null;

  const location = firstText([
    ".job-details-jobs-unified-top-card__primary-description-container .tvm__text",
    ".jobs-unified-top-card__bullet",
  ]);

  return {
    company,
    position,
    location,
    jobUrl,
    salaryRange: null,
    source: "LinkedIn",
  };
}

function reportIfNew(job: ScrapedJob) {
  const now = Date.now();
  const lastSeen = recentlyReported.get(job.jobUrl);
  if (lastSeen && now - lastSeen < DEDUPE_WINDOW_MS) return;
  recentlyReported.set(job.jobUrl, now);

  const message: ExtensionMessage = { type: "JOB_CAPTURED", payload: job };
  chrome.runtime.sendMessage(message).catch((error) => {
    console.error("[ApplyTrack] failed to report captured job", error);
  });
}

function handleAddedNode(node: Node) {
  if (!(node instanceof HTMLElement)) return;
  const toast = node.matches(TOAST_SELECTOR)
    ? node
    : node.querySelector(TOAST_SELECTOR);
  if (!toast) return;
  if (!SENT_PATTERN.test(toast.textContent ?? "")) return;

  const job = scrapeCurrentJob();
  if (job) reportIfNew(job);
  else console.warn("[ApplyTrack] detected submission but could not scrape job details");
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    mutation.addedNodes.forEach(handleAddedNode);
  }
});

observer.observe(document.body, { childList: true, subtree: true });
