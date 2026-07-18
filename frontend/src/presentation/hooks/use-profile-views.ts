"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { appContainer } from "@/modules/app.container";

export const profileViewsQueryKey = ["profile-views"] as const;
export const profileViewsCountQueryKey = [
  ...profileViewsQueryKey,
  "count",
] as const;

export function useMyProfileViewersCount(enabled = true) {
  return useQuery({
    queryKey: profileViewsCountQueryKey,
    queryFn: () => appContainer.profileViewService.getMyViewersCount(),
    enabled,
    staleTime: 60_000,
  });
}

export function useRecordProfileView(profileId: string | undefined) {
  return useMutation({
    mutationFn: () => appContainer.profileViewService.recordView(profileId!),
  });
}
