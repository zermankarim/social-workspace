"use client";

import { useState } from "react";
import { MapPin, Trash2 } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { Job } from "@/core/domain/entities/job.entity";
import { JobCompanyCard } from "@/presentation/components/jobs/job-company-card";
import { ApplyToJobDialog } from "@/presentation/components/jobs/apply-to-job-dialog";
import { Button } from "@/presentation/components/ui/button";
import { useDeleteJob } from "@/presentation/hooks/use-jobs";
import { formatRelativeTime } from "@/presentation/lib/format-relative-time";
import { useAuthStore } from "@/presentation/stores/auth.store";

type JobDetailPanelProps = {
  job: Job;
};

export function JobDetailPanel({ job }: JobDetailPanelProps) {
  const t = useTranslations("jobs");
  const user = useAuthStore((state) => state.user);
  const deleteJob = useDeleteJob();
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          {job.company?.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={job.company.logoUrl}
              alt=""
              className="h-14 w-14 shrink-0 rounded object-cover"
            />
          ) : (
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded bg-primary-soft text-lg font-semibold text-primary">
              {job.companyName.slice(0, 2).toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-foreground">
              {job.title}
            </h1>
            {job.company ? (
              <Link
                href={`/companies/${encodeURIComponent(job.company.name)}`}
                className="text-sm text-muted hover:text-primary hover:underline"
              >
                {job.company.name}
              </Link>
            ) : (
              <p className="text-sm text-muted">{job.companyName}</p>
            )}
            <p className="mt-0.5 flex flex-wrap items-center gap-x-1.5 text-xs text-muted">
              {job.location ? (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" aria-hidden />
                  {job.location}
                </span>
              ) : null}
              <span>· {formatRelativeTime(job.createdAt)}</span>
              <span>
                · {t("applicantsCount", { count: job.applicationsCount })}
              </span>
            </p>
          </div>
        </div>
        {user && job.isPostedBy(user.id) ? (
          <button
            type="button"
            aria-label={t("deleteJob")}
            disabled={deleteJob.isPending}
            onClick={() => {
              if (!window.confirm(t("deleteJobConfirm"))) return;
              deleteJob.mutate(job.id);
            }}
            className="shrink-0 rounded-full p-1.5 text-muted hover:bg-surface-muted hover:text-danger disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" aria-hidden />
          </button>
        ) : null}
      </div>

      {job.employmentType || job.workplaceType || job.experienceLevel ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.employmentType ? (
            <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs text-muted">
              {t(`employmentTypeValue.${job.employmentType}`)}
            </span>
          ) : null}
          {job.workplaceType ? (
            <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs text-muted">
              {t(`workplaceTypeValue.${job.workplaceType}`)}
            </span>
          ) : null}
          {job.experienceLevel ? (
            <span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs text-muted">
              {t(`experienceLevelValue.${job.experienceLevel}`)}
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="mt-4 flex items-center gap-2">
        {user ? (
          <Button
            type="button"
            disabled={applied}
            onClick={() => setApplying(true)}
          >
            {applied ? t("applied") : t("apply")}
          </Button>
        ) : null}
        {job.applyUrl ? (
          <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
            <Button type="button" variant="secondary">
              {t("applyExternally")}
            </Button>
          </a>
        ) : null}
      </div>

      <hr className="my-5 border-border" />

      <h2 className="text-sm font-semibold text-foreground">{t("aboutJob")}</h2>
      <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">
        {job.description}
      </p>

      <div className="mt-5">
        <JobCompanyCard registeredCompanyName={job.company?.name ?? null} />
      </div>

      {applying ? (
        <ApplyToJobDialog
          jobId={job.id}
          jobTitle={job.title}
          onClose={() => setApplying(false)}
          onApplied={() => {
            setApplied(true);
            setApplying(false);
          }}
        />
      ) : null}
    </div>
  );
}
