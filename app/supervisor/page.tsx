"use client";

// Supervisor portal shell.
// The supervisor workspace reads and writes the shared backend workflow so
// reviews, visit scheduling and completions affect the other role portals.
import { useEffect, useMemo, useState } from "react";
import { UserSettings } from "@/components/UserSettings";
import { ChangePasswordPanel } from "@/components/ChangePassword";
import { AppearanceLoader, AppearanceSettings } from "@/components/AppearanceSettings";
import type { LessonNote, Student, Visit } from "@/lib/sip-data";
import { newNotification, persistWorkflowData, readWorkflowDataAsync, type SipWorkflowData } from "@/lib/workflow-store";
import { createSupportTicket, ensureApiRole, fetchSupervisorDashboard, type SupervisorDashboardKpis } from "@/lib/api-client";

type SupervisorIconName = "grid" | "users" | "file" | "calendar" | "bell" | "logout";

function SupervisorIcon({ name }: { name: SupervisorIconName }) {
  const paths: Record<SupervisorIconName, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
    users: <><circle cx="9" cy="7" r="4"/><path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2M17 11a4 4 0 0 1 5 4v2"/></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16h16V8Z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    logout: <><path d="M10 17l5-5-5-5M15 12H3M14 3h7v18h-7"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

const supervisorName = "Dr. Samuel Ofori";
const supervisorEmail = "samuel.ofori@aamusted.edu.gh";
const nav = [["Dashboard", "grid"], ["Assigned Interns", "users"], ["Lesson Reviews", "file"], ["Visit Schedule", "calendar"], ["Support", "bell"]] as [string, SupervisorIconName][];
const defaultSupervisorDashboard: SupervisorDashboardKpis = { kpis: { assignedInterns: 0, pendingReviews: 0, upcomingVisits: 0, averageIrbProgress: 0, completedVisits: 0 }, assignedInterns: [], pendingLessonReviews: [] };
const emptyWorkflow: SipWorkflowData = { students: [], placements: [], notes: [], visits: [], notifications: [] };

export default function SupervisorDashboard() {
  const [active, setActive] = useState("Dashboard");
  const [toast, setToast] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [workflow, setWorkflow] = useState<SipWorkflowData>(emptyWorkflow);
  const [hydrated, setHydrated] = useState(false);
  const [dashboardData, setDashboardData] = useState<SupervisorDashboardKpis>(defaultSupervisorDashboard);
  const [dashboardPeriod, setDashboardPeriod] = useState("This week");

  useEffect(() => {
    if (!ensureApiRole("supervisor")) {
      fetch("/api/auth/logout", { method: "POST" }).finally(() => { window.location.href = "/login?role=supervisor"; });
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
    let alive = true;
    fetchSupervisorDashboard(dashboardPeriod).then((data) => {
      if (alive && data) setDashboardData(data);
    });
    return () => { alive = false; };
  }, [dashboardPeriod]);

  const assignedInterns = useMemo(() => buildAssignedInterns(workflow), [workflow]);
  const assignedNames = useMemo(() => new Set(assignedInterns.map(item => item.name)), [assignedInterns]);
  const notes = workflow.notes.filter(note => assignedNames.has(note.student));
  const visits = workflow.visits.filter(visit => assignedNames.has(visit.student) || visit.supervisor.includes("Ofori"));
  const notifications = workflow.notifications;
  const unread = notifications.filter(item => !item.read).length;

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  }

  function setNotifications(next: SipWorkflowData["notifications"]) {
    setWorkflow(current => ({ ...current, notifications: next }));
  }

  function openPage(page: string) {
    setActive(page);
    setProfileOpen(false);
  }

  async function logout() {
    localStorage.removeItem("sip_api_token");
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login?role=supervisor";
  }

  return <div className="supervisor-shell"><AppearanceLoader role="supervisor"/>
    <aside className="supervisor-sidebar">
      <div className="supervisor-brand"><b><img src="/ustedlogo.jpeg" alt="AAMUSTED logo"/></b><span><strong>AAMUSTED</strong><small>Supervisor Portal</small></span><button className="supervisor-mobile-menu-toggle" onClick={() => setMobileNavOpen(value => !value)} aria-expanded={mobileNavOpen} aria-label="Open supervisor menu"><i/><i/><i/></button></div>
      <nav className={mobileNavOpen ? "open" : ""}>{nav.map(([label, icon]) => <button className={active === label ? "active" : ""} onClick={() => { openPage(label); setMobileNavOpen(false); }} key={label}><SupervisorIcon name={icon}/>{label}</button>)}</nav>
    </aside>
    <main>
      <header className="supervisor-topbar">
        <div><span>FIELD SUPERVISION</span><strong>{active}</strong></div>
        <button className="supervisor-notification-button" onClick={() => { setNotificationOpen(true); setProfileOpen(false); }} aria-label={`${unread} unread notifications`}><SupervisorIcon name="bell"/>{unread > 0 && <span className="notification-count">{unread}</span>}</button>
        <div className="profile-menu-wrap">
          <button className="profile-trigger profile-trigger-compact" onClick={() => { setProfileOpen(!profileOpen); setNotificationOpen(false); }} aria-expanded={profileOpen}><div className="supervisor-avatar">SO</div><b>⌄</b></button>
          {profileOpen && <div className="profile-dropdown attached-profile-dropdown">
            <div className="profile-dropdown-head"><div className="supervisor-avatar">SO</div><span><strong>{supervisorName}</strong><small>{supervisorEmail}</small><em>Field Supervisor</em></span></div>
            <button onClick={() => openPage("Profile")}>◉ Profile</button>
            <button onClick={() => openPage("Settings")}>⚙ Settings</button>
            <button onClick={() => openPage("Appearance")}>◐ Appearance</button>
            <button onClick={() => openPage("Change Password")}>◆ Change password</button>
            <button onClick={logout}>↪ Sign out</button>
          </div>}
        </div>
      </header>
      <div className="supervisor-content">
        {active === "Dashboard"
          ? <><section className="module-head"><div><span>WELCOME BACK</span><h1>Welcome, Dr. Ofori</h1><p>You currently supervise {dashboardData.kpis.assignedInterns || assignedInterns.length} interns across {new Set(assignedInterns.map(intern => intern.region)).size || 0} assigned regions.</p></div></section><Overview assignedInterns={assignedInterns} notes={notes} visits={visits} setActive={setActive} dashboardData={dashboardData} period={dashboardPeriod} setPeriod={setDashboardPeriod}/></>
          : <InternWorkspace active={active} assignedInterns={assignedInterns} notes={notes} visits={visits} workflow={workflow} setWorkflow={setWorkflow} notify={notify}/>}
      </div>
    </main>
    {notificationOpen && <><button className="notification-backdrop" onClick={() => setNotificationOpen(false)} aria-label="Close notifications"/><aside className="notification-drawer"><header><div><strong>Notifications</strong><span>{unread} unread</span></div><button onClick={() => setNotifications(notifications.map(item => ({ ...item, read: true })))} title="Mark all as read">✓</button><button onClick={() => setNotificationOpen(false)} aria-label="Close notifications">×</button></header><div className="notification-drawer-label">RECENT</div><div className="notification-drawer-list">{notifications.length ? notifications.map(item => <button className={item.read ? "read" : ""} onClick={() => setNotifications(notifications.map(current => current.id === item.id ? { ...current, read: true } : current))} key={item.id}><i/><span><strong>{item.title}</strong><p>{item.message}</p><small>{item.time}</small></span></button>) : <div className="empty"><strong>No notifications</strong><p>Workflow updates will appear here.</p></div>}</div></aside></>}
    {toast && <div className="toast"><SupervisorIcon name="bell"/>{toast}</div>}
  </div>;
}

type AssignedIntern = { id: string; name: string; school: string; municipality: string; community: string; region: string; irb: number; note: string; visit: string; visitStatus: string };

function buildAssignedInterns(workflow: SipWorkflowData): AssignedIntern[] {
  const placements = workflow.placements.filter(item => item.status === "Approved" && (item.supervisor.includes("Ofori") || item.supervisor === "Dr. S. Ofori"));
  return placements.map((placement, index) => {
    const student = workflow.students.find(item => item.name === placement.student);
    const note = workflow.notes.find(item => item.student === placement.student);
    const visit = workflow.visits.find(item => item.student === placement.student);
    return {
      id: student?.id || `ST-${index + 1}`,
      name: placement.student,
      school: placement.school,
      municipality: placement.municipality,
      community: placement.community,
      region: placement.region,
      irb: [72, 61, 83, 55][index % 4],
      note: note?.supervisor === "Revision" ? "Revision" : note?.supervisor === "Approved" ? "Approved" : "Pending review",
      visit: visit ? formatVisitWindow(visit) : "Not scheduled",
      visitStatus: visit?.status === "Completed" ? "Visited" : visit?.status || "Scheduled",
    };
  });
}

function Overview({ assignedInterns, notes, visits, setActive, dashboardData, period, setPeriod }: { assignedInterns: AssignedIntern[]; notes: LessonNote[]; visits: Visit[]; setActive: (value: string) => void; dashboardData: SupervisorDashboardKpis; period: string; setPeriod: (value: string) => void }) {
  const average = dashboardData.kpis.averageIrbProgress || (assignedInterns.length ? Math.round(assignedInterns.reduce((total, intern) => total + intern.irb, 0) / assignedInterns.length) : 0);
  const pending = dashboardData.kpis.pendingReviews || notes.filter(note => note.supervisor === "Pending").length;
  return <>
    <div className="dashboard-periods">{["Today", "This week", "This month", "All time"].map(item => <button className={period === item ? "active" : ""} onClick={() => setPeriod(item)} key={item}>{item}</button>)}</div>
    <section className="supervisor-metrics supervisor-metrics-five">
      <article className="supervisor-metric-card"><span>Assigned interns</span><strong>{dashboardData.kpis.assignedInterns || assignedInterns.length}</strong><small>Across partner schools</small><em>Active</em></article>
      <article className="supervisor-metric-card"><span>Pending reviews</span><strong>{pending}</strong><small>Lesson notes awaiting action</small><em>Action needed</em></article>
      <article className="supervisor-metric-card"><span>Upcoming visits</span><strong>{dashboardData.kpis.upcomingVisits || visits.filter(v => v.status === "Scheduled").length}</strong><small>Over the next 14 days</small><em>Scheduled</em></article>
      <article className="supervisor-metric-card"><span>Average IRB progress</span><strong>{average}%</strong><small>Across assigned interns</small><em>On track</em></article>
      <article className="supervisor-metric-card"><span>Completed visits</span><strong>{dashboardData.kpis.completedVisits || visits.filter(v => v.status === "Completed").length}</strong><small>This internship cycle</small><em>Visited</em></article>
    </section>
    <section className="supervisor-analytics-bottom">
      <article className="module-card progress-snapshot-card"><DashboardCardHead title="Intern progress snapshot" copy={`Current ${period.toLowerCase()} IRB outcomes for assigned students.`} action={() => setActive("Assigned Interns")}/><div className="snapshot-list">{assignedInterns.length ? assignedInterns.map(intern => <div key={intern.id}><span><strong>{intern.name}</strong><small>{intern.school}</small></span><b>{intern.irb}%</b><i><em style={{ width: `${intern.irb}%` }}/></i></div>) : <EmptyState copy="Assigned interns will appear when the coordinator approves placements for this supervisor."/>}</div></article>
      <article className="module-card supervisor-empty-card"><DashboardCardHead title="Pending lesson reviews" copy="Review submitted notes from your assigned interns." action={() => setActive("Lesson Reviews")}/><div className="dashboard-empty"><span>{pending}</span><strong>{pending ? "Reviews need attention" : "All caught up"}</strong><p>{pending ? "Open Lesson Reviews to approve or request revision." : "New submissions will appear here."}</p></div></article>
    </section>
  </>;
}

function DashboardCardHead({ title, copy, action }: { title: string; copy: string; action?: () => void }) {
  return <div className="dashboard-card-head"><div><h2>{title}</h2><p>{copy}</p></div>{action && <button onClick={action}>View all →</button>}</div>;
}

function InternWorkspace({ active, assignedInterns, notes, visits, workflow, setWorkflow, notify }: { active: string; assignedInterns: AssignedIntern[]; notes: LessonNote[]; visits: Visit[]; workflow: SipWorkflowData; setWorkflow: (value: SipWorkflowData) => void; notify: (message: string) => void }) {
  const [selectedIntern, setSelectedIntern] = useState<AssignedIntern | null>(null);
  const [selectedNote, setSelectedNote] = useState<LessonNote | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [visitDetail, setVisitDetail] = useState<Visit | null>(null);
  const [rescheduleVisit, setRescheduleVisit] = useState<Visit | null>(null);

  useEffect(() => {
    setSelectedNote(null);
    setSelectedIntern(null);
    setScheduleOpen(false);
    setVisitDetail(null);
    setRescheduleVisit(null);
  }, [active]);

  function review(note: LessonNote, value: "Approved" | "Revision") {
    setWorkflow({
      ...workflow,
      notes: workflow.notes.map(item => item.id === note.id ? { ...item, supervisor: value } : item),
      notifications: [newNotification(`Lesson note ${value.toLowerCase()}`, `${note.student}'s ${note.subject} lesson note was marked ${value.toLowerCase()} by ${supervisorName}.`, "lesson"), ...workflow.notifications],
    });
    notify(`Lesson note marked ${value.toLowerCase()}.`);
  }

  function complete(visit: Visit) {
    setWorkflow({
      ...workflow,
      visits: workflow.visits.map(item => item.id === visit.id ? { ...item, status: "Completed" } : item),
      notifications: [newNotification("Visit completed", `${visit.supervisor} completed a visit for ${visit.student}.`, "visit"), ...workflow.notifications],
    });
    notify("Visit marked completed.");
  }

  function schedule(form: FormData) {
    const student = String(form.get("student"));
    const intern = assignedInterns.find(item => item.name === student);
    const visit: Visit = {
      id: `VS-${Date.now().toString().slice(-4)}`,
      student,
      supervisor: supervisorName,
      school: intern?.school || String(form.get("school")),
      startDate: String(form.get("startDate")),
      endDate: String(form.get("endDate")),
      time: String(form.get("time")),
      status: "Scheduled",
    };
    setWorkflow({
      ...workflow,
      visits: [visit, ...workflow.visits],
      notifications: [newNotification("Supervisor visit scheduled", `${supervisorName} scheduled a visit for ${visit.student} at ${visit.school}.`, "visit"), ...workflow.notifications],
    });
    setScheduleOpen(false);
    notify("Visit scheduled and shared with the workflow.");
  }

  function reschedule(form: FormData) {
    if (!rescheduleVisit) return;
    const date = String(form.get("rescheduledDate"));
    const reason = String(form.get("rescheduleReason"));
    setWorkflow({
      ...workflow,
      visits: workflow.visits.map(item => item.id === rescheduleVisit.id ? { ...item, rescheduledDate: date, rescheduleReason: reason, time: String(form.get("time")) || item.time, status: "Rescheduled" } : item),
      notifications: [newNotification("Supervisor visit rescheduled", `${supervisorName} rescheduled ${rescheduleVisit.student}'s visit to ${formatDate(date)}.`, "visit"), ...workflow.notifications],
    });
    setRescheduleVisit(null);
    notify("Visit rescheduled. The student can now see the updated date.");
  }

  async function raiseSupport(form: FormData) {
    await createSupportTicket({ subject: String(form.get("subject") || "Supervisor support request"), message: String(form.get("message") || ""), priority: String(form.get("priority") || "Normal"), requesterName: supervisorName, requesterRole: "supervisor" });
    notify("Support ticket submitted to the coordinator support desk.");
  }

  if (selectedNote) return <LessonReviewPage note={selectedNote} close={() => setSelectedNote(null)} onApprove={() => { review(selectedNote, "Approved"); setSelectedNote(null); }} onRevise={() => { review(selectedNote, "Revision"); setSelectedNote(null); }}/>;

  if (active === "Support") return <><section className="module-head"><div><span>SUPPORT DESK</span><h1>Raise support ticket</h1><p>Send an issue to coordinators. They will respond through the support queue.</p></div></section><section className="module-card admin-settings-panel"><form onSubmit={event=>{event.preventDefault();raiseSupport(new FormData(event.currentTarget));event.currentTarget.reset()}}><div className="role-settings-fields"><label><span>Subject</span><input required name="subject" placeholder="What do you need help with?"/></label><label><span>Priority</span><select name="priority" defaultValue="Normal"><option>Low</option><option>Normal</option><option>High</option></select></label></div><label className="admin-textarea"><span>Message</span><textarea required name="message" placeholder="Describe the issue for the coordinator..."/></label><div className="change-password-foot"><small>Tickets appear instantly on the coordinator Support Desk.</small><button className="primary">Submit ticket</button></div></form></section></>;

  if (active === "Profile") return <section className="module-card portal-settings"><div className="section-heading"><div><h2>Profile</h2><p>Your supervisor identity and assigned programme details.</p></div></div><div className="profile-detail-banner"><div className="supervisor-avatar">SO</div><span><strong>{supervisorName}</strong><small>{supervisorEmail}</small><em>Field Supervisor · Ashanti, Eastern and Bono</em></span></div></section>;
  if (active === "Settings") return <UserSettings role="supervisor" name={supervisorName} email={supervisorEmail} onSaved={notify}/>;
  if (active === "Appearance") return <AppearanceSettings role="supervisor"/>;
  if (active === "Change Password") return <ChangePasswordPanel role="supervisor" onSaved={notify}/>;

  if (active === "Assigned Interns") return <section className="module-card"><div className="section-heading"><div><h2>Assigned interns</h2><p>Students currently under your supervision.</p></div></div><InternTable assignedInterns={assignedInterns} onView={setSelectedIntern}/>{selectedIntern && <InternDetails intern={selectedIntern} student={workflow.students.find(item => item.name === selectedIntern.name)} notes={workflow.notes.filter(item => item.student === selectedIntern.name)} visits={workflow.visits.filter(item => item.student === selectedIntern.name)} close={() => setSelectedIntern(null)}/>}</section>;

  if (active === "Lesson Reviews") return <section className="module-card"><div className="section-heading"><div><h2>Lesson reviews</h2><p>Open the full lesson note, comment against each section and approve or request revision.</p></div></div><div className="table-scroll"><table><thead><tr><th>Lesson</th><th>Student</th><th>Subject</th><th>Topic</th><th>Mentor</th><th>Supervisor</th><th>Action</th></tr></thead><tbody>{notes.map(note => <tr key={note.id}><td><strong>{note.id}</strong></td><td>{note.student}</td><td>{note.subject}</td><td>{note.topic}</td><td><Status value={note.mentor}/></td><td><Status value={note.supervisor}/></td><td><button className="secondary table-review-button" onClick={() => setSelectedNote(note)}>{note.supervisor === "Pending" ? "Open review" : "View review"}</button></td></tr>)}</tbody></table>{!notes.length && <EmptyState copy="Lesson notes from assigned interns will appear here."/>}</div></section>;

  return <section className="module-card"><div className="section-heading"><div><h2>Visit schedule</h2><p>Inspect coordinator visit ranges, reschedule exact supervision dates and complete visits.</p></div><button className="primary" onClick={() => setScheduleOpen(true)}>＋ Add visit window</button></div><div className="supervisor-action-list">{visits.length ? visits.map(visit => <article key={visit.id}><div className="person"><b>{initials(visit.student)}</b><span><strong>{visit.student}</strong><small>{visit.school}</small></span></div><span>{formatVisitWindow(visit)} · {visit.time}</span><Status value={visit.status}/><div className="row-actions"><button onClick={() => setVisitDetail(visit)}>View</button><button disabled={visit.status === "Completed"} onClick={() => setRescheduleVisit(visit)}>Reschedule</button><button className="primary" disabled={visit.status === "Completed"} onClick={() => complete(visit)}>{visit.status === "Completed" ? "Completed" : "Mark completed"}</button></div></article>) : <EmptyState copy="No supervisor visits have been scheduled yet."/>}</div>{scheduleOpen && <SupervisorModal title="Add supervision window" close={() => setScheduleOpen(false)} onSubmit={schedule}><Select name="student" label="Intern" options={assignedInterns.map(item => item.name)}/><Field name="school" label="School" defaultValue={assignedInterns[0]?.school || ""}/><Field name="startDate" label="Window start date" type="date"/><Field name="endDate" label="Window end date" type="date"/><Field name="time" label="Preferred time" type="time"/></SupervisorModal>}{rescheduleVisit && <SupervisorModal title="Reschedule visit" close={() => setRescheduleVisit(null)} onSubmit={reschedule}><Field name="rescheduledDate" label="New exact visit date" type="date" defaultValue={rescheduleVisit.rescheduledDate || rescheduleVisit.startDate}/><Field name="time" label="New time" type="time" defaultValue={rescheduleVisit.time}/><Field name="rescheduleReason" label="Reason" defaultValue={rescheduleVisit.rescheduleReason || ""}/><p className="form-note">The student will see this updated supervision date immediately.</p></SupervisorModal>}{visitDetail && <VisitDetails visit={visitDetail} close={() => setVisitDetail(null)} onComplete={() => { complete(visitDetail); setVisitDetail(null); }}/>}</section>;
}

function InternTable({ assignedInterns, onView }: { assignedInterns: AssignedIntern[]; onView: (intern: AssignedIntern) => void }) {
  return <div className="table-scroll"><table><thead><tr><th>Intern</th><th>Student ID</th><th>School</th><th>Municipality</th><th>Community</th><th>Region</th><th>IRB progress</th><th>Next visit</th><th>Visit status</th><th>Action</th></tr></thead><tbody>{assignedInterns.map(intern => <tr key={intern.id}><td><strong>{intern.name}</strong></td><td>{intern.id}</td><td>{intern.school}</td><td>{intern.municipality}</td><td>{intern.community}</td><td>{intern.region}</td><td>{intern.irb}%</td><td>{intern.visit}</td><td><Status value={intern.visitStatus}/></td><td><button className="secondary" onClick={() => onView(intern)}>View</button></td></tr>)}</tbody></table>{!assignedInterns.length && <EmptyState copy="No approved placements are assigned to this supervisor yet."/>}</div>;
}

function InternDetails({ intern, student, notes, visits, close }: { intern: AssignedIntern; student?: Student; notes: LessonNote[]; visits: Visit[]; close: () => void }) {
  return <InfoModal title={intern.name} close={close} rows={[["Student ID", student?.id || intern.id], ["Email", student?.email || "—"], ["School", intern.school], ["Municipality", intern.municipality], ["Community", intern.community], ["Region", intern.region], ["IRB progress", `${intern.irb}%`], ["Lesson notes", String(notes.length)], ["Visits", String(visits.length)]]}/>;
}

function LessonReviewPage({ note, close, onApprove, onRevise }: { note: LessonNote; close: () => void; onApprove: () => void; onRevise: () => void }) {
  const [comments, setComments] = useState<Record<string, string>>({});
  const dayRows = note.days?.length ? note.days : [{ day: "Lesson day", starter: note.phaseStarter || "", main: note.phaseMain || "", reflection: note.phaseReflection || "" }];
  function setComment(key: string, value: string) {
    setComments(current => ({ ...current, [key]: value }));
  }
  return <section className="lesson-review-page">
    <div className="module-head lesson-review-head"><div><span>LESSON REVIEW</span><h1>{note.subject}</h1><p>{note.student} · {note.topic} · {note.week}{note.weekEnding ? ` · Week ending ${formatDate(note.weekEnding)}` : ""}</p></div><div className="row-actions"><button className="secondary" onClick={close}>← Back to reviews</button><button onClick={onRevise}>Request revision</button><button className="primary" onClick={onApprove}>Approve</button></div></div>
    <div className="lesson-review-layout">
      <article className="module-card lesson-review-sheet">
        <header><span>AAMUSTED · CSTSI</span><strong>{note.planType || "Weekly"} Lesson Plan</strong><small>Student submitted lesson note</small></header>
        <h2>{note.topic}</h2>
        <div className="lesson-review-meta plain"><span><b>Student</b>{note.student}</span><span><b>Class</b>{note.className || "Not specified"}</span><span><b>Mentor</b>{note.mentor}</span><span><b>Supervisor</b>{note.supervisor}</span></div>
        <ReviewBlock title="Learning indicator(s)" value={note.learningIndicators || "No learning indicators supplied."}/>
        <ReviewBlock title="Performance indicator" value={note.performanceIndicators || "No performance indicator supplied."}/>
        <ReviewBlock title="Teaching / Learning resources" value={note.resources || "No resources supplied."}/>
        {(note.planType || "Weekly") === "Weekly" ? <div className="lesson-review-days"><table><thead><tr><th>Day</th><th>Starter</th><th>Main</th><th>Reflection</th></tr></thead><tbody>{dayRows.map(day => <tr key={day.day}><td><strong>{day.day}</strong></td><td>{day.starter || "—"}</td><td>{day.main || "—"}</td><td>{day.reflection || "—"}</td></tr>)}</tbody></table></div> : <><ReviewBlock title="Term overview" value={note.termOverview || "No term overview supplied."}/><ReviewBlock title="Assessment plan" value={note.assessmentPlan || "No assessment plan supplied."}/></>}
      </article>
      <aside className="module-card lesson-review-side"><h2>Supervisor decision</h2><p>Write comments at the exact sections that need attention, then approve or request revision.</p><label><span>Overall comment</span><textarea value={comments.overall || ""} onChange={event => setComment("overall", event.target.value)} placeholder="Summarise the decision or required changes"/></label><div><button onClick={onRevise}>Request revision</button><button className="primary" onClick={onApprove}>Approve lesson note</button></div></aside>
    </div>
  </section>;
}

function ReviewBlock({ title, value }: { title: string; value: string }) {
  return <section className="lesson-review-block no-comment"><div><h3>{title}</h3><p>{value}</p></div></section>;
}

function VisitDetails({ visit, close, onComplete }: { visit: Visit; close: () => void; onComplete: () => void }) {
  return <InfoModal title={`Visit ${visit.id}`} close={close} rows={[["Student", visit.student], ["School", visit.school], ["Supervisor", visit.supervisor], ["Coordinator window", `${formatDate(visit.startDate)} to ${formatDate(visit.endDate)}`], ["Exact/rescheduled date", visit.rescheduledDate ? formatDate(visit.rescheduledDate) : "Not selected yet"], ["Time", visit.time], ["Reason", visit.rescheduleReason || "—"], ["Status", visit.status]]} action={visit.status === "Completed" ? undefined : { label: "Mark completed", run: onComplete }}/>;
}

function SupervisorModal({ title, close, onSubmit, children }: { title: string; close: () => void; onSubmit: (form: FormData) => void; children: React.ReactNode }) {
  return <div className="modal-backdrop" onMouseDown={close}><form className="modal" onSubmit={event => { event.preventDefault(); onSubmit(new FormData(event.currentTarget)); }} onMouseDown={event => event.stopPropagation()}><div className="modal-head"><div><span>SUPERVISION WORKFLOW</span><h2>{title}</h2></div><button type="button" onClick={close}>×</button></div><div className="modal-fields">{children}</div><div className="modal-foot"><button type="button" className="secondary" onClick={close}>Cancel</button><button className="primary">Save</button></div></form></div>;
}

function InfoModal({ title, close, rows, action }: { title: string; close: () => void; rows: [string, string][]; action?: { label: string; run: () => void } }) {
  return <div className="modal-backdrop" onMouseDown={close}><div className="modal" onMouseDown={event => event.stopPropagation()}><div className="modal-head"><div><span>DETAILS</span><h2>{title}</h2></div><button type="button" onClick={close}>×</button></div><div className="modal-fields">{rows.map(([label, value]) => <label className="field" key={label}><span>{label}</span><input readOnly value={value}/></label>)}</div><div className="modal-foot"><button type="button" className="secondary" onClick={close}>Close</button>{action && <button type="button" className="primary" onClick={action.run}>{action.label}</button>}</div></div></div>;
}

function Field({ name, label, type = "text", defaultValue = "" }: { name: string; label: string; type?: string; defaultValue?: string }) {
  return <label className="field"><span>{label}</span><input required name={name} type={type} defaultValue={defaultValue}/></label>;
}

function Select({ name, label, options }: { name: string; label: string; options: string[] }) {
  return <label className="field"><span>{label}</span><select required name={name}>{options.length ? options.map(option => <option key={option}>{option}</option>) : <option value="">No assigned interns</option>}</select></label>;
}

function Status({ value }: { value: string }) {
  return <span className={`status status-${value.toLowerCase().replace(" ", "-")}`}>{value}</span>;
}

function EmptyState({ copy }: { copy: string }) {
  return <div className="empty"><span aria-hidden="true">▤</span><strong>No data to display</strong><p>{copy}</p></div>;
}

function initials(name: string) {
  return name.split(" ").map(part => part[0]).slice(0, 2).join("");
}

function formatDate(value: string) {
  return value ? new Date(value + "T00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "Not set";
}

function formatVisitWindow(visit: Visit) {
  const windowText = `${formatDate(visit.startDate)} – ${formatDate(visit.endDate)}`;
  return visit.rescheduledDate ? `${formatDate(visit.rescheduledDate)} · rescheduled from ${windowText}` : windowText;
}
