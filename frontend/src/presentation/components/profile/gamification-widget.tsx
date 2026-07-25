"use client";

import { Award, Coins, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { StreakInfoDialog } from "@/presentation/components/profile/streak-info-dialog";
import { StreakFlame } from "@/presentation/components/shared/streak-flame/streak-flame";
import { useGamificationState } from "@/presentation/hooks/use-gamification";

const BADGE_ICONS: Record<string, string> = {
  streak_7: "🔥",
  streak_30: "🔥",
  connections_50: "🤝",
  connections_100: "🤝",
  followers_100: "⭐",
};

export function GamificationWidget() {
  const t = useTranslations("profile");
  const stateQuery = useGamificationState();
  const state = stateQuery.data;
  const [showStreakInfo, setShowStreakInfo] = useState(false);

  if (!state) return null;

  return (
    <div>
      <h2 className="text-sm font-semibold text-foreground">
        {t("yourActivity")}
      </h2>

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

      {state.badges.length > 0 ? (
        <div className="mt-3">
          <div className="mb-1.5 flex items-center gap-1.5 text-muted">
            <Award className="h-3.5 w-3.5" aria-hidden />
            <span className="text-[11px] font-medium uppercase tracking-wide">
              {t("badges")}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {state.badges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary"
              >
                <span aria-hidden>{BADGE_ICONS[badge] ?? "🏅"}</span>
                {t(`badge.${badge}`)}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {showStreakInfo ? (
        <StreakInfoDialog onClose={() => setShowStreakInfo(false)} />
      ) : null}
    </div>
  );
}
