import type { SipWorkflowData } from "@/lib/workflow-store";
import type { DirectorySchool } from "@/lib/school-directory";
import type { GhanaRegion } from "@/lib/ghana-locations";

export type ApiIrbField = { id: string; label: string; type: "text" | "textarea" | "date" | "checkbox" | "table"; required: boolean };
export type ApiIrbSection = { id: string; title: string; subtitle: string; fixed?: boolean; fields: ApiIrbField[] };
export type ApiLessonNoteFormat = { id?: string; modeDefault?: "Weekly" | "Termly"; fontSize: string; headingSize: string; lineHeight: string; tableDensity: "Compact" | "Comfortable" | "Spacious"; fields: ApiIrbField[] };
export type ApiInternshipLetterTemplate = { id?: string; letterheadName: string; letterheadSubheading: string; logoUrl?: string; footerContact: string; title: string; body: string; signatories: { id: string; name: string; title: string }[] };
export type CoordinatorSettings = {
  programmeName: string;
  supportEmail: string;
  defaultRegion: string;
  institution: string;
  academicYear: string;
  cohortName: string;
  programmeStart: string;
  programmeEnd: string;
  studentSelfPlacement: boolean;
  showPlacementCapacity: boolean;
  acceptNewPlacements: boolean;
  placementNotifications: boolean;
  lessonNoteNotifications: boolean;
  visitReminders: boolean;
  deadlineAlerts: boolean;
  sessionDuration: string;
  failedSignInLimit: string;
  strongPasswords: boolean;
  coordinatorSignInAlerts: boolean;
  emailSenderName: string;
  emailReplyTo: string;
  emailFooter: string;
  firebaseProjectId: string;
  firebaseVapidKey: string;
  fcmPlacementConfirmations: boolean;
  fcmVisitReminders: boolean;
};
export type CoordinatorDashboardKpis = {
  kpis: { totalInterns: number; activePlacements: number; pendingApprovals: number; completedSip: number; openSupportTickets?: number };
  progress: { activeInterns: number; change: string; series: number[] };
  placementOverview: { total: number; active: number; pending: number; completed: number };
  recentActivity: { id: string; title: string; message: string; time: string; read: boolean; type: string }[];
  upcomingVisits: { id: string; student: string; supervisor: string; school: string; startDate: string; endDate: string; rescheduledDate?: string; time: string; status: string }[];
};
export type SupportTicket = {
  id: string;
  subject: string;
  message: string;
  requesterName: string;
  requesterRole: "student" | "supervisor" | "coordinator";
  status: "Open" | "In Progress" | "Resolved";
  priority: "Low" | "Normal" | "High";
  createdAt: string;
  replies: { id: string; author: string; role: string; message: string; createdAt: string }[];
};
export type SupervisorDashboardKpis = {
  kpis: { assignedInterns: number; pendingReviews: number; upcomingVisits: number; averageIrbProgress: number; completedVisits: number };
  assignedInterns: { id: string; name: string; school: string; region: string; irb: number }[];
  pendingLessonReviews: unknown[];
};
export type StudentDashboardKpis = {
  student: { id: string; name: string; email: string; region: string };
  kpis: {
    progress: number;
    placement: { school: string; status: string; region: string } | null;
    irbProgress: string;
    approvedLessonNotes: number;
    pendingLessonNotes: number;
    nextVisit: { startDate: string; endDate: string; rescheduledDate?: string; time: string; supervisor: string; status: string } | null;
  };
};

export type LessonAiGuideResponse = {
  answer: string;
  suggestions?: Partial<{
    learningIndicators: string;
    performanceIndicators: string;
    resources: string;
    starter: string;
    main: string;
    reflection: string;
  }>;
  provider: "gemini" | "fallback";
};
export type LessonAiChatMessage = { role: "assistant" | "student"; text: string; createdAt?: string };
export type LessonAiChat = {
  id: string;
  title: string;
  subject: string;
  topic: string;
  mode: "Weekly" | "Termly";
  studentIdentifier?: string;
  createdAt: string;
  updatedAt: string;
  messages: LessonAiChatMessage[];
};

export type StaffInvite = {
  id: string;
  name: string;
  email: string;
  staffId: string;
  role: "coordinator" | "supervisor";
  regions: string[];
  status: "Pending" | "Accepted" | "Revoked";
  invitedAt: string;
  account?: { identifier: string; alternateIdentifier: string; initialPassword: string; mustChangePassword: boolean };
};

// Default to the deployed Express API. Local development can still override this
// with NEXT_PUBLIC_API_BASE_URL, but no environment file is required in git.
// If hosting provides only the backend root URL, normalize it to the API prefix.
function normalizeApiBase(value: string) {
  const clean = value.replace(/\/$/, "");
  return clean.endsWith("/api/v1") ? clean : `${clean}/api/v1`;
}

export const apiBase = normalizeApiBase(process.env.NEXT_PUBLIC_API_BASE_URL || "https://irm-backend-t750.onrender.com/api/v1");

// Builds absolute backend URLs while allowing the app to run in frontend-only demo mode.
function endpoint(path: string) {
  return `${apiBase}${path.startsWith("/") ? path : `/${path}`}`;
}

export function backendEnabled() {
  return Boolean(apiBase);
}

export function apiTokenRole() {
  if (typeof window === "undefined") return "";
  const token = window.localStorage.getItem("sip_api_token");
  if (!token) return "";
  try {
    const [, payload] = token.split(".");
    if (!payload) return "";
    const normalized = payload.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(payload.length / 4) * 4, "=");
    return String(JSON.parse(window.atob(normalized)).role || "").toLowerCase();
  } catch {
    return "";
  }
}

export function ensureApiRole(role: "student" | "supervisor" | "coordinator") {
  if (typeof window === "undefined") return true;
  const currentRole = apiTokenRole();
  if (currentRole === role) return true;
  window.localStorage.removeItem("sip_api_token");
  return false;
}

async function request<T>(path: string, init?: RequestInit): Promise<T | null> {
  if (!backendEnabled()) return null;
  const token = typeof window !== "undefined" ? window.localStorage.getItem("sip_api_token") : "";
  try {
    const response = await fetch(endpoint(path), {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(init?.headers || {}),
      },
      cache: "no-store",
    });
    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      if (process.env.NODE_ENV !== "production") console.warn(`API request failed: ${path}`, response.status, errorText);
      return null;
    }
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

// Shared workflow payload used by coordinator, supervisor and student portals.
// This is the quickest complete integration path for the demo: every role reads
// the same server workflow and writes changed students, placements, notes,
// visits and notifications back to the API.
export async function fetchWorkflowData() {
  return request<SipWorkflowData>("/workflow");
}

export async function saveWorkflowData(data: SipWorkflowData) {
  return request<SipWorkflowData>("/workflow", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function fetchStudents() {
  return request("/students");
}

export async function createStudent(input: {
  id: string;
  name: string;
  email: string;
  programme: string;
  department: string;
  year?: number;
  school?: string;
  region: string;
  status?: string;
}) {
  return request<(typeof input) & { account?: { identifier: string; alternateIdentifier: string; initialPassword: string; mustChangePassword: boolean } }>("/students", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function fetchPlacements() {
  return request("/placements");
}

export async function fetchLessonNotes() {
  return request("/lesson-notes");
}

export async function fetchVisits() {
  return request("/visits");
}

export async function fetchSupervisors() {
  return request<{ id: string; name: string; staffId: string; regions: string[]; status: string }[]>("/supervisors");
}

export async function fetchSupervisorAssignments() {
  return request("/supervisor-assignments");
}

export async function fetchAuditLogs() {
  return request("/audit-logs");
}

export async function fetchReports() {
  return request<{ id: string; name: string; type: string; status?: string; generatedAt?: string }[]>("/reports");
}

export async function generateReport(name: string) {
  return request<{ id: string; name: string; type?: string; status: string; generatedAt?: string }>("/reports/generate", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function fetchSettings() {
  return request<CoordinatorSettings>("/settings");
}

function dashboardPeriodQuery(period?: string) {
  if (!period) return "";
  return `?period=${encodeURIComponent(period.toLowerCase().replace(/\s+/g, "-"))}`;
}

export async function fetchCoordinatorDashboard(period?: string) {
  return request<CoordinatorDashboardKpis>(`/dashboard/coordinator${dashboardPeriodQuery(period)}`);
}

export async function fetchSupervisorDashboard(period?: string) {
  return request<SupervisorDashboardKpis>(`/dashboard/supervisor${dashboardPeriodQuery(period)}`);
}

export async function fetchStudentDashboard(period?: string) {
  return request<StudentDashboardKpis>(`/dashboard/student${dashboardPeriodQuery(period)}`);
}

export async function askLessonAiGuide(input: {
  prompt: string;
  mode: "Weekly" | "Termly";
  subject: string;
  topic: string;
  className: string;
  week: string;
  weekEnding: string;
  planner: Record<string, unknown>;
}) {
  return request<LessonAiGuideResponse>("/ai/lesson-note-guide", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function fetchLessonAiChats() {
  return request<LessonAiChat[]>("/ai/lesson-note-chats");
}

export async function saveLessonAiChat(input: Partial<LessonAiChat> & { messages: LessonAiChatMessage[] }) {
  return request<LessonAiChat>("/ai/lesson-note-chats", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function deleteLessonAiChat(id: string) {
  return request<{ deleted: true }>(`/ai/lesson-note-chats/${id}`, { method: "DELETE" });
}

export async function saveSettings(settings: CoordinatorSettings) {
  return request<CoordinatorSettings>("/settings", {
    method: "PATCH",
    body: JSON.stringify(settings),
  });
}

export async function registerNotificationDevice(input: { token: string; platform: "web"; role?: string }) {
  return request<{ registered: boolean; token: string }>("/notifications/device", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function fetchNotifications() {
  return request("/notifications");
}

export async function markAllNotificationsRead() {
  return request("/notifications/read-all", { method: "PATCH" });
}

export async function fetchSupportTickets() {
  return request<SupportTicket[]>("/support/tickets");
}

export async function createSupportTicket(input: { subject: string; message: string; priority?: string; requesterName?: string; requesterRole?: string }) {
  return request<SupportTicket>("/support/tickets", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function replySupportTicket(id: string, message: string, status = "In Progress") {
  return request<SupportTicket>(`/support/tickets/${id}/replies`, {
    method: "POST",
    body: JSON.stringify({ message, status }),
  });
}

export async function updateSupportTicket(id: string, patch: Partial<SupportTicket>) {
  return request<SupportTicket>(`/support/tickets/${id}`, {
    method: "PATCH",
    body: JSON.stringify(patch),
  });
}

export async function fetchStaffInvitations() {
  return request<StaffInvite[]>("/staff/invitations");
}

// Called when a coordinator opens a sidebar module. It intentionally maps each
// UI page to a backend read endpoint so every click is visible in Network and
// in the Express/morgan backend logs during demos.
export async function touchCoordinatorModule(active: string) {
  const routes: Record<string, () => Promise<unknown>> = {
    Students: fetchStudents,
    Schools: () => fetchSchools(),
    Placements: fetchPlacements,
    Supervisors: fetchSupervisorAssignments,
    "IRB Submissions": fetchIrbSubmissions,
    Visits: fetchVisits,
    "Staff Onboarding": fetchStaffInvitations,
    "Bulk Uploads": () => request("/reports"),
    "Audit Logs": fetchAuditLogs,
    Reports: fetchReports,
    "Support Desk": fetchSupportTickets,
    "IRB Configuration": fetchIrbTemplate,
    "Lesson Note Format": fetchLessonNoteFormat,
    "Internship Letter": fetchInternshipLetterTemplate,
    Settings: fetchSettings,
    Notifications: () => request("/notifications"),
    "Lesson Notes": fetchLessonNotes,
  };
  return routes[active]?.() || null;
}

export async function createStaffInvitation(input: Omit<StaffInvite, "id" | "status" | "invitedAt">) {
  return request<StaffInvite>("/staff/invitations", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function revokeStaffInvitation(id: string) {
  return request<StaffInvite>(`/staff/invitations/${id}/revoke`, {
    method: "POST",
  });
}

// Directory endpoints power all school and Ghana-location dropdowns.
// The UI can filter by region/municipality/community/category and still allows
// students to suggest schools that are missing from the approved directory.
export async function fetchSchools(params?: { region?: string; municipality?: string; community?: string; category?: string; q?: string }) {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value && !String(value).startsWith("All ")) query.set(key, String(value));
  });
  return request<DirectorySchool[]>(`/schools${query.toString() ? `?${query.toString()}` : ""}`);
}

export async function fetchGhanaLocations() {
  return request<GhanaRegion[]>("/locations/ghana");
}

export async function createSchool(input: Omit<DirectorySchool, "id" | "status"> & Partial<Pick<DirectorySchool, "id" | "status">>) {
  return request<DirectorySchool>("/schools", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function suggestSchool(input: { name: string; region: string; municipality: string; community: string; category?: string; suggestedBy?: string }) {
  return request<{ id: string; status: "Pending"; school: typeof input }>("/schools/suggestions", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// Configuration endpoints keep coordinator-built templates synced with the API.
// Each caller still keeps a local fallback so the demo remains usable without a running backend.
export async function fetchIrbTemplate() {
  return request<ApiIrbSection[]>("/configurations/irb-template");
}

export async function fetchStudentIrbSections() {
  return request<ApiIrbSection[]>("/irb/sections");
}

export async function saveIrbTemplate(sections: ApiIrbSection[]) {
  return request<ApiIrbSection[]>("/configurations/irb-template", {
    method: "PUT",
    body: JSON.stringify({ sections }),
  });
}

export async function createIrbSubmission(input: { studentId: string; studentName: string; sectionId: string; sectionTitle: string; status: "Draft" | "Submitted"; values: Record<string, string> }) {
  return request("/irb/submissions", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function fetchIrbSubmissions() {
  return request<{ id: string; studentId: string; studentName: string; sectionId: string; sectionTitle: string; status: string; values: Record<string, string>; submittedAt?: string }[]>("/irb/submissions");
}

export async function deleteIrbSubmission(id: string) {
  return request(`/irb/submissions/${id}`, { method: "DELETE" });
}

export async function fetchLessonNoteFormat() {
  return request<ApiLessonNoteFormat>("/configurations/lesson-note-format");
}

export async function saveLessonNoteFormat(format: ApiLessonNoteFormat) {
  return request<ApiLessonNoteFormat>("/configurations/lesson-note-format", {
    method: "PUT",
    body: JSON.stringify(format),
  });
}

export async function fetchInternshipLetterTemplate() {
  return request<ApiInternshipLetterTemplate>("/internship-letter/template");
}

export async function saveInternshipLetterTemplate(template: ApiInternshipLetterTemplate) {
  return request<ApiInternshipLetterTemplate>("/internship-letter/template", {
    method: "PUT",
    body: JSON.stringify(template),
  });
}
