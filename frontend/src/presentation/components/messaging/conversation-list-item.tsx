"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import type { Conversation } from "@/core/domain/entities/conversation.entity";
import type { Message } from "@/core/domain/entities/message.entity";
import type { MessagingUser } from "@/core/domain/entities/messaging-user.entity";
import { useDecryptedMessageBody } from "@/presentation/hooks/use-decrypted-message";
import { useMyDevices, usePeerDevices } from "@/presentation/hooks/use-devices";
import { formatMentionsForPreview } from "@/presentation/lib/mentions";
import { formatRelativeTime } from "@/presentation/lib/format-relative-time";
import { usePresenceStore } from "@/presentation/stores/presence.store";

function PeerAvatar({
  peer,
  online,
}: {
  peer: MessagingUser;
  online: boolean;
}) {
  return (
    <span className="relative shrink-0">
      {peer.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={peer.avatarUrl}
          alt=""
          className="size-11 rounded-full object-cover"
        />
      ) : (
        <div className="flex size-11 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
          {peer.initials}
        </div>
      )}
      <span
        className={`absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-surface ${
          online ? "bg-emerald-500" : "bg-muted-foreground/35"
        }`}
        aria-hidden
      />
    </span>
  );
}

function LastMessagePreview({
  message,
  currentUserId,
  peerUserId,
}: {
  message: Message;
  currentUserId: string;
  peerUserId: string | undefined;
}) {
  const t = useTranslations("messaging");
  const peerDevices = usePeerDevices(peerUserId);
  const myDevices = useMyDevices();
  const decrypted = useDecryptedMessageBody(
    message,
    currentUserId,
    peerDevices.data,
    myDevices.data,
  );

  if (message.isDeleted) {
    return <>{t("messageDeleted")}</>;
  }

  if (decrypted.status === "loading") {
    return <>…</>;
  }

  const prefix = message.isFrom(currentUserId) ? `${t("you")}: ` : "";
  const attachmentHint =
    message.attachments.length > 0
      ? t("attachmentPreview", { count: message.attachments.length })
      : null;

  if (decrypted.status === "error") {
    return (
      <>
        {prefix}
        {attachmentHint ?? t("encryptedPreview")}
      </>
    );
  }

  const text = decrypted.text.trim()
    ? formatMentionsForPreview(decrypted.text)
    : null;

  return (
    <>
      {prefix}
      {text ?? attachmentHint ?? t("encryptedPreview")}
    </>
  );
}

type ConversationListItemProps = {
  conversation: Conversation;
  currentUserId: string;
  active: boolean;
};

export function ConversationListItem({
  conversation,
  currentUserId,
  active,
}: ConversationListItemProps) {
  const t = useTranslations("messaging");
  const peer = conversation.peer(currentUserId);
  const presence = usePresenceStore((state) =>
    peer ? state.byUserId[peer.id] : undefined,
  );
  const seedOnline = usePresenceStore((state) => state.seedOnline);

  useEffect(() => {
    if (peer && conversation.peerOnline !== undefined) {
      seedOnline(peer.id, conversation.peerOnline);
    }
  }, [peer, conversation.peerOnline, seedOnline]);

  const online = presence?.online ?? conversation.peerOnline ?? false;
  const unread = conversation.unreadCount > 0;

  return (
    <Link
      href={`/messaging/${conversation.id}`}
      className={`flex items-center gap-3 px-3 py-2.5 transition-colors sm:px-4 ${
        active ? "bg-primary-soft/70" : "hover:bg-surface-muted/80"
      }`}
    >
      {peer ? (
        <PeerAvatar peer={peer} online={online} />
      ) : (
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-muted text-sm font-semibold text-muted">
          ?
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p
            className={`min-w-0 flex-1 truncate text-sm ${
              unread
                ? "font-semibold text-foreground"
                : "font-medium text-foreground"
            }`}
          >
            {peer?.displayName ?? t("unknownPeer")}
          </p>
          {conversation.lastMessage ? (
            <span className="shrink-0 text-[11px] text-muted">
              {formatRelativeTime(conversation.lastMessage.createdAt)}
            </span>
          ) : null}
          {unread ? (
            <span className="inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-danger px-1.5 text-[10px] font-bold leading-none text-white">
              {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
            </span>
          ) : null}
        </div>
        <p
          className={`mt-0.5 min-w-0 truncate text-xs text-muted ${
            unread ? "font-medium text-foreground/80" : ""
          }`}
        >
          {conversation.lastMessage ? (
            <LastMessagePreview
              message={conversation.lastMessage}
              currentUserId={currentUserId}
              peerUserId={peer?.id}
            />
          ) : (
            t("conversationFallback")
          )}
        </p>
      </div>
    </Link>
  );
}
