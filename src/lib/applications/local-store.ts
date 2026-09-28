import type { ApplicationInput, JobApplication } from "@/types/application";

const STORAGE_KEY = "applytrack:applications";

function readRaw(): JobApplication[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as JobApplication[];
  } catch {
    return [];
  }
}

function writeRaw(items: JobApplication[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function sortByAppliedDateDesc(items: JobApplication[]) {
  return [...items].sort((a, b) =>
    b.appliedDate === a.appliedDate
      ? b.createdAt.localeCompare(a.createdAt)
      : b.appliedDate.localeCompare(a.appliedDate)
  );
}

export const localApplicationStore = {
  getAll(): JobApplication[] {
    return sortByAppliedDateDesc(readRaw());
  },

  create(input: ApplicationInput): JobApplication {
    const now = new Date().toISOString();
    const item: JobApplication = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    const items = readRaw();
    items.push(item);
    writeRaw(items);
    return item;
  },

  update(id: string, patch: Partial<ApplicationInput>): JobApplication | null {
    const items = readRaw();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;
    const updated: JobApplication = {
      ...items[index],
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    items[index] = updated;
    writeRaw(items);
    return updated;
  },

  remove(id: string) {
    const items = readRaw().filter((item) => item.id !== id);
    writeRaw(items);
  },

  clear() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(STORAGE_KEY);
  },

  count(): number {
    return readRaw().length;
  },
};
