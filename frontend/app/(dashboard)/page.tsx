import {
  StatCard,
  AreaChart,
  HorizontalBarChart,
  VerticalBarChart,
  DonutChart,
  NotificationsPanel,
  ActivitiesPanel,
  ContactsPanel,
} from "./DashboardWidgets";

const statCards = [
  { label: "Total Students", value: "7,265", change: "11.01%", trend: "up" as const, sparkData: [2, 4, 3, 5, 4, 6, 7, 6, 8, 9, 8, 10] },
  { label: "Active Internships", value: "3,671", change: "0.03%", trend: "down" as const, sparkData: [5, 4, 6, 5, 4, 3, 5, 4, 3, 4, 3, 2] },
  { label: "Lesson Notes", value: "156", change: "15.03%", trend: "up" as const, sparkData: [1, 2, 2, 3, 3, 4, 5, 4, 5, 6, 7, 8] },
  { label: "IRMS Records", value: "2,318", change: "6.08%", trend: "up" as const, sparkData: [3, 4, 3, 5, 6, 5, 7, 6, 7, 8, 9, 10] },
];

export default function DashboardPage() {
  return (
    <div className="max-w-[1400px]">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-snow-text">Overview</h1>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] text-snow-text-secondary bg-white border border-snow-border rounded-lg hover:bg-snow-bg transition-colors">
          Today
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {statCards.map((card) => (
              <StatCard key={card.label} {...card} />
            ))}
          </div>

          {/* Charts Row 1: Area Chart + Traffic by Website */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
            {/* Total Users chart */}
            <div className="lg:col-span-3 bg-white rounded-2xl border border-snow-border p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-6">
                  <button className="text-[13px] font-semibold text-snow-text border-b-2 border-snow-accent pb-1">Total Students</button>
                  <button className="text-[13px] text-snow-text-muted hover:text-snow-text-secondary pb-1">Total Records</button>
                  <button className="text-[13px] text-snow-text-muted hover:text-snow-text-secondary pb-1">Completion Rate</button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 rounded bg-snow-accent" />
                    <span className="text-[11px] text-snow-text-muted">This year</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-0.5 rounded bg-snow-text-muted" style={{ opacity: 0.4 }} />
                    <span className="text-[11px] text-snow-text-muted">Last year</span>
                  </div>
                </div>
              </div>
              <AreaChart />
            </div>

            {/* Traffic by Website */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-snow-border p-5">
              <h3 className="text-sm font-semibold text-snow-text mb-4">Students by University</h3>
              <HorizontalBarChart />
            </div>
          </div>

          {/* Charts Row 2: Bar Chart + Donut Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Traffic by Device */}
            <div className="bg-white rounded-2xl border border-snow-border p-5">
              <h3 className="text-sm font-semibold text-snow-text mb-4">Students by School Level</h3>
              <VerticalBarChart />
            </div>

            {/* Traffic by Location */}
            <div className="bg-white rounded-2xl border border-snow-border p-5">
              <h3 className="text-sm font-semibold text-snow-text mb-4">Students by Region</h3>
              <DonutChart />
            </div>
          </div>
        </div>

        {/* Right Panel - Notifications, Activities, Contacts */}
        <div className="hidden xl:block w-[240px] flex-shrink-0 space-y-6">
          <div className="bg-white rounded-2xl border border-snow-border p-4">
            <NotificationsPanel />
          </div>
          <div className="bg-white rounded-2xl border border-snow-border p-4">
            <ActivitiesPanel />
          </div>
          <div className="bg-white rounded-2xl border border-snow-border p-4">
            <ContactsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
