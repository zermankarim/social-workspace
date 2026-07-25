"use client";

import { useState } from "react";
import { Building2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  useCompany,
  useFollowCompany,
  useUnfollowCompany,
} from "@/presentation/hooks/use-company";
import { Button } from "@/presentation/components/ui/button";

type JobCompanyCardProps = {
  registeredCompanyName: string | null;
};

const DESCRIPTION_PREVIEW_LENGTH = 220;

/** "About the company" card shown under a job's description — mirrors LinkedIn's job-detail company block. */
export function JobCompanyCard({ registeredCompanyName }: JobCompanyCardProps) {
  const t = useTranslations("jobs");
  const tCompanies = useTranslations("companies");
  const [expanded, setExpanded] = useState(false);
  const companyQuery = useCompany(registeredCompanyName ?? undefined);
  const company = companyQuery.data;
  const follow = useFollowCompany();
  const unfollow = useUnfollowCompany();

  if (!registeredCompanyName) {
    return null;
  }

  if (companyQuery.isLoading) {
    return (
      <div className="flex justify-center rounded-lg border border-border py-6">
        <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden />
      </div>
    );
  }

  if (!company) return null;

  const description = company.description ?? "";
  const isLong = description.length > DESCRIPTION_PREVIEW_LENGTH;
  const shownDescription =
    expanded || !isLong
      ? description
      : `${description.slice(0, DESCRIPTION_PREVIEW_LENGTH)}…`;

  const toggleFollow = () => {
    if (company.isViewerFollowing) {
      unfollow.mutate({ companyId: company.id, companyName: company.name });
    } else {
      follow.mutate({ companyId: company.id, companyName: company.name });
    }
  };

  return (
    <div className="rounded-lg border border-border p-4">
      <h3 className="mb-3 text-sm font-semibold text-foreground">
        {t("aboutCompany")}
      </h3>
      <div className="flex items-start justify-between gap-3">
        <Link
          href={`/companies/${encodeURIComponent(company.name)}`}
          className="flex min-w-0 items-center gap-3"
        >
          {company.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={company.logoUrl}
              alt=""
              className="h-12 w-12 shrink-0 rounded object-cover"
            />
          ) : (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-primary-soft text-primary">
              <Building2 className="h-6 w-6" aria-hidden />
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground hover:underline">
              {company.name}
            </p>
            <p className="text-xs text-muted">
              {tCompanies("followersCount", { count: company.followersCount })}
            </p>
          </div>
        </Link>
        <Button
          type="button"
          variant={company.isViewerFollowing ? "secondary" : "ghost"}
          className="shrink-0 text-xs"
          disabled={follow.isPending || unfollow.isPending}
          onClick={toggleFollow}
        >
          {company.isViewerFollowing
            ? tCompanies("following")
            : tCompanies("follow")}
        </Button>
      </div>

      {company.industry || company.size ? (
        <p className="mt-2 text-xs text-muted">
          {[
            company.industry,
            company.size ? tCompanies(`sizeValue.${company.size}`) : null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      ) : null}

      {description ? (
        <p className="mt-2 text-sm whitespace-pre-wrap text-foreground">
          {shownDescription}{" "}
          {isLong ? (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="font-medium text-primary hover:underline"
            >
              {expanded ? tCompanies("showLess") : tCompanies("showMore")}
            </button>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}
