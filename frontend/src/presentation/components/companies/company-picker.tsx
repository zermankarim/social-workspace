"use client";

import { useState } from "react";
import { Building2, Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import type { CompanySummary } from "@/core/domain/entities/company-summary.entity";
import { useCompanySearch } from "@/presentation/hooks/use-company";

type CompanyPickerProps = {
  selected: CompanySummary | null;
  onSelect: (company: CompanySummary | null) => void;
  disabled?: boolean;
};

export function CompanyPicker({
  selected,
  onSelect,
  disabled,
}: CompanyPickerProps) {
  const t = useTranslations("companies");
  const [query, setQuery] = useState("");
  const { data, isFetching } = useCompanySearch(query, !selected, 1);

  if (selected) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border-strong bg-surface px-3 py-2">
        {selected.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={selected.logoUrl}
            alt=""
            className="h-6 w-6 shrink-0 rounded object-cover"
          />
        ) : (
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary-soft text-[10px] font-semibold text-primary">
            {selected.initials}
          </span>
        )}
        <span className="min-w-0 flex-1 truncate text-sm text-foreground">
          {selected.name}
        </span>
        {!disabled ? (
          <button
            type="button"
            onClick={() => onSelect(null)}
            className="shrink-0 rounded-full p-1 text-muted hover:bg-surface-muted hover:text-foreground"
            aria-label={t("clearCompany")}
          >
            <X className="h-3.5 w-3.5" aria-hidden />
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t("searchCompanyPlaceholder")}
        disabled={disabled}
        className="w-full rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      {isFetching ? (
        <div className="absolute top-full right-0 left-0 z-10 mt-1 flex justify-center rounded-lg border border-border bg-surface py-2 shadow-card">
          <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
        </div>
      ) : query.trim() && data && data.data.length > 0 ? (
        <ul className="absolute top-full right-0 left-0 z-10 mt-1 max-h-48 overflow-y-auto rounded-lg border border-border bg-surface shadow-card">
          {data.data.map((company) => (
            <li key={company.id}>
              <button
                type="button"
                onClick={() => {
                  onSelect(company);
                  setQuery("");
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-surface-muted"
              >
                {company.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={company.logoUrl}
                    alt=""
                    className="h-6 w-6 shrink-0 rounded object-cover"
                  />
                ) : (
                  <Building2
                    className="h-6 w-6 shrink-0 rounded bg-primary-soft p-1 text-primary"
                    aria-hidden
                  />
                )}
                <span className="min-w-0 flex-1 truncate text-foreground">
                  {company.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
