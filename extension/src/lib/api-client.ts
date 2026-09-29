import type { ApplicationInput, JobApplication } from "../types/application";

const APP_URL = import.meta.env.VITE_APP_URL as string;
if (!APP_URL) {
  throw new Error(
    "Missing VITE_APP_URL — copy .env.local.example to .env.local and fill it in."
  );
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: { id: string; email: string | null };
}

const SESSION_KEY = "session";

async function getStoredSession(): Promise<Session | null> {
  const result = await chrome.storage.local.get(SESSION_KEY);
  return result[SESSION_KEY] ?? null;
}

async function setStoredSession(session: Session | null): Promise<void> {
  if (session) await chrome.storage.local.set({ [SESSION_KEY]: session });
  else await chrome.storage.local.remove(SESSION_KEY);
}

async function parseJsonOrThrow(response: Response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error ?? `Request failed (${response.status})`);
  return body;
}

export const auth = {
  getSession: getStoredSession,

  async login(email: string, password: string): Promise<Session> {
    const response = await fetch(`${APP_URL}/api/extension/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const body = await parseJsonOrThrow(response);
    const session: Session = {
      accessToken: body.accessToken,
      refreshToken: body.refreshToken,
      expiresAt: body.expiresAt,
      user: body.user,
    };
    await setStoredSession(session);
    return session;
  },

  async logout(): Promise<void> {
    await setStoredSession(null);
  },

  /** Refreshes and persists a new session when the access token is stale. */
  async refresh(session: Session): Promise<Session> {
    const response = await fetch(`${APP_URL}/api/extension/session/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    });
    const body = await parseJsonOrThrow(response);
    const next: Session = {
      accessToken: body.accessToken,
      refreshToken: body.refreshToken,
      expiresAt: body.expiresAt,
      user: body.user,
    };
    await setStoredSession(next);
    return next;
  },
};

/** Returns a session with a non-expired access token, refreshing it first if needed. */
async function ensureFreshSession(): Promise<Session> {
  const session = await getStoredSession();
  if (!session) throw new Error("Not signed in");
  const isExpired = session.expiresAt * 1000 < Date.now() + 10_000;
  return isExpired ? auth.refresh(session) : session;
}

export const applications = {
  async create(input: ApplicationInput): Promise<JobApplication> {
    const session = await ensureFreshSession();
    const response = await fetch(`${APP_URL}/api/extension/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
      },
      body: JSON.stringify(input),
    });
    return parseJsonOrThrow(response);
  },
};
