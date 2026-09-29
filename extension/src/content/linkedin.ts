import type { ExtensionMessage, ScrapedJob } from "../types/messages";

// LinkedIn is a SPA: this script loads once and must keep working as the user
// navigates between job postings without a full page reload.
//
// LinkedIn's CSS classes are hashed/obfuscated and regenerate across builds
// (confirmed by recording a real Easy Apply flow), so nothing here matches on
// class names. Instead:
//  - The Easy Apply modal is a semantic <dialog data-testid="dialog"> whose
//    heading literally reads "Lamar ke {company}" (id) / "Apply to {company}"
//    (en) — we read the company name straight out of that text.
//  - There is no toast on submit. The confirmation is an inline status panel
//    containing "Lamaran dikirim" (id) / "Application sent" (en) that appears
//    in place, still inside the flow — not a separate widget.
const APPLY_MODAL_SELECTOR = 'dialog[data-testid="dialog"]';
const COMPANY_HEADING_PATTERN = /^(?:Lamar ke|Apply to)\s+(.+)$/i;
const SENT_PATTERN = /lamaran dikirim|application sent/i;

const recentlyReported = new Map<string, number>();
const DEDUPE_WINDOW_MS = 15_000;

// Snapshot of the company name read from the modal heading when it opened,
// keyed by job URL — the modal's own DOM may already be gone/transitioning
// by the time the confirmation panel appears, so we can't re-query it then.
const pendingCompanyByJobUrl = new Map<string, string>();

function currentJobUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  const jobId = params.get("currentJobId");
  if (jobId) return `https://www.linkedin.com/jobs/view/${jobId}/`;
  const match = window.location.pathname.match(/\/jobs\/view\/(\d+)/);
  return match ? `https://www.linkedin.com/jobs/view/${match[1]}/` : null;
}

// Best-effort only: LinkedIn's <title> format isn't confirmed for every
// locale/page variant, and the review card in the side panel lets the user
// fix this by hand, so it's fine if this occasionally comes out wrong/empty.
function guessPositionFromTitle(): string | null {
  const title = document.title.replace(/\s*\|\s*LinkedIn\s*$/i, "").trim();
  if (!title) return null;
  const hiringMatch = title.match(/hiring\s+(.+?)(?:\s+in\s+.+)?$/i);
  if (hiringMatch) return hiringMatch[1].trim();
  const dashIndex = title.indexOf(" - ");
  if (dashIndex > 0) return title.slice(0, dashIndex).trim();
  return title;
}

function handleModalOpened(dialog: HTMLElement) {
  // #dialog-header is what the dialog's own aria-labelledby points at, so
  // it's the accessibility-load-bearing element — LinkedIn can't rename or
  // reorder it without breaking screen readers, unlike an arbitrary <h2>.
  const heading = dialog.querySelector("#dialog-header") ?? dialog.querySelector("h2");
  const match = heading?.textContent?.trim().match(COMPANY_HEADING_PATTERN);
  const jobUrl = currentJobUrl();
  if (!match || !jobUrl) return;
  pendingCompanyByJobUrl.set(jobUrl, match[1].trim());
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

function handleConfirmation() {
  const jobUrl = currentJobUrl();
  if (!jobUrl) return;
  const company = pendingCompanyByJobUrl.get(jobUrl);
  if (!company) {
    console.warn("[ApplyTrack] detected submission but no company was captured for", jobUrl);
    return;
  }

  reportIfNew({
    company,
    position: guessPositionFromTitle() ?? "",
    location: null,
    jobUrl,
    salaryRange: null,
    source: "LinkedIn",
  });
}

function handleAddedNode(node: Node) {
  if (!(node instanceof HTMLElement)) return;

  const dialog = node.matches(APPLY_MODAL_SELECTOR)
    ? node
    : node.querySelector(APPLY_MODAL_SELECTOR);
  if (dialog instanceof HTMLElement) handleModalOpened(dialog);

  if (SENT_PATTERN.test(node.textContent ?? "")) handleConfirmation();
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    mutation.addedNodes.forEach(handleAddedNode);
  }
});

observer.observe(document.body, { childList: true, subtree: true });
