"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  Briefcase,
  Inbox,
  Loader2,
  MapPin,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import type {
  Job,
  JobExperienceLevel,
} from "@/core/domain/entities/job.entity";
import type { JobFilters } from "@/core/domain/repositories/job.repository";
import { EmploymentType } from "@/core/domain/enums/employment-type.enum";
import { WorkplaceType } from "@/core/domain/enums/workplace-type.enum";
import { FeedCard } from "@/presentation/components/feed/feed-card";
import { CreateJobDialog } from "@/presentation/components/jobs/create-job-dialog";
import { JobDetailPanel } from "@/presentation/components/jobs/job-detail-panel";
import { Button } from "@/presentation/components/ui/button";
import { ListPagination } from "@/presentation/components/ui/list-pagination";
import { SearchInput } from "@/presentation/components/ui/search-input";
import { Select } from "@/presentation/components/ui/select";
import { useJobsPage } from "@/presentation/hooks/use-jobs";
import { formatRelativeTime } from "@/presentation/lib/format-relative-time";
import { useAuthStore } from "@/presentation/stores/auth.store";

const EXPERIENCE_LEVELS: JobExperienceLevel[] = [
  "NO_EXPERIENCE",
  "JUNIOR",
  "MIDDLE",
  "SENIOR",
  "LEAD",
];

function JobListRow({
  job,
  active,
  onSelect,
}: {
  job: Job;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={`flex w-full items-start gap-2.5 border-l-2 px-4 py-3 text-left transition-colors ${
          active
            ? "border-primary bg-primary-soft"
            : "border-transparent hover:bg-surface-muted"
        }`}
      >
        {job.company?.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={job.company.logoUrl}
            alt=""
            className="h-10 w-10 shrink-0 rounded object-cover"
          />
        ) : (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-primary-soft text-xs font-semibold text-primary">
            {job.companyName.slice(0, 2).toUpperCase()}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {job.title}
          </p>
          <p className="truncate text-xs text-muted">{job.companyName}</p>
          {job.location ? (
            <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
              <MapPin className="h-3 w-3 shrink-0" aria-hidden />
              {job.location}
            </p>
          ) : null}
          <p className="mt-0.5 text-[11px] text-muted">
            {formatRelativeTime(job.createdAt)}
          </p>
        </div>
      </button>
    </li>
  );
}

export function JobsPage() {
  const t = useTranslations("jobs");
  const tCommon = useTranslations("common");
  const user = useAuthStore((state) => state.user);
  const searchParams = useSearchParams();
  const companyIdFromUrl = searchParams.get("companyId") ?? undefined;

  const [q, setQ] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [workplaceType, setWorkplaceType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [page, setPage] = useState(1);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filters: JobFilters = useMemo(
    () => ({
      q: q.trim() || undefined,
      location: location.trim() || undefined,
      companyId: companyIdFromUrl,
      employmentType: (employmentType as EmploymentType) || undefined,
      workplaceType: (workplaceType as WorkplaceType) || undefined,
      experienceLevel: (experienceLevel as JobExperienceLevel) || undefined,
    }),
    [
      q,
      location,
      companyIdFromUrl,
      employmentType,
      workplaceType,
      experienceLevel,
    ],
  );

  const { data, isLoading, error } = useJobsPage(filters, page);
  const jobs = data?.data ?? [];

  // Falls back to the first result whenever the selection isn't in the
  // current filtered/paginated list (new search, new page, initial load).
  const selectedJob =
    jobs.find((job) => job.id === selectedJobId) ?? jobs[0] ?? null;

  return (
    <div className="mx-auto max-w-[1100px]">
      <FeedCard className="mb-2 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-lg font-semibold text-foreground">
            {t("title")}
          </h1>
          <div className="flex items-center gap-2">
            <Link href="/applications">
              <Button
                type="button"
                variant="secondary"
                className="gap-1.5 text-xs"
              >
                <Inbox className="h-3.5 w-3.5" aria-hidden />
                {t("myApplications")}
              </Button>
            </Link>
            {user ? (
              <Button
                type="button"
                className="gap-1.5 text-xs"
                onClick={() => setDialogOpen(true)}
              >
                <Plus className="h-3.5 w-3.5" aria-hidden />
                {t("postJob")}
              </Button>
            ) : null}
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <SearchInput
            value={q}
            onChange={(value) => {
              setQ(value);
              setPage(1);
            }}
            placeholder={t("searchPlaceholder")}
          />
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <input
              value={location}
              onChange={(event) => {
                setLocation(event.target.value);
                setPage(1);
              }}
              placeholder={t("location")}
              className="col-span-2 rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:col-span-1"
            />
            <Select
              label={t("employmentType")}
              hideLabel
              value={employmentType}
              onChange={(value) => {
                setEmploymentType(value);
                setPage(1);
              }}
              placeholder={t("employmentType")}
              options={Object.values(EmploymentType).map((value) => ({
                value,
                label: t(`employmentTypeValue.${value}`),
              }))}
            />
            <Select
              label={t("workplaceType")}
              hideLabel
              value={workplaceType}
              onChange={(value) => {
                setWorkplaceType(value);
                setPage(1);
              }}
              placeholder={t("workplaceType")}
              options={Object.values(WorkplaceType).map((value) => ({
                value,
                label: t(`workplaceTypeValue.${value}`),
              }))}
            />
            <Select
              label={t("experienceLevel")}
              hideLabel
              value={experienceLevel}
              onChange={(value) => {
                setExperienceLevel(value);
                setPage(1);
              }}
              placeholder={t("experienceLevel")}
              options={EXPERIENCE_LEVELS.map((value) => ({
                value,
                label: t(`experienceLevelValue.${value}`),
              }))}
            />
          </div>
        </div>
      </FeedCard>

      {isLoading ? (
        <FeedCard className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
        </FeedCard>
      ) : error ? (
        <FeedCard className="px-4 py-8 text-center">
          <p className="inline-flex items-center gap-2 text-sm text-danger">
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
            {error instanceof ApiError ? error.message : t("loadFailed")}
          </p>
        </FeedCard>
      ) : jobs.length === 0 ? (
        <FeedCard className="px-4 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Briefcase className="h-7 w-7" aria-hidden />
          </div>
          <p className="mt-4 text-sm font-medium text-foreground">
            {t("emptyTitle")}
          </p>
          <p className="mt-1 text-sm text-muted">{t("emptyHint")}</p>
        </FeedCard>
      ) : (
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-[360px_minmax(0,1fr)]">
          <FeedCard className="overflow-hidden p-0">
            <ul className="divide-y divide-border">
              {jobs.map((job) => (
                <JobListRow
                  key={job.id}
                  job={job}
                  active={job.id === selectedJob?.id}
                  onSelect={() => setSelectedJobId(job.id)}
                />
              ))}
            </ul>
            {data ? (
              <ListPagination
                meta={data.meta}
                onPageChange={setPage}
                itemLabel={t("jobItemLabel")}
              />
            ) : null}
          </FeedCard>

          <div className="lg:sticky lg:top-[68px] lg:self-start">
            {selectedJob ? (
              <JobDetailPanel job={selectedJob} />
            ) : (
              <FeedCard className="flex justify-center py-16 text-sm text-muted">
                {tCommon("nothingSelected")}
              </FeedCard>
            )}
          </div>
        </div>
      )}

      {dialogOpen ? (
        <CreateJobDialog onClose={() => setDialogOpen(false)} />
      ) : null}
    </div>
  );
}
