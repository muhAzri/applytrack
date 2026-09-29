import type { ExtensionMessage, ScrapedJob } from "../types/messages";
import { PENDING_CAPTURE_KEY } from "../types/messages";
import { auth, applications } from "../lib/api-client";
import { today } from "../lib/dates";

// Clicking the toolbar icon opens the side panel directly instead of a popup.
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error("Failed to set side panel behavior", error));

const BADGE_CLEAR_MS = 4_000;

function flashBadge(text: string, color: string) {
  void chrome.action.setBadgeBackgroundColor({ color });
  void chrome.action.setBadgeText({ text });
  setTimeout(() => void chrome.action.setBadgeText({ text: "" }), BADGE_CLEAR_MS);
}

// Not signed in / save failed: fall back to the old flow so the user can
// finish sign-in or fix the details by hand instead of losing the capture.
async function fallbackToReview(job: ScrapedJob, windowId: number | undefined) {
  await chrome.storage.session.set({ [PENDING_CAPTURE_KEY]: job });
  if (windowId !== undefined) void chrome.sidePanel.open({ windowId });
}

async function handleJobCaptured(job: ScrapedJob, windowId: number | undefined) {
  const session = await auth.getSession();
  if (!session) {
    await fallbackToReview(job, windowId);
    return;
  }

  try {
    await applications.create({
      company: job.company,
      position: job.position,
      status: "applied",
      location: job.location,
      jobUrl: job.jobUrl,
      salaryRange: job.salaryRange,
      source: job.source,
      appliedDate: today(),
      notes: null,
    });
    flashBadge("✓", "#16a34a");
    // Best-effort: only lands if the side panel happens to be open.
    chrome.runtime.sendMessage({ type: "JOB_SAVED", payload: job } satisfies ExtensionMessage).catch(() => {});
  } catch (error) {
    console.error("[ApplyTrack] auto-save failed, falling back to manual review", error);
    flashBadge("!", "#dc2626");
    await fallbackToReview(job, windowId);
  }
}

chrome.runtime.onMessage.addListener((message: ExtensionMessage, sender) => {
  if (message.type !== "JOB_CAPTURED") return;
  void handleJobCaptured(message.payload, sender.tab?.windowId);
});
