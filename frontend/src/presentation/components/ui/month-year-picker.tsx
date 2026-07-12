"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Select } from "@/presentation/components/ui/select";

const MONTH_VALUES = [
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
] as const;

type MonthYearPickerProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  id?: string;
  yearsPast?: number;
  yearsFuture?: number;
};

type Draft = {
  month: string;
  year: string;
};

function parseMonthYear(value: string): Draft {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return { month: "", year: "" };
  return { year: match[1]!, month: match[2]! };
}

function buildYearOptions(yearsPast: number, yearsFuture: number): string[] {
  const current = new Date().getFullYear();
  const years: string[] = [];
  for (
    let year = current + yearsFuture;
    year >= current - yearsPast;
    year -= 1
  ) {
    years.push(String(year));
  }
  return years;
}

function monthLabel(monthIndex: number, locale: string): string {
  return new Intl.DateTimeFormat(locale, { month: "long" }).format(
    new Date(Date.UTC(2020, monthIndex, 1)),
  );
}

export function MonthYearPicker({
  label,
  value,
  onChange,
  disabled = false,
  id,
  yearsPast = 70,
  yearsFuture = 5,
}: MonthYearPickerProps) {
  const t = useTranslations("profile");
  const locale = useLocale();
  const baseId = id ?? label.toLowerCase().replace(/\s+/g, "-");
  const yearOptions = buildYearOptions(yearsPast, yearsFuture);
  const parsed = parseMonthYear(value);
  const [draft, setDraft] = useState<Draft>({ month: "", year: "" });

  const month = value ? parsed.month : draft.month;
  const year = value ? parsed.year : draft.year;

  function handleMonthChange(nextMonth: string) {
    const currentYear = value ? parsed.year : draft.year;
    if (nextMonth && currentYear) {
      setDraft({ month: "", year: "" });
      onChange(`${currentYear}-${nextMonth}`);
      return;
    }
    setDraft({ month: nextMonth, year: currentYear });
    if (value) {
      onChange("");
    }
  }

  function handleYearChange(nextYear: string) {
    const currentMonth = value ? parsed.month : draft.month;
    if (currentMonth && nextYear) {
      setDraft({ month: "", year: "" });
      onChange(`${nextYear}-${currentMonth}`);
      return;
    }
    setDraft({ month: currentMonth, year: nextYear });
    if (value) {
      onChange("");
    }
  }

  return (
    <fieldset disabled={disabled} className="min-w-0">
      <legend className="mb-1.5 text-sm font-medium text-foreground">
        {label}
      </legend>
      <div className="grid grid-cols-2 gap-2">
        <Select
          id={`${baseId}-month`}
          label={`${label} — ${t("month")}`}
          hideLabel
          placeholder={t("month")}
          value={month}
          disabled={disabled}
          onChange={handleMonthChange}
          options={MONTH_VALUES.map((monthValue, index) => ({
            value: monthValue,
            label: monthLabel(index, locale),
          }))}
        />
        <Select
          id={`${baseId}-year`}
          label={`${label} — ${t("year")}`}
          hideLabel
          placeholder={t("year")}
          value={year}
          disabled={disabled}
          onChange={handleYearChange}
          options={yearOptions.map((yearValue) => ({
            value: yearValue,
            label: yearValue,
          }))}
        />
      </div>
    </fieldset>
  );
}
