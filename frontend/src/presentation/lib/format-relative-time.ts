const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

export function formatRelativeTime(date: Date, now = new Date()): string {
  const diffMs = Math.max(0, now.getTime() - date.getTime());

  if (diffMs < MINUTE_MS) return "just now";

  const minutes = Math.floor(diffMs / MINUTE_MS);
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(diffMs / HOUR_MS);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(diffMs / DAY_MS);
  if (days < 7) return `${days}d`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
