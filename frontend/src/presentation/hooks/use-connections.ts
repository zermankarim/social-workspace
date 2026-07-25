"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { Connection } from "@/core/domain/entities/connection.entity";
import { ConnectionStatus } from "@/core/domain/enums/connection-status.enum";
import { appContainer } from "@/modules/app.container";

export const connectionsQueryKey = ["connections"] as const;
export const connectionsAcceptedKey = [
  ...connectionsQueryKey,
  "accepted",
] as const;
export const connectionsPendingKey = [
  ...connectionsQueryKey,
  "pending",
] as const;
export const connectionsOutgoingKey = [
  ...connectionsQueryKey,
  "outgoing",
] as const;

export const DEFAULT_CONNECTION_PAGE_SIZE = 20;
/** Used when resolving relation to another user without a dedicated status API. */
export const CONNECTION_RELATION_LOOKUP_LIMIT = 100;

function invalidateConnections(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: connectionsQueryKey });
  void queryClient.invalidateQueries({ queryKey: ["profile"] });
}

export function useAcceptedConnections(limit = DEFAULT_CONNECTION_PAGE_SIZE) {
  return useInfiniteQuery({
    queryKey: [...connectionsAcceptedKey, limit],
    queryFn: ({ pageParam }) =>
      appContainer.connectionService.getAccepted(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
  });
}

export function useUserConnections(
  userId: string | undefined,
  limit = DEFAULT_CONNECTION_PAGE_SIZE,
) {
  return useInfiniteQuery({
    queryKey: [...connectionsQueryKey, "by-user", userId, limit],
    queryFn: ({ pageParam }) =>
      appContainer.connectionService.getAcceptedByUserId(
        userId!,
        pageParam,
        limit,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    enabled: Boolean(userId),
  });
}

export function usePendingIncomingConnections(
  limit = DEFAULT_CONNECTION_PAGE_SIZE,
) {
  return useInfiniteQuery({
    queryKey: [...connectionsPendingKey, limit],
    queryFn: ({ pageParam }) =>
      appContainer.connectionService.getPendingIncoming(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
  });
}

export function usePendingOutgoingConnections(
  limit = DEFAULT_CONNECTION_PAGE_SIZE,
) {
  return useInfiniteQuery({
    queryKey: [...connectionsOutgoingKey, limit],
    queryFn: ({ pageParam }) =>
      appContainer.connectionService.getPendingOutgoing(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
  });
}

export type ConnectionRelationKind =
  "none" | "connected" | "pendingOutgoing" | "pendingIncoming";

export type ConnectionRelation = {
  kind: ConnectionRelationKind;
  connection: Connection | null;
};

function findRelation(
  otherUserId: string,
  accepted: Connection[],
  pending: Connection[],
  outgoing: Connection[],
): ConnectionRelation {
  const acceptedMatch = accepted.find((item) => item.involves(otherUserId));
  if (acceptedMatch?.status === ConnectionStatus.ACCEPTED) {
    return { kind: "connected", connection: acceptedMatch };
  }

  const outgoingMatch = outgoing.find((item) => item.involves(otherUserId));
  if (outgoingMatch) {
    return { kind: "pendingOutgoing", connection: outgoingMatch };
  }

  const incomingMatch = pending.find((item) => item.involves(otherUserId));
  if (incomingMatch) {
    return { kind: "pendingIncoming", connection: incomingMatch };
  }

  return { kind: "none", connection: null };
}

export function useConnectionRelation(otherUserId: string | undefined) {
  const enabled = Boolean(otherUserId);
  const limit = CONNECTION_RELATION_LOOKUP_LIMIT;

  const accepted = useQuery({
    queryKey: [...connectionsAcceptedKey, "relation", limit],
    queryFn: () => appContainer.connectionService.getAccepted(1, limit),
    enabled,
  });
  const pending = useQuery({
    queryKey: [...connectionsPendingKey, "relation", limit],
    queryFn: () => appContainer.connectionService.getPendingIncoming(1, limit),
    enabled,
  });
  const outgoing = useQuery({
    queryKey: [...connectionsOutgoingKey, "relation", limit],
    queryFn: () => appContainer.connectionService.getPendingOutgoing(1, limit),
    enabled,
  });

  const isLoading =
    enabled && (accepted.isLoading || pending.isLoading || outgoing.isLoading);

  const relation =
    otherUserId && accepted.data && pending.data && outgoing.data
      ? findRelation(
          otherUserId,
          accepted.data.data,
          pending.data.data,
          outgoing.data.data,
        )
      : ({ kind: "none", connection: null } satisfies ConnectionRelation);

  return {
    relation,
    isLoading,
    error: accepted.error ?? pending.error ?? outgoing.error,
  };
}

export function useCreateConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (addresseeId: string) =>
      appContainer.connectionService.create(addresseeId),
    onSuccess: () => invalidateConnections(queryClient),
  });
}

export function useAcceptConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => appContainer.connectionService.accept(id),
    onSuccess: () => invalidateConnections(queryClient),
  });
}

export function useRejectConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => appContainer.connectionService.reject(id),
    onSuccess: () => invalidateConnections(queryClient),
  });
}

export function useRemoveConnection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => appContainer.connectionService.remove(id),
    onSuccess: () => invalidateConnections(queryClient),
  });
}

export function useSuggestedConnections(limit = 5) {
  return useQuery({
    queryKey: [...connectionsQueryKey, "suggestions", limit],
    queryFn: () => appContainer.connectionService.getSuggestions(limit),
    staleTime: 5 * 60 * 1000,
  });
}

/** Summary totals for network sidebar (first page meta.total). */
export function useConnectionCounts() {
  const accepted = useQuery({
    queryKey: [...connectionsAcceptedKey, "count"],
    queryFn: () => appContainer.connectionService.getAccepted(1, 1),
  });
  const pending = useQuery({
    queryKey: [...connectionsPendingKey, "count"],
    queryFn: () => appContainer.connectionService.getPendingIncoming(1, 1),
  });
  const outgoing = useQuery({
    queryKey: [...connectionsOutgoingKey, "count"],
    queryFn: () => appContainer.connectionService.getPendingOutgoing(1, 1),
  });

  return {
    accepted: accepted.data?.meta.total ?? 0,
    pending: pending.data?.meta.total ?? 0,
    outgoing: outgoing.data?.meta.total ?? 0,
    isLoading: accepted.isLoading || pending.isLoading || outgoing.isLoading,
  };
}
