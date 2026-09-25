export function dateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function fromDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d, 12, 0, 0);
}

export function shiftDate(key: string, amount: number): string {
  const date = fromDateKey(key);
  date.setDate(date.getDate() + amount);
  return dateKey(date);
}

export function todayKey(): string {
  return dateKey(new Date());
}

export function displayDate(key: string, options?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-US", options ?? {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(fromDateKey(key));
}

export function daysBetween(start: string, end: string): number {
  const ms = fromDateKey(end).getTime() - fromDateKey(start).getTime();
  return Math.round(ms / 86_400_000);
}
