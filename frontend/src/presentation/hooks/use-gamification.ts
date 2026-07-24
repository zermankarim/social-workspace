"use client";

import { useQuery } from "@tanstack/react-query";
import { appContainer } from "@/modules/app.container";

export const gamificationQueryKey = ["gamification", "state"] as const;

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
