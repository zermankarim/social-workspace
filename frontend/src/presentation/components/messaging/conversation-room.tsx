"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCheck,
  ImagePlus,
  Loader2,
  MessageSquarePlus,
  Send,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import { isPeerDeviceMissingError } from "@/core/application/errors/peer-device-missing.error";
import type { Message } from "@/core/domain/entities/message.entity";
import type { UserDevicePublic } from "@/core/domain/entities/user-device-public.entity";
import { appContainer } from "@/modules/app.container";
import { MessageAttachmentsGallery } from "@/presentation/components/messaging/message-attachments-gallery";
import { MessageReactionsBar } from "@/presentation/components/messaging/message-reactions-bar";
import { Button } from "@/presentation/components/ui/button";
import { EmojiPickerButton } from "@/presentation/components/ui/emoji-picker-button";
import { MentionText } from "@/presentation/components/ui/mention-text";
import { MentionTextarea } from "@/presentation/components/ui/mention-textarea";
import {
  useConversation,
  useConversationMessages,
  useMarkConversationRead,
  useSendMessage,
} from "@/presentation/hooks/use-conversations";
import { useDecryptedMessageBody } from "@/presentation/hooks/use-decrypted-message";
import { usePeerDevices } from "@/presentation/hooks/use-devices";
import { useEmojiInsert } from "@/presentation/hooks/use-emoji-insert";
import { useMessagingSocket } from "@/presentation/hooks/use-messaging-socket";
import { getPastedImageFiles } from "@/presentation/lib/clipboard-images";
import { usePresenceStore } from "@/presentation/stores/presence.store";
import { MESSAGE_TEXT_MAX_LENGTH } from "@/presentation/validations/message.validation";

const MAX_ATTACHMENTS = 10;
const ACCEPT_IMAGES = "image/jpeg,image/png,image/webp,image/gif";

type PendingAttachment = {
  id: string;
  file: File;
  previewUrl: string;
};

function formatTime(date: Date): string {
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function MessageBubble({
  message,
  isOwn,
  currentUserId,
  conversationId,
  peerDevices,
  peerLastReadAt,
}: {
  message: Message;
  isOwn: boolean;
  currentUserId: string;
  conversationId: string;
  peerDevices: UserDevicePublic[] | undefined;
  peerLastReadAt: Date | null;
}) {
  const t = useTranslations("messaging");
  const decrypted = useDecryptedMessageBody(
    message,
    currentUserId,
    peerDevices,
  );

  let statusBody: string | null = null;
  let mentionBody: string | null = null;
  if (message.isDeleted) {
    statusBody = t("messageDeleted");
  } else if (decrypted.status === "loading") {
    statusBody = "…";
  } else if (decrypted.status === "error") {
    statusBody =
      decrypted.reason === "missing-keys"
        ? t("decryptMissingKeys")
        : t("decryptFailed");
  } else if (decrypted.text.trim()) {
    mentionBody = decrypted.text;
  }

  const isRead =
    isOwn &&
    peerLastReadAt !== null &&
    peerLastReadAt.getTime() >= message.createdAt.getTime();

  const hasAttachments = !message.isDeleted && message.attachments.length > 0;
  const hasBody = Boolean(statusBody || mentionBody);

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[min(85%,28rem)]">
        <div
          className={`rounded-2xl px-3 py-2 text-[13px] leading-snug sm:text-sm ${
            isOwn
              ? "rounded-br-md bg-primary text-primary-foreground"
              : "rounded-bl-md bg-surface-muted text-foreground"
          }`}
        >
          {!isOwn ? (
            <p className="mb-1 text-[11px] font-semibold tracking-wide text-foreground/70">
              {message.sender.displayName}
            </p>
          ) : null}
          {statusBody ? (
            <p className="whitespace-pre-wrap break-words">{statusBody}</p>
          ) : null}
          {mentionBody ? (
            <p className="whitespace-pre-wrap break-words">
              <MentionText
                text={mentionBody}
                mentionClassName={
                  isOwn
                    ? "font-semibold text-primary-foreground underline decoration-primary-foreground/55 hover:decoration-primary-foreground"
                    : undefined
                }
              />
            </p>
          ) : null}
          {hasAttachments ? (
            <div className={hasBody ? "mt-1.5" : undefined}>
              <MessageAttachmentsGallery
                attachments={message.attachments}
                tone={isOwn ? "own" : "peer"}
              />
            </div>
          ) : null}
          <p
            className={`mt-1 flex items-center gap-1 text-[10px] leading-none ${
              isOwn ? "justify-end text-primary-foreground/75" : "text-muted"
            }`}
          >
            <span>{formatTime(message.createdAt)}</span>
            {isOwn ? (
              isRead ? (
                <CheckCheck
                  className="size-3.5 shrink-0"
                  strokeWidth={2.25}
                  aria-label={t("readReceiptRead")}
                />
              ) : (
                <Check
                  className="size-3.5 shrink-0"
                  strokeWidth={2.25}
                  aria-label={t("readReceiptSent")}
                />
              )
            ) : null}
          </p>
        </div>
        <MessageReactionsBar
          message={message}
          conversationId={conversationId}
          currentUserId={currentUserId}
          isOwn={isOwn}
        />
      </div>
    </div>
  );
}

type ConversationRoomProps = {
  conversationId: string;
  currentUserId: string;
};

export function ConversationRoom({
  conversationId,
  currentUserId,
}: ConversationRoomProps) {
  const t = useTranslations("messaging");
  const tCommon = useTranslations("common");
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState<PendingAttachment[]>([]);
  const [sendError, setSendError] = useState<unknown>(null);
  const [uploading, setUploading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const composerRef = useRef<HTMLTextAreaElement | null>(null);
  const insertEmoji = useEmojiInsert(
    composerRef,
    draft,
    setDraft,
    MESSAGE_TEXT_MAX_LENGTH,
  );

  const conversationQuery = useConversation(conversationId);
  const messagesQuery = useConversationMessages(conversationId);
  const markRead = useMarkConversationRead();
  const peer = conversationQuery.data?.peer(currentUserId);
  const peerMember = conversationQuery.data?.peerMember(currentUserId);
  const peerUserId = peer?.id ?? "";
  const peerDevicesQuery = usePeerDevices(peer?.id);
  const sendMessage = useSendMessage(conversationId, peerUserId);
  useMessagingSocket(conversationId);

  const presence = usePresenceStore((state) =>
    peer ? state.byUserId[peer.id] : undefined,
  );
  const seedOnline = usePresenceStore((state) => state.seedOnline);

  useEffect(() => {
    if (peer && conversationQuery.data?.peerOnline !== undefined) {
      seedOnline(peer.id, conversationQuery.data.peerOnline);
    }
  }, [peer, conversationQuery.data?.peerOnline, seedOnline]);

  useEffect(() => {
    return () => {
      for (const item of pending) {
        URL.revokeObjectURL(item.previewUrl);
      }
    };
    // only on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const online =
    presence?.online ?? conversationQuery.data?.peerOnline ?? false;

  const chronologicalMessages = useMemo(() => {
    const items = messagesQuery.data?.pages.flatMap((page) => page.data) ?? [];
    return [...items].sort(
      (a, b) => a.createdAt.getTime() - b.createdAt.getTime(),
    );
  }, [messagesQuery.data]);

  const latestInboundId = useMemo(() => {
    for (let i = chronologicalMessages.length - 1; i >= 0; i -= 1) {
      const message = chronologicalMessages[i];
      if (message && !message.isFrom(currentUserId)) return message.id;
    }
    return null;
  }, [chronologicalMessages, currentUserId]);

  useEffect(() => {
    void markRead.mutateAsync(conversationId).catch(() => {
      // Ignoring read receipt errors keeps the room usable.
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, latestInboundId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chronologicalMessages.length]);

  function addFiles(files: File[]) {
    const images = files.filter((file) => file.type.startsWith("image/"));
    if (images.length === 0) return;
    setPending((current) => {
      const room = MAX_ATTACHMENTS - current.length;
      if (room <= 0) return current;
      const next = images.slice(0, room).map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
      }));
      return [...current, ...next];
    });
  }

  function removePending(id: string) {
    setPending((current) => {
      const target = current.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return current.filter((item) => item.id !== id);
    });
  }

  async function handleSend() {
    const text = draft.trim();
    if (
      (!text && pending.length === 0) ||
      sendMessage.isPending ||
      uploading ||
      !peerUserId
    ) {
      return;
    }
    setSendError(null);
    setUploading(true);
    try {
      const files = pending.map((item) => item.file);
      const uploaded =
        files.length > 0
          ? await appContainer.uploadService.uploadMany(files)
          : [];
      const attachments = uploaded.map((file) => ({
        url: file.url,
        ciphertextSize: file.sizeBytes,
      }));

      await sendMessage.mutateAsync({ text, attachments });
      setDraft("");
      for (const item of pending) {
        URL.revokeObjectURL(item.previewUrl);
      }
      setPending([]);
    } catch (err) {
      setSendError(err);
    } finally {
      setUploading(false);
    }
  }

  const busy = sendMessage.isPending || uploading;
  const canSend =
    Boolean(peerUserId) &&
    !busy &&
    (draft.trim().length > 0 || pending.length > 0);

  if (conversationQuery.isLoading || messagesQuery.isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-primary" aria-hidden />
      </div>
    );
  }

  if (conversationQuery.error || messagesQuery.error) {
    return (
      <p className="flex items-center gap-2 p-6 text-sm text-danger">
        <AlertCircle className="h-4 w-4" aria-hidden />
        {conversationQuery.error instanceof ApiError
          ? conversationQuery.error.message
          : messagesQuery.error instanceof ApiError
            ? messagesQuery.error.message
            : t("loadFailed")}
      </p>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex items-center gap-2.5 border-b border-border px-3 py-2.5 sm:px-4">
        <Link
          href="/messaging"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-surface-muted hover:text-foreground lg:hidden"
          aria-label={t("backToList")}
        >
          <ArrowLeft className="size-5" strokeWidth={2} />
        </Link>
        {peer ? (
          <Link
            href={`/users/${peer.id}`}
            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-lg outline-none transition-colors hover:bg-surface-muted/70 focus-visible:ring-2 focus-visible:ring-primary/30 -my-1.5 -ml-1.5 px-1.5 py-1.5"
          >
            {peer.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={peer.avatarUrl}
                alt=""
                className="size-9 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                {peer.initials}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {peer.displayName}
              </p>
              <p className="flex items-center gap-1.5 truncate text-[11px] text-muted">
                <span
                  className={`inline-block size-1.5 shrink-0 rounded-full ${
                    online ? "bg-emerald-500" : "bg-muted-foreground/40"
                  }`}
                  aria-hidden
                />
                {online ? t("statusOnline") : t("statusOffline")}
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
              ?
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {t("unknownPeer")}
              </p>
            </div>
          </div>
        )}
      </header>

      <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-3 py-3 sm:px-4 sm:py-4">
        {messagesQuery.hasNextPage ? (
          <div className="flex justify-center">
            <Button
              type="button"
              variant="ghost"
              className="h-8 gap-1.5 px-3 text-xs"
              disabled={messagesQuery.isFetchingNextPage}
              onClick={() => void messagesQuery.fetchNextPage()}
            >
              {messagesQuery.isFetchingNextPage ? (
                <Loader2 className="size-3.5 animate-spin" aria-hidden />
              ) : (
                tCommon("loadMore")
              )}
            </Button>
          </div>
        ) : null}

        {chronologicalMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2.5 py-16 text-center text-muted">
            <MessageSquarePlus
              className="size-9 opacity-40"
              strokeWidth={1.5}
              aria-hidden
            />
            <p className="text-sm">{t("messagesEmpty")}</p>
          </div>
        ) : (
          chronologicalMessages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.isFrom(currentUserId)}
              currentUserId={currentUserId}
              conversationId={conversationId}
              peerDevices={peerDevicesQuery.data}
              peerLastReadAt={peerMember?.lastReadAt ?? null}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void handleSend();
        }}
        className="border-t border-border px-3 py-2.5 sm:px-4"
      >
        {sendError ? (
          <p className="mb-2 text-xs text-danger" role="alert">
            {isPeerDeviceMissingError(sendError)
              ? t("peerDeviceMissing")
              : sendError instanceof ApiError
                ? sendError.message
                : sendError instanceof Error &&
                    sendError.message === "EMPTY_MESSAGE"
                  ? t("emptyMessage")
                  : sendError instanceof Error
                    ? sendError.message
                    : t("sendFailed")}
          </p>
        ) : null}

        {pending.length > 0 ? (
          <ul className="mb-2.5 flex gap-2 overflow-x-auto pb-0.5">
            {pending.map((item) => (
              <li key={item.id} className="relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.previewUrl}
                  alt=""
                  className="size-14 rounded-xl object-cover ring-1 ring-border"
                />
                <button
                  type="button"
                  className="absolute -top-1.5 -right-1.5 inline-flex size-5 items-center justify-center rounded-full bg-surface text-muted shadow-sm ring-1 ring-border hover:text-foreground"
                  onClick={() => removePending(item.id)}
                  aria-label={t("removeAttachment")}
                  disabled={busy}
                >
                  <X className="size-3" strokeWidth={2.5} />
                </button>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="flex items-end gap-1.5 rounded-2xl border border-border bg-surface px-1.5 py-1.5 shadow-sm">
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT_IMAGES}
            multiple
            className="sr-only"
            onChange={(event) => {
              const files = Array.from(event.target.files ?? []);
              addFiles(files);
              event.target.value = "";
            }}
          />
          <button
            type="button"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
            disabled={busy || pending.length >= MAX_ATTACHMENTS}
            aria-label={t("attachImage")}
            onClick={() => fileInputRef.current?.click()}
          >
            <ImagePlus
              className="size-[1.125rem]"
              strokeWidth={2}
              aria-hidden
            />
          </button>
          <div className="min-w-0 flex-1">
            <MentionTextarea
              ref={composerRef}
              value={draft}
              onChange={setDraft}
              rows={1}
              maxLength={MESSAGE_TEXT_MAX_LENGTH}
              placeholder={t("messagePlaceholder")}
              disabled={busy}
              className="max-h-28 min-h-9 w-full resize-none bg-transparent px-1.5 py-2 text-sm leading-snug text-foreground outline-none placeholder:text-muted disabled:opacity-60"
              onPaste={(event) => {
                const files = getPastedImageFiles(event.clipboardData);
                if (!files) return;
                event.preventDefault();
                addFiles(files);
              }}
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey &&
                  !event.nativeEvent.isComposing
                ) {
                  event.preventDefault();
                  void handleSend();
                }
              }}
            />
          </div>
          <EmojiPickerButton
            disabled={busy}
            onSelect={insertEmoji}
            className="shrink-0 [&_button]:size-9 [&_button]:rounded-full [&_button]:p-0 [&_svg]:size-[1.125rem]"
          />
          <button
            type="submit"
            disabled={!canSend}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-colors hover:bg-primary-hover disabled:pointer-events-none disabled:opacity-40"
            aria-label={t("send")}
          >
            {busy ? (
              <Loader2 className="size-[1.125rem] animate-spin" aria-hidden />
            ) : (
              <Send className="size-[1.125rem]" strokeWidth={2} aria-hidden />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
