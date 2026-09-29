import { useEffect, useState } from "react";
import { AuthForm } from "./AuthForm";
import { CaptureReview } from "./CaptureReview";
import { auth, type Session } from "../lib/api-client";
import { PENDING_CAPTURE_KEY, type ExtensionMessage, type ScrapedJob } from "../types/messages";

export default function App() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [pendingJob, setPendingJob] = useState<ScrapedJob | null>(null);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    void auth.getSession().then(setSession);
  }, []);

  useEffect(() => {
    void chrome.storage.session
      .get(PENDING_CAPTURE_KEY)
      .then((result) => setPendingJob(result[PENDING_CAPTURE_KEY] ?? null));

    const onMessage = (message: ExtensionMessage) => {
      if (message.type === "JOB_CAPTURED") setPendingJob(message.payload);
    };
    chrome.runtime.onMessage.addListener(onMessage);
    return () => chrome.runtime.onMessage.removeListener(onMessage);
  }, []);

  function clearPending() {
    setPendingJob(null);
    void chrome.storage.session.remove(PENDING_CAPTURE_KEY);
  }

  if (session === undefined) return null;

  if (!session) {
    return <AuthForm onSignedIn={setSession} />;
  }

  return (
    <>
      <div className="status-row">
        <div>
          <h1>ApplyTrack</h1>
          <p className="subtitle">{session.user.email}</p>
        </div>
        <button
          type="button"
          className="secondary"
          onClick={() => void auth.logout().then(() => setSession(null))}
        >
          Sign out
        </button>
      </div>

      {pendingJob ? (
        <CaptureReview
          job={pendingJob}
          onSaved={() => {
            clearPending();
            setSavedCount((n) => n + 1);
          }}
          onDismiss={clearPending}
        />
      ) : (
        <div className="card">
          <p className="empty-state">
            Waiting for a LinkedIn Easy Apply submission…
            {savedCount > 0 &&
              ` (${savedCount} application${savedCount === 1 ? "" : "s"} saved this session)`}
          </p>
        </div>
      )}
    </>
  );
}
