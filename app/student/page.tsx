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
import type { LessonNote, NotificationItem, Placement, Student, Visit } from "@/lib/sip-data";
import { newNotification, readWorkflowData, writeWorkflowData, type SipWorkflowData } from "@/lib/workflow-store";

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
const schools = [
  { name: "Asokwa M/A JHS", municipality: "Kumasi Metropolitan", community: "Asokwa", region: "Ashanti", spaces: 6 },
  { name: "Kumasi Technical SHS", municipality: "Kumasi Metropolitan", community: "Atonsu", region: "Ashanti", spaces: 2 },
  { name: "Mampong Presby JHS", municipality: "Mampong Municipal", community: "Mampong", region: "Ashanti", spaces: 4 },
  { name: "Akropong D/A JHS", municipality: "Akuapem North Municipal", community: "Akropong", region: "Eastern", spaces: 3 },
];

type IrbSection = { id: string; title: string; status: "Locked" | "Draft" | "Submitted" | "Approved"; updated: string };

export default function StudentPortalPage() {
  const [active, setActive] = useState("Overview");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [workflow, setWorkflow] = useState<SipWorkflowData>(() => readWorkflowData());

  const student = workflow.students.find(item => item.name === currentStudentName) || workflow.students[0];
  const placements = workflow.placements.filter(item => item.student === student.name);
  const notes = workflow.notes.filter(item => item.student === student.name);
  const visits = workflow.visits.filter(item => item.student === student.name);
  const studentNotifications = workflow.notifications.filter(item => item.message.includes(student.name) || item.title.includes("Visit") || item.title.includes("Placement") || item.title.includes("Lesson") || item.title.includes("IRB"));
  const unread = studentNotifications.filter(item => !item.read).length;

  useEffect(() => writeWorkflowData(workflow), [workflow]);

  function feedback(text: string) {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 3500);
  }

  function saveWorkflow(next: SipWorkflowData, toast?: string) {
    setWorkflow(next);
    if (toast) feedback(toast);
  }

  function addNotification(title: string, body: string, type: string) {
    setWorkflow(current => ({ ...current, notifications: [newNotification(title, body, type), ...current.notifications] }));
  }

  function contactSupport() {
    addNotification("Student support request", `${student.name} requested help from CSTSI support.`, "system");
    feedback("Support request sent to CSTSI and added to notifications.");
  }

  function markNotification(id: string) {
    setWorkflow(current => ({ ...current, notifications: current.notifications.map(item => item.id === id ? { ...item, read: true } : item) }));
  }

  function markAllNotifications() {
    const ids = new Set(studentNotifications.map(item => item.id));
    setWorkflow(current => ({ ...current, notifications: current.notifications.map(item => ids.has(item.id) ? { ...item, read: true } : item) }));
  }

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login?role=student";
  }

  return <div className="student-shell"><AppearanceLoader role="student"/>
    <aside className="student-sidebar">
      <div className="student-brand"><span><img src="/ustedlogo.jpeg" alt="AAMUSTED logo"/></span><div><strong>AAMUSTED</strong><small>Student SIP Portal</small></div></div>
      <nav>{portalNavigation.map(([label, icon]) => <button className={active === label ? "active" : ""} onClick={() => setActive(label)} key={label}><StudentIcon name={icon}/>{label}</button>)}</nav>
      <div className="student-support"><strong>Need support?</strong><p>Contact CSTSI if you are unable to complete a required stage.</p><button onClick={contactSupport}>Contact support</button></div>
    </aside>
    <main className="student-main">
      <header className="student-topbar">
        <div><span>2025/26 Internship</span><strong>{active}</strong></div>
        <button onClick={() => { setNotificationOpen(true); setProfileOpen(false); }} aria-label="Open notifications"><StudentIcon name="bell"/>{unread > 0 && <i/>}</button>
        <div className="profile-menu-wrap"><button className="profile-trigger profile-trigger-compact" onClick={() => { setProfileOpen(!profileOpen); setNotificationOpen(false); }} aria-expanded={profileOpen}><div className="student-avatar">{initials(student.name)}</div><b>⌄</b></button>{profileOpen && <div className="profile-dropdown attached-profile-dropdown"><div className="profile-dropdown-head"><div className="student-avatar">{initials(student.name)}</div><span><strong>{student.name}</strong><small>{student.email}</small><em>Internship Student</em></span></div><button onClick={() => { setActive("Profile"); setProfileOpen(false); }}>◉ Profile</button><button onClick={() => { setActive("Settings"); setProfileOpen(false); }}>⚙ Settings</button><button onClick={() => { setActive("Appearance"); setProfileOpen(false); }}>◐ Appearance</button><button onClick={() => { setActive("Change Password"); setProfileOpen(false); }}>◆ Change password</button><button onClick={signOut}>↪ Sign out</button></div>}</div>
      </header>
      <div className="student-content">{active === "Overview" ? <StudentOverview student={student} notes={notes} visits={visits} placements={placements} onAction={setActive}/> : <StudentSection name={active} student={student} placements={placements} notes={notes} visits={visits} workflow={workflow} saveWorkflow={saveWorkflow} notify={feedback}/>}</div>
    </main>
    {notificationOpen && <><button className="notification-backdrop" onClick={() => setNotificationOpen(false)} aria-label="Close notifications"/><aside className="notification-drawer"><header><div><strong>Notifications</strong><span>{unread} unread</span></div><button onClick={markAllNotifications} title="Mark all as read">✓</button><button onClick={() => setNotificationOpen(false)} aria-label="Close notifications">×</button></header><div className="notification-drawer-label">RECENT</div><div className="notification-drawer-list">{studentNotifications.length ? studentNotifications.map(item => <button className={item.read ? "read" : ""} onClick={() => markNotification(item.id)} key={item.id}><i/><span><strong>{item.title}</strong><p>{item.message}</p><small>{item.time}</small></span></button>) : <div className="empty"><strong>No notifications</strong><p>Your placement, visits and lesson-note updates will appear here.</p></div>}</div></aside></>}
    {message && <div className="toast"><StudentIcon name="bell"/>{message}</div>}
  </div>;
}

function StudentOverview({ student, placements, notes, visits, onAction }: { student: Student; placements: Placement[]; notes: LessonNote[]; visits: Visit[]; onAction: (page: string) => void }) {
  const approvedNotes = notes.filter(note => note.supervisor === "Approved").length;
  const placement = placements.find(item => item.status === "Approved");
  const pending = placements.find(item => item.status === "Pending");
  const nextVisit = visits.find(item => item.status === "Scheduled");
  const progress = placement ? 68 : pending ? 32 : 18;
  return <>
    <section className="student-welcome"><div><span>WELCOME BACK</span><h1>Welcome, {student.name.split(" ")[0]} 👋🏽</h1><p>You are {progress}% through your Student Internship Programme.</p></div><button onClick={() => onAction(placement ? "Whitebook (IRB)" : "My Placement")}>{placement ? "Continue IRB" : "Choose placement"} <StudentIcon name="arrow"/></button></section>
    <section className="student-progress-card"><div className="progress-ring"><strong>{progress}%</strong><span>Complete</span></div><div className="progress-copy"><span>YOUR INTERNSHIP JOURNEY</span><h2>{placement ? "Keep up the good work" : "Placement step pending"}</h2><p>{placement ? "Complete your IRB section and submit this week’s lesson note." : "Select a school and wait for coordinator confirmation."}</p><div className="journey-steps"><i className="done"/><i className={placement ? "done" : "current"}/><i className={placement ? "current" : ""}/><i/><i/></div><div className="journey-labels"><span>Profile</span><span>Placed</span><span>IRB</span><span>Review</span><span>Complete</span></div></div></section>
    <section className="student-metrics">
      <button onClick={() => onAction("My Placement")}><div className="blue"><StudentIcon name="pin"/></div><span>Placement</span><strong>{placement?.school || pending?.school || "Not selected"}</strong><small>{placement ? "Approved" : pending ? "Pending approval" : "Action required"} · {student.region}</small></button>
      <button onClick={() => onAction("Whitebook (IRB)")}><div className="purple"><StudentIcon name="book"/></div><span>IRB progress</span><strong>{placement ? "4 of 6 sections" : "0 of 6 sections"}</strong><small>{placement ? "Section 5 in progress" : "Starts after placement"}</small></button>
      <button onClick={() => onAction("Lesson Notes")}><div className="green"><StudentIcon name="file"/></div><span>Lesson notes</span><strong>{approvedNotes} approved</strong><small>{notes.filter(n => n.supervisor === "Pending").length} awaiting review</small></button>
      <button onClick={() => onAction("Supervisor Visits")}><div className="amber"><StudentIcon name="calendar"/></div><span>Next visit</span><strong>{nextVisit ? formatVisitDisplay(nextVisit) : "Not scheduled"}</strong><small>{nextVisit ? `${nextVisit.time} · ${nextVisit.supervisor}` : "Supervisor will schedule"}</small></button>
    </section>
  </>;
}

function StudentSection({ name, student, placements, notes, visits, workflow, saveWorkflow, notify }: { name: string; student: Student; placements: Placement[]; notes: LessonNote[]; visits: Visit[]; workflow: SipWorkflowData; saveWorkflow: (next: SipWorkflowData, toast?: string) => void; notify: (message: string) => void }) {
  const [selectedSchool, setSelectedSchool] = useState("");
  const [addingSchool, setAddingSchool] = useState(false);
  const [customSchool, setCustomSchool] = useState({ name: "", municipality: "", community: "", region: student.region });
  const [lessonSubject, setLessonSubject] = useState("");
  const [lessonTopic, setLessonTopic] = useState("");
  const [lessonWeek, setLessonWeek] = useState(`Week ${notes.length + 1}`);
  const [selectedNote, setSelectedNote] = useState<LessonNote | null>(null);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [selectedPlacement, setSelectedPlacement] = useState<Placement | null>(null);
  const [irbSections, setIrbSections] = useState<IrbSection[]>(() => readIrbSections(student.id));
  const activePlacement = placements.find(item => item.status === "Approved");
  const pendingPlacement = placements.find(item => item.status === "Pending");
  const descriptions: Record<string, string> = { "Whitebook (IRB)": "Complete and submit your configurable Internship Record Book sections.", "Lesson Notes": "Create weekly lesson plans and monitor mentor and supervisor reviews.", "Supervisor Visits": "Review your personal visit schedule and assessment feedback.", Profile: "View your student identity and programme details." };

  useEffect(() => writeIrbSections(student.id, irbSections), [student.id, irbSections]);

  function requestPlacement() {
    const school = addingSchool ? { ...customSchool, spaces: 0 } : schools.find(item => item.name === selectedSchool);
    if (!school) return;
    const request: Placement = { id: `PL-${Date.now().toString().slice(-4)}`, student: student.name, school: school.name, municipality: school.municipality, community: school.community, region: school.region, supervisor: "Unassigned", requested: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }), status: "Pending" };
    saveWorkflow({ ...workflow, placements: [request, ...workflow.placements], notifications: [newNotification(addingSchool ? "New school suggested" : "Placement request submitted", `${student.name} requested ${school.name}${addingSchool ? " and added the school for coordinator review" : ""}.`, "placement"), ...workflow.notifications] }, `Placement request sent to ${school.name}.`);
    setAddingSchool(false);
    setCustomSchool({ name: "", municipality: "", community: "", region: student.region });
  }

  function cancelPlacement(id: string) {
    saveWorkflow({ ...workflow, placements: workflow.placements.filter(item => item.id !== id), notifications: [newNotification("Placement request cancelled", `${student.name} cancelled placement request ${id}.`, "placement"), ...workflow.notifications] }, "Pending placement request cancelled.");
  }

  function submitLessonNote() {
    const item: LessonNote = { id: `LN-${Date.now().toString().slice(-3)}`, student: student.name, subject: lessonSubject, topic: lessonTopic, week: lessonWeek, mentor: "Pending", supervisor: "Pending" };
    saveWorkflow({ ...workflow, notes: [item, ...workflow.notes], notifications: [newNotification("Lesson note submitted", `${student.name} submitted ${lessonSubject} for ${lessonWeek}.`, "lesson"), ...workflow.notifications] }, "Lesson note submitted for review.");
    setLessonSubject("");
    setLessonTopic("");
    setLessonWeek(`Week ${notes.length + 2}`);
  }

  function saveIrb(section: IrbSection, status: IrbSection["status"]) {
    const next = irbSections.map(item => item.id === section.id ? { ...item, status, updated: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) } : item);
    setIrbSections(next);
    saveWorkflow({ ...workflow, notifications: [newNotification(status === "Submitted" ? "IRB section submitted" : "IRB section saved", `${student.name} ${status === "Submitted" ? "submitted" : "saved"} ${section.title}.`, "irb"), ...workflow.notifications] }, status === "Submitted" ? "IRB section submitted for supervisor review." : "IRB section saved as draft.");
  }

  if (name === "Settings") return <UserSettings role="student" name={student.name} email={student.email} onSaved={notify}/>;
  if (name === "Appearance") return <AppearanceSettings role="student"/>;
  if (name === "Change Password") return <ChangePasswordPanel role="student" onSaved={notify}/>;
  if (name === "Documents") return <StudentInternshipLetter notify={notify}/>;
  if (name === "Profile") return <ProfileCard student={student} placement={activePlacement} notes={notes} visits={visits}/>;

  if (name === "My Placement") return <><section className="portal-page-head"><span>MY INTERNSHIP</span><h1>{activePlacement ? "My placement school" : "Choose a placement school"}</h1><p>{activePlacement ? "Your school has been confirmed by the coordinator." : "Select your preferred school. If it is not listed, add it for coordinator review."}</p></section><section className="student-card student-placement-picker"><header><div><h2>{activePlacement ? "Confirmed placement" : "Available placement schools"}</h2><p>{pendingPlacement ? "Your request is waiting for coordinator approval." : "Your request will be sent to the coordinator for confirmation."}</p></div>{!activePlacement&&!pendingPlacement&&<button className="secondary" onClick={()=>setAddingSchool(!addingSchool)}>{addingSchool?"Use listed schools":"School not found?"}</button>}</header>{activePlacement ? <div className="placement-choice-list"><button className="selected" onClick={() => setSelectedPlacement(activePlacement)}><i>✓</i><span><strong>{activePlacement.school}</strong><small>{activePlacement.municipality} · {activePlacement.region} Region</small></span><em>Approved</em></button></div> : <>{addingSchool ? <div className="role-settings-fields lesson-submit-fields"><label><span>School name</span><input value={customSchool.name} onChange={event=>setCustomSchool({...customSchool,name:event.target.value})} placeholder="Enter school name"/></label><label><span>Municipality / District</span><input value={customSchool.municipality} onChange={event=>setCustomSchool({...customSchool,municipality:event.target.value})} placeholder="e.g. Kumasi Metropolitan"/></label><label><span>Community / Town</span><input value={customSchool.community} onChange={event=>setCustomSchool({...customSchool,community:event.target.value})} placeholder="e.g. Asokwa"/></label><label><span>Region</span><input value={customSchool.region} onChange={event=>setCustomSchool({...customSchool,region:event.target.value})}/></label></div> : <div className="placement-choice-list">{schools.map(school => <button className={selectedSchool === school.name || pendingPlacement?.school === school.name ? "selected" : ""} onClick={() => setSelectedSchool(school.name)} key={school.name}><i>{selectedSchool === school.name || pendingPlacement?.school === school.name ? "✓" : ""}</i><span><strong>{school.name}</strong><small>{school.municipality} · {school.community} · {school.region} Region</small></span><em>{school.spaces} spaces</em></button>)}</div>}<div className="placement-request-foot"><span>{pendingPlacement ? `Pending: ${pendingPlacement.school}` : addingSchool ? "New school will be reviewed by coordinator" : selectedSchool ? `Selected: ${selectedSchool}` : "Select one school to continue"}</span>{pendingPlacement ? <div className="row-actions"><button onClick={() => setSelectedPlacement(pendingPlacement)}>View request</button><button onClick={() => cancelPlacement(pendingPlacement.id)}>Cancel request</button></div> : <button disabled={addingSchool?!customSchool.name||!customSchool.municipality||!customSchool.community:!selectedSchool} onClick={requestPlacement}>{addingSchool?"Submit new school request":"Request placement"}</button>}</div></>}</section>{selectedPlacement && <PlacementDetails placement={selectedPlacement} close={() => setSelectedPlacement(null)}/>}</>;

  if (name === "Lesson Notes") return <><section className="portal-page-head"><span>TEACHING PRACTICE</span><h1>Lesson notes</h1><p>Create lesson notes and follow mentor/supervisor review status.</p></section><section className="student-card lesson-submit-card"><header><div><h2>Submit lesson note</h2><p>Your mentor reviews first, then the supervisor approves or requests revision.</p></div></header><div className="role-settings-fields lesson-submit-fields"><label><span>Subject</span><input value={lessonSubject} onChange={event => setLessonSubject(event.target.value)} placeholder="e.g. Mathematics"/></label><label><span>Topic</span><input value={lessonTopic} onChange={event => setLessonTopic(event.target.value)} placeholder="e.g. Algebraic expressions"/></label><label><span>Week</span><input value={lessonWeek} onChange={event => setLessonWeek(event.target.value)} placeholder="Week 7"/></label></div><div className="placement-request-foot"><span>{lessonSubject && lessonTopic ? "Ready to submit" : "Enter subject and topic"}</span><button disabled={!lessonSubject || !lessonTopic || !activePlacement} onClick={submitLessonNote}>{activePlacement ? "Submit note" : "Placement required"}</button></div></section><RecordList title="My lesson notes" rows={notes.map(note => ({ id: note.id, cells: [note.id, note.subject, note.topic, note.week, `${note.mentor} / ${note.supervisor}`], onView: () => setSelectedNote(note) }))}/>{selectedNote && <NoteDetails note={selectedNote} close={() => setSelectedNote(null)}/>}</>;

  if (name === "Supervisor Visits") return <><section className="portal-page-head"><span>SUPERVISION</span><h1>Supervisor visits</h1><p>Review coordinator visit windows and supervisor reschedules.</p></section><RecordList title="My visit schedule" rows={visits.map(visit => ({ id: visit.id, cells: [visit.id, visit.school, formatVisitDisplay(visit), visit.time, visit.status], onView: () => setSelectedVisit(visit) }))}/>{selectedVisit && <VisitDetails visit={selectedVisit} close={() => setSelectedVisit(null)}/>}</>;

  if (name === "Whitebook (IRB)") return <StudentIrbWorkspace student={student} activePlacement={activePlacement} workflow={workflow} saveWorkflow={saveWorkflow}/>;

  return <><section className="portal-page-head"><span>MY INTERNSHIP</span><h1>{name}</h1><p>{descriptions[name]}</p></section><section className="student-card portal-detail"><div><StudentIcon name="file"/></div><h2>{name} workspace</h2><p>Your records are ready for review.</p><button onClick={() => notify(`${name} opened successfully.`)}>Open current record <StudentIcon name="arrow"/></button></section></>;
}

function ProfileCard({ student, placement, notes, visits }: { student: Student; placement?: Placement; notes: LessonNote[]; visits: Visit[] }) {
  return <><section className="portal-page-head"><span>PROFILE</span><h1>{student.name}</h1><p>Your student identity and internship summary.</p></section><section className="student-card portal-detail"><div><StudentIcon name="file"/></div><h2>Student profile</h2><p>{student.programme} · {student.department}</p><div className="role-settings-fields"><label><span>Student ID</span><input readOnly value={student.id}/></label><label><span>Email</span><input readOnly value={student.email}/></label><label><span>Placement</span><input readOnly value={placement?.school || "Not approved yet"}/></label><label><span>Lesson notes</span><input readOnly value={String(notes.length)}/></label><label><span>Supervisor visits</span><input readOnly value={String(visits.length)}/></label></div></section></>;
}

type ConfiguredIrbField = { id: string; label: string; type: "text" | "textarea" | "date" | "checkbox" | "table"; required: boolean };
type ConfiguredIrbPage = { id: string; title: string; subtitle: string; fields: ConfiguredIrbField[] };
type StudentIrbValues = Record<string, Record<string, string>>;
type StudentIrbStatus = Record<string, { status: "Draft" | "Submitted"; updated: string }>;

function StudentIrbWorkspace({ student, activePlacement, workflow, saveWorkflow }: { student: Student; activePlacement?: Placement; workflow: SipWorkflowData; saveWorkflow: (next: SipWorkflowData, toast?: string) => void }) {
  const [pages] = useState<ConfiguredIrbPage[]>(readConfiguredIrbTemplate);
  const [page, setPage] = useState(0);
  const [values, setValues] = useState<StudentIrbValues>(() => readStudentIrbValues(student.id));
  const [statuses, setStatuses] = useState<StudentIrbStatus>(() => readStudentIrbStatuses(student.id));
  const current = pages[page];

  useEffect(() => localStorage.setItem(`sip-irb-values-${student.id}`, JSON.stringify(values)), [student.id, values]);
  useEffect(() => localStorage.setItem(`sip-irb-status-${student.id}`, JSON.stringify(statuses)), [student.id, statuses]);

  function setField(fieldId: string, value: string) {
    setValues(currentValues => ({ ...currentValues, [current.id]: { ...(currentValues[current.id] || {}), [fieldId]: value } }));
  }

  function mark(status: "Draft" | "Submitted") {
    const updated = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
    setStatuses(currentStatuses => ({ ...currentStatuses, [current.id]: { status, updated } }));
    saveWorkflow({ ...workflow, notifications: [newNotification(status === "Submitted" ? "IRB page submitted" : "IRB page saved", `${student.name} ${status === "Submitted" ? "submitted" : "saved"} ${current.title}.`, "irb"), ...workflow.notifications] }, status === "Submitted" ? "IRB page submitted for review." : "IRB page saved as draft.");
  }

  return <>
    <section className="portal-page-head"><span>MY INTERNSHIP</span><h1>Whitebook (IRB)</h1><p>Fill the pages configured by the coordinator. The structure can change when CSTSI updates the whitebook.</p></section>
    <section className="student-card portal-detail"><div><StudentIcon name="book"/></div><h2>Configured IRB template</h2><p>{activePlacement ? `Page ${page + 1} of ${pages.length}: ${current.title}` : "Your IRB unlocks after placement approval."}</p></section>
    <section className="student-card student-record-list"><header><div><h2>{current.title}</h2><p>{current.subtitle}</p></div><StatusPill text={statuses[current.id]?.status || "Draft"}/></header><div className="role-settings-fields">{current.fields.map(field => <IrbStudentField key={field.id} field={field} value={values[current.id]?.[field.id] || ""} disabled={!activePlacement} onChange={value => setField(field.id, value)}/>)}</div><div className="placement-request-foot"><span>{statuses[current.id]?.updated ? `Last updated ${statuses[current.id].updated}` : "Not saved yet"}</span><div className="row-actions"><button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>Previous</button><button onClick={() => setPage(Math.min(pages.length - 1, page + 1))} disabled={page === pages.length - 1}>Next</button><button disabled={!activePlacement} onClick={() => mark("Draft")}>Save draft</button><button className="approve" disabled={!activePlacement} onClick={() => mark("Submitted")}>Submit page</button></div></div></section>
  </>;
}

function IrbStudentField({ field, value, disabled, onChange }: { field: ConfiguredIrbField; value: string; disabled: boolean; onChange: (value: string) => void }) {
  if (field.type === "textarea") return <label><span>{field.label}{field.required ? " *" : ""}</span><textarea disabled={disabled} value={value} onChange={event => onChange(event.target.value)} placeholder="Enter response"/></label>;
  if (field.type === "checkbox") return <label><span>{field.label}{field.required ? " *" : ""}</span><select disabled={disabled} value={value} onChange={event => onChange(event.target.value)}><option value="">Select</option><option>Yes</option><option>No</option><option>Not applicable</option></select></label>;
  if (field.type === "table") return <label><span>{field.label}{field.required ? " *" : ""}</span><textarea disabled={disabled} value={value} onChange={event => onChange(event.target.value)} placeholder="Enter table rows or observations"/></label>;
  return <label><span>{field.label}{field.required ? " *" : ""}</span><input disabled={disabled} type={field.type === "date" ? "date" : "text"} value={value} onChange={event => onChange(event.target.value)} placeholder="Enter response"/></label>;
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
  return <InfoModal title={note.subject} close={close} rows={[["Lesson ID", note.id], ["Topic", note.topic], ["Week", note.week], ["Mentor review", note.mentor], ["Supervisor review", note.supervisor]]}/>;
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
