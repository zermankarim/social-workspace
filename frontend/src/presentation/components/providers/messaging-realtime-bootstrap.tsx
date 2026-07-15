"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ConversationMapper } from "@/infrastructure/mappers/conversation.mapper";
import { MessagingCrypto } from "@/infrastructure/messaging/messaging-crypto";
import { messagingSocket } from "@/infrastructure/realtime/messaging-socket.client";
import { appContainer } from "@/modules/app.container";
import {
  applyConversationReadFromSocket,
  upsertMessageFromSocket,
} from "@/presentation/hooks/use-conversations";
import { formatMentionsForPreview } from "@/presentation/lib/mentions";
import { useAuthStore } from "@/presentation/stores/auth.store";
import { useMessagingUiStore } from "@/presentation/stores/messaging-ui.store";
import { usePresenceStore } from "@/presentation/stores/presence.store";

async function previewInboundPlaintext(
  message: ReturnType<typeof ConversationMapper.messageFromApi>,
): Promise<string> {
  try {
    const devices = await appContainer.deviceService.getPublicByUserId(
      message.senderId,
    );
    const device =
      (message.senderDeviceId
        ? devices.find((item) => item.id === message.senderDeviceId)
        : undefined) ?? devices[0];
    if (!device) return "New message";

    const result = await MessagingCrypto.decryptInbound(
      message.ciphertext,
      message.nonce,
      device.identityKeyPub,
    );
    if (!result.ok) return "New message";
    const text = formatMentionsForPreview(result.plaintext).trim();
    if (!text) return "New message";
    return text.length > 120 ? `${text.slice(0, 120)}…` : text;
  } catch {
    return "New message";
  }
}

/**
 * Global WS for signed-in users: inbox toasts, unread invalidation, presence.
 */
export function MessagingRealtimeBootstrap() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const setPresence = usePresenceStore((state) => state.setPresence);

  useEffect(() => {
    if (!user) {
      messagingSocket.disconnect();
      return;
    }

    messagingSocket.connect();

    const offMessage = messagingSocket.onMessageCreated((dto) => {
      upsertMessageFromSocket(queryClient, dto);

      const activeId = useMessagingUiStore.getState().activeConversationId;
      const isOwn = dto.senderId === user.id;
      const isActiveChat = activeId === dto.conversationId;

      if (isOwn || isActiveChat) return;

      const message = ConversationMapper.messageFromApi(dto);
      void previewInboundPlaintext(message).then((body) => {
        useMessagingUiStore.getState().pushToast({
          conversationId: dto.conversationId,
          title: message.sender.displayName,
          body,
        });
      });
    });

    const offRead = messagingSocket.onConversationRead((payload) => {
      applyConversationReadFromSocket(queryClient, payload);
    });

    const offPresence = messagingSocket.onUserPresence((payload) => {
      setPresence(payload.userId, payload.online, payload.lastSeenAt);
    });

    return () => {
      offMessage();
      offRead();
      offPresence();
    };
  }, [user, queryClient, setPresence]);

  return null;
}
