import {
  StatCard,
  AreaChart,
  HorizontalBarChart,
  VerticalBarChart,
  DonutChart,
  RecentInternships,
} from "./DashboardWidgets";

const statCards = [
  {
    label: "Total Students",
    value: "7,265",
    change: "+11.0%",
    trend: "up" as const,
    icon: "students",
    sparkData: [2, 4, 3, 5, 4, 6, 7, 6, 8, 9, 8, 10],
  },
  {
    label: "Active Internships",
    value: "3,671",
    change: "-0.03%",
    trend: "down" as const,
    icon: "internships",
    sparkData: [5, 4, 6, 5, 4, 3, 5, 4, 3, 4, 3, 2],
  },
  {
    label: "Lesson Notes",
    value: "156",
    change: "+15.0%",
    trend: "up" as const,
    icon: "notes",
    sparkData: [1, 2, 2, 3, 3, 4, 5, 4, 5, 6, 7, 8],
  },
  {
    label: "IRMS Records",
    value: "2,318",
    change: "+6.1%",
    trend: "up" as const,
    icon: "records",
    sparkData: [3, 4, 3, 5, 6, 5, 7, 6, 7, 8, 9, 10],
  },
];

export default function DashboardPage() {
  return (
    <div className="max-w-[1440px] space-y-6">

      {/* ── Welcome Banner ── */}
      <div
        className="relative overflow-hidden rounded-2xl px-8 py-6 flex items-center justify-between"
        style={{
          background: "linear-gradient(135deg, #0B1D3E 0%, #1B4FD8 60%, #3B7CF4 100%)",
          boxShadow: "0 8px 32px rgba(27,79,216,.35)",
        }}
      >
        {/* Decorative circles */}
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, white, transparent)" }} />
        <div className="absolute right-32 bottom-[-20px] w-32 h-32 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, white, transparent)" }} />

        <div className="relative">
          <p className="text-white/70 text-sm font-medium mb-1">Good morning 👋</p>
          <h1 className="text-white text-2xl font-bold leading-tight">Welcome to IRM Portal</h1>
          <p className="text-white/60 text-sm mt-1">
            Manage internship records, students, and academic activities.
          </p>
        </div>
        <div className="relative hidden sm:flex items-center gap-3">
          <a
            href="/internships"
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-irm-primary font-semibold text-sm rounded-xl hover:bg-white/90 transition-colors shadow-sm"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <path d="M5 5V3.5a3 3 0 016 0V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            View Internships
          </a>
          <a
            href="/registration"
            className="flex items-center gap-2 px-5 py-2.5 bg-white/15 text-white font-semibold text-sm rounded-xl hover:bg-white/25 transition-colors border border-white/20"
          >
            + Register Student
          </a>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Area chart — 2/3 width */}
        <div
          className="lg:col-span-2 bg-irm-card border border-irm-border rounded-xl p-5"
          style={{ boxShadow: "var(--irm-shadow)" }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-semibold text-irm-text">Student Enrollment Trend</h3>
              <p className="text-xs text-irm-text-muted mt-0.5">This year vs last year</p>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-irm-text-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-0.5 rounded bg-irm-primary inline-block" />
                This year
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-0.5 rounded inline-block" style={{ background: "#94A3B8" }} />
                Last year
              </span>
            </div>
          </div>
          <AreaChart />
        </div>

        {/* Donut chart — 1/3 width */}
        <div
          className="bg-irm-card border border-irm-border rounded-xl p-5"
          style={{ boxShadow: "var(--irm-shadow)" }}
        >
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-irm-text">Students by Region</h3>
            <p className="text-xs text-irm-text-muted mt-0.5">Distribution across Ghana</p>
          </div>
          <DonutChart />
        </div>
      </div>

      {/* ── Second Charts Row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          className="bg-irm-card border border-irm-border rounded-xl p-5"
          style={{ boxShadow: "var(--irm-shadow)" }}
        >
          <h3 className="text-sm font-semibold text-irm-text mb-4">Students by University</h3>
          <HorizontalBarChart />
        </div>
        <div
          className="bg-irm-card border border-irm-border rounded-xl p-5"
          style={{ boxShadow: "var(--irm-shadow)" }}
        >
          <h3 className="text-sm font-semibold text-irm-text mb-4">Students by School Level</h3>
          <VerticalBarChart />
        </div>
      </div>

      {/* ── Recent Internships Table ── */}
      <div
        className="bg-irm-card border border-irm-border rounded-xl overflow-hidden"
        style={{ boxShadow: "var(--irm-shadow)" }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-irm-border">
          <div>
            <h3 className="text-sm font-semibold text-irm-text">Recent Internships</h3>
            <p className="text-xs text-irm-text-muted mt-0.5">Latest registrations and updates</p>
          </div>
          <a
            href="/internships"
            className="text-sm font-medium text-irm-primary hover:text-irm-primary-hover transition-colors flex items-center gap-1"
          >
            View all
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
        <RecentInternships />
      </div>

    </div>
  );
}
