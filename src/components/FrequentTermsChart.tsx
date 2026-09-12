"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { FrequentTerm } from "@/types/youtube";

interface FrequentTermsChartProps {
  data: FrequentTerm[];
}

export default function FrequentTermsChart({ data }: FrequentTermsChartProps) {
  if (data.length === 0) {
    return <EmptyState />;
  }

  const chartData = [...data].reverse();

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={chartData} layout="vertical" margin={{ left: 24, right: 16 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-slate-200 dark:stroke-slate-700" />
        <XAxis type="number" allowDecimals={false} tick={{ fontSize: 12 }} />
        <YAxis type="category" dataKey="term" width={90} tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value) => [`${value}회`, "언급 횟수"]}
          contentStyle={{ borderRadius: 8, fontSize: 12 }}
        />
        <Bar dataKey="count" fill="#0066cc" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function EmptyState() {
  return (
    <div className="flex h-[320px] items-center justify-center text-sm text-slate-400">
      표시할 데이터가 없습니다.
    </div>
  );
}
