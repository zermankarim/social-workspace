"use client";

import { useEffect, useRef, useState } from "react";
import { LogOut, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { BrandLogo } from "@/presentation/components/brand/brand-logo";
import { AppNav } from "@/presentation/components/layout/app-nav";
import { HeaderSearch } from "@/presentation/components/layout/header-search";
import { Button } from "@/presentation/components/ui/button";
import { ThemeToggle } from "@/presentation/components/ui/theme-toggle";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen]);

  if (!user) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-nav">
      <div className="mx-auto grid max-w-[1128px] grid-cols-[auto_minmax(0,1fr)_auto] grid-rows-[52px] items-center gap-x-2 px-3 sm:px-4 md:grid-rows-[52px_48px] md:gap-x-3 xl:grid-cols-[auto_minmax(12rem,17.5rem)_minmax(0,1fr)_auto] xl:grid-rows-[52px]">
        <BrandLogo
          href="/feed"
          variant="mark"
          priority
          onClick={() => setMobileMenuOpen(false)}
          className="rounded-md"
        />

        <HeaderSearch />

        <AppNav
          id="app-primary-navigation"
          role={user.role}
          onNavigate={() => setMobileMenuOpen(false)}
          className={`absolute inset-x-0 top-[52px] grid-cols-3 border-t border-border bg-nav p-2 shadow-card ${
            mobileMenuOpen ? "grid" : "hidden"
          } md:static md:col-span-3 md:row-start-2 md:flex md:h-12 md:min-w-0 md:border-t md:p-0 md:shadow-none xl:col-span-1 xl:col-start-3 xl:row-start-1 xl:h-[52px] xl:border-0`}
        />

        <div className="col-start-3 row-start-1 flex shrink-0 items-center justify-end gap-0.5 sm:gap-1 xl:col-start-4">
          <Link
            href="/search"
            onClick={() => setMobileMenuOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-muted hover:text-foreground md:hidden"
            aria-label={t("search")}
          >
            <Search className="h-4 w-4" aria-hidden />
          </Link>
          <ThemeToggle />
          <Link
            href="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-surface-muted"
            aria-label={t("profile")}
          >
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
          </Link>
          <Button
            variant="ghost"
            onClick={() => signout.mutate()}
            disabled={signout.isPending}
            className="gap-1.5 px-2"
            aria-label={t("signOut")}
          >
            <LogOut className="h-4 w-4" aria-hidden />
            <span className="hidden text-xs lg:inline">
              {signout.isPending ? "…" : t("signOut")}
            </span>
          </Button>
          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => {
              if (mobileMenuOpen) {
                setMobileMenuOpen(false);
                return;
              }
              setMobileMenuOpen(true);
              requestAnimationFrame(() => {
                document
                  .querySelector<HTMLAnchorElement>("#app-primary-navigation a")
                  ?.focus();
              });
            }}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-muted hover:text-foreground md:hidden"
            aria-label={mobileMenuOpen ? t("close") : t("menu")}
            aria-expanded={mobileMenuOpen}
            aria-controls="app-primary-navigation"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" aria-hidden />
            ) : (
              <Menu className="h-5 w-5" aria-hidden />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
