import { useState } from "react";
import { applications } from "../lib/api-client";
import type { ApplicationStatus } from "../types/application";
import type { ScrapedJob } from "../types/messages";

const STATUSES: ApplicationStatus[] = [
  "wishlist",
  "applied",
  "interview",
  "offer",
  "rejected",
];

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export function CaptureReview({
  job,
  onSaved,
  onDismiss,
}: {
  job: ScrapedJob;
  onSaved: () => void;
  onDismiss: () => void;
}) {
  const [company, setCompany] = useState(job.company);
  const [position, setPosition] = useState(job.position);
  const [location, setLocation] = useState(job.location ?? "");
  const [salaryRange, setSalaryRange] = useState("");
  const [status, setStatus] = useState<ApplicationStatus>("applied");
  const [appliedDate, setAppliedDate] = useState(today());
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await applications.create({
        company,
        position,
        status,
        location: location.trim() || null,
        jobUrl: job.jobUrl,
        salaryRange: salaryRange.trim() || null,
        source: job.source,
        appliedDate,
        notes: notes.trim() || null,
      });
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save application");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="status-row">
        <h1>New application detected</h1>
        <button type="button" className="secondary" onClick={onDismiss}>
          Dismiss
        </button>
      </div>
      <p className="subtitle">Review the details before it's added to ApplyTrack.</p>

      <label>
        Company
        <input value={company} onChange={(e) => setCompany(e.target.value)} required />
      </label>
      <label>
        Position
        <input value={position} onChange={(e) => setPosition(e.target.value)} required />
      </label>
      <div className="row">
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value as ApplicationStatus)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label>
          Applied date
          <input
            type="date"
            value={appliedDate}
            onChange={(e) => setAppliedDate(e.target.value)}
            required
          />
        </label>
      </div>
      <label>
        Location
        <input value={location} onChange={(e) => setLocation(e.target.value)} />
      </label>
      <label>
        Salary range
        <input value={salaryRange} onChange={(e) => setSalaryRange(e.target.value)} />
      </label>
      <label>
        Notes
        <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </label>
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={saving}>
        {saving ? "Saving…" : "Save to ApplyTrack"}
      </button>
    </form>
  );
}
