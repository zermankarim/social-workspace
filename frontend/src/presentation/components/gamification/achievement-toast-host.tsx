"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { BADGE_DEFINITIONS_BY_KEY } from "@/presentation/config/badge-definitions";
import { BadgeIcon } from "@/presentation/components/gamification/badge-icon";
import { useAchievementToastStore } from "@/presentation/stores/achievement-toast.store";

const TOAST_TTL_MS = 7000;

export function AchievementToastHost() {
  const t = useTranslations("achievements");
  const router = useRouter();
  const toasts = useAchievementToastStore((state) => state.toasts);
  const dismissToast = useAchievementToastStore((state) => state.dismissToast);

  useEffect(() => {
    if (toasts.length === 0) return;
    const latest = toasts[toasts.length - 1];
    if (!latest) return;
    const timer = window.setTimeout(() => {
      dismissToast(latest.id);
    }, TOAST_TTL_MS);
    return () => window.clearTimeout(timer);
  }, [toasts, dismissToast]);

  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed top-[calc(4.5rem+env(safe-area-inset-top))] right-3 z-60 flex w-[min(22rem,calc(100vw-1.5rem))] flex-col gap-2"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const def = BADGE_DEFINITIONS_BY_KEY[toast.badgeKey];
        return (
          <button
            key={toast.id}
            type="button"
            className="pointer-events-auto flex items-center gap-3 rounded-xl border border-border bg-surface px-3.5 py-3 text-left shadow-card transition hover:bg-surface-muted"
            onClick={() => {
              dismissToast(toast.id);
              router.push("/achievements");
            }}
          >
            {def ? (
              <BadgeIcon
                category={def.category}
                tier={def.tier}
                earned
                size="sm"
              />
            ) : null}
            <span className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-primary">
                {t("unlockedToastTitle")}
              </p>
              <p className="truncate text-sm font-semibold text-foreground">
                {t(`badge.${toast.badgeKey}`)}
              </p>
            </span>
          </button>
        );
      })}
    </div>
  );
}
