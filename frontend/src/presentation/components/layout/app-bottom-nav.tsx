"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ProfileRole } from "@/core/domain/enums/profile-role.enum";
import {
  getVisibleNavItems,
  isNavItemActive,
  type AppNavItem,
} from "@/presentation/config/app-navigation";
import { useConnectionCounts } from "@/presentation/hooks/use-connections";
import { useUnreadTotal } from "@/presentation/hooks/use-conversations";
import { useUnreadNotificationsCount } from "@/presentation/hooks/use-notifications";
import { useAuthStore } from "@/presentation/stores/auth.store";

function formatBadgeCount(count: number): string {
  if (count > 99) return "99+";
  return String(count);
}

/** Primary destinations shown in the LinkedIn-style mobile bottom bar. */
function getBottomNavItems(role: ProfileRole): AppNavItem[] {
  const items = getVisibleNavItems(role);
  const preferred = ["/feed", "/network", "/notifications", "/jobs"];
  const primary = preferred
    .map((href) => items.find((item) => item.href === href))
    .filter((item): item is AppNavItem => Boolean(item));

  const admin = items.find((item) => item.href.startsWith("/admin"));
  if (admin) {
    return [...primary, admin];
  }
  return primary;
}

/**
 * Fixed bottom tab bar for phones and tablets (&lt; lg).
 * Mirrors the professional-network mobile shell: icon + short label + badges.
 */
export function AppBottomNav() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const tNetwork = useTranslations("network");
  const tMessaging = useTranslations("messaging");
  const tNotifications = useTranslations("notifications");
  const user = useAuthStore((state) => state.user);
  const { pending } = useConnectionCounts();
  const unreadQuery = useUnreadTotal(Boolean(user));
  const unreadTotal = unreadQuery.data ?? 0;
  const notificationsQuery = useUnreadNotificationsCount(Boolean(user));
  const unreadNotifications = notificationsQuery.data ?? 0;

  if (!user) return null;

  const items = getBottomNavItems(user.role);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-nav pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label={t("main")}
    >
      <ul className="mx-auto flex h-14 max-w-[1128px] items-stretch justify-around px-1">
        {items.map((item) => {
          const isActive = isNavItemActive(item, pathname);
          const Icon = item.icon;
          const showPendingBadge = item.href === "/network" && pending > 0;
          const showUnreadBadge = item.href === "/messaging" && unreadTotal > 0;
          const showNotificationsBadge =
            item.href === "/notifications" && unreadNotifications > 0;

          return (
            <li key={item.href} className="flex min-w-0 flex-1">
              <Link
                href={item.href}
                className={`relative flex w-full min-w-0 flex-col items-center justify-center gap-0.5 px-1 text-[10px] transition-colors ${
                  isActive
                    ? "font-semibold text-nav-active"
                    : "font-normal text-nav-foreground"
                }`}
                aria-current={isActive ? "page" : undefined}
                aria-label={
                  showPendingBadge
                    ? tNetwork("pendingNavBadge", { count: pending })
                    : showUnreadBadge
                      ? tMessaging("unreadNavBadge", { count: unreadTotal })
                      : showNotificationsBadge
                        ? tNotifications("unreadNavBadge", {
                            count: unreadNotifications,
                          })
                        : t(item.labelKey)
                }
              >
                <span className="relative inline-flex">
                  <Icon
                    className={`h-5 w-5 ${isActive ? "stroke-[2.25]" : ""}`}
                    aria-hidden
                  />
                  {showPendingBadge ? (
                    <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold leading-none text-white">
                      {formatBadgeCount(pending)}
                    </span>
                  ) : null}
                  {showUnreadBadge ? (
                    <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold leading-none text-white">
                      {formatBadgeCount(unreadTotal)}
                    </span>
                  ) : null}
                  {showNotificationsBadge ? (
                    <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold leading-none text-white">
                      {formatBadgeCount(unreadNotifications)}
                    </span>
                  ) : null}
                </span>
                <span className="max-w-full truncate">{t(item.labelKey)}</span>
                {isActive ? (
                  <span
                    className="absolute inset-x-2 top-0 h-0.5 rounded-full bg-nav-active"
                    aria-hidden
                  />
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
