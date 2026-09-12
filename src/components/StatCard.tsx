interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
}

export default function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-2xl font-semibold text-slate-900 dark:text-slate-50">{value}</span>
      {hint && <span className="text-xs text-slate-400 dark:text-slate-500">{hint}</span>}
    </div>
  );
}
