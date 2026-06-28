import { seedLessonNotes, seedNotifications, seedPlacements, seedStudents, seedVisits, type LessonNote, type NotificationItem, type Placement, type Student, type Visit } from "@/lib/sip-data";
import { fetchWorkflowData, saveWorkflowData } from "@/lib/api-client";

// Shared browser-side workflow store used by the three demo portals.
// The coordinator, supervisor and student pages all read/write this same key so
// actions in one portal are reflected in the other role workspaces.
export type SipWorkflowData = {
  students: Student[];
  placements: Placement[];
  notes: LessonNote[];
  visits: Visit[];
  notifications: NotificationItem[];
};

export const workflowStorageKey = "sip-demo-data";

export const defaultWorkflowData: SipWorkflowData = {
  students: seedStudents,
  placements: seedPlacements,
  notes: seedLessonNotes,
  visits: seedVisits,
  notifications: seedNotifications,
};

export function readWorkflowData(): SipWorkflowData {
  if (typeof window === "undefined") return defaultWorkflowData;
  const stored = localStorage.getItem(workflowStorageKey);
  if (!stored) return defaultWorkflowData;
  try {
    const value = JSON.parse(stored) as Partial<SipWorkflowData>;
    return {
      students: value.students?.length ? value.students : seedStudents,
      placements: value.placements?.length ? value.placements : seedPlacements,
      notes: value.notes?.length ? value.notes : seedLessonNotes,
      visits: value.visits?.length ? value.visits.map(normalizeVisit) : seedVisits,
      notifications: value.notifications?.length ? value.notifications : seedNotifications,
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
  // Prefer the backend when it is configured and authenticated. If the API is
  // unavailable, fall back to localStorage so the demo can continue offline.
  const remote = await fetchWorkflowData();
  if (remote) {
    writeWorkflowData(remote);
    return remote;
  }
  return readWorkflowData();
}

export async function persistWorkflowData(data: SipWorkflowData) {
  // Always save locally first for instant UI updates, then mirror to the API.
  // The API client silently no-ops when NEXT_PUBLIC_API_BASE_URL is not set.
  writeWorkflowData(data);
  await saveWorkflowData(data);
}

export function newNotification(title: string, message: string, type: string): NotificationItem {
  return { id: crypto.randomUUID(), title, message, type, read: false, time: "Just now" };
}
