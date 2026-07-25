"use client";

import { useQuery } from "@tanstack/react-query";
import type {
  LeaderboardPeriod,
  LeaderboardScope,
} from "@/core/domain/entities/leaderboard.entity";
import { appContainer } from "@/modules/app.container";

export const gamificationQueryKey = ["gamification", "state"] as const;
export const badgeCatalogQueryKey = ["gamification", "badges"] as const;
export const leaderboardQueryKey = ["gamification", "leaderboard"] as const;

/**
 * Check-in is idempotent per calendar day, so every mount (app bootstrap,
 * profile widget) can safely call it — React Query dedupes concurrent calls
 * and this cache is shared across all consumers.
 */
export function useGamificationState(enabled = true) {
  return useQuery({
    queryKey: gamificationQueryKey,
    queryFn: () => appContainer.gamificationService.checkIn(),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useBadgeCatalog(enabled = true) {
  return useQuery({
    queryKey: badgeCatalogQueryKey,
    queryFn: () => appContainer.gamificationService.getBadgeCatalog(),
    enabled,
    staleTime: 60 * 1000,
  });
}

export function useLeaderboard(
  scope: LeaderboardScope,
  period: LeaderboardPeriod,
) {
  return useQuery({
    queryKey: [...leaderboardQueryKey, scope, period],
    queryFn: () =>
      appContainer.gamificationService.getLeaderboard(scope, period),
    staleTime: 60 * 1000,
  });
}
