"use client";

import { useEffect } from "react";
import { messagingSocket } from "@/infrastructure/realtime/messaging-socket.client";
import { useMessagingUiStore } from "@/presentation/stores/messaging-ui.store";

/**
 * Joins the Socket.IO conversation room while the chat is open.
 * Global inbox events are handled by MessagingRealtimeBootstrap.
 */
export function useMessagingSocket(conversationId: string | undefined) {
  const setActiveConversationId = useMessagingUiStore(
    (state) => state.setActiveConversationId,
  );

  useEffect(() => {
    setActiveConversationId(conversationId ?? null);
    return () => {
      setActiveConversationId(null);
    };
  }, [conversationId, setActiveConversationId]);

  useEffect(() => {
    if (!conversationId) return;

    void messagingSocket.joinConversation(conversationId).catch(() => {
      // Room join failures are non-fatal; REST still works.
    });

    return () => {
      void messagingSocket.leaveConversation(conversationId);
    };
  }, [conversationId]);
}
