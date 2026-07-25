"use client";

import type { ComponentType } from "react";
import {
  AlertCircle,
  Award,
  BadgeCheck,
  Bell,
  Briefcase,
  Eye,
  Loader2,
  MessageCircle,
  Reply,
  Repeat2,
  ThumbsUp,
  UserCheck,
  UserPlus,
  UserRoundPlus,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ApiError } from "@/core/application/errors/api.error";
import type { Notification } from "@/core/domain/entities/notification.entity";
import { NotificationType } from "@/core/domain/enums/notification-type.enum";
import { FeedCard } from "@/presentation/components/feed/feed-card";
import { Button } from "@/presentation/components/ui/button";
import { UserNameWithBadge } from "@/presentation/components/ui/user-name-with-badge";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/presentation/hooks/use-notifications";
import { formatRelativeTime } from "@/presentation/lib/format-relative-time";
import { formatMentionsForPreview } from "@/presentation/lib/mentions";

const TYPE_META: Record<
  NotificationType,
  {
    icon: ComponentType<{ className?: string }>;
    className: string;
    key: string;
  }
> = {
  [NotificationType.POST_LIKE]: {
    icon: ThumbsUp,
    className: "bg-primary-soft text-primary",
    key: "like",
  },
  [NotificationType.POST_COMMENT]: {
    icon: MessageCircle,
    className: "bg-primary-soft text-primary",
    key: "comment",
  },
  [NotificationType.POST_REPOST]: {
    icon: Repeat2,
    className: "bg-primary-soft text-primary",
    key: "repost",
  },
  [NotificationType.COMMENT_REPLY]: {
    icon: Reply,
    className: "bg-primary-soft text-primary",
    key: "commentReply",
  },
  [NotificationType.CONNECTION_REQUEST]: {
    icon: UserPlus,
    className: "bg-primary-soft text-primary",
    key: "connectionRequest",
  },
  [NotificationType.CONNECTION_ACCEPTED]: {
    icon: UserCheck,
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    key: "connectionAccepted",
  },
  [NotificationType.PROFILE_VIEW]: {
    icon: Eye,
    className: "bg-primary-soft text-primary",
    key: "profileView",
  },
  [NotificationType.NEW_FOLLOWER]: {
    icon: UserRoundPlus,
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    key: "newFollower",
  },
  [NotificationType.BADGE_EARNED]: {
    icon: Award,
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    key: "badgeEarned",
  },
  [NotificationType.SKILL_ENDORSED]: {
    icon: BadgeCheck,
    className: "bg-primary-soft text-primary",
    key: "skillEndorsed",
  },
  [NotificationType.JOB_APPLICATION_RECEIVED]: {
    icon: Briefcase,
    className: "bg-primary-soft text-primary",
    key: "jobApplicationReceived",
  },
  [NotificationType.JOB_APPLICATION_STATUS_CHANGED]: {
    icon: Briefcase,
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    key: "jobApplicationStatusChanged",
  },
};

function NotificationRow({ notification }: { notification: Notification }) {
  const t = useTranslations("notifications");
  const markRead = useMarkNotificationRead();
  const meta = TYPE_META[notification.type];
  const Icon = meta.icon;

  const handleActivate = () => {
    if (!notification.read) markRead.mutate(notification.id);
  };

  const preview = notification.post?.textContent
    ? formatMentionsForPreview(notification.post.textContent)
    : null;

  return (
    <li
      className={`flex items-start gap-3 px-4 py-3 transition-colors ${
        notification.read ? "" : "bg-primary-soft/40"
      }`}
      onMouseEnter={handleActivate}
    >
      <Link
        href={`/users/${notification.actor.id}`}
        className="relative shrink-0"
        onClick={handleActivate}
      >
        {notification.actor.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={notification.actor.avatarUrl}
            alt=""
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary">
            {notification.actor.initials}
          </span>
        )}
        <span
          className={`absolute -right-1 -bottom-1 flex h-5 w-5 items-center justify-center rounded-full ring-2 ring-surface ${meta.className}`}
        >
          <Icon className="h-3 w-3" aria-hidden />
        </span>
      </Link>

      <div className="min-w-0 flex-1">
        <p className="text-sm text-foreground">
          <Link
            href={`/users/${notification.actor.id}`}
            className="font-semibold hover:underline"
            onClick={handleActivate}
          >
            <UserNameWithBadge
              name={notification.actor.displayName}
              showAdminBadge={notification.actor.isAdmin()}
              nameClassName="font-semibold text-foreground"
            />
          </Link>{" "}
          {t(`message.${meta.key}`)}
        </p>
        {preview ? (
          <p className="mt-0.5 line-clamp-2 text-xs text-muted">“{preview}”</p>
        ) : null}
        <p className="mt-0.5 text-xs text-muted">
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>

      {notification.read ? null : (
        <span
          className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary"
          aria-hidden
        />
      )}
    </li>
  );
}

export function NotificationsPage() {
  const t = useTranslations("notifications");
  const tCommon = useTranslations("common");
  const {
    data,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useNotifications();
  const markAll = useMarkAllNotificationsRead();

  const notifications = data?.pages.flatMap((page) => page.data) ?? [];
  const hasUnread = notifications.some((item) => !item.read);

  return (
    <div className="mx-auto max-w-[720px] space-y-2">
      <FeedCard className="flex items-center justify-between px-4 py-3">
        <h1 className="text-lg font-semibold text-foreground">{t("title")}</h1>
        {hasUnread ? (
          <Button
            type="button"
            variant="ghost"
            className="text-xs font-semibold text-primary"
            disabled={markAll.isPending}
            onClick={() => markAll.mutate()}
          >
            {t("markAllRead")}
          </Button>
        ) : null}
      </FeedCard>

      <FeedCard className="overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2
              className="h-8 w-8 animate-spin text-primary"
              aria-hidden
            />
          </div>
        ) : error ? (
          <p className="inline-flex items-center gap-2 px-4 py-8 text-sm text-danger">
            <AlertCircle className="h-4 w-4" aria-hidden />
            {error instanceof ApiError ? error.message : t("loadFailed")}
          </p>
        ) : notifications.length > 0 ? (
          <>
            <ul className="divide-y divide-border">
              {notifications.map((notification) => (
                <NotificationRow
                  key={notification.id}
                  notification={notification}
                />
              ))}
            </ul>
            {hasNextPage ? (
              <div className="flex justify-center py-3">
                <Button
                  type="button"
                  variant="secondary"
                  disabled={isFetchingNextPage}
                  onClick={() => void fetchNextPage()}
                  className="gap-1.5"
                >
                  {isFetchingNextPage ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : null}
                  {tCommon("loadMore")}
                </Button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="px-4 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
              <Bell className="h-7 w-7" aria-hidden />
            </div>
            <p className="mt-4 text-sm font-medium text-foreground">
              {t("emptyTitle")}
            </p>
            <p className="mt-1 text-sm text-muted">{t("emptyHint")}</p>
          </div>
        )}
      </FeedCard>
    </div>
  );
}
