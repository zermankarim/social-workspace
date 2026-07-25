"use client";

import { useMemo, useState } from "react";
import { AlertCircle, FileText, Inbox, Loader2, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import type { JobApplication } from "@/core/domain/entities/job-application.entity";
import { FeedCard } from "@/presentation/components/feed/feed-card";
import { Button } from "@/presentation/components/ui/button";
import {
  useDecideApplication,
  useReceivedApplications,
  useSentApplications,
  useWithdrawApplication,
} from "@/presentation/hooks/use-job-applications";
import { formatRelativeTime } from "@/presentation/lib/format-relative-time";

type Tab = "sent" | "received";

const STATUS_BADGE_CLASS: Record<JobApplication["status"], string> = {
  PENDING: "bg-surface-muted text-muted",
  ACCEPTED:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  REJECTED: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  WITHDRAWN: "bg-surface-muted text-muted",
};

function DecisionForm({
  applicationId,
  onDone,
}: {
  applicationId: string;
  onDone: () => void;
}) {
  const t = useTranslations("jobs");
  const decide = useDecideApplication();
  const [reason, setReason] = useState("");

  return (
    <div className="mt-2 space-y-2 rounded-lg border border-border bg-surface-muted/40 p-2">
      <textarea
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder={t("decisionReasonPlaceholder")}
        rows={2}
        maxLength={1000}
        className="w-full resize-y rounded border border-border bg-surface px-2 py-1.5 text-xs text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <div className="flex justify-end gap-1.5">
        <Button
          type="button"
          variant="ghost"
          className="h-7 px-2 text-xs"
          disabled={decide.isPending}
          onClick={() =>
            decide.mutate(
              {
                id: applicationId,
                status: "REJECTED",
                reason: reason.trim() || undefined,
              },
              { onSuccess: onDone },
            )
          }
        >
          {t("reject")}
        </Button>
        <Button
          type="button"
          className="h-7 px-2 text-xs"
          disabled={decide.isPending}
          onClick={() =>
            decide.mutate(
              {
                id: applicationId,
                status: "ACCEPTED",
                reason: reason.trim() || undefined,
              },
              { onSuccess: onDone },
            )
          }
        >
          {decide.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          ) : null}
          {t("accept")}
        </Button>
      </div>
    </div>
  );
}

function ApplicationRow({
  application,
  variant,
}: {
  application: JobApplication;
  variant: Tab;
}) {
  const t = useTranslations("jobs");
  const withdraw = useWithdrawApplication();
  const [decidingOpen, setDecidingOpen] = useState(false);
  const person = variant === "received" ? application.applicant : null;

  return (
    <FeedCard className="px-4 py-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 gap-2.5">
          {person ? (
            person.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={person.avatarUrl}
                alt=""
                className="h-10 w-10 shrink-0 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                {person.initials}
              </span>
            )
          ) : application.job.companyLogoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={application.job.companyLogoUrl}
              alt=""
              className="h-10 w-10 shrink-0 rounded object-cover"
            />
          ) : (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-primary-soft text-xs font-semibold text-primary">
              {application.job.companyName.slice(0, 2).toUpperCase()}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">
              {person ? person.displayName : application.job.title}
            </p>
            <p className="truncate text-xs text-muted">
              {person
                ? t("appliedTo", { title: application.job.title })
                : application.job.companyName}
            </p>
            {application.resume ? (
              <a
                href={application.resume.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-0.5 inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <FileText className="h-3 w-3" aria-hidden />
                {application.resume.fileName}
              </a>
            ) : null}
            {application.coverNote ? (
              <p className="mt-1 text-xs whitespace-pre-wrap text-foreground">
                {application.coverNote}
              </p>
            ) : null}
            {application.decisionReason ? (
              <p className="mt-1 text-xs text-muted">
                {t("decisionReasonLabel")}: {application.decisionReason}
              </p>
            ) : null}
          </div>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_BADGE_CLASS[application.status]}`}
        >
          {t(`status.${application.status}`)}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-muted">
          {formatRelativeTime(application.createdAt)}
        </span>
        {variant === "sent" && application.status === "PENDING" ? (
          <Button
            type="button"
            variant="ghost"
            className="h-7 px-2 text-xs"
            disabled={withdraw.isPending}
            onClick={() => withdraw.mutate(application.id)}
          >
            {t("withdraw")}
          </Button>
        ) : null}
        {variant === "received" && application.status === "PENDING" ? (
          <Button
            type="button"
            variant="secondary"
            className="h-7 px-2 text-xs"
            onClick={() => setDecidingOpen((open) => !open)}
          >
            {t("decide")}
          </Button>
        ) : null}
      </div>

      {decidingOpen ? (
        <DecisionForm
          applicationId={application.id}
          onDone={() => setDecidingOpen(false)}
        />
      ) : null}
    </FeedCard>
  );
}

function ApplicationsList({ variant }: { variant: Tab }) {
  const t = useTranslations("jobs");
  const tCommon = useTranslations("common");
  const sentQuery = useSentApplications();
  const receivedQuery = useReceivedApplications();
  const query = variant === "sent" ? sentQuery : receivedQuery;

  const items = useMemo(
    () => query.data?.pages.flatMap((page) => page.data) ?? [],
    [query.data],
  );

  if (query.isLoading) {
    return (
      <FeedCard className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
      </FeedCard>
    );
  }

  if (query.error) {
    return (
      <FeedCard className="px-4 py-8 text-center">
        <p className="inline-flex items-center gap-2 text-sm text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
          {query.error instanceof ApiError
            ? query.error.message
            : t("loadFailed")}
        </p>
      </FeedCard>
    );
  }

  if (items.length === 0) {
    return (
      <FeedCard className="px-4 py-16 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
          {variant === "sent" ? (
            <Send className="h-7 w-7" aria-hidden />
          ) : (
            <Inbox className="h-7 w-7" aria-hidden />
          )}
        </div>
        <p className="mt-4 text-sm text-muted">
          {variant === "sent"
            ? t("noSentApplications")
            : t("noReceivedApplications")}
        </p>
      </FeedCard>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((application) => (
        <ApplicationRow
          key={application.id}
          application={application}
          variant={variant}
        />
      ))}
      {query.hasNextPage ? (
        <div className="flex justify-center py-3">
          <Button
            type="button"
            variant="secondary"
            disabled={query.isFetchingNextPage}
            onClick={() => void query.fetchNextPage()}
            className="gap-1.5"
          >
            {query.isFetchingNextPage ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : null}
            {tCommon("loadMore")}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function ApplicationsPage() {
  const t = useTranslations("jobs");
  const [tab, setTab] = useState<Tab>("received");

  return (
    <div className="mx-auto max-w-[720px] space-y-2">
      <FeedCard className="px-4 py-3">
        <h1 className="text-lg font-semibold text-foreground">
          {t("applicationsTitle")}
        </h1>
        <div className="mt-3 inline-flex rounded-lg border border-border bg-surface-muted p-0.5">
          <button
            type="button"
            onClick={() => setTab("received")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === "received"
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            {t("received")}
          </button>
          <button
            type="button"
            onClick={() => setTab("sent")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              tab === "sent"
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            {t("sent")}
          </button>
        </div>
      </FeedCard>

      <ApplicationsList variant={tab} />
    </div>
  );
}
