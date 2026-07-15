"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ProfileRole } from "@/core/domain/enums/profile-role.enum";
import {
  getVisibleNavItems,
  isNavItemActive,
  shouldShowNavDivider,
} from "@/presentation/config/app-navigation";
import { useConnectionCounts } from "@/presentation/hooks/use-connections";
import { useUnreadTotal } from "@/presentation/hooks/use-conversations";
import { useAuthStore } from "@/presentation/stores/auth.store";

interface AppNavProps {
  role: ProfileRole;
  className?: string;
}

function formatBadgeCount(count: number): string {
  if (count > 99) return "99+";
  return String(count);
}

export function AppNav({ role, className = "" }: AppNavProps) {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const tNetwork = useTranslations("network");
  const tMessaging = useTranslations("messaging");
  const items = getVisibleNavItems(role);
  const { pending } = useConnectionCounts();
  const user = useAuthStore((state) => state.user);
  const unreadQuery = useUnreadTotal(Boolean(user));
  const unreadTotal = unreadQuery.data ?? 0;

  return (
    <nav
      className={`flex items-stretch justify-center gap-1 overflow-x-auto ${className}`}
      aria-label={t("main")}
    >
      {items.map((item, index) => {
        const isActive = isNavItemActive(item, pathname);
        const Icon = item.icon;
        const showPendingBadge = item.href === "/network" && pending > 0;
        const showUnreadBadge = item.href === "/messaging" && unreadTotal > 0;

        return (
          <div key={item.href} className="flex shrink-0 items-stretch">
            {shouldShowNavDivider(items, index) ? (
              <div
                className="mx-1 hidden w-px self-center bg-border sm:block"
                aria-hidden
                style={{ height: "1.5rem" }}
              />
            ) : null}
            <Link
              href={item.href}
              className={`relative flex min-w-[4.5rem] flex-col items-center justify-center gap-0.5 px-2 py-1.5 text-[11px] transition-colors sm:min-w-[5rem] ${
                isActive
                  ? "font-semibold text-nav-active"
                  : "font-normal text-nav-foreground hover:text-nav-active"
              }`}
              aria-label={
                showPendingBadge
                  ? tNetwork("pendingNavBadge", { count: pending })
                  : showUnreadBadge
                    ? tMessaging("unreadNavBadge", { count: unreadTotal })
                    : undefined
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
              </span>
              <span className="hidden sm:inline">{t(item.labelKey)}</span>
              {isActive ? (
                <span
                  className="absolute inset-x-1 bottom-0 h-0.5 rounded-full bg-nav-active"
                  aria-hidden
                />
              ) : null}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
