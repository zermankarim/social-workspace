"use client";

import { useEffect, useRef } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ExternalLink,
  Eye,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import { FeedCard } from "@/presentation/components/feed/feed-card";
import {
  useNewsStory,
  useRegisterNewsRead,
} from "@/presentation/hooks/use-news";
import { formatEngagementCount } from "@/presentation/lib/format-engagement-count";
import { useAuthStore } from "@/presentation/stores/auth.store";

type NewsDetailPageProps = {
  storyId: string;
};

export function NewsDetailPage({ storyId }: NewsDetailPageProps) {
  const t = useTranslations("news");
  const locale = useLocale();
  const user = useAuthStore((state) => state.user);
  const storyQuery = useNewsStory(storyId);
  const { mutate: registerRead } = useRegisterNewsRead();
  const recordedStoryIdRef = useRef<string | null>(null);
  const story = storyQuery.data;

  useEffect(() => {
    if (!user || !story || recordedStoryIdRef.current === story.id) return;

    recordedStoryIdRef.current = story.id;
    registerRead(story.id);
  }, [registerRead, story, user]);

  if (!user) return null;

  if (storyQuery.isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
      </div>
    );
  }

  if (storyQuery.error || !story) {
    return (
      <FeedCard className="mx-auto max-w-[760px] px-4 py-8 text-center">
        <p className="inline-flex items-center gap-2 text-sm text-danger">
          <AlertCircle className="h-4 w-4" aria-hidden />
          {storyQuery.error instanceof ApiError
            ? storyQuery.error.message
            : t("loadFailed")}
        </p>
      </FeedCard>
    );
  }

  const publishedAt = new Intl.DateTimeFormat(locale, {
    dateStyle: "long",
  }).format(story.createdAt);
  const content = story.body?.trim();

  return (
    <article className="mx-auto w-full max-w-[760px]">
      <Link
        href="/feed"
        className="mb-3 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm font-semibold text-primary hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {t("backToFeed")}
      </Link>

      <FeedCard className="overflow-hidden">
        <header className="border-b border-border px-5 py-5 sm:px-8 sm:py-7">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {t("eyebrow")}
          </p>
          <h1 className="mt-2 text-2xl font-bold leading-tight text-foreground sm:text-3xl">
            {story.title}
          </h1>
          {story.summary ? (
            <p className="mt-3 text-base leading-7 text-muted">
              {story.summary}
            </p>
          ) : null}
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted">
            <time dateTime={story.createdAt.toISOString()}>{publishedAt}</time>
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" aria-hidden />
              {t("readers", {
                count: story.readersCount,
                formatted: formatEngagementCount(story.readersCount),
              })}
            </span>
          </div>
        </header>

        <div className="px-5 py-6 sm:px-8 sm:py-8">
          {content ? (
            <div className="whitespace-pre-line text-[15px] leading-7 text-foreground sm:text-base">
              {content}
            </div>
          ) : (
            <p className="text-sm text-muted">{t("contentUnavailable")}</p>
          )}

          {story.url ? (
            <a
              href={story.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-semibold text-primary hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {t("viewSource")}
              <ExternalLink className="h-4 w-4" aria-hidden />
            </a>
          ) : null}
        </div>
      </FeedCard>
    </article>
  );
}
