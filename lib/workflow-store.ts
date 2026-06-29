import { type LessonNote, type NotificationItem, type Placement, type Student, type Visit } from "@/lib/sip-data";
import { fetchWorkflowData, saveWorkflowData } from "@/lib/api-client";

// Shared workflow payload used by the three portals.
// Runtime data now comes from the Express API; localStorage is kept only as a
// short-lived cache after successful API reads so a refresh does not flash old
// seed/demo data before the backend responds.
export type SipWorkflowData = {
  students: Student[];
  placements: Placement[];
  notes: LessonNote[];
  visits: Visit[];
  notifications: NotificationItem[];
};

export const workflowStorageKey = "sip-demo-data";

export const defaultWorkflowData: SipWorkflowData = {
  students: [],
  placements: [],
  notes: [],
  visits: [],
  notifications: [],
};

export function readWorkflowData(): SipWorkflowData {
  if (typeof window === "undefined") return defaultWorkflowData;
  const stored = localStorage.getItem(workflowStorageKey);
  if (!stored) return defaultWorkflowData;
  try {
    const value = JSON.parse(stored) as Partial<SipWorkflowData>;
    return {
      students: value.students || [],
      placements: value.placements || [],
      notes: value.notes || [],
      visits: value.visits?.map(normalizeVisit) || [],
      notifications: value.notifications || [],
    };
  } catch {
    return defaultWorkflowData;
  }
}

function normalizeVisit(visit: Visit & { date?: string }): Visit {
  if (visit.startDate && visit.endDate) return visit;
  const fallback = visit.date || new Date().toISOString().slice(0, 10);
  return { ...visit, startDate: fallback, endDate: fallback, status: visit.status || "Scheduled" };
}

export function writeWorkflowData(data: SipWorkflowData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(workflowStorageKey, JSON.stringify(data));
}

export async function readWorkflowDataAsync(): Promise<SipWorkflowData> {
  // The backend is the source of truth. If it is unavailable, return an empty
  // state instead of showing seeded/browser-only records that were not fetched.
  const remote = await fetchWorkflowData();
  if (remote) {
    writeWorkflowData(remote);
    return remote;
  }
  return defaultWorkflowData;
}

export async function persistWorkflowData(data: SipWorkflowData) {
  // Keep the UI responsive, then mirror to the API. If the API rejects the
  // update, the next read will restore the server state instead of using seeds.
  writeWorkflowData(data);
  await saveWorkflowData(data);
}

export function newNotification(title: string, message: string, type: string): NotificationItem {
  return { id: crypto.randomUUID(), title, message, type, read: false, time: "Just now" };
}
