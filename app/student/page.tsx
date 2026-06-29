"use client";

// Student portal shell.
// Student actions write to the shared SIP workflow store so coordinator and
// supervisor screens can react to placement requests, lesson notes, visits,
// IRB submissions and support messages.
import { useEffect, useMemo, useState } from "react";
import { UserSettings } from "@/components/UserSettings";
import { AppearanceLoader, AppearanceSettings } from "@/components/AppearanceSettings";
import { StudentInternshipLetter } from "@/components/InternshipLetter";
import { ChangePasswordPanel } from "@/components/ChangePassword";
import { GhanaLocationSelect } from "@/components/GhanaLocationSelect";
import { askLessonAiGuide, createIrbSubmission, createSupportTicket, deleteLessonAiChat, ensureApiRole, fetchLessonAiChats, fetchSchools, fetchStudentIrbSections, saveLessonAiChat, suggestSchool, type LessonAiChat, type LessonAiChatMessage, type StudentDashboardKpis } from "@/lib/api-client";
import { schoolToPlacementOption } from "@/lib/school-directory";
import type { LessonNote, NotificationItem, Placement, Student, Visit } from "@/lib/sip-data";
import { newNotification, persistWorkflowData, readWorkflowDataAsync, type SipWorkflowData } from "@/lib/workflow-store";

type StudentIconName = "home" | "pin" | "book" | "file" | "calendar" | "download" | "bell" | "arrow";

function StudentIcon({ name }: { name: StudentIconName }) {
  const paths: Record<StudentIconName, React.ReactNode> = {
    home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v11h14V10M9 21v-7h6v7"/></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13Z"/><path d="M8 7h8M8 11h6"/></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    download: <><path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    arrow: <path d="M5 12h14M13 6l6 6-6 6"/>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const portalNavigation = [["Overview", "home"], ["My Placement", "pin"], ["Whitebook (IRB)", "book"], ["Lesson Notes", "file"], ["Supervisor Visits", "calendar"], ["Documents", "download"]] as const;
const currentStudentName = "Kwame Mensah";
const defaultStudentDashboard: StudentDashboardKpis = { student: { id: "", name: currentStudentName, email: "", region: "Ashanti" }, kpis: { progress: 0, placement: null, irbProgress: "0 of 6 sections", approvedLessonNotes: 0, pendingLessonNotes: 0, nextVisit: null } };
const emptyStudentWorkflow: SipWorkflowData = { students: [], placements: [], notes: [], visits: [], notifications: [] };
const fallbackStudent: Student = { id: "", name: "Student", email: "", programme: "", department: "", year: 4, school: "—", region: "Ashanti", status: "Pending" };

type IrbSection = { id: string; title: string; status: "Locked" | "Draft" | "Submitted" | "Approved"; updated: string };
type LessonMode = "Weekly" | "Termly";
type LessonPlannerState = {
  subject: string; topic: string; week: string; weekEnding: string; term: string; className: string;
  learningIndicators: string; performanceIndicators: string; resources: string;
  phaseStarter: string; phaseMain: string; phaseReflection: string; termOverview: string; assessmentPlan: string;
  days: { day: string; starter: string; main: string; reflection: string }[];
};
const initialAiMessage: LessonAiChatMessage = { role: "assistant", text: "Hi, I can help you prepare a clearer lesson note. Add your subject and topic, then ask for learning indicators, starter ideas, main activities or reflection questions." };

export default function StudentPortalPage() {
  const [active, setActive] = useState("Overview");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [workflow, setWorkflow] = useState<SipWorkflowData>(emptyStudentWorkflow);
  const [hydrated, setHydrated] = useState(false);
  const [mobileSplash, setMobileSplash] = useState(false);
  const student = workflow.students[0] || fallbackStudent;
  const placements = workflow.placements.filter(item => item.student === student.name);
  const notes = workflow.notes.filter(item => item.student === student.name);
  const visits = workflow.visits.filter(item => item.student === student.name);
  const dashboardData = useMemo<StudentDashboardKpis>(() => {
    const placement = placements.find(item => item.status === "Approved") || placements[0] || null;
    const nextVisit = visits.find(item => item.status === "Scheduled" || item.status === "Rescheduled") || null;
    return {
      student: { id: student.id, name: student.name, email: student.email, region: student.region },
      kpis: {
        progress: placement ? 68 : 18,
        placement: placement ? { school: placement.school, status: placement.status, region: placement.region } : null,
        irbProgress: placement ? "0 of 6 sections" : "0 of 6 sections",
        approvedLessonNotes: notes.filter(item => item.supervisor === "Approved").length,
        pendingLessonNotes: notes.filter(item => item.supervisor === "Pending").length,
        nextVisit,
      },
    };
  }, [student, placements, notes, visits]);
  const studentNotifications = workflow.notifications.filter(item => item.message.includes(student.name));
  const unread = studentNotifications.filter(item => !item.read).length;

  useEffect(() => {
    if (!ensureApiRole("student")) {
      fetch("/api/auth/logout", { method: "POST" }).finally(() => { window.location.href = "/login?role=student"; });
      return;
    }
    let alive = true;
    readWorkflowDataAsync().then((data) => {
      if (!alive) return;
      setWorkflow(data);
      setHydrated(true);
    });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    if (hydrated) persistWorkflowData(workflow);
  }, [workflow, hydrated]);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 900px)").matches;
    if (!isMobile) return;
    setMobileSplash(true);
    const timer = window.setTimeout(() => setMobileSplash(false), 4000);
    return () => window.clearTimeout(timer);
  }, []);

  function feedback(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 3500);
  }

  function saveWorkflow(next: SipWorkflowData, toast?: string) {
    setWorkflow(next);
    if (toast) feedback(toast);
  }

  function contactSupport() {
    setActive("Support");
  }

  function markNotification(id: string) {
    setWorkflow(current => ({ ...current, notifications: current.notifications.map(item => item.id === id ? { ...item, read: true } : item) }));
  }

  function markAllNotifications() {
    const ids = new Set(studentNotifications.map(item => item.id));
    setWorkflow(current => ({ ...current, notifications: current.notifications.map(item => ids.has(item.id) ? { ...item, read: true } : item) }));
  }

  async function signOut() {
    localStorage.removeItem("sip_api_token");
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login?role=student";
  }

  return <div className="student-shell"><AppearanceLoader role="student"/>
    {mobileSplash && <div className="student-mobile-splash" role="status" aria-live="polite">
      <div className="student-mobile-splash-logo"><img src="/ustedlogo.jpeg" alt="AAMUSTED logo"/></div>
      <strong>AAMUSTED SIP</strong>
      <span>Preparing your student portal…</span>
    </div>}
    <aside className="student-sidebar">
      <div className="student-brand"><span><img src="/ustedlogo.jpeg" alt="AAMUSTED logo"/></span><div><strong>AAMUSTED</strong><small>Student SIP Portal</small></div><button className="student-mobile-menu-toggle" onClick={() => setMobileNavOpen(value => !value)} aria-expanded={mobileNavOpen} aria-label="Open student menu"><i/><i/><i/></button></div>
      <nav className={mobileNavOpen ? "open" : ""}>{portalNavigation.map(([label, icon]) => <button className={active === label ? "active" : ""} onClick={() => { setActive(label); setMobileNavOpen(false); }} key={label}><StudentIcon name={icon}/>{label}</button>)}</nav>
      <div className="student-support"><strong>Need support?</strong><p>Contact CSTSI if you are unable to complete a required stage.</p><button onClick={contactSupport}>Contact support</button></div>
    </aside>
    <main className="student-main">
      <header className="student-topbar">
        <div><span>2025/26 Internship</span><strong>{active}</strong></div>
        <button onClick={() => { setNotificationOpen(true); setProfileOpen(false); }} aria-label="Open notifications"><StudentIcon name="bell"/>{unread > 0 && <i/>}</button>
        <div className="profile-menu-wrap"><button className="profile-trigger profile-trigger-compact" onClick={() => { setProfileOpen(!profileOpen); setNotificationOpen(false); }} aria-expanded={profileOpen}><div className="student-avatar">{initials(student.name)}</div><b>⌄</b></button>{profileOpen && <div className="profile-dropdown attached-profile-dropdown"><div className="profile-dropdown-head"><div className="student-avatar">{initials(student.name)}</div><span><strong>{student.name}</strong><small>{student.email}</small><em>Internship Student</em></span></div><button onClick={() => { setActive("Profile"); setProfileOpen(false); }}>◉ Profile</button><button onClick={() => { setActive("Settings"); setProfileOpen(false); }}>⚙ Settings</button><button onClick={() => { setActive("Appearance"); setProfileOpen(false); }}>◐ Appearance</button><button onClick={() => { setActive("Change Password"); setProfileOpen(false); }}>◆ Change password</button><button onClick={signOut}>↪ Sign out</button></div>}</div>
      </header>
      <div className="student-content">{active === "Overview" ? <StudentOverview student={student} notes={notes} visits={visits} placements={placements} onAction={setActive} dashboardData={dashboardData}/> : <StudentSection name={active} student={student} placements={placements} notes={notes} visits={visits} workflow={workflow} saveWorkflow={saveWorkflow} notify={feedback}/>}</div>
    </main>
    {notificationOpen && <><button className="notification-backdrop" onClick={() => setNotificationOpen(false)} aria-label="Close notifications"/><aside className="notification-drawer"><header><div><strong>Notifications</strong><span>{unread} unread</span></div><button onClick={markAllNotifications} title="Mark all as read">✓</button><button onClick={() => setNotificationOpen(false)} aria-label="Close notifications">×</button></header><div className="notification-drawer-label">RECENT</div><div className="notification-drawer-list">{studentNotifications.length ? studentNotifications.map(item => <button className={item.read ? "read" : ""} onClick={() => markNotification(item.id)} key={item.id}><i/><span><strong>{item.title}</strong><p>{item.message}</p><small>{item.time}</small></span></button>) : <div className="empty"><strong>No notifications</strong><p>Your placement, visits and lesson-note updates will appear here.</p></div>}</div></aside></>}
    {message && <div className="toast"><StudentIcon name="bell"/>{message}</div>}
  </div>;
}

function StudentOverview({ student, placements, notes, visits, onAction, dashboardData }: { student: Student; placements: Placement[]; notes: LessonNote[]; visits: Visit[]; onAction: (page: string) => void; dashboardData: StudentDashboardKpis }) {
  const approvedNotes = dashboardData.kpis.approvedLessonNotes || notes.filter(note => note.supervisor === "Approved").length;
  const placement = placements.find(item => item.status === "Approved");
  const pending = placements.find(item => item.status === "Pending");
  const nextVisit = visits.find(item => item.status === "Scheduled");
  const progress = dashboardData.kpis.progress || (placement ? 68 : pending ? 32 : 18);
  const remotePlacement = dashboardData.kpis.placement;
  const remoteVisit = dashboardData.kpis.nextVisit;
  return <>
    <section className="student-welcome"><div><span>WELCOME BACK</span><h1>Welcome, {student.name.split(" ")[0]} </h1><p>You are {progress}% through your Student Internship Programme.</p></div><button onClick={() => onAction(placement ? "Whitebook (IRB)" : "My Placement")}>{placement ? "Continue IRB" : "Choose placement"} <StudentIcon name="arrow"/></button></section>
    <section className="student-progress-card"><div className="progress-ring"><strong>{progress}%</strong><span>Complete</span></div><div className="progress-copy"><span>YOUR INTERNSHIP JOURNEY</span><h2>{placement ? "Keep up the good work" : "Placement step pending"}</h2><p>{placement ? "Complete your IRB section and submit this week’s lesson note." : "Record the school only after the school accepts your internship letter."}</p><div className="journey-steps"><i className="done"/><i className={placement ? "done" : "current"}/><i className={placement ? "current" : ""}/><i/><i/></div><div className="journey-labels"><span>Profile</span><span>Placed</span><span>IRB</span><span>Review</span><span>Complete</span></div></div></section>
    <section className="student-metrics">
      <button onClick={() => onAction("My Placement")}><span>Placement</span><strong>{remotePlacement?.school || placement?.school || pending?.school || "Not selected"}</strong><small>{remotePlacement?.status === "Approved" ? "Accepted" : placement ? "Accepted" : pending ? "Recorded" : "Record after school acceptance"} · {remotePlacement?.region || student.region}</small></button>
      <button onClick={() => onAction("Whitebook (IRB)")}><span>IRB progress</span><strong>{dashboardData.kpis.irbProgress || (placement ? "4 of 6 sections" : "0 of 6 sections")}</strong><small>{placement || remotePlacement ? "Section 5 in progress" : "Starts after placement"}</small></button>
      <button onClick={() => onAction("Lesson Notes")}><span>Lesson notes</span><strong>{approvedNotes} approved</strong><small>{dashboardData.kpis.pendingLessonNotes || notes.filter(n => n.supervisor === "Pending").length} awaiting review</small></button>
      <button onClick={() => onAction("Supervisor Visits")}><span>Next visit</span><strong>{remoteVisit ? formatStudentDashboardVisit(remoteVisit) : nextVisit ? formatVisitDisplay(nextVisit) : "Not scheduled"}</strong><small>{remoteVisit ? `${remoteVisit.time} · ${remoteVisit.supervisor}` : nextVisit ? `${nextVisit.time} · ${nextVisit.supervisor}` : "Supervisor will schedule"}</small></button>
    </section>
  </>;
}

function formatStudentDashboardVisit(visit: StudentDashboardKpis["kpis"]["nextVisit"]) {
  if (!visit) return "Not scheduled";
  const start = visit.rescheduledDate || visit.startDate;
  return new Date(`${start}T00:00`).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function StudentSection({ name, student, placements, notes, visits, workflow, saveWorkflow, notify }: { name: string; student: Student; placements: Placement[]; notes: LessonNote[]; visits: Visit[]; workflow: SipWorkflowData; saveWorkflow: (next: SipWorkflowData, toast?: string) => void; notify: (message: string) => void }) {
  const [selectedSchool, setSelectedSchool] = useState("");
  const [addingSchool, setAddingSchool] = useState(false);
  const [customSchool, setCustomSchool] = useState({ name: "", municipality: "", community: "", region: student.region });
  const [placementSchools, setPlacementSchools] = useState<ReturnType<typeof schoolToPlacementOption>[]>([]);
  const [lessonMode, setLessonMode] = useState<LessonMode>("Weekly");
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [lessonPlanner, setLessonPlanner] = useState<LessonPlannerState>(() => defaultLessonPlanner(notes.length + 1));
  const [selectedNote, setSelectedNote] = useState<LessonNote | null>(null);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [selectedPlacement, setSelectedPlacement] = useState<Placement | null>(null);
  const [schoolPage, setSchoolPage] = useState(1);
  const [irbSections, setIrbSections] = useState<IrbSection[]>(() => readIrbSections(student.id));
  const activePlacement = placements.find(item => item.status === "Approved");
  const pendingPlacement = placements.find(item => item.status === "Pending");
  const schoolPageSize = 6;
  const schoolPages = Math.max(1, Math.ceil(placementSchools.length / schoolPageSize));
  const visiblePlacementSchools = placementSchools.slice((schoolPage - 1) * schoolPageSize, schoolPage * schoolPageSize);
  const descriptions: Record<string, string> = { "Whitebook (IRB)": "Complete and submit your configurable Internship Record Book sections.", "Lesson Notes": "Create weekly lesson plans and monitor mentor and supervisor reviews.", "Supervisor Visits": "Review your personal visit schedule and assessment feedback.", Support: "Raise a support ticket for coordinators to review and respond to.", Profile: "View your student identity and programme details." };

  useEffect(() => {
    let alive = true;
    fetchSchools({ region: student.region }).then((records) => {
      if (alive && records?.length) setPlacementSchools(records.map(schoolToPlacementOption));
    });
    return () => { alive = false; };
  }, [student.region]);

  useEffect(() => setSchoolPage(1), [placementSchools.length, addingSchool]);

  useEffect(() => writeIrbSections(student.id, irbSections), [student.id, irbSections]);

  function requestPlacement() {
    const school = addingSchool ? { ...customSchool, spaces: 0 } : placementSchools.find(item => item.name === selectedSchool);
    if (!school) return;
    if (addingSchool) suggestSchool({ ...customSchool, category: "Basic", suggestedBy: student.id });
    const request: Placement = { id: `PL-${Date.now().toString().slice(-4)}`, student: student.name, school: school.name, municipality: school.municipality, community: school.community, region: school.region, supervisor: "Unassigned", requested: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }), status: "Approved" };
    saveWorkflow({ ...workflow, placements: [request, ...workflow.placements], notifications: [newNotification(addingSchool ? "New school suggested" : "Placement school recorded", `${student.name} recorded ${school.name} as the accepted internship school${addingSchool ? " and suggested it for the school directory" : ""}.`, "placement"), ...workflow.notifications] }, `Accepted placement recorded for ${school.name}.`);
    setAddingSchool(false);
    setCustomSchool({ name: "", municipality: "", community: "", region: student.region });
  }

  function cancelPlacement(id: string) {
    saveWorkflow({ ...workflow, placements: workflow.placements.filter(item => item.id !== id), notifications: [newNotification("Placement request cancelled", `${student.name} cancelled placement request ${id}.`, "placement"), ...workflow.notifications] }, "Pending placement request cancelled.");
  }

  function submitLessonNote() {
    const item: LessonNote = {
      id: `LN-${Date.now().toString().slice(-3)}`,
      student: student.name,
      subject: lessonPlanner.subject,
      topic: lessonPlanner.topic,
      week: lessonMode === "Weekly" ? lessonPlanner.week : lessonPlanner.term,
      mentor: "Pending",
      supervisor: "Pending",
      planType: lessonMode,
      className: lessonPlanner.className,
      weekEnding: lessonPlanner.weekEnding,
      learningIndicators: lessonPlanner.learningIndicators,
      performanceIndicators: lessonPlanner.performanceIndicators,
      resources: lessonPlanner.resources,
      phaseStarter: lessonPlanner.phaseStarter,
      phaseMain: lessonPlanner.phaseMain,
      phaseReflection: lessonPlanner.phaseReflection,
      days: lessonPlanner.days,
      term: lessonPlanner.term,
      termOverview: lessonPlanner.termOverview,
      assessmentPlan: lessonPlanner.assessmentPlan,
    };
    saveWorkflow({ ...workflow, notes: [item, ...workflow.notes], notifications: [newNotification("Lesson note submitted", `${student.name} submitted ${lessonPlanner.subject} for ${item.week}.`, "lesson"), ...workflow.notifications] }, "Lesson note submitted for review.");
    setPlannerOpen(false);
    setLessonPlanner(defaultLessonPlanner(notes.length + 2));
  }

  function saveIrb(section: IrbSection, status: IrbSection["status"]) {
    const next = irbSections.map(item => item.id === section.id ? { ...item, status, updated: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) } : item);
    setIrbSections(next);
    saveWorkflow({ ...workflow, notifications: [newNotification(status === "Submitted" ? "IRB section submitted" : "IRB section saved", `${student.name} ${status === "Submitted" ? "submitted" : "saved"} ${section.title}.`, "irb"), ...workflow.notifications] }, status === "Submitted" ? "IRB section submitted for supervisor review." : "IRB section saved as draft.");
  }

  if (name === "Settings") return <UserSettings role="student" name={student.name} email={student.email} onSaved={notify}/>;
  if (name === "Appearance") return <AppearanceSettings role="student"/>;
  if (name === "Change Password") return <ChangePasswordPanel role="student" onSaved={notify}/>;
  if (name === "Documents") return <StudentInternshipLetter notify={notify} student={student} placement={activePlacement}/>;
  if (name === "Profile") return <ProfileCard student={student} placement={activePlacement} notes={notes} visits={visits}/>;
  if (name === "Support") return <StudentSupportPage student={student} notify={notify}/>;

  if (name === "My Placement") return <><section className="portal-page-head"><span>MY INTERNSHIP</span><h1>{activePlacement ? "My accepted school" : "Record accepted school"}</h1><p>{activePlacement ? "This is the school that accepted your internship letter." : "Download your internship letter, submit it to a school, then record the school here after they accept you."}</p></section><section className="student-card student-placement-picker"><header><div><h2>{activePlacement ? "Accepted placement" : "Schools directory"}</h2><p>{activePlacement ? "If another school accepts you instead, you can record the new accepted school." : "Choose the school only after you receive acceptance from that school."}</p></div><button className="secondary" onClick={()=>setAddingSchool(!addingSchool)}>{addingSchool?"Use listed schools":"School not found?"}</button></header>{activePlacement ? <div className="placement-choice-list accepted-placement-list"><button className="selected" onClick={() => setSelectedPlacement(activePlacement)}><i>✓</i><span><strong>{activePlacement.school}</strong><small>{activePlacement.municipality} · {activePlacement.community} · {activePlacement.region} Region</small></span><em>Accepted</em></button></div> : null}{addingSchool ? <div className="school-not-found-form role-settings-fields lesson-submit-fields"><label><span>School name</span><input value={customSchool.name} onChange={event=>setCustomSchool({...customSchool,name:event.target.value})} placeholder="Enter school name"/></label><GhanaLocationSelect value={customSchool} onChange={value=>setCustomSchool({...customSchool,...value})}/></div> : <><div className="placement-choice-list placement-choice-scroll">{visiblePlacementSchools.map(school => <button className={selectedSchool === school.name ? "selected" : ""} onClick={() => setSelectedSchool(school.name)} key={school.name}><i>{selectedSchool === school.name ? "✓" : ""}</i><span><strong>{school.name}</strong><small>{school.municipality} · {school.community} · {school.region} Region</small></span><em>{school.spaces} spaces</em></button>)}</div><div className="student-list-pagination"><button disabled={schoolPage===1} onClick={()=>setSchoolPage(page=>Math.max(1,page-1))}>‹</button><span>Page {schoolPage} of {schoolPages}</span><button disabled={schoolPage===schoolPages} onClick={()=>setSchoolPage(page=>Math.min(schoolPages,page+1))}>›</button></div></>}<div className="placement-request-foot"><span>{addingSchool ? "Add the accepted school if it is missing from the directory" : selectedSchool ? `Accepted school: ${selectedSchool}` : "Select the school that accepted your internship letter"}</span><button disabled={addingSchool?!customSchool.name||!customSchool.municipality||!customSchool.community:!selectedSchool} onClick={requestPlacement}>{addingSchool?"Record new accepted school":"Record accepted school"}</button></div></section>{selectedPlacement && <PlacementDetails placement={selectedPlacement} close={() => setSelectedPlacement(null)}/>}</>;

  if (name === "Lesson Notes") return <LessonNotesWorkspace notes={notes} mode={lessonMode} setMode={setLessonMode} planner={lessonPlanner} setPlanner={setLessonPlanner} plannerOpen={plannerOpen} setPlannerOpen={setPlannerOpen} selectedNote={selectedNote} setSelectedNote={setSelectedNote} submitLessonNote={submitLessonNote} activePlacement={Boolean(activePlacement)}/>;

  if (name === "Supervisor Visits") return <><section className="portal-page-head"><span>SUPERVISION</span><h1>Supervisor visits</h1><p>Review coordinator visit windows and supervisor reschedules.</p></section><RecordList title="My visit schedule" rows={visits.map(visit => ({ id: visit.id, cells: [visit.id, visit.school, formatVisitDisplay(visit), visit.time, visit.status], onView: () => setSelectedVisit(visit) }))}/>{selectedVisit && <VisitDetails visit={selectedVisit} close={() => setSelectedVisit(null)}/>}</>;

  if (name === "Whitebook (IRB)") return <StudentIrbWorkspace student={student} activePlacement={activePlacement} workflow={workflow} saveWorkflow={saveWorkflow}/>;

  return <><section className="portal-page-head"><span>MY INTERNSHIP</span><h1>{name}</h1><p>{descriptions[name]}</p></section><section className="student-card portal-detail"><div><StudentIcon name="file"/></div><h2>{name} workspace</h2><p>Your records are ready for review.</p><button onClick={() => notify(`${name} opened successfully.`)}>Open current record <StudentIcon name="arrow"/></button></section></>;
}

function ProfileCard({ student, placement, notes, visits }: { student: Student; placement?: Placement; notes: LessonNote[]; visits: Visit[] }) {
  return <><section className="portal-page-head"><span>PROFILE</span><h1>{student.name}</h1><p>Your student identity and internship summary.</p></section><section className="student-card portal-detail"><div><StudentIcon name="file"/></div><h2>Student profile</h2><p>{student.programme} · {student.department}</p><div className="role-settings-fields"><label><span>Student ID</span><input readOnly value={student.id}/></label><label><span>Email</span><input readOnly value={student.email}/></label><label><span>Placement</span><input readOnly value={placement?.school || "No accepted school recorded yet"}/></label><label><span>Lesson notes</span><input readOnly value={String(notes.length)}/></label><label><span>Supervisor visits</span><input readOnly value={String(visits.length)}/></label></div></section></>;
}

function StudentSupportPage({ student, notify }: { student: Student; notify: (message: string) => void }) {
  const [submitting, setSubmitting] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setSubmitting(true);
    const ticket = await createSupportTicket({
      subject: String(form.get("subject") || "Student support request"),
      priority: String(form.get("priority") || "Normal"),
      message: String(form.get("message") || ""),
      requesterName: student.name,
      requesterRole: "student",
    });
    setSubmitting(false);
    if (!ticket) {
      notify("Could not submit support request. Please login again to refresh your student access.");
      return;
    }
    event.currentTarget.reset();
    notify(`Support ticket ${ticket.id} submitted to coordinators.`);
  }
  return <><section className="portal-page-head"><span>HELP SUPPORT</span><h1>Raise support ticket</h1><p>Send an issue to the coordinator support desk. A coordinator can reply from the live support queue.</p></section><section className="student-card admin-settings-panel student-support-form"><form onSubmit={submit}><div className="role-settings-fields"><label><span>Subject</span><input required name="subject" placeholder="What do you need help with?"/></label><label><span>Priority</span><select name="priority" defaultValue="Normal"><option>Low</option><option>Normal</option><option>High</option></select></label></div><label className="admin-textarea"><span>Message</span><textarea required name="message" placeholder="Describe the issue clearly for the coordinator..."/></label><div className="change-password-foot"><small>Your ticket will appear in the coordinator Support Desk queue.</small><button className="primary" disabled={submitting}>{submitting ? "Submitting..." : "Submit ticket"}</button></div></form></section></>;
}

function LessonNotesWorkspace({ notes, mode, setMode, planner, setPlanner, plannerOpen, setPlannerOpen, selectedNote, setSelectedNote, submitLessonNote, activePlacement }: { notes: LessonNote[]; mode: LessonMode; setMode: (mode: LessonMode) => void; planner: LessonPlannerState; setPlanner: (value: LessonPlannerState) => void; plannerOpen: boolean; setPlannerOpen: (open: boolean) => void; selectedNote: LessonNote | null; setSelectedNote: (note: LessonNote | null) => void; submitLessonNote: () => void; activePlacement: boolean }) {
  const filteredNotes = notes.filter(note => (note.planType || "Weekly") === mode);
  const canSubmit = activePlacement && planner.subject.trim() && planner.topic.trim() && (mode === "Weekly" ? planner.week.trim() && planner.weekEnding.trim() && planner.days.length > 0 : planner.term.trim());
  if (plannerOpen) return <LessonPlannerPage mode={mode} planner={planner} setPlanner={setPlanner} close={() => setPlannerOpen(false)} submit={submitLessonNote} canSubmit={Boolean(canSubmit)} activePlacement={activePlacement}/>;
  return <>
    <section className="portal-page-head lesson-notes-head">
      <div><span>TEACHING PRACTICE</span><h1>Lesson notes</h1><p>Create lesson notes and follow mentor/supervisor review status.</p></div>
      <div className="lesson-head-actions">
        <div className="lesson-mode-toggle" role="tablist" aria-label="Lesson note type">
          {(["Weekly", "Termly"] as LessonMode[]).map(option => <button type="button" className={mode === option ? "active" : ""} onClick={() => setMode(option)} key={option}>{option}{option === "Termly" && <small>Optional</small>}</button>)}
        </div>
        <button className="primary" onClick={() => setPlannerOpen(true)}>+ Create {mode.toLowerCase()} note</button>
      </div>
    </section>
    <section className="student-card lesson-note-table-card">
      <header><div><h2>My lesson notes</h2><p>{filteredNotes.length ? `${filteredNotes.length} ${mode.toLowerCase()} records found` : `No ${mode.toLowerCase()} lesson notes yet`}</p></div></header>
      {filteredNotes.length ? <div className="table-scroll"><table><thead><tr><th>Reference</th><th>Type</th><th>Subject</th><th>Topic</th><th>{mode === "Weekly" ? "Week" : "Term"}</th><th>Review status</th><th>Action</th></tr></thead><tbody>{filteredNotes.map(note => <tr key={note.id}><td>{note.id}</td><td>{note.planType || "Weekly"}</td><td>{note.subject}</td><td>{note.topic}</td><td>{note.week}</td><td>{note.mentor} / {note.supervisor}</td><td><button className="secondary" onClick={() => setSelectedNote(note)}>Preview</button></td></tr>)}</tbody></table></div> : <div className="empty lesson-empty"><strong>No lesson notes yet</strong><p>Use the create button to open the {mode.toLowerCase()} planner. Coordinator-configured fields can be added to this structure later.</p><button className="primary" onClick={() => setPlannerOpen(true)}>Create note</button></div>}
    </section>
    {selectedNote && <NoteDetails note={selectedNote} close={() => setSelectedNote(null)}/>}
  </>;
}

function LessonPlannerPage({ mode, planner, setPlanner, close, submit, canSubmit, activePlacement }: { mode: LessonMode; planner: LessonPlannerState; setPlanner: (value: LessonPlannerState) => void; close: () => void; submit: () => void; canSubmit: boolean; activePlacement: boolean }) {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [aiOpen, setAiOpen] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<LessonAiChatMessage[]>([initialAiMessage]);
  const [aiHistory, setAiHistory] = useState<LessonAiChat[]>([]);
  const [aiTab, setAiTab] = useState<"chat" | "history">("chat");
  const [currentChatId, setCurrentChatId] = useState<string | undefined>();
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const availableDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].filter(day => !planner.days.some(item => item.day === day));
  function openAiTab(tab: "chat" | "history") {
    setAiTab(tab);
    if (tab === "history" && !historyLoaded) {
      setHistoryError("");
      fetchLessonAiChats().then(records => {
        if (records) {
          setAiHistory(records);
          setHistoryLoaded(true);
          setHistoryError("");
        } else {
          setHistoryError("AI history could not be loaded. Please confirm the backend was restarted after the latest AI routes and Prisma migration.");
        }
      });
    }
  }
  function update(key: keyof LessonPlannerState, value: string) {
    setPlanner({ ...planner, [key]: value });
  }
  function updateDay(index: number, key: "starter" | "main" | "reflection", value: string) {
    setPlanner({ ...planner, days: planner.days.map((day, dayIndex) => dayIndex === index ? { ...day, [key]: value } : day) });
  }
  function addTeachingDay() {
    const day = availableDays.includes(selectedDay) ? selectedDay : availableDays[0];
    if (!day) return;
    setPlanner({ ...planner, days: [...planner.days, { day, starter: "", main: "", reflection: "" }] });
    setSelectedDay(availableDays.filter(item => item !== day)[0] || "Monday");
  }
  function removeTeachingDay(day: string) {
    setPlanner({ ...planner, days: planner.days.filter(item => item.day !== day) });
    setSelectedDay(day);
  }
  function aiDraft(kind: "indicators" | "performance" | "resources" | "starter" | "main" | "reflection" | "general") {
    const topic = planner.topic || "the selected topic";
    const subject = planner.subject || "the subject";
    const className = planner.className || "the class";
    if (kind === "indicators") return `Suggested learning indicators for ${subject} (${topic}):\n1. Learners identify the key concept in ${topic}.\n2. Learners explain the concept using simple examples from their environment.\n3. Learners apply the concept through a guided activity in ${className}.`;
    if (kind === "performance") return `By the end of the lesson, learners should be able to:\n1. State the meaning of ${topic}.\n2. Give at least two examples related to ${topic}.\n3. Complete a short task that shows understanding of ${topic}.`;
    if (kind === "resources") return `Suggested resources: textbook pages, marker/board, learner exercise books, sample images or objects, short worksheet, and locally available teaching aids related to ${topic}.`;
    if (kind === "starter") return `Starter: Ask learners what they already know about ${topic}. Let two learners share examples, then connect their answers to today's lesson objective.`;
    if (kind === "main") return `Main activity: Explain ${topic} briefly, demonstrate one example, put learners into pairs/groups for a guided task, then discuss answers as a class.`;
    if (kind === "reflection") return `Reflection: Ask learners to mention one thing they understood, one example they can give, and one question they still have about ${topic}.`;
    return `For ${subject} — ${topic}, keep the lesson note clear: objective first, simple starter, guided main activity, learner practice, then reflection/assessment.`;
  }
  function applyAiSuggestion(target: "indicators" | "performance" | "resources" | "starter" | "main" | "reflection", text: string) {
    if (target === "indicators") setPlanner({ ...planner, learningIndicators: text });
    if (target === "performance") setPlanner({ ...planner, performanceIndicators: text });
    if (target === "resources") setPlanner({ ...planner, resources: text });
    if (["starter", "main", "reflection"].includes(target)) {
      const key = target as "starter" | "main" | "reflection";
      const days = planner.days.length ? planner.days : [{ day: selectedDay, starter: "", main: "", reflection: "" }];
      setPlanner({ ...planner, days: days.map((day, index) => index === 0 ? { ...day, [key]: text } : day) });
    }
  }
  async function persistAiChat(messages: LessonAiChatMessage[], id = currentChatId) {
    const now = new Date().toISOString();
    const subject = planner.subject || "Lesson note";
    const topic = planner.topic || "Untitled topic";
    const saved = await saveLessonAiChat({ id, title: `${subject} — ${topic}`, subject, topic, mode, messages });
    if (!saved) return;
    const record = saved;
    if (!currentChatId) setCurrentChatId(record.id);
    setAiHistory(current => {
      const next = [record, ...current.filter(item => item.id !== record.id)];
      return next;
    });
  }
  function loadAiChat(chat: LessonAiChat) {
    setCurrentChatId(chat.id);
    setAiMessages(chat.messages.length ? chat.messages : [initialAiMessage]);
    setAiTab("chat");
  }
  async function removeAiChat(id: string) {
    await deleteLessonAiChat(id);
    setAiHistory(current => {
      const next = current.filter(item => item.id !== id);
      return next;
    });
    if (currentChatId === id) {
      setCurrentChatId(undefined);
      setAiMessages([initialAiMessage]);
    }
  }
  function newAiChat() {
    setCurrentChatId(undefined);
    setAiMessages([initialAiMessage]);
    setAiTab("chat");
  }
  async function askAi() {
    const prompt = aiPrompt.trim();
    if (!prompt) return;
    const withStudent = [...aiMessages, { role: "student" as const, text: prompt, createdAt: new Date().toISOString() }];
    setAiMessages(withStudent);
    setAiPrompt("");
    setAiLoading(true);
    try {
      const response = await askLessonAiGuide({ prompt, mode, subject: planner.subject, topic: planner.topic, className: planner.className, week: planner.week, weekEnding: planner.weekEnding, planner: planner as unknown as Record<string, unknown> });
      if (response?.answer) {
        const next = [...withStudent, { role: "assistant" as const, text: response.answer, createdAt: new Date().toISOString() }];
        setAiMessages(next);
        void persistAiChat(next);
        return;
      }
      throw new Error("Empty AI response");
    } catch {
      const next = [...withStudent, { role: "assistant" as const, text: "I could not reach Gemini from the backend. Please confirm GEMINI_API_KEY is set on Render, the backend has been redeployed, and the AI endpoint is returning provider: gemini.", createdAt: new Date().toISOString() }];
      setAiMessages(next);
      void persistAiChat(next);
    } finally {
      setAiLoading(false);
    }
  }
  return <>
    <section className="portal-page-head lesson-builder-head">
      <div><span>{mode.toUpperCase()} LESSON PLANNER</span><h1>Create lesson note</h1><p>{mode === "Weekly" ? "Fill the weekly lesson plan table, preview it directly and save when ready." : "Termly planning is optional and supports wider schemes of work."}</p></div>
      <div className="row-actions"><button className="secondary" onClick={close}>← Back to notes</button><button className="primary" disabled={!canSubmit} onClick={submit}>Save lesson note</button></div>
    </section>
    <section className="lesson-builder-layout">
      <div className="student-card lesson-builder-form">
        <header><div><h2>{mode} lesson details</h2><p>{activePlacement ? "Inputs update the preview as you type." : "Record your accepted school before submitting lesson notes."}</p></div></header>
        <div className="lesson-planner-grid">
        <label><span>Subject</span><input value={planner.subject} onChange={event => update("subject", event.target.value)} placeholder="e.g. Computing"/></label>
        <label><span>Topic</span><input value={planner.topic} onChange={event => update("topic", event.target.value)} placeholder="e.g. Introduction to spreadsheets"/></label>
        {mode === "Weekly" ? <><label><span>Week ending date</span><input type="date" value={planner.weekEnding} onChange={event => update("weekEnding", event.target.value)}/></label><label><span>Week</span><input value={planner.week} onChange={event => update("week", event.target.value)} placeholder="Week 2"/></label></> : <label><span>Term</span><input value={planner.term} onChange={event => update("term", event.target.value)} placeholder="Term 1"/></label>}
        <label><span>Class</span><input value={planner.className} onChange={event => update("className", event.target.value)} placeholder="e.g. Basic 5"/></label>
        <label className="wide"><span>Learning indicator(s)</span><textarea value={planner.learningIndicators} onChange={event => update("learningIndicators", event.target.value)} placeholder="Enter learning indicators configured by the coordinator"/></label>
        <label className="wide"><span>Performance indicator</span><textarea value={planner.performanceIndicators} onChange={event => update("performanceIndicators", event.target.value)} placeholder="Describe what learners should be able to do"/></label>
        <label className="wide"><span>Teaching / Learning resources</span><textarea value={planner.resources} onChange={event => update("resources", event.target.value)} placeholder="Cards, videos, textbook, sample materials"/></label>
        </div>
        {mode === "Weekly" ? <div className="weekly-plan-editor">
          <div className="section-heading"><div><h2>Teaching days</h2><p>Add only the days you had a lesson, then enter Starter, Main and Reflection activities.</p></div><div className="add-day-control"><select value={availableDays.includes(selectedDay) ? selectedDay : availableDays[0] || ""} onChange={event => setSelectedDay(event.target.value)} disabled={!availableDays.length}>{availableDays.length ? availableDays.map(day => <option key={day}>{day}</option>) : <option>All days added</option>}</select><button className="secondary" onClick={addTeachingDay} disabled={!availableDays.length}>＋ Add day</button></div></div>
          <div className="weekly-plan-table">{planner.days.length ? <table><thead><tr><th>Day</th><th>Starter</th><th>Main</th><th>Reflection</th><th></th></tr></thead><tbody>{planner.days.map((day,index)=><tr key={day.day}><td><strong>{day.day}</strong></td><td><textarea value={day.starter} onChange={event=>updateDay(index,"starter",event.target.value)} placeholder="Revision, questions, warm-up"/></td><td><textarea value={day.main} onChange={event=>updateDay(index,"main",event.target.value)} placeholder="New learning and activities"/></td><td><textarea value={day.reflection} onChange={event=>updateDay(index,"reflection",event.target.value)} placeholder="Assessment and closure"/></td><td><button className="bin-remove day-remove" title={`Remove ${day.day}`} onClick={() => removeTeachingDay(day.day)}><span>×</span></button></td></tr>)}</tbody></table> : <div className="empty lesson-empty"><strong>No teaching day added</strong><p>Select a day above and click Add day to start the weekly table.</p></div>}</div>
        </div> : <div className="lesson-planner-grid">
          <label className="wide"><span>Term overview</span><textarea value={planner.termOverview} onChange={event => update("termOverview", event.target.value)} placeholder="Summarise the termly scope, units and expected outcomes"/></label>
          <label className="wide"><span>Assessment plan</span><textarea value={planner.assessmentPlan} onChange={event => update("assessmentPlan", event.target.value)} placeholder="Quizzes, practical tasks, project work and final assessment"/></label>
        </div>}
        <div className="placement-request-foot"><span>{activePlacement ? "Preview updates while you edit. Save when done." : "Record your accepted school before submission."}</span><div className="row-actions"><button onClick={close}>Cancel</button><button className="approve" disabled={!canSubmit} onClick={submit}>Save note</button></div></div>
      </div>
      <LessonPlannerPreview mode={mode} planner={planner}/>
    </section>
    <button className="ai-floating-orb" onClick={()=>setAiOpen(true)} aria-label="Open AI lesson-note guide"><span>AI</span></button>
    {aiOpen && <LessonAiDrawer loading={aiLoading} messages={aiMessages} history={aiHistory} historyError={historyError} tab={aiTab} setTab={openAiTab} prompt={aiPrompt} setPrompt={setAiPrompt} ask={askAi} close={()=>setAiOpen(false)} newChat={newAiChat} loadChat={loadAiChat} deleteChat={removeAiChat} insert={(kind)=>{const text=aiDraft(kind);applyAiSuggestion(kind,text);const next=[...aiMessages,{role:"assistant" as const,text:`I added this to your ${kind} section:\n${text}`,createdAt:new Date().toISOString()}];setAiMessages(next);void persistAiChat(next);}}/>}
  </>;
}

function LessonAiDrawer({messages,history,historyError,tab,setTab,prompt,setPrompt,ask,insert,close,loading,newChat,loadChat,deleteChat}:{messages:LessonAiChatMessage[];history:LessonAiChat[];historyError:string;tab:"chat"|"history";setTab:(tab:"chat"|"history")=>void;prompt:string;setPrompt:(value:string)=>void;ask:()=>void;insert:(kind:"indicators"|"performance"|"resources"|"starter"|"main"|"reflection")=>void;close:()=>void;loading:boolean;newChat:()=>void;loadChat:(chat:LessonAiChat)=>void;deleteChat:(id:string)=>void}) {
  return <aside className="notification-drawer lesson-ai-drawer">
    <header><div><strong>AI lesson-note guide</strong><span>Ghana lesson note assistant</span></div><button onClick={close} aria-label="Close AI guide">×</button></header>
    <div className="lesson-ai-setup"><strong>Gemini setup</strong><span>Add your key in the backend environment as <code>GEMINI_API_KEY</code>. The assistant now uses Gemini only and will show a provider error if the key or model is not available.</span></div>
    <div className="lesson-ai-tabs"><button className={tab==="chat"?"active":""} onClick={()=>setTab("chat")}>Chat</button><button className={tab==="history"?"active":""} onClick={()=>setTab("history")}>History <span>{history.length}</span></button></div>
    {tab==="chat" ? <>
      <div className="lesson-ai-toolbar"><button onClick={newChat}>＋ New chat</button></div>
      <div className="notification-drawer-label">QUICK INSERTS</div>
      <div className="lesson-ai-actions">
        <button onClick={()=>insert("indicators")}>Learning indicators</button>
        <button onClick={()=>insert("performance")}>Performance</button>
        <button onClick={()=>insert("resources")}>Resources</button>
        <button onClick={()=>insert("starter")}>Starter</button>
        <button onClick={()=>insert("main")}>Main activity</button>
        <button onClick={()=>insert("reflection")}>Reflection</button>
      </div>
      <div className="lesson-ai-thread">{messages.map((message,index)=><p className={message.role} key={index}>{message.text}</p>)}{loading&&<p className="assistant">Thinking through the Ghana lesson-note structure…</p>}</div>
      <div className="lesson-ai-input"><input value={prompt} onChange={event=>setPrompt(event.target.value)} onKeyDown={event=>{if(event.key==="Enter"){event.preventDefault();ask();}}} placeholder="Ask for ideas..."/><button onClick={ask} disabled={loading}>{loading?"...":"Ask"}</button></div>
    </> : <div className="lesson-ai-history">{historyError ? <div className="empty"><strong>History unavailable</strong><p>{historyError}</p><button className="secondary" onClick={()=>setTab("history")}>Retry</button></div> : history.length ? history.map(chat=><article key={chat.id}><button onClick={()=>loadChat(chat)}><strong>{chat.title}</strong><span>{chat.mode} · {new Date(chat.updatedAt).toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"numeric" })}</span><small>{chat.messages.length} messages</small></button><button className="delete-history" onClick={()=>deleteChat(chat.id)} aria-label={`Delete ${chat.title}`}>×</button></article>) : <div className="empty"><strong>No AI history yet</strong><p>Ask the AI guide a question and the chat will be saved here.</p></div>}</div>}
  </aside>;
}

function LessonPlannerPreview({ mode, planner }: { mode: LessonMode; planner: LessonPlannerState }) {
  return <aside className="student-card lesson-live-preview"><article><header><span>AAMUSTED · CSTSI</span><strong>{mode} Lesson Plan</strong><small>Live Preview</small></header><h2>{planner.topic || "Lesson topic"}</h2><p>{planner.subject || "Subject"} · {mode === "Weekly" ? `${planner.week || "Week"} · ${planner.weekEnding ? formatDate(planner.weekEnding) : "Week ending"}` : planner.term || "Term"}</p><div className="lesson-plan-table"><div><b>Class</b><p>{planner.className || "Not specified"}</p></div><div><b>Learning indicator(s)</b><p>{planner.learningIndicators || "Learning indicators will appear here."}</p></div><div><b>Performance indicator</b><p>{planner.performanceIndicators || "Performance indicators will appear here."}</p></div><div><b>Teaching / Learning resources</b><p>{planner.resources || "Teaching and learning resources will appear here."}</p></div>{mode === "Weekly" ? <div className="preview-weekly-days"><table><thead><tr><th>Day</th><th>Starter</th><th>Main</th><th>Reflection</th></tr></thead><tbody>{planner.days.map(day=><tr key={day.day}><td>{day.day}</td><td>{day.starter || "—"}</td><td>{day.main || "—"}</td><td>{day.reflection || "—"}</td></tr>)}</tbody></table></div> : <div className="lesson-phase-row term"><section><h4>Term overview</h4><p>{planner.termOverview || "Termly overview, units and expected outcomes."}</p></section><section><h4>Assessment plan</h4><p>{planner.assessmentPlan || "Assessment activities and project work."}</p></section></div>}</div><footer>Preview before saving</footer></article></aside>;
}

function defaultLessonPlanner(nextWeek: number): LessonPlannerState {
  return {
    subject: "",
    topic: "",
    week: `Week ${nextWeek}`,
    weekEnding: "",
    term: "Term 1",
    className: "",
    learningIndicators: "",
    performanceIndicators: "",
    resources: "",
    phaseStarter: "",
    phaseMain: "",
    phaseReflection: "",
    days: [],
    termOverview: "",
    assessmentPlan: "",
  };
}

type ConfiguredIrbField = { id: string; label: string; type: "text" | "textarea" | "date" | "checkbox" | "table"; required: boolean };
type ConfiguredIrbPage = { id: string; title: string; subtitle: string; fields: ConfiguredIrbField[] };
type StudentIrbValues = Record<string, Record<string, string>>;
type StudentIrbStatus = Record<string, { status: "Draft" | "Submitted"; updated: string }>;

function StudentIrbWorkspace({ student, activePlacement, workflow, saveWorkflow }: { student: Student; activePlacement?: Placement; workflow: SipWorkflowData; saveWorkflow: (next: SipWorkflowData, toast?: string) => void }) {
  const [pages, setPages] = useState<ConfiguredIrbPage[]>(readConfiguredIrbTemplate);
  const [page, setPage] = useState(0);
  const [values, setValues] = useState<StudentIrbValues>(() => readStudentIrbValues(student.id));
  const [statuses, setStatuses] = useState<StudentIrbStatus>(() => readStudentIrbStatuses(student.id));
  const current = pages[page];
  const currentValues = current.fields.reduce<Record<string, string>>((map, field) => ({ ...map, [field.id]: values[current.id]?.[field.id] || autoIrbValue(field, student, activePlacement) }), {});

  useEffect(() => {
    let alive = true;
    fetchStudentIrbSections().then(remote => {
      if (!alive || !remote?.length) return;
      const next = remote.map(item => ({ id: item.id, title: item.title, subtitle: item.subtitle, fields: item.fields as ConfiguredIrbField[] }));
      setPages(next);
      localStorage.setItem("sip-irb-template", JSON.stringify(next));
      setPage(current => Math.min(current, next.length - 1));
    });
    return () => { alive = false; };
  }, []);

  useEffect(() => localStorage.setItem(`sip-irb-values-${student.id}`, JSON.stringify(values)), [student.id, values]);
  useEffect(() => localStorage.setItem(`sip-irb-status-${student.id}`, JSON.stringify(statuses)), [student.id, statuses]);

  function setField(fieldId: string, value: string) {
    setValues(currentValues => ({ ...currentValues, [current.id]: { ...(currentValues[current.id] || {}), [fieldId]: value } }));
  }

  function mark(status: "Draft" | "Submitted") {
    const updated = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    setStatuses(currentStatuses => ({ ...currentStatuses, [current.id]: { status, updated } }));
    if (status === "Submitted") createIrbSubmission({ studentId: student.id, studentName: student.name, sectionId: current.id, sectionTitle: current.title, status, values: currentValues });
    saveWorkflow({ ...workflow, notifications: [newNotification(status === "Submitted" ? "IRB page submitted" : "IRB page saved", `${student.name} ${status === "Submitted" ? "submitted" : "saved"} ${current.title}.`, "irb"), ...workflow.notifications] }, status === "Submitted" ? "IRB page submitted for review." : "IRB page saved as draft.");
  }

  function downloadCurrentSection() {
    openStudentIrbPrint(current, currentValues, page + 1, pages.length);
    saveWorkflow({ ...workflow, notifications: [newNotification("IRB section downloaded", `${student.name} opened ${current.title} as a PDF-ready sheet.`, "irb"), ...workflow.notifications] }, "IRB section opened. Choose Save as PDF in the print dialog.");
  }

  return <>
    <section className="portal-page-head student-irb-page-head"><div><span>MY INTERNSHIP</span><h1>Whitebook (IRB)</h1><p>Fill the pages configured by the coordinator. The structure can change when CSTSI updates the whitebook.</p></div><button className="secondary" onClick={downloadCurrentSection}>⇩ Download PDF</button></section>
    <div className="student-irb-layout">
      <aside className="student-card student-irb-sections"><header><div><h2>IRB sections</h2><p>Select any page to fill, preview or download.</p></div></header>{pages.map((item,index)=><button className={index===page?"active":""} onClick={()=>setPage(index)} key={item.id}><strong>IRB {index+1}</strong><span>{item.title.replace(/^IRB \d+\+? — /,"")}</span><StatusPill text={statuses[item.id]?.status || "Draft"}/></button>)}</aside>
      <section className="student-card student-irb-form"><header><div><h2>{current.title}</h2>{cleanIrbSubtitle(current.subtitle)&&<p>{cleanIrbSubtitle(current.subtitle)}</p>}</div><div className="student-irb-header-actions"><StatusPill text={statuses[current.id]?.status || "Draft"}/></div></header><div className="student-irb-fields">{current.fields.map(field => <IrbStudentField key={field.id} field={field} value={currentValues[field.id]} disabled={!activePlacement} onChange={value => setField(field.id, value)}/>)}</div><div className="placement-request-foot"><span>{activePlacement ? statuses[current.id]?.updated ? `Last updated ${statuses[current.id].updated}` : "Preview is available before submission" : "Record your accepted school before editing"}</span><div className="row-actions"><button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>Previous</button><button onClick={() => setPage(Math.min(pages.length - 1, page + 1))} disabled={page === pages.length - 1}>Next</button><button disabled={!activePlacement} onClick={() => mark("Draft")}>Save draft</button><button className="approve" disabled={!activePlacement} onClick={() => mark("Submitted")}>Submit page</button></div></div></section>
      <StudentIrbPreview page={current} values={currentValues} pageNumber={page+1} total={pages.length}/>
    </div>
  </>;
}

function IrbStudentField({ field, value, disabled, onChange }: { field: ConfiguredIrbField; value: string; disabled: boolean; onChange: (value: string) => void }) {
  if (field.type === "textarea") return <label><span>{field.label}{field.required ? " *" : ""}</span><textarea disabled={disabled} value={value} onChange={event => onChange(event.target.value)} placeholder="Enter response"/></label>;
  if (field.type === "checkbox") return <label><span>{field.label}{field.required ? " *" : ""}</span><select disabled={disabled} value={value} onChange={event => onChange(event.target.value)}><option value="">Select</option><option>Yes</option><option>No</option><option>Not applicable</option></select></label>;
  if (field.type === "table") return <label><span>{field.label}{field.required ? " *" : ""}</span><textarea disabled={disabled} value={value} onChange={event => onChange(event.target.value)} placeholder="Enter table rows or observations"/></label>;
  return <label><span>{field.label}{field.required ? " *" : ""}</span><input disabled={disabled} type={field.type === "date" ? "date" : "text"} value={value} onChange={event => onChange(event.target.value)} placeholder="Enter response"/></label>;
}

function StudentIrbPreview({ page, values, pageNumber, total }: { page: ConfiguredIrbPage; values: Record<string, string>; pageNumber: number; total: number }) {
  const subtitle = cleanIrbSubtitle(page.subtitle);
  return <section className="student-card student-irb-preview"><article><header><span>AAMUSTED · CSTSI</span><strong>STUDENT INTERNSHIP PROGRAMME</strong><small>Internship Record Book Sheet</small></header><h2>{page.title}</h2>{subtitle&&<p>{subtitle}</p>}<div className="student-irb-preview-fields">{page.fields.map(field=><div className={`student-irb-preview-field ${field.type}`} key={field.id}><label>{field.label}{field.required&&<em>*</em>}</label>{field.type==="checkbox"?<span>{formatIrbValue(field, values[field.id]) || "Not selected"}</span>:<p>{formatIrbValue(field, values[field.id]) || " "}</p>}</div>)}</div><footer>Page {pageNumber} of {total}</footer></article></section>;
}

function cleanIrbSubtitle(value: string) {
  return value.includes("Convert the complete AAMUSTED Whitebook") ? "" : value;
}

function autoIrbValue(field: ConfiguredIrbField, student: Student, placement?: Placement) {
  const label = field.label.toLowerCase();
  if (label.includes("student name") || label === "name") return student.name;
  if (label.includes("student id") || label.includes("index number")) return student.id;
  if (label.includes("name of school") || label.includes("school name")) return placement?.school || student.school || "";
  if (label.includes("region")) return placement?.region || student.region || "";
  if (label.includes("municipality") || label.includes("district")) return placement?.municipality || "";
  if (label.includes("community") || label.includes("town")) return placement?.community || "";
  return "";
}

function formatIrbValue(field: ConfiguredIrbField, value: string) {
  if (field.type === "date" && value) return new Date(value + "T00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  return value;
}

function openStudentIrbPrint(page: ConfiguredIrbPage, values: Record<string, string>, pageNumber: number, total: number) {
  const popup = window.open("", "_blank", "width=900,height=1000");
  if (!popup) return;
  const fields = page.fields.map(field => `<div class="field ${field.type}"><label>${escapeHtml(field.label)}${field.required ? "<em>*</em>" : ""}</label><p>${escapeHtml(formatIrbValue(field, values[field.id]) || " ")}</p></div>`).join("");
  const subtitle = cleanIrbSubtitle(page.subtitle);
  popup.document.write(`<!doctype html><html><head><title>${escapeHtml(page.title)}</title><style>@page{size:A4 portrait;margin:16mm}*{box-sizing:border-box}body{margin:0;background:#e5e7eb;font-family:"Times New Roman",serif;color:#111}.sheet{width:210mm;min-height:297mm;margin:0 auto;background:white;padding:18mm 20mm;box-shadow:0 18px 45px rgba(15,23,42,.18);display:flex;flex-direction:column}header{text-align:center;border-bottom:3px solid #8a1538;padding-bottom:12px;margin-bottom:26px}header span,header small{display:block;font-size:11px;color:#555}header strong{display:block;color:#8a1538;font-size:16px;margin:4px 0;text-transform:uppercase}.body{flex:1;display:flex;flex-direction:column}h1{text-align:center;font-size:16px;margin:0 0 7px;text-transform:uppercase;letter-spacing:.02em}h2{text-align:center;font-size:12px;font-weight:400;color:#555;margin:0 0 30px;line-height:1.5}.fields{flex:1}.field{margin-bottom:20px;break-inside:avoid}.field label{display:block;font-size:12px;font-weight:700;margin-bottom:8px}.field label em{color:#b91c1c;font-style:normal;margin-left:2px}.field p{min-height:34px;border-bottom:1px dotted #555;margin:0;font-size:12px;line-height:1.85;white-space:pre-wrap;padding-bottom:4px}.field.textarea p,.field.table p{min-height:92px}.field.checkbox p{min-height:28px}footer{margin-top:auto;border-top:1px solid #ddd;padding-top:12px;text-align:center;font-size:11px;color:#555}@media print{body{background:#fff}.sheet{box-shadow:none;margin:0;padding:0;width:auto;min-height:calc(297mm - 32mm)}} </style></head><body><main class="sheet"><header><span>AAMUSTED · CSTSI</span><strong>Student Internship Programme</strong><small>Internship Record Book Sheet</small></header><section class="body"><h1>${escapeHtml(page.title)}</h1>${subtitle?`<h2>${escapeHtml(subtitle)}</h2>`:""}<div class="fields">${fields}</div><footer>Page ${pageNumber} of ${total}</footer></section></main><script>window.onload=function(){setTimeout(function(){window.print()},250)}</script></body></html>`);
  popup.document.close();
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[char] || char));
}

function StatusPill({ text }: { text: string }) {
  return <span className={`status status-${text.toLowerCase()}`}>{text}</span>;
}

type RecordRow = { id: string; cells: string[]; onView: () => void };
function RecordList({ title, rows }: { title: string; rows: RecordRow[] }) {
  return <section className="student-card student-record-list"><header><div><h2>{title}</h2><p>{rows.length ? `${rows.length} records found` : "No records yet"}</p></div></header>{rows.length ? <div className="table-scroll"><table><tbody>{rows.map(row => <tr key={row.id}>{row.cells.map(cell => <td key={cell}>{cell}</td>)}<td><button className="secondary" onClick={row.onView}>View</button></td></tr>)}</tbody></table></div> : <div className="empty"><strong>No data to display</strong><p>Records will appear here when they become available.</p></div>}</section>;
}

function PlacementDetails({ placement, close }: { placement: Placement; close: () => void }) {
  return <InfoModal title={placement.school} close={close} rows={[["Request ID", placement.id], ["Status", placement.status], ["Municipality", placement.municipality], ["Community", placement.community], ["Region", placement.region], ["Supervisor", placement.supervisor], ["Requested", placement.requested]]}/>;
}

function NoteDetails({ note, close }: { note: LessonNote; close: () => void }) {
  const sections = lessonPreviewSections(note);
  return <div className="modal-backdrop" onMouseDown={close}>
    <section className="modal lesson-preview-modal" onMouseDown={event => event.stopPropagation()}>
      <div className="modal-head">
        <div><span>LESSON NOTE PREVIEW</span><h2>{note.subject}</h2></div>
        <button type="button" onClick={close}>×</button>
      </div>
      <div className="lesson-preview-wrap">
        <article className="lesson-preview-sheet">
          <header>
            <span>AAMUSTED · CSTSI</span>
            <strong>Student Internship Programme</strong>
            <small>Lesson Note Preview</small>
          </header>
          <div className="lesson-preview-title">
            <div>
              <span>{note.week}{note.weekEnding ? ` · Week ending ${formatDate(note.weekEnding)}` : ""}</span>
              <h3>{note.topic}</h3>
              <p>{note.subject}</p>
            </div>
            <div className="lesson-preview-status">
              <StatusPill text={note.mentor}/>
              <StatusPill text={note.supervisor}/>
            </div>
          </div>
          <div className="lesson-preview-meta">
            <span><b>Lesson ID</b>{note.id}</span>
            <span><b>Class</b>{note.className || "Not specified"}</span>
            <span><b>Mentor review</b>{note.mentor}</span>
            <span><b>Supervisor review</b>{note.supervisor}</span>
          </div>
          <div className="lesson-plan-table">
            <div><b>Learning indicator(s)</b><p>{note.learningIndicators || "Configured learning indicators will appear here."}</p></div>
            <div><b>Performance indicator</b><p>{note.performanceIndicators || "Performance indicators will appear here."}</p></div>
            <div><b>Teaching / Learning resources</b><p>{note.resources || "Teaching and learning resources will appear here."}</p></div>
            {(note.planType || "Weekly") === "Weekly" ? <div className="preview-weekly-days"><table><thead><tr><th>Day</th><th>Starter</th><th>Main</th><th>Reflection</th></tr></thead><tbody>{lessonDays(note).map(day => <tr key={day.day}><td>{day.day}</td><td>{day.starter || "—"}</td><td>{day.main || "—"}</td><td>{day.reflection || "—"}</td></tr>)}</tbody></table></div> : <div className="lesson-phase-row term">
              <section><h4>Term overview</h4><p>{note.termOverview || "Termly overview, units and expected outcomes."}</p></section>
              <section><h4>Assessment plan</h4><p>{note.assessmentPlan || "Assessment activities, practical tasks and project work."}</p></section>
            </div>}
          </div>
          {sections.length > 0 && <div className="lesson-preview-sections">
            {sections.map(section => <section key={section.title}>
              <h4>{section.title}</h4>
              <p>{section.body}</p>
            </section>)}
          </div>}
        </article>
      </div>
      <div className="modal-foot"><button type="button" className="secondary" onClick={() => openLessonNotePrint(note)}>Download / Print</button><button type="button" className="primary" onClick={close}>Done</button></div>
    </section>
  </div>;
}

function lessonPreviewSections(note: LessonNote): { title: string; body: string }[] {
  return [];
}

function lessonDays(note: LessonNote) {
  return note.days?.length ? note.days : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day, index) => ({
    day,
    starter: index === 0 ? note.phaseStarter || "" : "",
    main: index === 0 ? note.phaseMain || "" : "",
    reflection: index === 0 ? note.phaseReflection || "" : "",
  }));
}

function openLessonNotePrint(note: LessonNote) {
  const popup = window.open("", "_blank", "width=900,height=1000");
  if (!popup) return;
  const sections = lessonPreviewSections(note).map(section => `<section><h2>${escapeHtml(section.title)}</h2><p>${escapeHtml(section.body)}</p></section>`).join("");
  const weekly = (note.planType || "Weekly") === "Weekly";
  const phases = weekly ? `<tr><th>Day</th><th>Starter</th><th>Main</th><th>Reflection</th></tr>${lessonDays(note).map(day => `<tr><td><strong>${escapeHtml(day.day)}</strong></td><td>${escapeHtml(day.starter || "—")}</td><td>${escapeHtml(day.main || "—")}</td><td>${escapeHtml(day.reflection || "—")}</td></tr>`).join("")}` : `<tr><th>Term overview</th><th>Assessment plan</th></tr><tr><td>${escapeHtml(note.termOverview || "Termly overview, units and expected outcomes.")}</td><td>${escapeHtml(note.assessmentPlan || "Assessment activities and project work.")}</td></tr>`;
  popup.document.write(`<!doctype html><html><head><title>${escapeHtml(note.subject)} lesson note</title><style>@page{size:A4 portrait;margin:14mm}*{box-sizing:border-box}body{margin:0;background:#e5e7eb;font-family:"Times New Roman",serif;color:#111827}.sheet{width:210mm;min-height:297mm;margin:0 auto;background:white;padding:15mm 16mm;box-shadow:0 18px 45px rgba(15,23,42,.18);display:flex;flex-direction:column}header{text-align:center;border-bottom:2px solid #111827;padding-bottom:10px;margin-bottom:18px}header span,header small{display:block;font-size:10px;color:#555}header strong{display:block;color:#111827;font-size:15px;margin:4px 0;text-transform:uppercase}.meta{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid #111;margin:0 0 12px}.meta div{border-right:1px solid #111;padding:7px}.meta div:last-child{border-right:0}.meta b{display:block;font-size:9px;text-transform:uppercase;margin-bottom:4px}.meta span{font-size:11px;font-weight:700}h1{text-align:center;font-size:15px;margin:0 0 4px;text-transform:uppercase}h3{text-align:center;font-size:11px;color:#444;margin:0 0 16px}.plan{width:100%;border-collapse:collapse;margin-bottom:14px}.plan th,.plan td{border:1px solid #111;padding:8px;vertical-align:top;font-size:11px;line-height:1.55}.plan th{text-align:left;background:#f8fafc;font-weight:700}.plan p{margin:0;white-space:pre-wrap}section{margin-bottom:12px;break-inside:avoid}section h2{font-size:12px;margin:0 0 5px;color:#111827}section p{font-size:11px;line-height:1.65;margin:0;white-space:pre-wrap}footer{margin-top:auto;border-top:1px solid #ddd;padding-top:10px;text-align:center;font-size:10px;color:#555}@media print{body{background:#fff}.sheet{box-shadow:none;margin:0;padding:0;width:auto;min-height:calc(297mm - 28mm)}} </style></head><body><main class="sheet"><header><span>AAMUSTED · CSTSI</span><strong>${escapeHtml((note.planType || "Weekly").toUpperCase())} LESSON PLAN</strong><small>Student Internship Programme</small></header><h1>${escapeHtml(note.topic)}</h1><h3>${escapeHtml(note.subject)} · ${escapeHtml(note.week)}${note.weekEnding ? ` · Week ending ${escapeHtml(formatDate(note.weekEnding))}` : ""}</h3><div class="meta"><div><b>Lesson ID</b><span>${escapeHtml(note.id)}</span></div><div><b>Class</b><span>${escapeHtml(note.className || "—")}</span></div><div><b>Mentor</b><span>${escapeHtml(note.mentor)}</span></div><div><b>Supervisor</b><span>${escapeHtml(note.supervisor)}</span></div></div><table class="plan"><tbody><tr><th>Learning indicator(s)</th><td colspan="3"><p>${escapeHtml(note.learningIndicators || "Configured learning indicators will appear here.")}</p></td></tr><tr><th>Performance indicator</th><td colspan="3"><p>${escapeHtml(note.performanceIndicators || "Performance indicators will appear here.")}</p></td></tr><tr><th>Teaching / Learning resources</th><td colspan="3"><p>${escapeHtml(note.resources || "Teaching and learning resources will appear here.")}</p></td></tr>${phases}</tbody></table>${sections}<footer>Generated from the Student SIP Portal</footer></main><script>window.onload=function(){setTimeout(function(){window.print()},250)}</script></body></html>`);
  popup.document.close();
}

function VisitDetails({ visit, close }: { visit: Visit; close: () => void }) {
  return <InfoModal title={`Visit ${visit.id}`} close={close} rows={[["School", visit.school], ["Supervisor", visit.supervisor], ["Coordinator window", `${formatDate(visit.startDate)} to ${formatDate(visit.endDate)}`], ["Exact/rescheduled date", visit.rescheduledDate ? formatDate(visit.rescheduledDate) : "Supervisor has not selected a new exact date"], ["Time", visit.time], ["Reason", visit.rescheduleReason || "—"], ["Status", visit.status]]}/>;
}

function InfoModal({ title, close, rows }: { title: string; close: () => void; rows: [string, string][] }) {
  return <div className="modal-backdrop" onMouseDown={close}><div className="modal" onMouseDown={event => event.stopPropagation()}><div className="modal-head"><div><span>DETAILS</span><h2>{title}</h2></div><button type="button" onClick={close}>×</button></div><div className="modal-fields">{rows.map(([label, value]) => <label className="field" key={label}><span>{label}</span><input readOnly value={value}/></label>)}</div><div className="modal-foot"><button type="button" className="primary" onClick={close}>Done</button></div></div></div>;
}

function readIrbSections(studentId: string): IrbSection[] {
  try {
    const saved = localStorage.getItem(`sip-irb-${studentId}`);
    if (saved) return JSON.parse(saved);
  } catch { /* Fall back to default sections. */ }
  return [
    { id: "irb-1", title: "School familiarization", status: "Draft", updated: "Not submitted" },
    { id: "irb-2", title: "Mentor lesson observation", status: "Draft", updated: "Not submitted" },
    { id: "irb-3", title: "Teaching practice evidence", status: "Locked", updated: "Not submitted" },
    { id: "irb-4", title: "Reflection and assessment", status: "Locked", updated: "Not submitted" },
  ];
}

function writeIrbSections(studentId: string, sections: IrbSection[]) {
  localStorage.setItem(`sip-irb-${studentId}`, JSON.stringify(sections));
}

function readConfiguredIrbTemplate(): ConfiguredIrbPage[] {
  try {
    const saved = localStorage.getItem("sip-irb-template");
    if (saved) return JSON.parse(saved);
  } catch { /* Use the default student-fill template. */ }
  return [
    { id: "cover", title: "Student Internship Record Book", subtitle: "Student identity, programme and placement summary.", fields: [
      { id: "student", label: "Student name", type: "text", required: true },
      { id: "index", label: "Index / Student number", type: "text", required: true },
      { id: "programme", label: "Programme", type: "text", required: true },
      { id: "school", label: "Placement school", type: "text", required: true },
    ] },
    { id: "school-profile", title: "School Profile", subtitle: "Basic details of the school and mentor teacher.", fields: [
      { id: "head", label: "Head of school", type: "text", required: true },
      { id: "mentor", label: "Mentor teacher", type: "text", required: true },
      { id: "facilities", label: "Facilities and resources available", type: "textarea", required: false },
    ] },
    { id: "reflection", title: "Weekly Reflection", subtitle: "Student reflection, challenges and professional growth.", fields: [
      { id: "activities", label: "Activities performed this week", type: "textarea", required: true },
      { id: "challenges", label: "Challenges encountered", type: "textarea", required: true },
      { id: "signature", label: "Student signature", type: "text", required: true },
    ] },
  ];
}

function readStudentIrbValues(studentId: string): StudentIrbValues {
  try {
    const saved = localStorage.getItem(`sip-irb-values-${studentId}`);
    return saved ? JSON.parse(saved) : {};
  } catch { return {}; }
}

function readStudentIrbStatuses(studentId: string): StudentIrbStatus {
  try {
    const saved = localStorage.getItem(`sip-irb-status-${studentId}`);
    return saved ? JSON.parse(saved) : {};
  } catch { return {}; }
}

function initials(name: string) {
  return name.split(" ").map(part => part[0]).slice(0, 2).join("");
}

function formatDate(value: string) {
  return value ? new Date(value + "T00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "Not set";
}

function formatVisitDisplay(visit: Visit) {
  if (visit.rescheduledDate) return formatDate(visit.rescheduledDate);
  return `${formatDate(visit.startDate)} – ${formatDate(visit.endDate)}`;
}
