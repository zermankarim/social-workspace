"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Copy, Loader2, MessageSquare, Send, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import { PeerDeviceMissingError } from "@/core/application/errors/peer-device-missing.error";
import type { Post } from "@/core/domain/entities/post.entity";
import { MessagingCrypto } from "@/infrastructure/messaging/messaging-crypto";
import { appContainer } from "@/modules/app.container";
import {
  conversationsListKey,
  useConversations,
} from "@/presentation/hooks/use-conversations";
import { ensureRegisteredDeviceId } from "@/presentation/hooks/use-devices";
import { useAuthStore } from "@/presentation/stores/auth.store";

type SharePostDialogProps = {
  post: Post;
  onClose: () => void;
};

export function SharePostDialog({ post, onClose }: SharePostDialogProps) {
  const t = useTranslations("feed");
  const tCommon = useTranslations("common");
  const titleId = useId();
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  const conversationsQuery = useConversations(20);
  const [copied, setCopied] = useState(false);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return `/feed/posts/${post.id}`;
    return `${window.location.origin}/feed/posts/${post.id}`;
  }, [post.id]);

  const shareText = t("shareMessage", { url: shareUrl });

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const conversations = useMemo(() => {
    const pages = conversationsQuery.data?.pages ?? [];
    return pages.flatMap((page) => page.data);
  }, [conversationsQuery.data]);

  const handleCopy = async () => {
    setError(null);
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setError(t("shareCopyFailed"));
    }
  };

  const sendEncrypted = async (conversationId: string, peerUserId: string) => {
    const senderDeviceId = await ensureRegisteredDeviceId();
    // Fan out to every device of both conversation members (see useSendMessage).
    const [peerDevices, myDevices] = await Promise.all([
      appContainer.deviceService.getPublicByUserId(peerUserId),
      appContainer.deviceService.getMine(),
    ]);
    const targetDevices = [...peerDevices, ...myDevices];
    if (targetDevices.length === 0) throw new PeerDeviceMissingError();

    const recipientKeys = await Promise.all(
      targetDevices.map(async (device) => {
        const encrypted = await MessagingCrypto.encryptForPeerDevice(
          shareText,
          device,
        );
        return {
          deviceId: device.id,
          ciphertext: encrypted.ciphertext,
          nonce: encrypted.nonce,
          keyVersion: encrypted.keyVersion,
        };
      }),
    );

    await appContainer.conversationService.sendMessage(conversationId, {
      senderDeviceId,
      recipientKeys,
    });
  };

  const handleSendToConversation = async (conversationId: string) => {
    if (!currentUser) return;
    setError(null);
    setSendingId(conversationId);
    try {
      const conversation =
        conversations.find((item) => item.id === conversationId) ??
        (await appContainer.conversationService.getById(conversationId));
      const peer = conversation.peer(currentUser.id);
      if (!peer) throw new Error("NO_PEER");
      await sendEncrypted(conversation.id, peer.id);
      void queryClient.invalidateQueries({ queryKey: conversationsListKey });
      onClose();
    } catch (sendError) {
      setError(
        sendError instanceof PeerDeviceMissingError
          ? t("sharePeerDeviceMissing")
          : sendError instanceof ApiError
            ? sendError.message
            : t("shareFailed"),
      );
    } finally {
      setSendingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 px-3 py-8 sm:items-center sm:py-10">
      <button
        type="button"
        aria-label={tCommon("close")}
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex w-full max-w-[420px] flex-col overflow-hidden rounded-xl bg-surface shadow-[0_8px_28px_rgba(0,0,0,0.28)]"
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 id={titleId} className="text-lg font-semibold text-foreground">
            {t("send")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
            aria-label={tCommon("close")}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <div className="space-y-3 px-4 py-4">
          <button
            type="button"
            onClick={() => void handleCopy()}
            className="flex w-full items-center gap-3 rounded-md border border-border px-3 py-2.5 text-left hover:bg-surface-muted"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-primary">
              {copied ? (
                <Check className="h-4 w-4" aria-hidden />
              ) : (
                <Copy className="h-4 w-4" aria-hidden />
              )}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-foreground">
                {copied ? t("linkCopied") : t("copyLink")}
              </span>
              <span className="block truncate text-xs text-muted">
                {shareUrl}
              </span>
            </span>
          </button>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
              {t("sendInMessage")}
            </p>
            {conversationsQuery.isLoading ? (
              <div className="flex justify-center py-6">
                <Loader2
                  className="h-5 w-5 animate-spin text-primary"
                  aria-hidden
                />
              </div>
            ) : conversations.length === 0 ? (
              <p className="rounded-md bg-surface-muted px-3 py-4 text-center text-sm text-muted">
                {t("shareNoConversations")}
              </p>
            ) : (
              <ul className="max-h-64 space-y-1 overflow-y-auto">
                {conversations.map((conversation) => {
                  const peer = currentUser
                    ? conversation.peer(currentUser.id)
                    : null;
                  if (!peer) return null;
                  return (
                    <li key={conversation.id}>
                      <button
                        type="button"
                        disabled={sendingId !== null}
                        onClick={() =>
                          void handleSendToConversation(conversation.id)
                        }
                        className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-left hover:bg-surface-muted disabled:opacity-60"
                      >
                        {peer.avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={peer.avatarUrl}
                            alt=""
                            className="h-9 w-9 rounded-full object-cover"
                          />
                        ) : (
                          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                            {peer.initials}
                          </span>
                        )}
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-foreground">
                            {peer.displayName}
                          </span>
                          {peer.headline ? (
                            <span className="block truncate text-xs text-muted">
                              {peer.headline}
                            </span>
                          ) : null}
                        </span>
                        {sendingId === conversation.id ? (
                          <Loader2
                            className="h-4 w-4 animate-spin text-primary"
                            aria-hidden
                          />
                        ) : (
                          <Send className="h-4 w-4 text-muted" aria-hidden />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {error ? <p className="text-sm text-danger">{error}</p> : null}

          <p className="inline-flex items-center gap-1.5 text-[11px] text-muted">
            <MessageSquare className="h-3.5 w-3.5" aria-hidden />
            {t("shareHint")}
          </p>
        </div>
      </div>
    </div>
  );
}
