"use client";

import { LogOut, Search } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { BrandLogo } from "@/presentation/components/brand/brand-logo";
import { AppNav } from "@/presentation/components/layout/app-nav";
import { Button } from "@/presentation/components/ui/button";
import { ThemeToggle } from "@/presentation/components/ui/theme-toggle";
import { UserNameWithBadge } from "@/presentation/components/ui/user-name-with-badge";
import { useSignout } from "@/presentation/hooks/use-auth";
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

export function AppHeader() {
  const t = useTranslations("common");
  const user = useAuthStore((s) => s.user);
  const signout = useSignout();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-nav">
      <div className="mx-auto flex h-[52px] max-w-[1128px] items-center gap-3 px-3 sm:px-4">
        <BrandLogo
          href="/feed"
          variant="mark"
          priority
          className="rounded-md"
        />

        <label className="relative hidden min-w-0 flex-1 md:block md:max-w-[280px]">
          <span className="sr-only">{t("search")}</span>
          <Search
            className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            type="search"
            placeholder={t("search")}
            disabled
            className="h-8 w-full rounded border-0 bg-surface-muted py-1.5 pr-3 pl-8 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </label>

        <AppNav role={user.role} className="min-w-0 flex-1" />

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <div className="hidden items-center gap-2 border-l border-border pl-2 lg:flex">
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-md px-1 py-0.5 hover:bg-surface-muted"
            >
              {user.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt=""
                  className="h-7 w-7 rounded-full object-cover"
                />
              ) : (
                <div
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-soft text-[11px] font-semibold text-primary"
                  aria-hidden
                >
                  {getInitials(user.firstName, user.lastName, user.email)}
                </div>
              )}
              <div className="min-w-0">
                <p className="max-w-[9rem] truncate text-xs font-semibold text-foreground">
                  <UserNameWithBadge
                    name={user.displayName}
                    showAdminBadge={user.isAdmin()}
                    nameClassName="text-xs font-semibold text-foreground"
                  />
                </p>
                <p className="max-w-[9rem] truncate text-[11px] text-muted">
                  {user.email}
                </p>
              </div>
            </Link>
          </div>
          <Button
            variant="ghost"
            onClick={() => signout.mutate()}
            disabled={signout.isPending}
            className="gap-1.5 px-2"
            aria-label={t("signOut")}
          >
            <LogOut className="h-4 w-4" aria-hidden />
            <span className="hidden text-xs sm:inline">
              {signout.isPending ? "…" : t("signOut")}
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
