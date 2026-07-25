"use client";

import { Award, ChevronRight, Coins, Info, Trophy } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { StreakInfoDialog } from "@/presentation/components/profile/streak-info-dialog";
import { StreakFlame } from "@/presentation/components/shared/streak-flame/streak-flame";
import { BadgeIcon } from "@/presentation/components/gamification/badge-icon";
import { LevelBadge } from "@/presentation/components/gamification/level-badge";
import { BADGE_DEFINITIONS_BY_KEY } from "@/presentation/config/badge-definitions";
import { useGamificationState } from "@/presentation/hooks/use-gamification";

const COMPACT_BADGE_COUNT = 4;

export function GamificationWidget() {
  const t = useTranslations("profile");
  const tAchievements = useTranslations("achievements");
  const stateQuery = useGamificationState();
  const state = stateQuery.data;
  const [showStreakInfo, setShowStreakInfo] = useState(false);

  if (!state) return null;

  const recentBadges = state.badges.slice(-COMPACT_BADGE_COUNT).reverse();

  return (
    <div>
      <h2 className="text-sm font-semibold text-foreground">
        {t("yourActivity")}
      </h2>

      <div className="mt-3">
        <LevelBadge level={state.level} pointsBalance={state.pointsBalance} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-md bg-surface-muted px-3 py-2">
          <div className="flex items-center gap-1.5 text-muted">
            <Coins className="h-3.5 w-3.5" aria-hidden />
            <span className="text-[11px] font-medium uppercase tracking-wide">
              {t("points")}
            </span>
          </div>
          <p className="mt-0.5 text-lg font-semibold text-foreground">
            {state.pointsBalance}
          </p>
        </div>

        <div className="rounded-md bg-surface-muted px-3 py-2">
          <div className="flex items-center justify-between gap-1 text-muted">
            <div className="flex min-w-0 items-center gap-1.5">
              <StreakFlame
                streak={state.currentStreak}
                size="sm"
                label={t("streakDays", { count: state.currentStreak })}
              />
              <span className="text-[11px] font-medium uppercase tracking-wide">
                {t("streak")}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowStreakInfo(true)}
              className="shrink-0 rounded-full p-0.5 text-muted transition-colors hover:bg-surface hover:text-foreground"
              aria-label={t("streakInfoLabel")}
            >
              <Info className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
          <p className="mt-0.5 text-lg font-semibold text-foreground">
            {t("streakDays", { count: state.currentStreak })}
          </p>
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>{t("profileComplete")}</span>
          <span>{state.profileCompletionPercent}%</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${state.profileCompletionPercent}%` }}
          />
        </div>
      </div>

      <div className="mt-3">
        <div className="mb-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-muted">
            <Award className="h-3.5 w-3.5" aria-hidden />
            <span className="text-[11px] font-medium uppercase tracking-wide">
              {t("badges")}
            </span>
          </div>
          <Link
            href="/achievements"
            className="inline-flex items-center gap-0.5 text-[11px] font-medium text-primary hover:underline"
          >
            {tAchievements("viewAll")}
            <ChevronRight className="h-3 w-3" aria-hidden />
          </Link>
        </div>

        {recentBadges.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {recentBadges.map((badgeKey) => {
              const def = BADGE_DEFINITIONS_BY_KEY[badgeKey];
              if (!def) return null;
              return (
                <Link
                  key={badgeKey}
                  href="/achievements"
                  className="flex flex-col items-center gap-1"
                  title={tAchievements(`badge.${badgeKey}`)}
                >
                  <BadgeIcon
                    category={def.category}
                    tier={def.tier}
                    earned
                    size="sm"
                  />
                </Link>
              );
            })}
          </div>
        ) : (
          <Link
            href="/achievements"
            className="flex items-center gap-2 rounded-md bg-surface-muted px-3 py-2 text-xs text-muted hover:text-foreground"
          >
            <Trophy className="h-3.5 w-3.5" aria-hidden />
            {tAchievements("noneYet")}
          </Link>
        )}
      </div>

      {showStreakInfo ? (
        <StreakInfoDialog onClose={() => setShowStreakInfo(false)} />
      ) : null}
    </div>
  );
}
