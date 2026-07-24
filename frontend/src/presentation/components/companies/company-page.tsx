"use client";

import Link from "next/link";
import { AlertCircle, Building2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import { FeedCard } from "@/presentation/components/feed/feed-card";
import { useCompany } from "@/presentation/hooks/use-company";

type CompanyPageProps = {
  name: string;
};

export function CompanyPage({ name }: CompanyPageProps) {
  const t = useTranslations("companies");
  const companyQuery = useCompany(name);
  const company = companyQuery.data;

  if (companyQuery.isLoading) {
    return (
      <FeedCard className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
      </FeedCard>
    );
  }

  if (companyQuery.error || !company) {
    return (
      <FeedCard className="px-4 py-8 text-center">
        <p className="inline-flex items-center gap-2 text-sm text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
          {companyQuery.error instanceof ApiError
            ? companyQuery.error.message
            : t("loadFailed")}
        </p>
      </FeedCard>
    );
  }

  return (
    <div className="mx-auto max-w-[720px] space-y-2">
      <FeedCard className="px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Building2 className="h-6 w-6" aria-hidden />
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold text-foreground">
              {company.name}
            </h1>
            <p className="text-sm text-muted">
              {t("employeesCount", { count: company.employeesCount })}
              {" · "}
              {t("currentEmployeesCount", {
                count: company.currentEmployeesCount,
              })}
            </p>
          </div>
        </div>
      </FeedCard>

      <FeedCard className="overflow-hidden">
        {company.employees.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-muted">
            {t("noEmployees")}
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {company.employees.map((employee) => (
              <li key={employee.id}>
                <Link
                  href={`/users/${employee.id}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-surface-muted"
                >
                  {employee.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={employee.avatarUrl}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
                      {employee.initials}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {employee.displayName}
                    </p>
                    <p className="truncate text-xs text-muted">
                      {employee.title}
                      {employee.isCurrent
                        ? ` · ${t("current")}`
                        : ` · ${t("past")}`}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </FeedCard>
    </div>
  );
}
