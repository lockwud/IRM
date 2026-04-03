/* SnowUI-style Dashboard Widgets */

// Sparkline mini chart
function Sparkline({ data, color = "#05CD99", width = 80, height = 32 }: { data: number[]; color?: string; width?: number; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((d - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={width} height={height} className="flex-shrink-0">
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} />
    </svg>
  );
}

// Stat card matching SnowUI design
export function StatCard({
  label,
  value,
  change,
  trend,
  sparkData,
}: {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  sparkData: number[];
}) {
  const isUp = trend === "up";
  return (
    <div className="flex-1 min-w-[180px] bg-white rounded-2xl border border-snow-border p-4 flex items-center justify-between gap-3">
      <div className="flex flex-col gap-1">
        <span className="text-[12px] text-snow-text-muted font-medium">{label}</span>
        <span className="text-2xl font-bold text-snow-text leading-tight">{value}</span>
        <span className={`text-[12px] font-medium ${isUp ? "text-snow-green" : "text-snow-red"}`}>
          {isUp ? "+" : ""}{change}
        </span>
      </div>
      <Sparkline data={sparkData} color={isUp ? "#05CD99" : "#EE5D50"} />
    </div>
  );
}

// Area chart (Total Users style)
export function AreaChart() {
  const thisYear = [5, 12, 8, 18, 14, 22, 28, 25, 30, 28, 32, 35];
  const lastYear = [3, 8, 6, 12, 10, 15, 18, 16, 20, 18, 22, 25];
  const width = 500;
  const height = 200;
  const padX = 40;
  const padY = 20;
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

  const gridLines = [0, 10, 20, 30];

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Grid */}
        {gridLines.map((v) => {
          const y = padY + chartH - (v / max) * chartH;
          return (
            <g key={v}>
              <line x1={padX} y1={y} x2={width - padX} y2={y} stroke="#E9EDF7" strokeWidth="1" />
              <text x={padX - 8} y={y + 4} textAnchor="end" fill="#A3AED0" fontSize="10">
                {v}K
              </text>
            </g>
          );
        })}
        {/* Month labels */}
        {months.map((m, i) => {
          const x = padX + (i / (months.length - 1)) * chartW;
          return (
            <text key={m} x={x} y={height - 4} textAnchor="middle" fill="#A3AED0" fontSize="10">
              {m}
            </text>
          );
        })}
        {/* Area fills */}
        <path d={toAreaPath(thisYear)} fill="url(#areaGradient)" opacity="0.3" />
        <path d={toAreaPath(lastYear)} fill="url(#areaGradient2)" opacity="0.15" />
        {/* Lines */}
        <path d={toPath(thisYear)} fill="none" stroke="#6366F1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={toPath(lastYear)} fill="none" stroke="#A3AED0" strokeWidth="2" strokeDasharray="6 3" strokeLinecap="round" strokeLinejoin="round" />
        {/* Gradients */}
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="areaGradient2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#A3AED0" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#A3AED0" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// Horizontal bar chart (Traffic by Website style)
export function HorizontalBarChart() {
  const data = [
    { label: "AAMUSTED", value: 85, color: "#6366F1" },
    { label: "UCC", value: 62, color: "#818CF8" },
    { label: "UEW", value: 48, color: "#A5B4FC" },
    { label: "KNUST", value: 35, color: "#C7D2FE" },
    { label: "UG", value: 28, color: "#E0E7FF" },
    { label: "Others", value: 15, color: "#EEF2FF" },
  ];

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.label} className="flex items-center gap-3">
          <span className="text-[12px] text-snow-text-secondary w-16 text-right flex-shrink-0">{item.label}</span>
          <div className="flex-1 h-2 bg-snow-bg rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${item.value}%`, backgroundColor: item.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// Vertical bar chart (Traffic by Device style)
export function VerticalBarChart() {
  const data = [
    { label: "SHS", value: 30, color: "#1C2024" },
    { label: "JHS", value: 25, color: "#6366F1" },
    { label: "Primary", value: 20, color: "#A5B4FC" },
    { label: "KG", value: 15, color: "#C7D2FE" },
    { label: "College", value: 8, color: "#E0E7FF" },
    { label: "Other", value: 5, color: "#EEF2FF" },
  ];
  const max = 35;

  return (
    <div className="flex items-end justify-between gap-2 h-40 px-2">
      {data.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-1 flex-1">
          <span className="text-[10px] text-snow-text-muted">{item.value}K</span>
          <div className="w-full max-w-[32px] rounded-t-md transition-all" style={{ height: `${(item.value / max) * 100}%`, backgroundColor: item.color }} />
          <span className="text-[10px] text-snow-text-muted mt-1">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// Donut chart (Traffic by Location style)
export function DonutChart() {
  const data = [
    { label: "Ashanti Region", value: 52.1, color: "#1C2024" },
    { label: "Central Region", value: 22.8, color: "#6366F1" },
    { label: "Greater Accra", value: 13.9, color: "#A5B4FC" },
    { label: "Other Regions", value: 11.2, color: "#E0E7FF" },
  ];
  const radius = 50;
  const stroke = 14;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  let offset = 0;

  return (
    <div className="flex items-center gap-4">
      <svg width={radius * 2} height={radius * 2} className="flex-shrink-0">
        {data.map((item) => {
          const dash = (item.value / 100) * circumference;
          const currentOffset = offset;
          offset += dash;
          return (
            <circle
              key={item.label}
              cx={radius}
              cy={radius}
              r={normalizedRadius}
              fill="none"
              stroke={item.color}
              strokeWidth={stroke}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-currentOffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${radius} ${radius})`}
            />
          );
        })}
      </svg>
      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
            <span className="text-[11px] text-snow-text-secondary">{item.label}</span>
            <span className="text-[11px] font-medium text-snow-text ml-auto">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Notifications panel
export function NotificationsPanel() {
  const notifications = [
    { text: "You submitted a lesson note.", time: "Just now", avatar: "JD", color: "bg-snow-green" },
    { text: "New student registered.", time: "59 minutes ago", avatar: "NK", color: "bg-snow-blue" },
    { text: "You completed a task.", time: "12 hours ago", avatar: "JD", color: "bg-snow-green" },
    { text: "Mentor reviewed your record.", time: "Today, 11:59 AM", avatar: "MO", color: "bg-snow-purple" },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-snow-text">Notifications</h3>
      {notifications.map((n, i) => (
        <div key={i} className="flex items-start gap-2.5">
          <div className={`w-7 h-7 rounded-full ${n.color} flex items-center justify-center flex-shrink-0`}>
            <span className="text-white text-[10px] font-semibold">{n.avatar}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] text-snow-text leading-tight">{n.text}</p>
            <p className="text-[11px] text-snow-text-muted mt-0.5">{n.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Activities panel
export function ActivitiesPanel() {
  const activities = [
    { text: "Updated lesson plan.", time: "Just now", color: "bg-snow-green" },
    { text: "Submitted IRMS Record.", time: "59 minutes ago", color: "bg-snow-blue" },
    { text: "Attendance marked.", time: "12 hours ago", color: "bg-snow-orange" },
    { text: "Feedback received.", time: "Today, 11:59 AM", color: "bg-snow-purple" },
    { text: "Completed observation.", time: "Feb 4, 2026", color: "bg-snow-red" },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-snow-text">Activities</h3>
      {activities.map((a, i) => (
        <div key={i} className="flex items-start gap-2.5">
          <div className="flex flex-col items-center">
            <span className={`w-2.5 h-2.5 rounded-full ${a.color} flex-shrink-0`} />
            {i < activities.length - 1 && <div className="w-px h-6 bg-snow-border mt-0.5" />}
          </div>
          <div className="flex-1 min-w-0 -mt-0.5">
            <p className="text-[12px] text-snow-text leading-tight">{a.text}</p>
            <p className="text-[11px] text-snow-text-muted mt-0.5">{a.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Contacts panel
export function ContactsPanel() {
  const contacts = [
    { name: "Mr. Owusu", role: "Mentor" },
    { name: "Mrs. Mensah", role: "Supervisor" },
    { name: "Andi Lane", role: "Student" },
    { name: "Koray Okumus", role: "Student" },
    { name: "Kate Morrison", role: "Mentor" },
  ];

  const colors = ["bg-snow-accent", "bg-snow-purple", "bg-snow-blue", "bg-snow-orange", "bg-snow-green"];

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-snow-text">Contacts</h3>
      {contacts.map((c, i) => (
        <div key={i} className="flex items-center gap-2.5">
          <div className={`w-7 h-7 rounded-full ${colors[i % colors.length]} flex items-center justify-center flex-shrink-0`}>
            <span className="text-white text-[10px] font-semibold">{c.name.split(" ").map(w => w[0]).join("")}</span>
          </div>
          <span className="text-[12px] text-snow-text">{c.name}</span>
        </div>
      ))}
    </div>
  );
}

// Keep old exports for backward compat
export function StatWidget({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return <StatCard label={label} value={value} change="" trend="up" sparkData={[1, 2, 3, 4, 5]} />;
}

export function AgendaWidget() {
  return null;
}

export function ChartWidget() {
  return null;
}
