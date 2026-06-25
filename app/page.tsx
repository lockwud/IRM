"use client";

// Coordinator portal shell.
// This file owns the coordinator dashboard, global navigation, topbar actions,
// notification drawer, page-loading skeleton, and module routing for the SIP admin.
import { useEffect, useState } from "react";
import { clearDevelopmentServiceWorkers, enablePushNotifications, firebaseIsConfigured, listenForForegroundMessages, registerPwaServiceWorker } from "@/lib/firebase";
import { ModulePage } from "@/components/Modules";
import { seedLessonNotes, seedNotifications, seedPlacements, seedStudents, seedVisits, type LessonNote, type NotificationItem, type Placement, type Student, type Visit } from "@/lib/sip-data";
import { AppearanceLoader } from "@/components/AppearanceSettings";
import { workflowStorageKey } from "@/lib/workflow-store";

type IconName = "grid" | "users" | "school" | "pin" | "book" | "file" | "calendar" | "chart" | "bell" | "settings" | "search" | "plus" | "more" | "arrow" | "check" | "clock" | "menu" | "close" | "briefcase" | "download";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    school: <><path d="m3 10 9-5 9 5"/><path d="M5 9v10h14V9M3 21h18"/><path d="M9 19v-5h6v5"/></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13Z"/><path d="M8 7h8M8 11h6"/></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
    chart: <><path d="M3 3v18h18"/><path d="m7 16 4-5 4 3 5-7"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V21h-4v-.08A1.7 1.7 0 0 0 9 19.37a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.63 15 1.7 1.7 0 0 0 3.08 14H3v-4h.08A1.7 1.7 0 0 0 4.63 9a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.63h.02A1.7 1.7 0 0 0 10 3.08V3h4v.08A1.7 1.7 0 0 0 15 4.63a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.37 9v.02A1.7 1.7 0 0 0 20.92 10H21v4h-.08A1.7 1.7 0 0 0 19.4 15Z"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>, more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
    arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>, check: <path d="m5 12 4 4L19 6"/>, clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    menu: <path d="M4 7h16M4 12h16M4 17h16"/>, close: <path d="m6 6 12 12M18 6 6 18"/>, briefcase: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V4h6v3M3 12h18M10 12v2h4v-2"/></>, download: <><path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/></>,
  };
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

const nav = [
  ["Dashboard", "grid"], ["Students", "users"], ["Schools", "school"], ["Placements", "pin"],
  ["Supervisors", "briefcase"], ["IRB Submissions", "book"], ["Visits", "calendar"],
  ["Post-Internship", "check"], ["Bulk Uploads", "download"], ["Audit Logs", "clock"], ["Reports", "chart"],
] as [string, IconName][];

const configurationNav = [
  ["IRB Configuration", "book"],
  ["Internship Letter", "file"],
] as [string, IconName][];

const chartData = [42, 55, 48, 70, 66, 84, 76, 91, 82, 96, 88, 100];
const activities = [
  { initials: "EA", tone: "violet", title: "Placement request approved", desc: "Esi Asare • Akropong D/A JHS", time: "8 mins ago" },
  { initials: "KM", tone: "green", title: "Lesson note submitted", desc: "Kwame Mensah • Mathematics", time: "32 mins ago" },
  { initials: "DO", tone: "amber", title: "Supervisor visit scheduled", desc: "Dr. Ofori • 24 June, 10:00 AM", time: "1 hour ago" },
  { initials: "AA", tone: "blue", title: "IRB section completed", desc: "Afia Amoah • School Familiarization", time: "2 hours ago" },
];

export default function Dashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [dashboardPeriod, setDashboardPeriod] = useState("This week");
  const [pageLoading, setPageLoading] = useState(false);
  const [active, setActive] = useState("Dashboard");
  const [pushState, setPushState] = useState<"idle" | "loading" | "enabled" | "error">("idle");
  const [toast, setToast] = useState("");
  const [students, setStudents] = useState<Student[]>(seedStudents);
  const [placements, setPlacements] = useState<Placement[]>(seedPlacements);
  const [notes, setNotes] = useState<LessonNote[]>(seedLessonNotes);
  const [visits, setVisits] = useState<Visit[]>(seedVisits);
  const [notifications, setNotifications] = useState<NotificationItem[]>(seedNotifications);
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    if (process.env.NODE_ENV === "production") {
      registerPwaServiceWorker().catch(() => undefined);
    } else {
      clearDevelopmentServiceWorkers().catch(() => undefined);
    }
    listenForForegroundMessages((message) => {
      setToast(message.notification?.title || "New SIP notification");
      window.setTimeout(() => setToast(""), 4000);
    }).then((fn) => { unsubscribe = fn; });
    return () => unsubscribe?.();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(workflowStorageKey);
    if (!stored) { setDataReady(true); return; }
    try {
      const data = JSON.parse(stored);
      if (data.students) setStudents(data.students);
      if (data.placements) setPlacements(data.placements);
      if (data.notes) setNotes(data.notes);
      if (data.visits) setVisits(data.visits);
      if (data.notifications) setNotifications(data.notifications);
    } catch { /* Keep safe seed data when local storage is malformed. */ }
    setDataReady(true);
  }, []);

  useEffect(() => {
    if (!dataReady) return;
    localStorage.setItem(workflowStorageKey, JSON.stringify({ students, placements, notes, visits, notifications }));
  }, [dataReady, students, placements, notes, visits, notifications]);

  async function turnOnPush() {
    setPushState("loading");
    try {
      await enablePushNotifications();
      setPushState("enabled");
      setToast("Push notifications enabled");
    } catch (error) {
      setPushState("error");
      setToast(error instanceof Error ? error.message : "Could not enable notifications");
    }
    window.setTimeout(() => setToast(""), 4500);
  }

  async function signOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login?role=coordinator";
  }
  function navigate(page:string){setPageLoading(true);window.setTimeout(()=>{setActive(page);setPageLoading(false)},320)}
  function showToast(message:string){setToast(message);window.setTimeout(()=>setToast(""),3500)}

  return <div className="shell"><AppearanceLoader role="coordinator"/>
    <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
      <div className="brand"><div className="brand-mark"><img src="/ustedlogo.jpeg" alt="AAMUSTED logo"/></div><div><strong>AAMUSTED</strong><span>SIP Portal</span></div><button className="mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close menu"><Icon name="close"/></button></div>
      <div className="side-label">WORKSPACE</div>
      <nav>{nav.map(([label, icon]) => <button key={label} className={active === label ? "active" : ""} onClick={() => { navigate(label); setMenuOpen(false); }}><Icon name={icon}/><span>{label}</span>{label === "Placements" && <em>12</em>}</button>)}</nav>
      <div className="side-label manage">CONFIGURATIONS</div>
      <nav>{configurationNav.map(([label, icon]) => <button key={label} className={active === label ? "active" : ""} onClick={() => { navigate(label); setMenuOpen(false); }}><Icon name={icon}/><span>{label}</span></button>)}</nav>
      <div className="side-label manage">MANAGE</div>
      <nav><button className={active === "Settings" ? "active" : ""} onClick={() => { navigate("Settings"); setMenuOpen(false); }}><Icon name="settings"/><span>Settings</span></button></nav>
      <div className="help-card"><div className="help-icon">?</div><strong>Need a little help?</strong><p>Browse the SIP user guide or contact support.</p><button onClick={()=>showToast("Help centre opened. Support resources are ready.")}>Visit help centre <Icon name="arrow" size={15}/></button></div>
    </aside>
    {menuOpen && <button className="backdrop" onClick={() => setMenuOpen(false)} aria-label="Close navigation"/>}

    <main>
      <header className="topbar"><button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation"><Icon name="menu"/></button><div className="search"><Icon name="search" size={18}/><input aria-label="Search" placeholder="Search students, schools, reports..."/><kbd>⌘ K</kbd></div><div className="top-actions"><button className="notify" onClick={()=>{setNotificationOpen(true);setProfileOpen(false)}} aria-label={`${notifications.filter(item=>!item.read).length} unread notifications`}><Icon name="bell"/>{notifications.some(item=>!item.read)&&<span className="notification-count">{notifications.filter(item=>!item.read).length}</span>}</button><div className="profile-menu-wrap"><button className="profile-trigger profile-trigger-compact" onClick={() => {setProfileOpen(!profileOpen);setNotificationOpen(false)}} aria-expanded={profileOpen}><div className="avatar">EO</div><b>⌄</b></button>{profileOpen&&<div className="profile-dropdown attached-profile-dropdown"><div className="profile-dropdown-head"><div className="avatar">EO</div><span><strong>Emmanuel Owusu</strong><small>emmanuel.owusu@aamusted.edu.gh</small><em>SIP Coordinator</em></span></div><button onClick={()=>{setActive("Profile");setProfileOpen(false)}}>◉ Profile</button><button onClick={()=>{setActive("Settings");setProfileOpen(false)}}><Icon name="settings" size={16}/>Settings</button><button onClick={()=>{setActive("Appearance");setProfileOpen(false)}}>◐ Appearance</button><button onClick={()=>{setActive("Change Password");setProfileOpen(false)}}>◆ Change password</button><button onClick={signOut}>↪ Sign out</button></div>}</div></div></header>

      <div className="content">
        {pageLoading?<PageSkeleton/>:active === "Dashboard" ? <>
        <section className="page-title"><div><div className="eyebrow">OVERVIEW</div><h1>Welcome, Emmanuel</h1><p>Here’s what’s happening with the internship programme today.</p></div><div className="dashboard-periods coordinator-dashboard-periods">{["Today","This week","This month","All time"].map(period=><button className={dashboardPeriod===period?"active":""} onClick={()=>setDashboardPeriod(period)} key={period}>{period}</button>)}</div></section>

        <section className="metrics">
          <Metric title="Total interns" value="2,846" change="12.5%" note="vs. last semester" icon="users" tone="indigo" onAction={()=>navigate("Students")} />
          <Metric title="Active placements" value="2,174" change="8.2%" note="76.4% placement rate" icon="pin" tone="violet" onAction={()=>navigate("Placements")} />
          <Metric title="Pending approvals" value="126" change="18 new" note="since yesterday" icon="clock" tone="amber" pending onAction={()=>navigate("Placements")} />
          <Metric title="Completed SIP" value="546" change="6.4%" note="19.2% completion rate" icon="check" tone="green" onAction={()=>navigate("Post-Internship")} />
        </section>

        <section className="dashboard-grid">
          <div className="card performance-card"><CardHeader title="Internship progress" subtitle="Monthly completion overview" action="Last 12 months" onAction={()=>showToast("Progress period filter opened.")}/>
            <div className="chart-summary"><div><strong>2,174</strong><span>Active interns</span></div><span className="trend">↗ 8.2%</span><span className="compare">vs last semester</span></div>
            <div className="chart-wrap"><div className="y-labels"><span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span></div><div className="chart"><div className="gridlines"><i/><i/><i/><i/><i/></div><svg viewBox="0 0 720 190" preserveAspectRatio="none" aria-label="Internship progress chart"><defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6366f1" stopOpacity=".26"/><stop offset="1" stopColor="#6366f1" stopOpacity=".01"/></linearGradient></defs><path className="area" d={`M 0 ${190-chartData[0]*1.55} ${chartData.map((v,i)=>`L ${i*65.45} ${190-v*1.55}`).join(" ")} L 720 190 L 0 190 Z`}/><polyline points={chartData.map((v,i)=>`${i*65.45},${190-v*1.55}`).join(" ")} /></svg><div className="months">{["Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun"].map(m=><span key={m}>{m}</span>)}</div></div></div>
          </div>
          <div className="card activity-card"><CardHeader title="Recent activity" subtitle="Latest updates across SIP" action="View all" link onAction={()=>navigate("Notifications")}/><div className="activity-list">{activities.map(a=><div className="activity" key={a.title}><div className={`activity-avatar ${a.tone}`}>{a.initials}</div><div><strong>{a.title}</strong><p>{a.desc}</p><span>{a.time}</span></div></div>)}</div></div>
        </section>

        <section className="lower-grid">
          <div className="card placement-card"><CardHeader title="Placement overview" subtitle="Interns by current placement status" action="View placements" link onAction={()=>navigate("Placements")}/><div className="placement-content"><div className="donut"><div><strong>2,846</strong><span>Total interns</span></div></div><div className="legend"><Legend color="indigo" label="Active" value="2,174" percent="76.4%"/><Legend color="amber" label="Pending" value="126" percent="4.4%"/><Legend color="green" label="Completed" value="546" percent="19.2%"/></div></div></div>
          <div className="card visits-card"><CardHeader title="Upcoming supervisor visits" subtitle="Scheduled over the next 14 days" action="View calendar" link onAction={()=>navigate("Visits")}/><div className="visits"><Visit month="JUN" day="24" name="Kwame Mensah" school="Asokwa M/A JHS" time="10:00 AM" onAction={()=>showToast("Visit details opened for Kwame Mensah.")}/><Visit month="JUN" day="26" name="Esi Asare" school="Akropong D/A JHS" time="9:30 AM" onAction={()=>showToast("Visit details opened for Esi Asare.")}/><Visit month="JUL" day="02" name="Afia Amoah" school="Wesley College Demo" time="11:00 AM" onAction={()=>showToast("Visit details opened for Afia Amoah.")}/></div></div>
        </section>
        {!firebaseIsConfigured && <div className="config-note"><Icon name="bell"/><div><strong>Firebase FCM is ready to connect</strong><span>Add the values from <code>.env.example</code> to <code>.env.local</code> to activate device registration and push delivery.</span></div></div>}
        </> : <ModulePage active={active} students={students} setStudents={setStudents} placements={placements} setPlacements={setPlacements} notes={notes} setNotes={setNotes} visits={visits} setVisits={setVisits} notifications={notifications} setNotifications={setNotifications} notify={(message) => { setToast(message); window.setTimeout(() => setToast(""), 3500); }}/>} 
      </div>
    </main>
    {notificationOpen&&<><button className="notification-backdrop" onClick={()=>setNotificationOpen(false)} aria-label="Close notifications"/><aside className="notification-drawer"><header><div><strong>Notifications</strong><span>{notifications.filter(item=>!item.read).length} unread</span></div><button onClick={()=>setNotifications(notifications.map(item=>({...item,read:true})))} title="Mark all as read">✓</button><button onClick={()=>setNotificationOpen(false)} aria-label="Close notifications">×</button></header><div className="notification-drawer-label">RECENT</div><div className="notification-drawer-list">{notifications.map(item=><button className={item.read?"read":""} onClick={()=>setNotifications(notifications.map(current=>current.id===item.id?{...current,read:true}:current))} key={item.id}><i/><span><strong>{item.title}</strong><p>{item.message}</p><small>{item.time}</small></span></button>)}</div></aside></>}
    {toast && <div className="toast"><Icon name={pushState === "error" ? "clock" : "check"}/>{toast}</div>}
  </div>;
}

function Metric({ title, value, change, note, icon, tone, pending, onAction }: {title:string;value:string;change:string;note:string;icon:IconName;tone:string;pending?:boolean;onAction?:()=>void}) { return <div className="metric card"><div className={`metric-icon ${tone}`}><Icon name={icon}/></div><button aria-label={`More options for ${title}`} onClick={onAction}><Icon name="more"/></button><span>{title}</span><strong>{value}</strong><div><em className={pending ? "neutral" : "up"}>{pending ? "+" : "↗"} {change}</em><small>{note}</small></div></div> }
function CardHeader({title,subtitle,action,link,onAction}:{title:string;subtitle:string;action:string;link?:boolean;onAction?:()=>void}) { return <div className="card-header"><div><h2>{title}</h2><p>{subtitle}</p></div><button className={link?"text-button":"filter-button"} onClick={onAction}>{action}{link ? <Icon name="arrow" size={16}/> : <span>⌄</span>}</button></div> }
function Legend({color,label,value,percent}:{color:string;label:string;value:string;percent:string}) { return <div className="legend-row"><i className={color}/><span>{label}</span><strong>{value}</strong><small>{percent}</small></div> }
function Visit({month,day,name,school,time,onAction}:{month:string;day:string;name:string;school:string;time:string;onAction?:()=>void}) { return <div className="visit"><div className="date"><span>{month}</span><strong>{day}</strong></div><div className="visit-info"><strong>{name}</strong><span>{school}</span></div><div className="visit-time"><Icon name="clock" size={15}/>{time}</div><button aria-label="Visit details" onClick={onAction}><Icon name="more"/></button></div> }
function PageSkeleton(){return <div className="page-skeleton" aria-label="Loading page"><div className="skeleton-title"/><div className="skeleton-copy"/><section>{[1,2,3,4].map(item=><i key={item}/>)}</section><article><b/><b/><b/><b/></article></div>}
