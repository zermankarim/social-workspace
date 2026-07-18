"use client";

import Link from "next/link";
import { Bookmark, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import type { User } from "@/core/domain/entities/user.entity";
import { FeedCard } from "@/presentation/components/feed/feed-card";
import { UserNameWithBadge } from "@/presentation/components/ui/user-name-with-badge";
import { useImpressionsSummary } from "@/presentation/hooks/use-impressions";
import { useMyProfileViewersCount } from "@/presentation/hooks/use-profile-views";
import { formatEngagementCount } from "@/presentation/lib/format-engagement-count";

type FeedLeftRailProps = {
  user: User;
};

export function FeedLeftRail({ user }: FeedLeftRailProps) {
  const t = useTranslations("feed");
  const viewersQuery = useMyProfileViewersCount(true);
  const impressionsQuery = useImpressionsSummary(true);
  const formatStat = (query: {
    isPending: boolean;
    data: number | undefined;
  }) =>
    query.isPending && query.data === undefined
      ? "—"
      : formatEngagementCount(query.data ?? 0);

  return (
    <aside className="space-y-2">
      <FeedCard className="overflow-hidden">
        <div
          className="h-14 bg-gradient-to-r from-primary to-primary-hover bg-cover bg-center"
          style={
            user.coverUrl
              ? { backgroundImage: `url(${user.coverUrl})` }
              : undefined
          }
        />
        <div className="-mt-8 px-3 pb-3 text-center">
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt=""
              className="mx-auto h-16 w-16 rounded-full border-2 border-surface object-cover"
            />
          ) : (
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-surface bg-primary-soft text-lg font-semibold text-primary">
              {user.initials}
            </div>
          )}
          <Link
            href="/profile"
            className="mt-2 inline-flex max-w-full items-center justify-center gap-1 text-sm font-semibold text-foreground hover:underline"
          >
            <UserNameWithBadge
              name={user.displayName}
              showAdminBadge={user.isAdmin()}
              nameClassName="text-sm font-semibold text-foreground"
            />
          </Link>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted">
            {user.headline?.trim() || t("headlinePlaceholder")}
          </p>
          {user.location?.label || user.location?.city ? (
            <p className="mt-2 inline-flex items-center justify-center gap-1 text-xs text-muted">
              <MapPin className="h-3 w-3" aria-hidden />
              {user.location.label ??
                [user.location.city, user.location.country]
                  .filter(Boolean)
                  .join(", ")}
            </p>
          ) : null}
        </div>
        <div className="border-t border-border px-3 py-2 text-xs">
          <div className="flex items-center justify-between py-1">
            <span className="text-muted">{t("profileViewers")}</span>
            <span className="font-semibold text-primary">
              {formatStat(viewersQuery)}
            </span>
          </div>
          <div className="flex items-center justify-between py-1">
            <span className="text-muted">{t("postImpressions")}</span>
            <span className="font-semibold text-primary">
              {formatStat(impressionsQuery)}
            </span>
          </div>
        </div>
      </FeedCard>

      <FeedCard className="px-3 py-2">
        <Link
          href="/saved"
          className="flex w-full items-center gap-2 rounded py-1.5 text-left text-xs font-semibold text-foreground transition-colors hover:text-primary"
        >
          <Bookmark className="h-4 w-4 text-primary" aria-hidden />
          {t("savedItems")}
        </Link>
      </FeedCard>
    </aside>
  );
}
