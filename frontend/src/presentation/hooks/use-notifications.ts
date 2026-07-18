"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { appContainer } from "@/modules/app.container";

export const notificationsQueryKey = ["notifications"] as const;
export const notificationsUnreadQueryKey = [
  ...notificationsQueryKey,
  "unread-count",
] as const;

const DEFAULT_NOTIFICATIONS_PAGE_SIZE = 20;

export function useNotifications(limit = DEFAULT_NOTIFICATIONS_PAGE_SIZE) {
  return useInfiniteQuery({
    queryKey: [...notificationsQueryKey, "list", limit],
    queryFn: ({ pageParam }) =>
      appContainer.notificationService.list(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
  });
}

export function useUnreadNotificationsCount(enabled = true) {
  return useQuery({
    queryKey: notificationsUnreadQueryKey,
    queryFn: () => appContainer.notificationService.getUnreadCount(),
    enabled,
    refetchInterval: 60_000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => appContainer.notificationService.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => appContainer.notificationService.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationsQueryKey });
    },
  });
}
