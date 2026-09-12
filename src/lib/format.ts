/** Formats a large integer using Korean 만/억 units for compact, readable display. */
export function formatCompactKo(value: number): string {
  if (value >= 100_000_000) return `${(value / 100_000_000).toFixed(1)}억`;
  if (value >= 10_000) return `${(value / 10_000).toFixed(1)}만`;
  return value.toLocaleString("ko-KR");
}

export function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" });
}
