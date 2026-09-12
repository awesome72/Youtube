"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { FrequentTerm } from "@/types/youtube";
import { useIsDarkMode } from "@/lib/useIsDarkMode";
import { chartTheme } from "@/lib/chartTheme";

interface FrequentTermsChartProps {
  data: FrequentTerm[];
}

export default function FrequentTermsChart({ data }: FrequentTermsChartProps) {
  const isDark = useIsDarkMode();
  const t = isDark ? chartTheme.dark : chartTheme.light;

  if (data.length === 0) {
    return <EmptyState />;
  }

  const chartData = [...data].reverse();

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 24, right: 16 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={t.grid} />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12, fill: t.axisText }} />
        <YAxis type="category" dataKey="term" width={90} tick={{ fontSize: 12, fill: t.axisText }} />
        <Tooltip
          formatter={(value) => [`${value}회`, "언급 횟수"]}
          contentStyle={{
            borderRadius: 8,
            fontSize: 12,
            background: t.tooltipBg,
            border: `1px solid ${t.tooltipBorder}`,
            color: t.tooltipText,
          }}
          labelStyle={{ color: t.tooltipText }}
          itemStyle={{ color: t.tooltipText }}
        />
        <Bar dataKey="count" fill={t.primary} radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function EmptyState() {
  return (
    <div className="flex h-[320px] items-center justify-center text-[14px] text-[var(--color-text-secondary)]">
      표시할 데이터가 없습니다.
    </div>
  );
}
