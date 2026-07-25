"use client";

import { useId } from "react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { StreakFlame } from "@/presentation/components/shared/streak-flame/streak-flame";
import { Button } from "@/presentation/components/ui/button";

type StreakInfoDialogProps = {
  onClose: () => void;
};

/** One representative streak count per tier — matches the thresholds in streak-flame.config. */
const TIER_SAMPLES = [
  { streak: 0, key: "tier0" },
  { streak: 1, key: "tier1" },
  { streak: 3, key: "tier2" },
  { streak: 7, key: "tier3" },
  { streak: 30, key: "tier4" },
] as const;

export function StreakInfoDialog({ onClose }: StreakInfoDialogProps) {
  const t = useTranslations("profile");
  const tCommon = useTranslations("common");
  const titleId = useId();

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-xl bg-surface shadow-card"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 id={titleId} className="text-sm font-semibold text-foreground">
            {t("streakInfoTitle")}
          </h2>
          <button
            type="button"
            className="inline-flex size-8 items-center justify-center rounded-full text-muted hover:bg-surface-muted hover:text-foreground"
            onClick={onClose}
            aria-label={tCommon("close")}
          >
            <X className="size-4" strokeWidth={2} />
          </button>
        </div>

        <div className="space-y-4 p-4">
          <p className="text-sm text-muted">{t("streakInfoIntro")}</p>

          <ul className="space-y-3">
            {TIER_SAMPLES.map(({ streak, key }) => (
              <li key={key} className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-muted">
                  <StreakFlame
                    streak={streak}
                    size="sm"
                    label={t(`streakTiers.${key}.name`)}
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="text-sm font-semibold text-foreground">
                      {t(`streakTiers.${key}.name`)}
                    </span>
                    <span className="text-xs text-muted">
                      {t(`streakTiers.${key}.range`)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted">
                    {t(`streakTiers.${key}.description`)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-end border-t border-border px-4 py-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            {tCommon("close")}
          </Button>
        </div>
      </div>
    </div>
  );
}
