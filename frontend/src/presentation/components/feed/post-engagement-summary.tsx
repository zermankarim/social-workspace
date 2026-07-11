"use client";

import { useTranslations } from "next-intl";
import type { PostLike } from "@/core/domain/entities/post-like.entity";
import { formatEngagementCount } from "@/presentation/lib/format-engagement-count";
import { getReactionOption } from "@/presentation/lib/reactions";

type PostEngagementSummaryProps = {
  likesCount: number;
  previewLikes: PostLike[];
};

export function PostEngagementSummary({
  likesCount,
  previewLikes,
}: PostEngagementSummaryProps) {
  const t = useTranslations("feed");

  if (likesCount === 0) return null;

  const uniqueTypes = [
    ...new Set(previewLikes.map((like) => like.likeType)),
  ].slice(0, 3);

  const firstName = previewLikes[0]?.author.displayName;

  return (
    <div className="flex items-center gap-1.5 px-0.5 pb-1 pt-2 text-xs text-muted">
      {uniqueTypes.length > 0 ? (
        <span className="flex shrink-0 -space-x-1">
          {uniqueTypes.map((type) => {
            const option = getReactionOption(type);
            const Icon = option.icon;
            return (
              <span
                key={type}
                className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-surface ring-1 ring-border"
              >
                <Icon
                  className={`h-2.5 w-2.5 ${option.colorClass}`}
                  aria-hidden
                />
              </span>
            );
          })}
        </span>
      ) : null}
      <span className="min-w-0 truncate tabular-nums">
        {firstName && likesCount === 1
          ? firstName
          : firstName && likesCount > 1
            ? t("reactions.andOthers", {
                name: firstName,
                count: likesCount - 1,
              })
            : formatEngagementCount(likesCount)}
      </span>
    </div>
  );
}
