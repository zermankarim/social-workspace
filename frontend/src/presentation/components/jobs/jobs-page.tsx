"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  Briefcase,
  Loader2,
  MapPin,
  Plus,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import { FeedCard } from "@/presentation/components/feed/feed-card";
import { CreateJobDialog } from "@/presentation/components/jobs/create-job-dialog";
import { Button } from "@/presentation/components/ui/button";
import { ExpandableText } from "@/presentation/components/ui/expandable-text";
import { useDeleteJob, useJobsFeed } from "@/presentation/hooks/use-jobs";
import { formatRelativeTime } from "@/presentation/lib/format-relative-time";
import { useAuthStore } from "@/presentation/stores/auth.store";

export function JobsPage() {
  const t = useTranslations("jobs");
  const tCommon = useTranslations("common");
  const user = useAuthStore((state) => state.user);
  const {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useJobsFeed();
  const deleteJob = useDeleteJob();
  const [dialogOpen, setDialogOpen] = useState(false);

  const jobs = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  return (
    <div className="mx-auto max-w-[720px] space-y-2">
      <FeedCard className="flex items-center justify-between px-4 py-3">
        <h1 className="text-lg font-semibold text-foreground">{t("title")}</h1>
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
        jobs.map((job) => (
          <FeedCard key={job.id} className="px-4 py-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-foreground">
                  {job.title}
                </h2>
                <p className="text-sm text-muted">{job.companyName}</p>
                {job.location ? (
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-muted">
                    <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    {job.location}
                  </p>
                ) : null}
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

            <ExpandableText
              text={job.description}
              className="mt-2 whitespace-pre-wrap text-sm text-foreground"
            />

            <div className="mt-3 flex items-center justify-between gap-2">
              <span className="text-xs text-muted">
                {formatRelativeTime(job.createdAt)}
              </span>
              <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                <Button type="button" className="text-xs">
                  {t("apply")}
                </Button>
              </a>
            </div>
          </FeedCard>
        ))
      )}

      {hasNextPage ? (
        <div className="flex justify-center py-3">
          <Button
            type="button"
            variant="secondary"
            disabled={isFetchingNextPage}
            onClick={() => void fetchNextPage()}
            className="gap-1.5"
          >
            {isFetchingNextPage ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : null}
            {tCommon("loadMore")}
          </Button>
        </div>
      ) : null}

      {dialogOpen ? (
        <CreateJobDialog onClose={() => setDialogOpen(false)} />
      ) : null}
    </div>
  );
}
