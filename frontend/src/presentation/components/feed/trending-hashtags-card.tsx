"use client";

import { Hash } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { FeedCard } from "@/presentation/components/feed/feed-card";
import { useTrendingHashtags } from "@/presentation/hooks/use-hashtags";

export function TrendingHashtagsCard() {
  const t = useTranslations("hashtag");
  const { data, isLoading } = useTrendingHashtags(6);
  const hashtags = data ?? [];

  if (!isLoading && hashtags.length === 0) return null;

  return (
    <FeedCard className="px-3 py-3">
      <h2 className="text-sm font-semibold text-foreground">{t("trending")}</h2>
      {isLoading ? (
        <ul className="mt-3 space-y-2.5" aria-hidden>
          {Array.from({ length: 4 }).map((_, index) => (
            <li key={index} className="h-3.5 w-3/4 rounded bg-surface-muted" />
          ))}
        </ul>
      ) : (
        <ul className="mt-3 space-y-1">
          {hashtags.map((hashtag) => (
            <li key={hashtag.id}>
              <Link
                href={`/feed/hashtags/${encodeURIComponent(hashtag.tag)}`}
                className="flex items-center gap-2 rounded px-1 py-1 hover:bg-surface-muted"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                  <Hash className="h-4 w-4" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold text-foreground">
                    #{hashtag.tag}
                  </span>
                  <span className="block text-[11px] text-muted">
                    {t("postsCount", { count: hashtag.postsCount })}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </FeedCard>
  );
}
