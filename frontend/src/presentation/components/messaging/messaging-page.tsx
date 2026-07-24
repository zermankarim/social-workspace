"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Loader2,
  MessageSquare,
  MessageSquarePlus,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import { FeedCard } from "@/presentation/components/feed/feed-card";
import { ConversationListItem } from "@/presentation/components/messaging/conversation-list-item";
import { ConversationRoom } from "@/presentation/components/messaging/conversation-room";
import { ConnectionPersonRow } from "@/presentation/components/network/connection-person-row";
import { Button } from "@/presentation/components/ui/button";
import {
  useConversations,
  useOpenDirectConversation,
} from "@/presentation/hooks/use-conversations";
import { useAcceptedConnections } from "@/presentation/hooks/use-connections";
import { useEnsureMessagingDevice } from "@/presentation/hooks/use-devices";
import { useAuthStore } from "@/presentation/stores/auth.store";

type MessagingPageProps = {
  conversationId?: string;
};

export function MessagingPage({ conversationId }: MessagingPageProps) {
  const t = useTranslations("messaging");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [showNewChat, setShowNewChat] = useState(false);
  const [openError, setOpenError] = useState<unknown>(null);

  useEnsureMessagingDevice(Boolean(user));

  const {
    data,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useConversations();
  const connections = useAcceptedConnections();
  const openDirect = useOpenDirectConversation();

  const conversations = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const connectionPeople = useMemo(() => {
    if (!user) return [];
    const items = connections.data?.pages.flatMap((page) => page.data) ?? [];
    return items.map((connection) => connection.otherUser(user.id));
  }, [connections.data, user]);

  async function handleStartChat(peerUserId: string) {
    setOpenError(null);
    try {
      const conversation = await openDirect.mutateAsync(peerUserId);
      setShowNewChat(false);
      router.push(`/messaging/${conversation.id}`);
    } catch (err) {
      setOpenError(err);
    }
  }

  if (!user) {
    return null;
  }

  const listPanel = (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex items-center justify-between gap-2 border-b border-border px-3 py-2.5 sm:px-4">
        <h1 className="text-base font-semibold text-foreground">
          {t("title")}
        </h1>
        <Button
          type="button"
          variant="secondary"
          className="h-8 gap-1.5 px-3 text-xs"
          onClick={() => setShowNewChat(true)}
        >
          <MessageSquarePlus
            className="size-3.5"
            strokeWidth={2.25}
            aria-hidden
          />
          {t("newChat")}
        </Button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
          </div>
        ) : error ? (
          <p className="flex items-center gap-2 px-4 py-6 text-sm text-danger">
            <AlertCircle className="size-4 shrink-0" aria-hidden />
            {error instanceof ApiError ? error.message : t("loadFailed")}
          </p>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <span className="inline-flex size-14 items-center justify-center rounded-full bg-surface-muted text-muted">
              <MessageSquare
                className="size-7 opacity-70"
                strokeWidth={1.5}
                aria-hidden
              />
            </span>
            <p className="text-sm text-muted">{t("conversationsEmpty")}</p>
            <Button
              type="button"
              variant="secondary"
              className="h-9 gap-1.5 px-4 text-sm"
              onClick={() => setShowNewChat(true)}
            >
              <MessageSquarePlus className="size-4" aria-hidden />
              {t("newChat")}
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {conversations.map((conversation) => (
              <li key={conversation.id}>
                <ConversationListItem
                  conversation={conversation}
                  currentUserId={user.id}
                  active={conversation.id === conversationId}
                />
              </li>
            ))}
          </ul>
        )}

        {hasNextPage ? (
          <div className="flex justify-center py-3">
            <Button
              type="button"
              variant="ghost"
              className="h-8 gap-1.5 px-3 text-xs"
              disabled={isFetchingNextPage}
              onClick={() => void fetchNextPage()}
            >
              {isFetchingNextPage ? (
                <Loader2 className="size-3.5 animate-spin" aria-hidden />
              ) : (
                tCommon("loadMore")
              )}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );

  const roomPanel = conversationId ? (
    <ConversationRoom conversationId={conversationId} currentUserId={user.id} />
  ) : (
    <div className="hidden h-full flex-col items-center justify-center gap-3 p-8 text-center text-muted lg:flex">
      <span className="inline-flex size-16 items-center justify-center rounded-full bg-surface-muted">
        <MessageSquare
          className="size-8 opacity-50"
          strokeWidth={1.5}
          aria-hidden
        />
      </span>
      <p className="max-w-xs text-sm">{t("selectConversation")}</p>
    </div>
  );

  return (
    <>
      <FeedCard
        className={`overflow-hidden ${
          conversationId
            ? "h-[calc(100dvh-52px-1rem)] sm:h-[calc(100dvh-52px-2rem)] lg:h-[calc(100dvh-52px-3rem)]"
            : "h-[calc(100dvh-52px-1rem-3.75rem-env(safe-area-inset-bottom))] sm:h-[calc(100dvh-52px-2rem-3.75rem-env(safe-area-inset-bottom))] lg:h-[calc(100dvh-52px-3rem)]"
        }`}
      >
        <div className="grid h-full min-h-0 lg:grid-cols-[minmax(260px,340px)_1fr]">
          <aside
            className={`h-full min-h-0 border-border lg:border-r ${
              conversationId ? "hidden lg:block" : "block"
            }`}
          >
            {listPanel}
          </aside>
          <section
            className={`h-full min-h-0 ${
              conversationId ? "block" : "hidden lg:block"
            }`}
          >
            {roomPanel}
          </section>
        </div>
      </FeedCard>

      {showNewChat ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-center sm:pb-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-chat-title"
          onClick={() => setShowNewChat(false)}
        >
          <div
            className="max-h-[80dvh] w-full max-w-md overflow-hidden rounded-xl bg-surface shadow-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2
                id="new-chat-title"
                className="text-sm font-semibold text-foreground"
              >
                {t("newChatTitle")}
              </h2>
              <button
                type="button"
                className="inline-flex size-8 items-center justify-center rounded-full text-muted hover:bg-surface-muted hover:text-foreground"
                onClick={() => setShowNewChat(false)}
                aria-label={tCommon("close")}
              >
                <X className="size-4" strokeWidth={2} />
              </button>
            </div>

            <div className="max-h-[60dvh] overflow-y-auto p-4">
              {openError ? (
                <p className="mb-3 text-xs text-danger" role="alert">
                  {openError instanceof ApiError
                    ? openError.message
                    : t("openFailed")}
                </p>
              ) : null}

              {connections.isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2
                    className="h-6 w-6 animate-spin text-primary"
                    aria-hidden
                  />
                </div>
              ) : connectionPeople.length === 0 ? (
                <p className="py-6 text-sm text-muted">{t("noConnections")}</p>
              ) : (
                <ul className="space-y-4">
                  {connectionPeople.map((person) => (
                    <li key={person.id}>
                      <ConnectionPersonRow
                        person={person}
                        actions={
                          <Button
                            type="button"
                            variant="secondary"
                            className="text-xs"
                            disabled={openDirect.isPending}
                            onClick={() => void handleStartChat(person.id)}
                          >
                            {openDirect.isPending ? (
                              <Loader2
                                className="size-3.5 animate-spin"
                                aria-hidden
                              />
                            ) : (
                              t("message")
                            )}
                          </Button>
                        }
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
