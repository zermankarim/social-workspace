"use client";

import { useState } from "react";
import { Building2, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { FeedCard } from "@/presentation/components/feed/feed-card";
import { CreateCompanyDialog } from "@/presentation/components/companies/create-company-dialog";
import { SearchInput } from "@/presentation/components/ui/search-input";
import { useCompanySearch } from "@/presentation/hooks/use-company";
import { useAuthStore } from "@/presentation/stores/auth.store";

export function CompaniesDirectoryPage() {
  const t = useTranslations("companies");
  const user = useAuthStore((state) => state.user);
  const [query, setQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data, isFetching } = useCompanySearch(query, true);

  return (
    <div className="mx-auto max-w-[720px] space-y-2">
      <FeedCard className="px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-lg font-semibold text-foreground">
            {t("directoryTitle")}
          </h1>
          {user ? (
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold text-primary hover:bg-primary-soft"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              {t("registerCompany")}
            </button>
          ) : null}
        </div>
        <div className="mt-3">
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder={t("searchCompanyPlaceholder")}
          />
        </div>
      </FeedCard>

      <FeedCard className="overflow-hidden">
        {isFetching ? (
          <div className="flex justify-center py-16">
            <Loader2
              className="h-6 w-6 animate-spin text-primary"
              aria-hidden
            />
          </div>
        ) : !data || data.data.length === 0 ? (
          <p className="px-4 py-16 text-center text-sm text-muted">
            {query.trim() ? t("noCompaniesFound") : t("noCompaniesYet")}
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {data.data.map((company) => (
              <li key={company.id}>
                <Link
                  href={`/companies/${encodeURIComponent(company.name)}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-surface-muted"
                >
                  {company.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={company.logoUrl}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded object-cover"
                    />
                  ) : (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-primary-soft text-primary">
                      <Building2 className="h-5 w-5" aria-hidden />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {company.name}
                    </p>
                    {company.industry ? (
                      <p className="truncate text-xs text-muted">
                        {company.industry}
                      </p>
                    ) : null}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </FeedCard>

      {dialogOpen ? (
        <CreateCompanyDialog onClose={() => setDialogOpen(false)} />
      ) : null}
    </div>
  );
}
