"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarState } from "./lib/hooks/useSidebarState";

const favorites = [
  { label: "Overview", href: "/" },
  { label: "Students", href: "/students" },
];

const dashboards = [
  { label: "Overview", href: "/" },
  { label: "Internships", href: "/internships" },
  { label: "Reports", href: "/reports" },
];

const pages = [
  {
    label: "Internship Management",
    items: [
      { label: "List All Students", href: "/students" },
      { label: "Register Student", href: "/registration" },
      { label: "Internships", href: "/internships" },
    ],
  },
  {
    label: "Academic Records",
    items: [
      { label: "Lesson Notes", href: "/notes" },
      { label: "Planning Calendar", href: "/planning" },
      { label: "Whitebook", href: "/whitebook" },
    ],
  },
  {
    label: "IRMS (Record Book)",
    items: [
      { label: "Create Record", href: "/irms/records/new" },
      { label: "View Records", href: "/irms/records" },
      { label: "Reports", href: "/reports" },
    ],
  },
  {
    label: "Administration",
    items: [
      { label: "Supervisor", href: "/supervisor" },
      { label: "Monitoring", href: "/monitoring" },
      { label: "Tasks", href: "/tasks" },
      { label: "Settings", href: "/settings" },
    ],
  },
];

export default function Sidebar({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();
  const { expandedSections, toggleSection } = useSidebarState();

  const isActive = (href: string) => pathname === href;

  return (
    <aside
      className={`h-screen flex flex-col bg-white border-r border-snow-border transition-all duration-300 sticky top-0 ${
        collapsed ? "w-16" : "w-[250px]"
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center gap-2.5 h-14 ${collapsed ? "justify-center px-2" : "px-5"}`}>
        <div className="w-7 h-7 rounded-lg bg-snow-accent flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 3h4v4H3V3zm6 0h4v4H9V3zM3 9h4v4H3V9zm6 2a2 2 0 104 0 2 2 0 00-4 0z" fill="white"/>
          </svg>
        </div>
        {!collapsed && <span className="font-semibold text-base text-snow-text tracking-tight">IRM Portal</span>}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto pt-2 pb-4">
        {/* Favorites */}
        {!collapsed && (
          <div className="px-5 pt-3 pb-1.5 flex items-center gap-4">
            <span className="text-[11px] font-medium text-snow-text-muted uppercase tracking-wider">Favorites</span>
            <span className="text-[11px] font-medium text-snow-text-muted/50 uppercase tracking-wider cursor-pointer hover:text-snow-text-muted">Recently</span>
          </div>
        )}
        <div className="px-3 space-y-0.5">
          {favorites.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13px] transition-all ${
                isActive(item.href)
                  ? "text-snow-text font-medium"
                  : "text-snow-text-secondary hover:text-snow-text hover:bg-snow-bg"
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive(item.href) ? "bg-snow-accent" : "bg-snow-text-muted/40"}`} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </div>

        {/* Dashboards */}
        {!collapsed && (
          <div className="px-5 pt-5 pb-1.5">
            <span className="text-[11px] font-medium text-snow-text-muted uppercase tracking-wider">Dashboards</span>
          </div>
        )}
        <div className="px-3 space-y-0.5">
          {dashboards.map((item) => (
            <Link
              key={item.href + item.label + "dash"}
              href={item.href}
              className={`flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[13px] transition-all ${
                isActive(item.href)
                  ? "bg-snow-accent-light text-snow-accent font-medium"
                  : "text-snow-text-secondary hover:text-snow-text hover:bg-snow-bg"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                {item.label === "Overview" ? (
                  <path d="M2 2h5v5H2V2zm7 0h5v5H9V2zM2 9h5v5H2V9zm7 0h5v5H9V9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                ) : item.label === "Internships" ? (
                  <path d="M2 4a1 1 0 011-1h4l2 2h4a1 1 0 011 1v6a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                ) : (
                  <path d="M3 3v10h10M6 10V8m3 2V6m3 4V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                )}
              </svg>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </div>

        {/* Pages */}
        {!collapsed && (
          <div className="px-5 pt-5 pb-1.5">
            <span className="text-[11px] font-medium text-snow-text-muted uppercase tracking-wider">Pages</span>
          </div>
        )}
        <div className="px-3 space-y-0.5">
          {pages.map((section) => {
            const sectionExpanded = expandedSections[section.label];
            const hasActiveChild = section.items.some((item) => isActive(item.href));

            return (
              <div key={section.label}>
                <button
                  onClick={() => toggleSection(section.label)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-[13px] transition-all ${
                    hasActiveChild ? "text-snow-text font-medium" : "text-snow-text-secondary hover:text-snow-text hover:bg-snow-bg"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                      <path d="M6 2v12M2 6h8v6a1 1 0 01-1 1H3a1 1 0 01-1-1V7a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                    </svg>
                    {!collapsed && <span className="truncate">{section.label}</span>}
                  </div>
                  {!collapsed && (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      className={`flex-shrink-0 transition-transform duration-200 text-snow-text-muted ${sectionExpanded ? "rotate-90" : ""}`}
                    >
                      <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
                {!collapsed && sectionExpanded && (
                  <div className="ml-5 pl-2.5 border-l border-snow-border space-y-0.5 mt-0.5">
                    {section.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block px-2 py-1.5 rounded-lg text-[13px] transition-all ${
                          isActive(item.href)
                            ? "text-snow-accent font-medium bg-snow-accent-light"
                            : "text-snow-text-secondary hover:text-snow-text hover:bg-snow-bg"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </nav>

      {/* Bottom: Logo */}
      <div className={`px-5 py-4 border-t border-snow-border ${collapsed ? "flex justify-center" : ""}`}>
        <Link href="/profile" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-snow-accent to-snow-purple flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-semibold">JD</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-snow-text truncate group-hover:text-snow-accent transition-colors">John Doe</p>
              <p className="text-[11px] text-snow-text-muted truncate">Student</p>
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
}
