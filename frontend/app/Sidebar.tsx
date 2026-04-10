"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarState } from "./lib/hooks/useSidebarState";

/* ── Nav config ── */
const navSections = [
  {
    label: "Main",
    items: [
      {
        label: "Dashboard",
        href: "/",
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 2h5v5H2V2zm7 0h5v5H9V2zM2 9h5v5H2V9zm7 0h5v5H9V9z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        ),
      },
      {
        label: "Students",
        href: "/students",
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M2 13.5c0-2.5 2.7-4 6-4s6 1.5 6 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: "Register Student",
        href: "/registration",
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="5" r="3" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M1 13.5c0-2.5 2.5-4 6-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            <path d="M12 10v4M10 12h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: "Internships",
        href: "/internships",
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" fill="none"/>
            <path d="M5 5V3.5a3 3 0 016 0V5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        ),
      },
    ],
  },
  {
    label: "Academic",
    items: [
      {
        label: "Lesson Notes",
        href: "/notes",
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 2h5l4 4v8H4V2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none"/>
            <path d="M9 2v4h4M6 9h4M6 12h2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        ),
      },

      {
        label: "Whitebook",
        href: "/whitebook",
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 2h8l2 2v10H3V2z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none"/>
            <path d="M5 7h6M5 10h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        ),
      },
    ],
  },
  {
    label: "Records",
    items: [
      {
        label: "Create Record",
        href: "/irms/records/new",
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="3" width="12" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.4" fill="none"/>
            <path d="M8 6v4M6 8h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: "View Records",
        href: "/irms/records",
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 5h12M2 8h8M2 11h5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: "Reports",
        href: "/reports",
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 13V8m3 5V5m3 8V7m3 6V3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        ),
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        label: "Supervisor",
        href: "/supervisor",
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M2 13.5c0-2.5 2.7-4 6-4s6 1.5 6 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: "Monitoring",
        href: "/monitoring",
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="2" y="3" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" fill="none"/>
            <path d="M5 14h6M8 11v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        ),
      },
      {
        label: "Tasks",
        href: "/tasks",
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 5l2 2 4-4M3 10l2 2 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ),
      },
      {
        label: "Settings",
        href: "/settings",
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M8 2v1.5M8 12.5V14M2 8h1.5M12.5 8H14M3.64 3.64l1.06 1.06M11.3 11.3l1.06 1.06M3.64 12.36l1.06-1.06M11.3 4.7l1.06-1.06" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
        ),
      },
    ],
  },
];

export default function Sidebar({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();
  const { expandedSections, toggleSection } = useSidebarState();

  const isActive = (href: string) => pathname === href;

  return (
    <aside
      className={`h-screen flex flex-col sticky top-0 overflow-hidden transition-all duration-300
        bg-irm-sidebar`}
      style={{ width: collapsed ? 64 : 260, borderRight: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* ── Logo ── */}
      <div
        className={`flex items-center h-[60px] flex-shrink-0 ${
          collapsed ? "justify-center px-3" : "px-5"
        }`}
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-irm-primary to-irm-c2 flex items-center justify-center flex-shrink-0 shadow-lg">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 3h4v4H3V3zm6 0h4v4H9V3zM3 9h4v4H3V9zm6 2a2 2 0 104 0 2 2 0 00-4 0z" fill="white"/>
          </svg>
        </div>
        {!collapsed && (
          <div className="ml-3 min-w-0">
            <p className="text-white font-bold text-[15px] leading-none tracking-tight">IRM Portal</p>
            <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>Internship Records</p>
          </div>
        )}
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-1">
        {navSections.map((section) => {
          const sectionExpanded = expandedSections[section.label] !== false; // default expanded
          const hasActiveChild = section.items.some((item) => isActive(item.href));

          return (
            <div key={section.label} className="px-2">
              {/* Section heading */}
              {!collapsed && (
                <div className="flex items-center justify-between px-3 pt-3 pb-1">
                  <span
                    className="text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {section.label}
                  </span>
                  <button
                    onClick={() => toggleSection(section.label)}
                    className="transition-transform duration-200"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    <svg
                      width="12" height="12" viewBox="0 0 12 12" fill="none"
                      className={`transition-transform duration-200 ${sectionExpanded ? "" : "-rotate-90"}`}
                    >
                      <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              )}

              {/* Items */}
              {(collapsed || sectionExpanded) && (
                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        title={collapsed ? item.label : undefined}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                          active
                            ? "text-white"
                            : "hover:text-white"
                        }`}
                        style={{
                          background: active
                            ? "rgba(255,255,255,0.12)"
                            : undefined,
                          color: active ? "#FFFFFF" : "rgba(255,255,255,0.5)",
                        }}
                        onMouseEnter={(e) => {
                          if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                        }}
                        onMouseLeave={(e) => {
                          if (!active) (e.currentTarget as HTMLElement).style.background = "";
                        }}
                      >
                        <span className={`flex-shrink-0 ${active ? "text-white" : ""}`}
                          style={{ color: active ? "#FFFFFF" : "rgba(255,255,255,0.5)" }}>
                          {item.icon}
                        </span>
                        {!collapsed && <span className="truncate">{item.label}</span>}
                        {active && !collapsed && (
                          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-irm-primary flex-shrink-0" style={{ background: "#60A5FA" }} />
                        )}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* ── User ── */}
      <div
        className={`flex-shrink-0 px-4 py-4 ${collapsed ? "flex justify-center" : ""}`}
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <Link href="/profile" className="flex items-center gap-3 group w-full">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-irm-primary to-irm-c2 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
            JD
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-white truncate">John Doe</p>
              <p className="text-[11px] truncate" style={{ color: "rgba(255,255,255,0.4)" }}>john.doe@aamusted.edu.gh</p>
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
}
