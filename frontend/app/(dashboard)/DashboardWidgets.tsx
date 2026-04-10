/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   IRM Dashboard Widgets  — Deep Blue + White Design
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* ── Sparkline ── */
function Sparkline({
  data,
  color = "#1B4FD8",
  width = 80,
  height = 36,
}: {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="flex-shrink-0">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

/* ── Stat icon map ── */
function StatIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    students: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="6" r="4" stroke="white" strokeWidth="1.6"/>
        <path d="M2 17c0-3.3 3.6-5.5 8-5.5s8 2.2 8 5.5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    internships: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="7" width="14" height="10" rx="2" stroke="white" strokeWidth="1.6" fill="none"/>
        <path d="M7 7V5.5a3 3 0 016 0V7" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    notes: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M5 2h7l5 5v11H5V2z" stroke="white" strokeWidth="1.6" strokeLinejoin="round" fill="none"/>
        <path d="M12 2v5h5M7 11h6M7 14h4" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
    records: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4 16V5L10 2l6 3v11l-6 3-6-3z" stroke="white" strokeWidth="1.6" strokeLinejoin="round" fill="none"/>
        <path d="M10 2v14M4 8l6 2 6-2" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    ),
  };
  return <>{icons[type] || icons.students}</>;
}

/* ── Stat Card ── */
export function StatCard({
  label,
  value,
  change,
  trend,
  sparkData,
  icon,
}: {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  sparkData: number[];
  icon?: string;
}) {
  const isUp = trend === "up";
  const sparkColor = isUp ? "#1B4FD8" : "#DC2626";

  return (
    <div
      className="bg-irm-card border border-irm-border rounded-xl p-5 flex flex-col gap-4"
      style={{ boxShadow: "var(--irm-shadow)" }}
    >
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #1B4FD8, #3B7CF4)",
          }}
        >
          <StatIcon type={icon || "students"} />
        </div>
        <span
          className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${
            isUp
              ? "bg-irm-success-light text-irm-success border-irm-success/20"
              : "bg-irm-danger-light text-irm-danger border-irm-danger/20"
          }`}
        >
          {isUp ? (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 8V2M2 5l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 2v6M2 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          {change}
        </span>
      </div>
      <div>
        <p className="text-xs text-irm-text-muted font-medium uppercase tracking-wide">{label}</p>
        <p className="text-2xl font-bold text-irm-text mt-1">{value}</p>
      </div>
      <Sparkline data={sparkData} color={sparkColor} />
    </div>
  );
}

/* ── Area Chart ── */
export function AreaChart() {
  const thisYear = [5, 12, 8, 18, 14, 22, 28, 25, 30, 28, 32, 35];
  const lastYear = [3, 8, 6, 12, 10, 15, 18, 16, 20, 18, 22, 25];
  const width = 500;
  const height = 180;
  const padX = 40;
  const padY = 16;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;
  const max = 40;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const toPath = (data: number[]) =>
    data
      .map((d, i) => {
        const x = padX + (i / (data.length - 1)) * chartW;
        const y = padY + chartH - (d / max) * chartH;
        return `${i === 0 ? "M" : "L"}${x},${y}`;
      })
      .join(" ");

  const toAreaPath = (data: number[]) => {
    const line = toPath(data);
    const lastX = padX + chartW;
    const firstX = padX;
    const baseY = padY + chartH;
    return `${line} L${lastX},${baseY} L${firstX},${baseY} Z`;
  };

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        <defs>
          <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1B4FD8" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#1B4FD8" stopOpacity="0"/>
          </linearGradient>
          <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#94A3B8" stopOpacity="0.2"/>
            <stop offset="100%" stopColor="#94A3B8" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {[0, 10, 20, 30].map((v) => {
          const y = padY + chartH - (v / max) * chartH;
          return (
            <g key={v}>
              <line x1={padX} y1={y} x2={width - padX} y2={y} stroke="var(--irm-border)" strokeWidth="1"/>
              <text x={padX - 6} y={y + 4} textAnchor="end" fill="var(--irm-text-muted)" fontSize="9">
                {v}K
              </text>
            </g>
          );
        })}
        {months.map((m, i) => (
          <text key={m} x={padX + (i / (months.length - 1)) * chartW} y={height - 2}
            textAnchor="middle" fill="var(--irm-text-muted)" fontSize="9">
            {m}
          </text>
        ))}
        <path d={toAreaPath(thisYear)} fill="url(#grad1)"/>
        <path d={toAreaPath(lastYear)} fill="url(#grad2)"/>
        <path d={toPath(thisYear)} fill="none" stroke="#1B4FD8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d={toPath(lastYear)} fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="6 3" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

/* ── Horizontal Bar Chart ── */
export function HorizontalBarChart() {
  const data = [
    { label: "AAMUSTED", value: 85 },
    { label: "UCC",      value: 62 },
    { label: "UEW",      value: 48 },
    { label: "KNUST",    value: 35 },
    { label: "UG",       value: 28 },
    { label: "Others",   value: 15 },
  ];
  const colors = ["#1B4FD8", "#2563EB", "#3B7CF4", "#60A5FA", "#93C5FD", "#BFDBFE"];

  return (
    <div className="space-y-3.5">
      {data.map((item, i) => (
        <div key={item.label}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[12px] text-irm-text-secondary font-medium">{item.label}</span>
            <span className="text-[12px] text-irm-text font-bold">{item.value}%</span>
          </div>
          <div className="h-2 bg-irm-bg rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${item.value}%`, background: colors[i] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Vertical Bar Chart ── */
export function VerticalBarChart() {
  const data = [
    { label: "SHS",     value: 30 },
    { label: "JHS",     value: 25 },
    { label: "Primary", value: 20 },
    { label: "KG",      value: 15 },
    { label: "College", value: 8  },
    { label: "Other",   value: 5  },
  ];
  const max = 35;
  const colors = ["#1B4FD8", "#2563EB", "#3B7CF4", "#60A5FA", "#93C5FD", "#BFDBFE"];

  return (
    <div className="flex items-end justify-between gap-2 h-40 px-2">
      {data.map((item, i) => (
        <div key={item.label} className="flex flex-col items-center gap-1 flex-1">
          <span className="text-[10px] text-irm-text-muted font-medium">{item.value}K</span>
          <div
            className="w-full max-w-[36px] rounded-xl transition-all"
            style={{ height: `${(item.value / max) * 100}%`, background: colors[i] }}
          />
          <span className="text-[10px] text-irm-text-muted">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Donut Chart ── */
export function DonutChart() {
  const data = [
    { label: "Ashanti",      value: 52.1 },
    { label: "Central",      value: 22.8 },
    { label: "Gt. Accra",    value: 13.9 },
    { label: "Other",        value: 11.2 },
  ];
  const colors = ["#1B4FD8", "#3B7CF4", "#60A5FA", "#BFDBFE"];
  const radius = 56;
  const stroke = 16;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  let offset = 0;

  return (
    <div className="flex items-center gap-6">
      <svg width={radius * 2} height={radius * 2} className="flex-shrink-0">
        {data.map((item, i) => {
          const dash = (item.value / 100) * circumference;
          const cur = offset;
          offset += dash;
          return (
            <circle
              key={item.label}
              cx={radius} cy={radius}
              r={normalizedRadius}
              fill="none"
              stroke={colors[i]}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-cur}
              strokeLinecap="round"
              transform={`rotate(-90 ${radius} ${radius})`}
            />
          );
        })}
        {/* Centre label */}
        <text x={radius} y={radius - 4} textAnchor="middle" fill="var(--irm-text)" fontSize="16" fontWeight="700">100%</text>
        <text x={radius} y={radius + 14} textAnchor="middle" fill="var(--irm-text-muted)" fontSize="10">Total</text>
      </svg>
      <div className="space-y-2.5 flex-1">
        {data.map((item, i) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: colors[i] }} />
            <span className="text-[12px] text-irm-text-secondary flex-1">{item.label}</span>
            <span className="text-[12px] font-bold text-irm-text">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Status Badge ── */
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; cls: string }> = {
    registration: { label: "Registration", cls: "badge-registration" },
    in_progress:  { label: "In Progress",  cls: "badge-in_progress"  },
    completed:    { label: "Completed",    cls: "badge-completed"    },
  };
  const s = map[status] || { label: status, cls: "badge-registration" };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${s.cls}`}>
      {s.label}
    </span>
  );
}

/* ── Recent Internships (mini table) ── */
export function RecentInternships() {
  const rows = [
    { name: "Alice Johnson",  school: "Greenwood High",  mentor: "Mr. Smith",     status: "registration" },
    { name: "Bob Lee",        school: "Sunrise Academy", mentor: "Ms. Carter",    status: "in_progress"  },
    { name: "Carol Williams", school: "Central Tech",    mentor: "Dr. Adams",     status: "in_progress"  },
    { name: "David Chen",     school: "Metro Institute", mentor: "Prof. Martinez",status: "completed"    },
    { name: "Emma Davis",     school: "Riverside School",mentor: "Mr. Johnson",   status: "registration" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="border-b border-irm-border bg-irm-bg/60">
          <tr>
            {["Intern Name", "School", "Mentor", "Status"].map((h) => (
              <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-irm-text-secondary uppercase tracking-wider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-irm-border hover:bg-irm-bg-hover/60 transition-colors"
            >
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-irm-primary to-irm-c2 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[10px] font-bold">
                      {row.name.split(" ").map((w: string) => w[0]).join("")}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-irm-text">{row.name}</span>
                </div>
              </td>
              <td className="px-5 py-3.5 text-sm text-irm-text-secondary">{row.school}</td>
              <td className="px-5 py-3.5 text-sm text-irm-text-secondary">{row.mentor}</td>
              <td className="px-5 py-3.5"><StatusBadge status={row.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
