import { type LessonNote, type NotificationItem, type Placement, type Student, type Visit } from "@/lib/sip-data";
import { fetchWorkflowData, saveWorkflowData } from "@/lib/api-client";

// Shared workflow payload used by the three portals.
// The Express/PostgreSQL API is the only source of truth for business data.
// Do not read or write workflow records from browser storage.
export type SipWorkflowData = {
  students: Student[];
  placements: Placement[];
  notes: LessonNote[];
  visits: Visit[];
  notifications: NotificationItem[];
};

export const defaultWorkflowData: SipWorkflowData = {
  students: [],
  placements: [],
  notes: [],
  visits: [],
  notifications: [],
};

export function readWorkflowData(): SipWorkflowData {
  return defaultWorkflowData;
}

export function writeWorkflowData(data: SipWorkflowData) {
  void data;
}

export async function readWorkflowDataAsync(): Promise<SipWorkflowData> {
  return fetchWorkflowData();
}

export async function persistWorkflowData(data: SipWorkflowData) {
  await saveWorkflowData(data);
}

export function newNotification(title: string, message: string, type: string): NotificationItem {
  return { id: crypto.randomUUID(), title, message, type, read: false, time: "Just now" };
}
