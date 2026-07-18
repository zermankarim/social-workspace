"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, Loader2, UserMinus, UserPlus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import type { Connection } from "@/core/domain/entities/connection.entity";
import { FeedCard } from "@/presentation/components/feed/feed-card";
import { MessageUserButton } from "@/presentation/components/messaging/message-user-button";
import {
  ConnectionPersonAvatar,
  ConnectionPersonRow,
} from "@/presentation/components/network/connection-person-row";
import { Button } from "@/presentation/components/ui/button";
import {
  useAcceptConnection,
  useAcceptedConnections,
  useConnectionCounts,
  usePendingIncomingConnections,
  usePendingOutgoingConnections,
  useRejectConnection,
  useRemoveConnection,
} from "@/presentation/hooks/use-connections";
import { useAuthStore } from "@/presentation/stores/auth.store";

type NetworkSection = "invitations" | "connections" | "sent";

function ActionError({ error }: { error: unknown }) {
  const t = useTranslations("network");
  if (!error) return null;
  return (
    <p className="mt-2 text-xs text-danger" role="alert">
      {error instanceof ApiError ? error.message : t("actionFailed")}
    </p>
  );
}

function InvitationsPanel({ currentUserId }: { currentUserId: string }) {
  const t = useTranslations("network");
  const tCommon = useTranslations("common");
  const {
    data,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = usePendingIncomingConnections();
  const accept = useAcceptConnection();
  const reject = useRejectConnection();
  const [actionError, setActionError] = useState<unknown>(null);

  const items = data?.pages.flatMap((page) => page.data) ?? [];

  async function handleAccept(connection: Connection) {
    setActionError(null);
    try {
      await accept.mutateAsync(connection.id);
    } catch (err) {
      setActionError(err);
    }
  }

  async function handleIgnore(connection: Connection) {
    setActionError(null);
    try {
      await reject.mutateAsync(connection.id);
    } catch (err) {
      setActionError(err);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-7 w-7 animate-spin text-primary" aria-hidden />
      </div>
    );
  }

  if (error) {
    return (
      <p className="inline-flex items-center gap-2 px-1 py-6 text-sm text-danger">
        <AlertCircle className="h-4 w-4" aria-hidden />
        {error instanceof ApiError ? error.message : t("loadFailed")}
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p className="px-1 py-6 text-sm text-muted">{t("invitationsEmpty")}</p>
    );
  }

  return (
    <div className="space-y-4">
      <ActionError error={actionError} />
      <ul className="divide-y divide-border">
        {items.map((connection) => {
          const person = connection.otherUser(currentUserId);
          const busy =
            (accept.isPending && accept.variables === connection.id) ||
            (reject.isPending && reject.variables === connection.id);

          return (
            <li key={connection.id} className="py-4 first:pt-0 last:pb-0">
              <ConnectionPersonRow
                person={person}
                actions={
                  <>
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={busy}
                      className="h-8 px-3 text-xs"
                      onClick={() => void handleIgnore(connection)}
                    >
                      {t("ignore")}
                    </Button>
                    <Button
                      type="button"
                      disabled={busy}
                      className="h-8 px-3 text-xs"
                      onClick={() => void handleAccept(connection)}
                    >
                      {busy ? (
                        <Loader2
                          className="h-3.5 w-3.5 animate-spin"
                          aria-hidden
                        />
                      ) : null}
                      {t("accept")}
                    </Button>
                  </>
                }
              />
            </li>
          );
        })}
      </ul>
      {hasNextPage ? (
        <div className="flex justify-center pt-2">
          <Button
            type="button"
            variant="secondary"
            disabled={isFetchingNextPage}
            onClick={() => void fetchNextPage()}
          >
            {isFetchingNextPage ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : null}
            {tCommon("loadMore")}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function SentPanel({ currentUserId }: { currentUserId: string }) {
  const t = useTranslations("network");
  const tCommon = useTranslations("common");
  const {
    data,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = usePendingOutgoingConnections();
  const remove = useRemoveConnection();
  const [actionError, setActionError] = useState<unknown>(null);
  const items = data?.pages.flatMap((page) => page.data) ?? [];

  async function handleWithdraw(connection: Connection) {
    setActionError(null);
    try {
      await remove.mutateAsync(connection.id);
    } catch (err) {
      setActionError(err);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-7 w-7 animate-spin text-primary" aria-hidden />
      </div>
    );
  }

  if (error) {
    return (
      <p className="inline-flex items-center gap-2 px-1 py-6 text-sm text-danger">
        <AlertCircle className="h-4 w-4" aria-hidden />
        {error instanceof ApiError ? error.message : t("loadFailed")}
      </p>
    );
  }

  if (items.length === 0) {
    return <p className="px-1 py-6 text-sm text-muted">{t("sentEmpty")}</p>;
  }

  return (
    <div className="space-y-4">
      <ActionError error={actionError} />
      <ul className="divide-y divide-border">
        {items.map((connection) => {
          const person = connection.otherUser(currentUserId);
          const busy = remove.isPending && remove.variables === connection.id;
          return (
            <li key={connection.id} className="py-4 first:pt-0 last:pb-0">
              <ConnectionPersonRow
                person={person}
                actions={
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={busy}
                    className="h-8 gap-1.5 px-3 text-xs"
                    onClick={() => void handleWithdraw(connection)}
                  >
                    {busy ? (
                      <Loader2
                        className="h-3.5 w-3.5 animate-spin"
                        aria-hidden
                      />
                    ) : (
                      <X className="h-3.5 w-3.5" aria-hidden />
                    )}
                    {t("withdraw")}
                  </Button>
                }
              />
            </li>
          );
        })}
      </ul>
      {hasNextPage ? (
        <div className="flex justify-center pt-2">
          <Button
            type="button"
            variant="secondary"
            disabled={isFetchingNextPage}
            onClick={() => void fetchNextPage()}
          >
            {isFetchingNextPage ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : null}
            {tCommon("loadMore")}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function ConnectionsPanel({ currentUserId }: { currentUserId: string }) {
  const t = useTranslations("network");
  const tCommon = useTranslations("common");
  const {
    data,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useAcceptedConnections();
  const remove = useRemoveConnection();
  const [actionError, setActionError] = useState<unknown>(null);
  const items = data?.pages.flatMap((page) => page.data) ?? [];

  async function handleRemove(connection: Connection) {
    if (!window.confirm(t("removeConfirm"))) return;
    setActionError(null);
    try {
      await remove.mutateAsync(connection.id);
    } catch (err) {
      setActionError(err);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-7 w-7 animate-spin text-primary" aria-hidden />
      </div>
    );
  }

  if (error) {
    return (
      <p className="inline-flex items-center gap-2 px-1 py-6 text-sm text-danger">
        <AlertCircle className="h-4 w-4" aria-hidden />
        {error instanceof ApiError ? error.message : t("loadFailed")}
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p className="px-1 py-6 text-sm text-muted">{t("connectionsEmpty")}</p>
    );
  }

  return (
    <div className="space-y-4">
      <ActionError error={actionError} />
      <ul className="grid items-stretch gap-3 sm:grid-cols-2">
        {items.map((connection) => {
          const person = connection.otherUser(currentUserId);
          const busy = remove.isPending && remove.variables === connection.id;
          return (
            <li key={connection.id} className="min-h-0">
              <FeedCard className="flex h-full flex-col px-4 py-4">
                <div className="flex h-full flex-col items-center text-center">
                  <Link href={`/users/${person.id}`} className="shrink-0">
                    <ConnectionPersonAvatar person={person} size="lg" />
                  </Link>
                  <Link
                    href={`/users/${person.id}`}
                    className="mt-3 line-clamp-1 min-h-5 w-full text-sm font-semibold text-foreground hover:underline"
                  >
                    {person.displayName}
                  </Link>
                  <p
                    className={`mt-1 line-clamp-2 min-h-8 w-full text-xs ${
                      person.headline?.trim()
                        ? "text-muted"
                        : "select-none text-transparent"
                    }`}
                    aria-hidden={!person.headline?.trim()}
                  >
                    {person.headline?.trim() || "—"}
                  </p>
                  <div className="mt-auto flex w-full flex-wrap justify-center gap-2 pt-3">
                    <MessageUserButton
                      userId={person.id}
                      variant="compact"
                      className="justify-center"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      disabled={busy}
                      className="h-8 gap-1.5 px-3 text-xs"
                      onClick={() => void handleRemove(connection)}
                    >
                      {busy ? (
                        <Loader2
                          className="h-3.5 w-3.5 animate-spin"
                          aria-hidden
                        />
                      ) : (
                        <UserMinus className="h-3.5 w-3.5" aria-hidden />
                      )}
                      {t("remove")}
                    </Button>
                  </div>
                </div>
              </FeedCard>
            </li>
          );
        })}
      </ul>
      {hasNextPage ? (
        <div className="flex justify-center pt-2">
          <Button
            type="button"
            variant="secondary"
            disabled={isFetchingNextPage}
            onClick={() => void fetchNextPage()}
          >
            {isFetchingNextPage ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : null}
            {tCommon("loadMore")}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export function NetworkPage() {
  const t = useTranslations("network");
  const user = useAuthStore((state) => state.user);
  const counts = useConnectionCounts();
  const [section, setSection] = useState<NetworkSection>("invitations");

  if (!user) return null;

  const navItems: {
    id: NetworkSection;
    label: string;
    count: number;
  }[] = [
    {
      id: "invitations",
      label: t("invitations"),
      count: counts.pending,
    },
    {
      id: "connections",
      label: t("connections"),
      count: counts.accepted,
    },
    {
      id: "sent",
      label: t("sent"),
      count: counts.outgoing,
    },
  ];

  const titles: Record<NetworkSection, string> = {
    invitations: t("invitationsTitle"),
    connections: t("connectionsTitle"),
    sent: t("sentTitle"),
  };

  return (
    <div className="grid items-start gap-2 lg:grid-cols-[225px_minmax(0,1fr)]">
      <aside className="space-y-2 lg:sticky lg:top-[60px] lg:self-start">
        <FeedCard className="overflow-hidden px-0 py-0">
          <div className="hidden border-b border-border px-4 py-3 lg:block">
            <h1 className="text-base font-semibold text-foreground">
              {t("manageNetwork")}
            </h1>
          </div>
          <nav aria-label={t("manageNetwork")}>
            <ul className="flex gap-1 overflow-x-auto px-2 py-2 lg:block lg:overflow-visible lg:px-0 lg:py-0">
              {navItems.map((item) => {
                const active = section === item.id;
                return (
                  <li key={item.id} className="shrink-0 lg:shrink">
                    <button
                      type="button"
                      onClick={() => setSection(item.id)}
                      className={`flex w-full items-center justify-between gap-3 rounded-full px-3 py-2 text-left text-sm transition-colors lg:rounded-none lg:px-4 lg:py-2.5 ${
                        active
                          ? "bg-primary-soft font-semibold text-primary lg:border-l-2 lg:border-primary lg:bg-primary-soft/40"
                          : "text-foreground hover:bg-surface-muted lg:border-l-2 lg:border-transparent"
                      }`}
                    >
                      <span className="whitespace-nowrap">{item.label}</span>
                      <span className="text-muted">{item.count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </FeedCard>
      </aside>

      <div className="space-y-2">
        <FeedCard className="px-3 py-4 sm:px-6">
          <div className="mb-4 flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" aria-hidden />
            <h2 className="text-lg font-semibold text-foreground">
              {titles[section]}
            </h2>
          </div>

          {section === "invitations" ? (
            <InvitationsPanel currentUserId={user.id} />
          ) : null}
          {section === "connections" ? (
            <ConnectionsPanel currentUserId={user.id} />
          ) : null}
          {section === "sent" ? <SentPanel currentUserId={user.id} /> : null}
        </FeedCard>
      </div>
    </div>
  );
}
