"use client";

import type { Period } from "@/types/youtube";

interface PeriodToggleProps {
  value: Period;
  onChange: (period: Period) => void;
}

export default function PeriodToggle({ value, onChange }: PeriodToggleProps) {
  const options: Period[] = [7, 30];

  return (
    <div className="inline-flex rounded-lg border border-slate-300 p-1 dark:border-slate-600">
      {options.map((period) => (
        <button
          key={period}
          type="button"
          onClick={() => onChange(period)}
          className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
            value === period
              ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
              : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          }`}
        >
          최근 {period}일
        </button>
      ))}
    </div>
  );
}
