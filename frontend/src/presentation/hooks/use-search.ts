"use client";

import { useQuery } from "@tanstack/react-query";
import { appContainer } from "@/modules/app.container";

export function usePeopleSearch(q: string, limit = 10) {
  const trimmed = q.trim();
  return useQuery({
    queryKey: ["search", "people", trimmed, limit],
    queryFn: () => appContainer.profileService.searchUsers(trimmed, 1, limit),
    enabled: trimmed.length >= 1,
  });
}

export function usePostSearch(q: string, limit = 10) {
  const trimmed = q.trim();
  return useQuery({
    queryKey: ["search", "posts", trimmed, limit],
    queryFn: () => appContainer.postService.search(trimmed, 1, limit),
    enabled: trimmed.length >= 1,
  });
}

export function useHashtagResults(q: string, limit = 10) {
  const trimmed = q.trim();
  return useQuery({
    queryKey: ["search", "hashtags", trimmed, limit],
    queryFn: () => appContainer.hashtagService.search(trimmed, 1, limit),
    enabled: trimmed.length >= 1,
  });
}
