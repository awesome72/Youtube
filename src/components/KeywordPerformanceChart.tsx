"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { KeywordStat } from "@/types/youtube";
import { formatCompactKo } from "@/lib/format";
import { useIsDarkMode } from "@/lib/useIsDarkMode";
import { chartTheme } from "@/lib/chartTheme";

interface KeywordPerformanceChartProps {
  data: KeywordStat[];
}

export default function KeywordPerformanceChart({ data }: KeywordPerformanceChartProps) {
  const isDark = useIsDarkMode();
  const t = isDark ? chartTheme.dark : chartTheme.light;

  if (data.length === 0) {
    return (
      <div className="flex h-[320px] items-center justify-center text-[14px] text-[var(--color-text-secondary)]">
        표시할 데이터가 없습니다.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={t.grid} />
        <XAxis dataKey="keyword" tick={{ fontSize: 12, fill: t.axisText }} />
        <YAxis yAxisId="left" tick={{ fontSize: 12, fill: t.axisText }} />
        <YAxis
          yAxisId="right"
          orientation="right"
          tick={{ fontSize: 12, fill: t.axisText }}
          tickFormatter={formatCompactKo}
        />
        <Tooltip
          formatter={(value, name) =>
            name === "총 조회수" ? [formatCompactKo(Number(value)), name] : [value, name]
          }
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
        <Legend wrapperStyle={{ fontSize: 12, color: t.axisText }} />
        <Bar yAxisId="left" dataKey="avgTrendScore" name="평균 Trend Score" fill={t.primary} radius={[6, 6, 0, 0]} />
        <Bar yAxisId="right" dataKey="totalViews" name="총 조회수" fill={t.secondary} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
