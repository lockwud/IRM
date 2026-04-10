"use client";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export default function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

  /* Sync with stored preference on mount */
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("irm-theme", next ? "dark" : "light"); } catch {}
  };

  /* Build breadcrumb label from pathname */
  const crumb = pathname === "/" ? "Dashboard"
    : pathname.split("/").filter(Boolean).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" › ");

  return (
    <header
      className="flex items-center justify-between h-[60px] px-5 sticky top-0 z-30 transition-colors duration-200"
      style={{ background: "var(--irm-header-bg)", borderBottom: "1px solid var(--irm-header-border)" }}
    >
      {/* ── Left: hamburger + breadcrumb ── */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="w-9 h-9 flex items-center justify-center rounded-xl text-irm-text-muted hover:bg-irm-bg-hover hover:text-irm-text transition-all"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </button>

        <nav className="hidden sm:flex items-center gap-1.5 text-[13px]">
          <span className="text-irm-text-muted">IRM</span>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-irm-text-muted">
            <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-semibold text-irm-text">{crumb}</span>
        </nav>
      </div>

      {/* ── Right: search, actions, avatar ── */}
      <div className="flex items-center gap-1.5">
        {/* Search */}
        <div className="relative hidden md:flex items-center mr-1">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" className="absolute left-3 pointer-events-none text-irm-text-muted">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search…"
            className="h-9 w-44 pl-9 pr-3 text-[13px] rounded-xl border transition-all duration-200
              bg-irm-input-bg border-irm-input-border text-irm-text placeholder:text-irm-text-muted
              focus:outline-none focus:w-56 focus:ring-2 focus:ring-irm-primary/25 focus:border-irm-border-focus"
          />
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDark}
          aria-label="Toggle dark mode"
          className="w-9 h-9 flex items-center justify-center rounded-xl text-irm-text-muted hover:bg-irm-bg-hover hover:text-irm-text transition-all"
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>

        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="relative w-9 h-9 flex items-center justify-center rounded-xl text-irm-text-muted hover:bg-irm-bg-hover hover:text-irm-text transition-all"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-irm-danger border-2 border-[var(--irm-header-bg)]" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2.5 ml-1 pl-3 border-l border-irm-border">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-irm-primary to-irm-c2 flex items-center justify-center text-white text-xs font-bold select-none">
            AD
          </div>
          <div className="hidden lg:block">
            <p className="text-[13px] font-semibold text-irm-text leading-none">Admin</p>
            <p className="text-[11px] text-irm-text-muted mt-0.5">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}

