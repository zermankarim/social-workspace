"use client";

import { LogOut, MessageSquare, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { BrandLogo } from "@/presentation/components/brand/brand-logo";
import { AppNav } from "@/presentation/components/layout/app-nav";
import { HeaderSearch } from "@/presentation/components/layout/header-search";
import { StreakFlame } from "@/presentation/components/shared/streak-flame/streak-flame";
import { Button } from "@/presentation/components/ui/button";
import { ThemeToggle } from "@/presentation/components/ui/theme-toggle";
import { useUnreadTotal } from "@/presentation/hooks/use-conversations";
import { useSignout } from "@/presentation/hooks/use-auth";
import { useGamificationState } from "@/presentation/hooks/use-gamification";
import { useAuthStore } from "@/presentation/stores/auth.store";

function getInitials(
  firstName: string,
  lastName: string,
  email: string,
): string {
  const fromName = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.trim();
  if (fromName) return fromName.toUpperCase();
  return (email.split("@")[0] ?? "U").slice(0, 2).toUpperCase();
}

function formatBadgeCount(count: number): string {
  if (count > 99) return "99+";
  return String(count);
}

/**
 * App chrome header.
 * - &lt; lg: compact LinkedIn-style top bar (logo, search entry, messaging, me)
 * - lg+: search + primary nav in the top bar (bottom nav is hidden)
 */
export function AppHeader() {
  const t = useTranslations("common");
  const tMessaging = useTranslations("messaging");
  const tProfile = useTranslations("profile");
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const signout = useSignout();
  const unreadQuery = useUnreadTotal(Boolean(user));
  const unreadTotal = unreadQuery.data ?? 0;
  const gamificationQuery = useGamificationState(Boolean(user));
  const currentStreak = gamificationQuery.data?.currentStreak ?? 0;
  const messagingActive =
    pathname === "/messaging" || pathname.startsWith("/messaging/");

  if (!user) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-nav">
      <div className="mx-auto flex h-[52px] max-w-[1128px] items-center gap-2 px-3 sm:px-4 lg:gap-3">
        <BrandLogo href="/feed" variant="mark" className="rounded-lg" />

        <HeaderSearch className="hidden min-w-0 flex-1 md:block md:max-w-[280px]" />

        <div className="min-w-0 flex-1 md:hidden">
          <Link
            href="/search"
            className="flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
            aria-label={t("search")}
          >
            <Search className="h-5 w-5 shrink-0" aria-hidden />
          </Link>
        </div>

        <AppNav
          id="app-primary-navigation"
          role={user.role}
          className="hidden min-w-0 flex-1 lg:flex"
        />

        <div className="flex shrink-0 items-center justify-end gap-0.5 sm:gap-1">
          <Link
            href="/messaging"
            className={`relative inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-surface-muted lg:hidden ${
              messagingActive
                ? "text-nav-active"
                : "text-muted hover:text-foreground"
            }`}
            aria-label={
              unreadTotal > 0
                ? tMessaging("unreadNavBadge", { count: unreadTotal })
                : tMessaging("title")
            }
          >
            <MessageSquare className="h-5 w-5" aria-hidden />
            {unreadTotal > 0 ? (
              <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold leading-none text-white">
                {formatBadgeCount(unreadTotal)}
              </span>
            ) : null}
          </Link>

          <ThemeToggle />

          <Link
            href="/profile"
            className="flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-surface-muted"
            aria-label={t("profile")}
          >
            <span className="relative inline-flex h-7 w-7 shrink-0">
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="h-7 w-7 rounded-full object-cover"
                />
              ) : (
                <span
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-soft text-[11px] font-semibold text-primary"
                  aria-hidden
                >
                  {getInitials(user.firstName, user.lastName, user.email)}
                </span>
              )}
              {currentStreak > 0 ? (
                <StreakFlame
                  streak={currentStreak}
                  size="sm"
                  label={tProfile("streakDays", { count: currentStreak })}
                  className="absolute -right-1 -bottom-1 drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)]"
                />
              ) : null}
            </span>
          </Link>

          <Button
            variant="ghost"
            onClick={() => signout.mutate()}
            disabled={signout.isPending}
            className="gap-1.5 px-2"
            aria-label={t("signOut")}
          >
            <LogOut className="h-4 w-4" aria-hidden />
            <span className="hidden text-xs xl:inline">
              {signout.isPending ? "…" : t("signOut")}
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
