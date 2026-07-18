"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { InfiniteData } from "@tanstack/react-query";
import type { Conversation } from "@/core/domain/entities/conversation.entity";
import type { Message } from "@/core/domain/entities/message.entity";
import type { PaginatedConversations } from "@/core/domain/entities/paginated-conversations.entity";
import type { PaginatedMessages } from "@/core/domain/entities/paginated-messages.entity";
import type { MessageResponseDto } from "@/infrastructure/api/dto/conversation-response.dto";
import { ConversationMapper } from "@/infrastructure/mappers/conversation.mapper";
import { PeerDeviceMissingError } from "@/core/application/errors/peer-device-missing.error";
import { MessagingCrypto } from "@/infrastructure/messaging/messaging-crypto";
import { appContainer } from "@/modules/app.container";
import { ensureRegisteredDeviceId } from "@/presentation/hooks/use-devices";

export const conversationsQueryKey = ["conversations"] as const;
export const conversationsListKey = [...conversationsQueryKey, "list"] as const;
export const conversationsUnreadTotalKey = [
  ...conversationsQueryKey,
  "unread-total",
] as const;

export const DEFAULT_CONVERSATION_PAGE_SIZE = 20;
export const DEFAULT_MESSAGE_PAGE_SIZE = 30;

export function conversationDetailKey(conversationId: string) {
  return [...conversationsQueryKey, "detail", conversationId] as const;
}

function messagesKey(conversationId: string) {
  return [...conversationsQueryKey, conversationId, "messages"] as const;
}

function invalidateConversations(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  void queryClient.invalidateQueries({ queryKey: conversationsQueryKey });
}

function prependMessageToCache(
  queryClient: ReturnType<typeof useQueryClient>,
  conversationId: string,
  message: Message,
) {
  queryClient.setQueryData<InfiniteData<PaginatedMessages>>(
    [...messagesKey(conversationId), DEFAULT_MESSAGE_PAGE_SIZE],
    (current) => {
      if (!current) return current;
      const [first, ...rest] = current.pages;
      if (!first) return current;
      if (first.data.some((item) => item.id === message.id)) {
        return current;
      }
      return {
        ...current,
        pages: [
          {
            ...first,
            data: [message, ...first.data],
            meta: {
              ...first.meta,
              total: first.meta.total + 1,
            },
          },
          ...rest,
        ],
      };
    },
  );
}

function replaceMessageInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  conversationId: string,
  message: Message,
) {
  queryClient.setQueryData<InfiniteData<PaginatedMessages>>(
    [...messagesKey(conversationId), DEFAULT_MESSAGE_PAGE_SIZE],
    (current) => {
      if (!current) return current;
      return {
        ...current,
        pages: current.pages.map((page) => ({
          ...page,
          data: page.data.map((item) =>
            item.id === message.id ? message : item,
          ),
        })),
      };
    },
  );
}

export function upsertMessageFromSocket(
  queryClient: ReturnType<typeof useQueryClient>,
  dto: MessageResponseDto,
) {
  const message = ConversationMapper.messageFromApi(dto);
  prependMessageToCache(queryClient, message.conversationId, message);
  void queryClient.invalidateQueries({ queryKey: conversationsListKey });
  void queryClient.invalidateQueries({ queryKey: conversationsUnreadTotalKey });
}

export function updateMessageFromSocket(
  queryClient: ReturnType<typeof useQueryClient>,
  dto: MessageResponseDto,
) {
  const message = ConversationMapper.messageFromApi(dto);
  replaceMessageInCache(queryClient, message.conversationId, message);
}

export function applyConversationReadFromSocket(
  queryClient: ReturnType<typeof useQueryClient>,
  payload: {
    conversationId: string;
    userId: string;
    lastReadAt: string;
  },
) {
  const lastReadAt = new Date(payload.lastReadAt);
  queryClient.setQueryData<Conversation | undefined>(
    conversationDetailKey(payload.conversationId),
    (current) => current?.withMemberLastRead(payload.userId, lastReadAt),
  );
  void queryClient.invalidateQueries({ queryKey: conversationsListKey });
  void queryClient.invalidateQueries({ queryKey: conversationsUnreadTotalKey });
}

export function useUnreadTotal(enabled = true) {
  return useQuery({
    queryKey: conversationsUnreadTotalKey,
    queryFn: () => appContainer.conversationService.getUnreadTotal(),
    enabled,
    staleTime: 15_000,
  });
}

export function useConversations(limit = DEFAULT_CONVERSATION_PAGE_SIZE) {
  return useInfiniteQuery({
    queryKey: [...conversationsListKey, limit],
    queryFn: ({ pageParam }) =>
      appContainer.conversationService.getMine(pageParam, limit),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
  });
}

export function useConversation(conversationId: string | undefined) {
  return useQuery({
    queryKey: conversationDetailKey(conversationId ?? ""),
    queryFn: () => appContainer.conversationService.getById(conversationId!),
    enabled: Boolean(conversationId),
  });
}

export function useConversationMessages(
  conversationId: string | undefined,
  limit = DEFAULT_MESSAGE_PAGE_SIZE,
) {
  return useInfiniteQuery({
    queryKey: [...messagesKey(conversationId ?? ""), limit],
    queryFn: ({ pageParam }) =>
      appContainer.conversationService.getMessages(
        conversationId!,
        pageParam,
        limit,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : undefined,
    enabled: Boolean(conversationId),
  });
}

export function useOpenDirectConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (peerUserId: string) =>
      appContainer.conversationService.openDirect(peerUserId),
    onSuccess: () => {
      invalidateConversations(queryClient);
    },
  });
}

export function useMarkConversationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (conversationId: string) =>
      appContainer.conversationService.markRead(conversationId),
    onSuccess: (_data, conversationId) => {
      void queryClient.invalidateQueries({
        queryKey: conversationDetailKey(conversationId),
      });
      void queryClient.invalidateQueries({ queryKey: conversationsListKey });
      void queryClient.invalidateQueries({
        queryKey: conversationsUnreadTotalKey,
      });
    },
  });
}

export type SendMessagePayload = {
  text: string;
  attachments?: Array<{
    url: string;
    ciphertextSize?: number | null;
  }>;
};

export function useSendMessage(conversationId: string, peerUserId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SendMessagePayload) => {
      const text = payload.text.trim();
      const attachments = payload.attachments ?? [];
      if (!text && attachments.length === 0) {
        throw new Error("EMPTY_MESSAGE");
      }

      const senderDeviceId = await ensureRegisteredDeviceId();
      const peerDevices =
        await appContainer.deviceService.getPublicByUserId(peerUserId);
      const peerDevice = peerDevices[0];
      if (!peerDevice) {
        throw new PeerDeviceMissingError();
      }
      const encrypted = await MessagingCrypto.encryptForPeerDevice(
        text,
        peerDevice,
      );
      return appContainer.conversationService.sendMessage(conversationId, {
        ciphertext: encrypted.ciphertext,
        nonce: encrypted.nonce,
        senderDeviceId,
        keyVersion: encrypted.keyVersion,
        attachments: attachments.length > 0 ? attachments : undefined,
      });
    },
    onSuccess: (message) => {
      prependMessageToCache(queryClient, conversationId, message);
      void queryClient.invalidateQueries({ queryKey: conversationsListKey });
    },
  });
}

export function useSetMessageReaction(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      messageId,
      emoji,
    }: {
      messageId: string;
      emoji: string | null;
    }) =>
      emoji
        ? appContainer.conversationService.setReaction(
            conversationId,
            messageId,
            emoji,
          )
        : appContainer.conversationService.removeReaction(
            conversationId,
            messageId,
          ),
    onSuccess: (message) => {
      replaceMessageInCache(queryClient, conversationId, message);
    },
  });
}

export type { PaginatedConversations };
