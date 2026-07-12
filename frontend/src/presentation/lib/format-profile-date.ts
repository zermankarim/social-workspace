export function formatProfileMonthYear(date: Date, locale = "en"): string {
  return date.toLocaleDateString(locale, { month: "short", year: "numeric" });
}

export function formatProfileDateRange(
  start: Date,
  end: Date | null,
  presentLabel: string,
  locale = "en",
): string {
  const startLabel = formatProfileMonthYear(start, locale);
  const endLabel = end ? formatProfileMonthYear(end, locale) : presentLabel;
  return `${startLabel} – ${endLabel}`;
}

export function toMonthInputValue(date: Date | null | undefined): string {
  if (!date) return "";
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function monthInputToIsoDate(value: string): string {
  return `${value}-01`;
}
