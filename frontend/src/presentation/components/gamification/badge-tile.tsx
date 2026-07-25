"use client";

import { useTranslations } from "next-intl";
import type { BadgeCatalogItem } from "@/core/domain/entities/badge-catalog.entity";
import { BadgeIcon } from "@/presentation/components/gamification/badge-icon";
import { formatRelativeTime } from "@/presentation/lib/format-relative-time";

type BadgeTileProps = {
  badge: BadgeCatalogItem;
};

export function BadgeTile({ badge }: BadgeTileProps) {
  const t = useTranslations("achievements");

  return (
    <div
      className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-center transition-colors ${
        badge.earned
          ? "border-border bg-surface"
          : "border-dashed border-border bg-surface-muted/40"
      }`}
    >
      <BadgeIcon
        category={badge.category}
        tier={badge.tier}
        earned={badge.earned}
      />
      <div className="min-w-0">
        <p
          className={`text-xs font-semibold ${badge.earned ? "text-foreground" : "text-muted"}`}
        >
          {t(`badge.${badge.key}`)}
        </p>
        <p className="mt-0.5 text-[10px] uppercase tracking-wide text-muted">
          {t(`tier.${badge.tier}`)}
        </p>
      </div>

      {badge.earned ? (
        <p className="text-[10px] text-muted">
          {badge.earnedAt ? formatRelativeTime(badge.earnedAt) : null}
        </p>
      ) : (
        <div className="w-full">
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-muted">
            <div
              className="h-full rounded-full bg-primary/70 transition-all"
              style={{ width: `${badge.progressPercent}%` }}
            />
          </div>
          <p className="mt-1 text-[10px] text-muted">
            {t("progress", {
              current: Math.min(badge.progressCurrent, badge.threshold),
              target: badge.threshold,
            })}
          </p>
        </div>
      )}
    </div>
  );
}
