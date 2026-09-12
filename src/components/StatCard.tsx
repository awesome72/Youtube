interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
}

export default function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="flex flex-col gap-1 rounded-card border border-[var(--color-card-border)] bg-[var(--color-card-bg)] p-6">
      <span className="text-[14px] leading-[1.43] tracking-[-0.224px] text-[var(--color-text-secondary)]">
        {label}
      </span>
      <span className="text-[22px] font-semibold tracking-[-0.374px] text-[var(--color-text-primary)]">
        {value}
      </span>
      {hint && (
        <span className="text-[12px] leading-[1] tracking-[-0.12px] text-[var(--color-text-secondary)]">
          {hint}
        </span>
      )}
    </div>
  );
}
