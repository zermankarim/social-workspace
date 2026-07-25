"use client";

import { useTranslations } from "next-intl";
import type { LevelProgress } from "@/core/domain/entities/level-progress.entity";

type LevelBadgeProps = {
  level: LevelProgress;
  pointsBalance: number;
  compact?: boolean;
};

export function LevelBadge({ level, pointsBalance, compact }: LevelBadgeProps) {
  const t = useTranslations("achievements");

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-semibold text-primary">
        {t(`level.${level.key}`)}
      </span>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-foreground">
          {t(`level.${level.key}`)}
        </span>
        <span className="text-muted">
          {level.nextLevelKey
            ? t("pointsToNextLevel", {
                points: Math.max(
                  0,
                  (level.nextLevelPoints ?? 0) - pointsBalance,
                ),
                nextLevel: t(`level.${level.nextLevelKey}`),
              })
            : t("maxLevel")}
        </span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${level.progressPercent}%` }}
        />
      </div>
    </div>
  );
}
