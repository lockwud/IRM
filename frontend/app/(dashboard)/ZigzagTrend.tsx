import React from "react";

export default function ZigzagTrend({ data, label }: { data: number[]; label: string }) {
  const width = 120;
  const height = 40;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / (max - min || 1)) * (height - 8) - 4;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="flex flex-col items-center">
      <svg width={width} height={height} className="mb-1">
        <polyline
          fill="none"
          stroke="#22c55e"
          strokeWidth="2"
          points={points}
        />
        {/* Dots */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * width;
          const y = height - ((d - min) / (max - min || 1)) * (height - 8) - 4;
          return <circle key={i} cx={x} cy={y} r={2} fill="#22c55e" />;
        })}
      </svg>
      <span className="text-xs text-gray-500 font-medium">{label}</span>
    </div>
  );
}
