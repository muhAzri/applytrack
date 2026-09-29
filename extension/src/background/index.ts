import type { ExtensionMessage } from "../types/messages";
import { PENDING_CAPTURE_KEY } from "../types/messages";

// Clicking the toolbar icon opens the side panel directly instead of a popup.
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error("Failed to set side panel behavior", error));

chrome.runtime.onMessage.addListener((message: ExtensionMessage, sender) => {
  if (message.type !== "JOB_CAPTURED") return;

  // Session storage (not local) — this is scraped job data waiting for user
  // review, not something that should outlive the browser session.
  void chrome.storage.session.set({ [PENDING_CAPTURE_KEY]: message.payload });

  if (sender.tab?.windowId !== undefined) {
    void chrome.sidePanel.open({ windowId: sender.tab.windowId });
  }
});
