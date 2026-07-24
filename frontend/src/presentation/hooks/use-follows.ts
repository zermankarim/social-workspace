"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { appContainer } from "@/modules/app.container";

export const followsQueryKey = ["follows"] as const;

export function followCountsKey(userId: string) {
  return [...followsQueryKey, "counts", userId] as const;
}

export function followStatusKey(userId: string) {
  return [...followsQueryKey, "status", userId] as const;
}

const DEFAULT_FOLLOWS_PAGE_SIZE = 20;

export function useFollowCounts(userId: string | undefined) {
  return useQuery({
    queryKey: followCountsKey(userId ?? ""),
    queryFn: () => appContainer.followService.getCounts(userId!),
    enabled: Boolean(userId),
  });
}

export function useIsFollowing(userId: string | undefined) {
  return useQuery({
    queryKey: followStatusKey(userId ?? ""),
    queryFn: () => appContainer.followService.isFollowing(userId!),
    enabled: Boolean(userId),
  });
}

export function useFollowers(
  userId: string | undefined,
  limit = DEFAULT_FOLLOWS_PAGE_SIZE,
) {
  return useInfiniteQuery({
    queryKey: [...followsQueryKey, "followers", userId ?? "", limit],
    queryFn: ({ pageParam }) =>
      appContainer.followService.getFollowers(userId!, pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    enabled: Boolean(userId),
  });
}

export function useFollowing(
  userId: string | undefined,
  limit = DEFAULT_FOLLOWS_PAGE_SIZE,
) {
  return useInfiniteQuery({
    queryKey: [...followsQueryKey, "following", userId ?? "", limit],
    queryFn: ({ pageParam }) =>
      appContainer.followService.getFollowing(userId!, pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    enabled: Boolean(userId),
  });
}

export function useFollowUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => appContainer.followService.follow(userId),
    onSuccess: (_data, userId) => {
      queryClient.setQueryData(followStatusKey(userId), true);
      void queryClient.invalidateQueries({
        queryKey: followCountsKey(userId),
      });
    },
  });
}

export function useUnfollowUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => appContainer.followService.unfollow(userId),
    onSuccess: (_data, userId) => {
      queryClient.setQueryData(followStatusKey(userId), false);
      void queryClient.invalidateQueries({
        queryKey: followCountsKey(userId),
      });
    },
  });
}
