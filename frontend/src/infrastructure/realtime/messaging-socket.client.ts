import { io, type Socket } from "socket.io-client";
import type { MessageResponseDto } from "@/infrastructure/api/dto/conversation-response.dto";
import type { NotificationResponseDto } from "@/infrastructure/api/dto/notification-response.dto";
import { WsConfig } from "@/infrastructure/config/ws.config";

export type ConversationReadPayload = {
  conversationId: string;
  userId: string;
  lastReadAt: string;
};

export type UserPresencePayload = {
  userId: string;
  online: boolean;
  lastSeenAt: string | null;
};

export type MessageCreatedHandler = (message: MessageResponseDto) => void;
export type ConversationReadHandler = (
  payload: ConversationReadPayload,
) => void;
export type UserPresenceHandler = (payload: UserPresencePayload) => void;
export type NotificationCreatedHandler = (
  notification: NotificationResponseDto,
) => void;

/**
 * Singleton Socket.IO client for `/ws`. Auth via access_token cookie
 * (`withCredentials: true`). User room is joined server-side on connect.
 */
export class MessagingSocketClient {
  private static instance: MessagingSocketClient | null = null;

  private socket: Socket | null = null;
  private joinedConversations = new Set<string>();

  static getInstance(): MessagingSocketClient {
    if (!MessagingSocketClient.instance) {
      MessagingSocketClient.instance = new MessagingSocketClient();
    }
    return MessagingSocketClient.instance;
  }

  connect(): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }
    if (this.socket) {
      this.socket.connect();
      return this.socket;
    }

    this.socket = io(`${WsConfig.origin}${WsConfig.namespace}`, {
      withCredentials: true,
      transports: ["websocket", "polling"],
      autoConnect: true,
    });

    this.socket.on("connect", () => {
      for (const conversationId of this.joinedConversations) {
        this.socket?.emit("conversation:join", { conversationId });
      }
    });

    return this.socket;
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
    this.joinedConversations.clear();
  }

  get isConnected(): boolean {
    return Boolean(this.socket?.connected);
  }

  async joinConversation(conversationId: string): Promise<void> {
    this.joinedConversations.add(conversationId);
    const socket = this.connect();

    if (!socket.connected) {
      await new Promise<void>((resolve, reject) => {
        const onConnect = () => {
          cleanup();
          resolve();
        };
        const onError = () => {
          cleanup();
          reject(new Error("Socket connection failed"));
        };
        const cleanup = () => {
          socket.off("connect", onConnect);
          socket.off("connect_error", onError);
        };
        socket.once("connect", onConnect);
        socket.once("connect_error", onError);
      });
    }

    await new Promise<void>((resolve, reject) => {
      socket
        .timeout(8000)
        .emit(
          "conversation:join",
          { conversationId },
          (err: Error | null, response?: { ok?: boolean }) => {
            if (err) {
              reject(err);
              return;
            }
            if (!response?.ok) {
              reject(new Error("Failed to join conversation room"));
              return;
            }
            resolve();
          },
        );
    });
  }

  async leaveConversation(conversationId: string): Promise<void> {
    this.joinedConversations.delete(conversationId);
    if (!this.socket?.connected) return;
    this.socket.emit("conversation:leave", { conversationId });
  }

  onMessageCreated(handler: MessageCreatedHandler): () => void {
    const socket = this.connect();
    socket.on("message:created", handler);
    return () => {
      socket.off("message:created", handler);
    };
  }

  onMessageUpdated(handler: MessageCreatedHandler): () => void {
    const socket = this.connect();
    socket.on("message:updated", handler);
    return () => {
      socket.off("message:updated", handler);
    };
  }

  onConversationRead(handler: ConversationReadHandler): () => void {
    const socket = this.connect();
    socket.on("conversation:read", handler);
    return () => {
      socket.off("conversation:read", handler);
    };
  }

  onUserPresence(handler: UserPresenceHandler): () => void {
    const socket = this.connect();
    socket.on("user:presence", handler);
    return () => {
      socket.off("user:presence", handler);
    };
  }

  onNotificationCreated(handler: NotificationCreatedHandler): () => void {
    const socket = this.connect();
    socket.on("notification:created", handler);
    return () => {
      socket.off("notification:created", handler);
    };
  }
}

export const messagingSocket = MessagingSocketClient.getInstance();
