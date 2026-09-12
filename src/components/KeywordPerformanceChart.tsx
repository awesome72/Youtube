"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { KeywordStat } from "@/types/youtube";
import { formatCompactKo } from "@/lib/format";

interface KeywordPerformanceChartProps {
  data: KeywordStat[];
}

export default function KeywordPerformanceChart({ data }: KeywordPerformanceChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[320px] items-center justify-center text-sm text-slate-400">
        표시할 데이터가 없습니다.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-200 dark:stroke-slate-700" />
        <XAxis dataKey="keyword" tick={{ fontSize: 12 }} />
        <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} tickFormatter={formatCompactKo} />
        <Tooltip
          formatter={(value, name) =>
            name === "총 조회수" ? [formatCompactKo(Number(value)), name] : [value, name]
          }
          contentStyle={{ borderRadius: 8, fontSize: 12 }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar yAxisId="left" dataKey="avgTrendScore" name="평균 Trend Score" fill="#0066cc" radius={[6, 6, 0, 0]} />
        <Bar yAxisId="right" dataKey="totalViews" name="총 조회수" fill="#7a7a7a" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
