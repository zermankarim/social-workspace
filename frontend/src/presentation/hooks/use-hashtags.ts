"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { appContainer } from "@/modules/app.container";
import { useDebouncedValue } from "@/presentation/hooks/use-debounced-value";

export const hashtagsQueryKey = ["hashtags"] as const;

export function useTrendingHashtags(limit = 5) {
  return useQuery({
    queryKey: [...hashtagsQueryKey, "trending", limit],
    queryFn: () => appContainer.hashtagService.getTrending(limit),
    staleTime: 60_000,
  });
}

export function useHashtagSearch(query: string, enabled = true) {
  const debounced = useDebouncedValue(query, 250);

  return useQuery({
    queryKey: [...hashtagsQueryKey, "search", debounced],
    queryFn: () => appContainer.hashtagService.search(debounced, 1, 5),
    enabled: enabled && debounced.trim().length >= 1,
  });
}

export function useHashtagPosts(tag: string | null, limit = 20) {
  return useInfiniteQuery({
    queryKey: [...hashtagsQueryKey, "posts", tag, limit],
    queryFn: ({ pageParam }) =>
      appContainer.hashtagService.getPostsByTag(tag!, pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    enabled: Boolean(tag),
  });
}
