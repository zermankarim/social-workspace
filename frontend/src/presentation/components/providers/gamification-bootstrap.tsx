"use client";

import { useEffect, useRef } from "react";
import { useGamificationState } from "@/presentation/hooks/use-gamification";
import { useAchievementToastStore } from "@/presentation/stores/achievement-toast.store";
import { useAuthStore } from "@/presentation/stores/auth.store";

/** Records today's visit (streak) and syncs points/badges/level once per session. */
export function GamificationBootstrap() {
  const user = useAuthStore((state) => state.user);
  const { data } = useGamificationState(Boolean(user));
  const pushToasts = useAchievementToastStore((state) => state.pushToasts);
  const celebratedRef = useRef<GamificationStateSnapshot | null>(null);

  useEffect(() => {
    if (!data || data.newlyEarnedBadges.length === 0) return;
    if (celebratedRef.current === data) return;
    celebratedRef.current = data;
    pushToasts(data.newlyEarnedBadges);
  }, [data, pushToasts]);

  return null;
}

type GamificationStateSnapshot = NonNullable<
  ReturnType<typeof useGamificationState>["data"]
>;
