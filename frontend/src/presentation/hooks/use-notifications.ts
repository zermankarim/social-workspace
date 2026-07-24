"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";
import type { NotificationResponseDto } from "@/infrastructure/api/dto/notification-response.dto";
import { NotificationMapper } from "@/infrastructure/mappers/notification.mapper";
import type { PaginatedNotifications } from "@/core/domain/entities/paginated-notifications.entity";
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
    // Realtime push (see upsertNotificationFromSocket) delivers instantly; this is just a safety net.
    refetchInterval: 300_000,
  });
}

/** Applied when `notification:created` arrives over the existing messaging socket. */
export function upsertNotificationFromSocket(
  queryClient: ReturnType<typeof useQueryClient>,
  dto: NotificationResponseDto,
) {
  const notification = NotificationMapper.fromApi(dto);

  queryClient.setQueryData<InfiniteData<PaginatedNotifications>>(
    [...notificationsQueryKey, "list", DEFAULT_NOTIFICATIONS_PAGE_SIZE],
    (current) => {
      if (!current) return current;
      const [first, ...rest] = current.pages;
      if (!first) return current;
      if (first.data.some((item) => item.id === notification.id)) {
        return current;
      }
      return {
        ...current,
        pages: [
          {
            ...first,
            data: [notification, ...first.data],
            meta: { ...first.meta, total: first.meta.total + 1 },
          },
          ...rest,
        ],
      };
    },
  );

  queryClient.setQueryData<number>(
    notificationsUnreadQueryKey,
    (current) => (current ?? 0) + 1,
  );
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
