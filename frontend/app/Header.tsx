"use client";

export default function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  return (
    <header className="flex items-center justify-between h-14 px-6 bg-white border-b border-snow-border sticky top-0 z-20">
      {/* Left: Toggle + Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-snow-bg transition-colors"
          aria-label="Toggle sidebar"
          onClick={onToggleSidebar}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3 4.5h12M3 9h12M3 13.5h12" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="hidden sm:flex items-center gap-1.5 text-[13px]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 2h5v5H2V2zm7 0h5v5H9V2zM2 9h5v5H2V9zm7 0h5v5H9V9z" stroke="#A3AED0" strokeWidth="1.2" fill="none"/>
          </svg>
          <span className="text-snow-text-muted">/</span>
          <span className="text-snow-text-secondary">Dashboards</span>
          <span className="text-snow-text-muted">/</span>
          <span className="text-snow-text font-medium">Default</span>
        </div>
      </div>

      {/* Right: Search + Icons */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="absolute left-3 text-snow-text-muted">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search"
            className="w-48 h-9 pl-9 pr-3 text-[13px] bg-snow-bg border border-snow-border rounded-xl focus:outline-none focus:ring-2 focus:ring-snow-accent/20 focus:border-snow-accent/30 placeholder:text-snow-text-muted transition-all"
          />
        </div>

        {/* Theme Toggle */}
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-snow-bg transition-colors" aria-label="Toggle theme">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="4" stroke="#6B7280" strokeWidth="1.5"/>
            <path d="M9 2v1.5M9 14.5V16M2 9h1.5M14.5 9H16M4.11 4.11l1.06 1.06M12.83 12.83l1.06 1.06M4.11 13.89l1.06-1.06M12.83 5.17l1.06-1.06" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Clock/History */}
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-snow-bg transition-colors" aria-label="History">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7" stroke="#6B7280" strokeWidth="1.5"/>
            <path d="M9 5.5V9l2.5 1.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Notifications */}
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-snow-bg transition-colors relative" aria-label="Notifications">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M13.5 6.75a4.5 4.5 0 10-9 0c0 5.25-2.25 6.75-2.25 6.75h13.5s-2.25-1.5-2.25-6.75" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.3 15.75a1.5 1.5 0 01-2.6 0" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-snow-red rounded-full border-2 border-white"></span>
        </button>

        {/* Sidebar toggle right */}
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-snow-bg transition-colors" aria-label="Right panel">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2" y="3" width="14" height="12" rx="2" stroke="#6B7280" strokeWidth="1.5"/>
            <path d="M12 3v12" stroke="#6B7280" strokeWidth="1.5"/>
          </svg>
        </button>
      </div>
    </header>
  );
}
