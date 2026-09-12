"use client";

import type { Period } from "@/types/youtube";

interface PeriodToggleProps {
  value: Period;
  onChange: (period: Period) => void;
}

export default function PeriodToggle({ value, onChange }: PeriodToggleProps) {
  const options: Period[] = [7, 30];

  return (
    <div className="inline-flex rounded-pill border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-1">
      {options.map((period) => (
        <button
          key={period}
          type="button"
          onClick={() => onChange(period)}
          className={`rounded-pill px-4 py-1.5 text-[14px] font-normal tracking-[-0.224px] transition-all active:scale-95 ${
            value === period
              ? "bg-primary text-white"
              : "text-[var(--color-text-secondary)] hover:bg-[var(--color-divider-soft)] dark:hover:bg-white/5"
          }`}
        >
          최근 {period}일
        </button>
      ))}
    </div>
  );
}
