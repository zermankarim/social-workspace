"use client";

import { Loader2, Trophy } from "lucide-react";
import { useTranslations } from "next-intl";
import type { BadgeCategory } from "@/core/domain/entities/badge-catalog.entity";
import { FeedCard } from "@/presentation/components/feed/feed-card";
import { BadgeTile } from "@/presentation/components/gamification/badge-tile";
import { LevelBadge } from "@/presentation/components/gamification/level-badge";
import {
  useBadgeCatalog,
  useGamificationState,
} from "@/presentation/hooks/use-gamification";

const CATEGORY_ORDER: BadgeCategory[] = [
  "streak",
  "connections",
  "followers",
  "posts",
  "likesReceived",
  "commentsReceived",
  "endorsementsReceived",
  "applications",
  "experience",
  "points",
  "profile",
];

export function AchievementsPage() {
  const t = useTranslations("achievements");
  const { data: catalog, isLoading } = useBadgeCatalog();
  const { data: state } = useGamificationState();

  if (isLoading || !catalog) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden />
      </div>
    );
  }

  const byCategory = new Map<BadgeCategory, typeof catalog.badges>();
  for (const badge of catalog.badges) {
    const list = byCategory.get(badge.category) ?? [];
    list.push(badge);
    byCategory.set(badge.category, list);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-3 px-4 py-6">
      <FeedCard className="px-4 py-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" aria-hidden />
          <h1 className="text-lg font-semibold text-foreground">
            {t("title")}
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted">
          {t("earnedSummary", {
            earned: catalog.totalEarned,
            total: catalog.totalCount,
          })}
        </p>
        {state ? (
          <div className="mt-4">
            <LevelBadge
              level={state.level}
              pointsBalance={state.pointsBalance}
            />
          </div>
        ) : null}
      </FeedCard>

      {CATEGORY_ORDER.filter((category) => byCategory.has(category)).map(
        (category) => (
          <FeedCard key={category} className="px-4 py-4">
            <h2 className="text-sm font-semibold text-foreground">
              {t(`category.${category}`)}
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {byCategory.get(category)!.map((badge) => (
                <BadgeTile key={badge.key} badge={badge} />
              ))}
            </div>
          </FeedCard>
        ),
      )}
    </div>
  );
}
