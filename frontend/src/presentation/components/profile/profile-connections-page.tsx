"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import { FeedCard } from "@/presentation/components/feed/feed-card";
import { MessageUserButton } from "@/presentation/components/messaging/message-user-button";
import { ConnectionPersonAvatar } from "@/presentation/components/network/connection-person-row";
import { Button } from "@/presentation/components/ui/button";
import { useMyProfile, useUserProfile } from "@/presentation/hooks/use-profile";
import { useUserConnections } from "@/presentation/hooks/use-connections";
import { useAuthStore } from "@/presentation/stores/auth.store";

type ProfileConnectionsPageProps = {
  /** When omitted, loads the current user's profile and connections. */
  userId?: string;
};

export function ProfileConnectionsPage({
  userId,
}: ProfileConnectionsPageProps) {
  const t = useTranslations("profile");
  const tNetwork = useTranslations("network");
  const tCommon = useTranslations("common");
  const isOwn = userId === undefined;
  const authUser = useAuthStore((state) => state.user);

  const myProfileQuery = useMyProfile(isOwn);
  const userProfileQuery = useUserProfile(isOwn ? undefined : userId);
  const profileQuery = isOwn ? myProfileQuery : userProfileQuery;
  const profile = profileQuery.data;
  const profileOwnerId = profile?.id;

  const {
    data,
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useUserConnections(profileOwnerId);

  const backHref = isOwn ? "/profile" : `/users/${userId}`;
  const items = data?.pages.flatMap((page) => page.data) ?? [];

  if (profileQuery.isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
      </div>
    );
  }

  if (profileQuery.error || !profile) {
    return (
      <FeedCard className="px-4 py-8 text-center">
        <p className="inline-flex items-center gap-2 text-sm text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
          {profileQuery.error instanceof ApiError
            ? profileQuery.error.message
            : t("loadFailed")}
        </p>
      </FeedCard>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[780px] space-y-2">
      <FeedCard className="px-4 py-4 sm:px-6">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t("backToProfile")}
        </Link>

        <h1 className="mt-3 text-xl font-semibold text-foreground">
          {t("connectionsOf", { name: profile.displayName })}
        </h1>
        <p className="mt-1 text-sm text-muted">
          {t("connectionsCount", { count: profile.connectionsCount })}
        </p>
      </FeedCard>

      <FeedCard className="px-4 py-4 sm:px-6">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2
              className="h-7 w-7 animate-spin text-primary"
              aria-hidden
            />
          </div>
        ) : error ? (
          <p className="inline-flex items-center gap-2 py-6 text-sm text-danger">
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
            {error instanceof ApiError ? error.message : tNetwork("loadFailed")}
          </p>
        ) : items.length === 0 ? (
          <p className="py-6 text-sm text-muted">{t("connectionsEmpty")}</p>
        ) : (
          <div className="space-y-4">
            <ul className="grid items-stretch gap-3 sm:grid-cols-2">
              {items.map((connection) => {
                const person = connection.otherUser(profile.id);
                const canMessage =
                  Boolean(authUser) && person.id !== authUser?.id;
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
                        {canMessage ? (
                          <div className="mt-auto flex w-full justify-center pt-3">
                            <MessageUserButton
                              userId={person.id}
                              variant="compact"
                            />
                          </div>
                        ) : null}
                      </div>
                    </FeedCard>
                  </li>
                );
              })}
            </ul>
            {hasNextPage ? (
              <div className="flex justify-center pt-1">
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
        )}
      </FeedCard>
    </div>
  );
}
