"use client";

import { LogOut, MessagesSquare } from "lucide-react";
import Link from "next/link";
import { AppNav } from "@/presentation/components/layout/app-nav";
import { Button } from "@/presentation/components/ui/button";
import { ThemeToggle } from "@/presentation/components/ui/theme-toggle";
import { RoleBadge } from "@/presentation/components/ui/role-badge";
import { useSignout } from "@/presentation/hooks/use-auth";
import { useAuthStore } from "@/presentation/stores/auth.store";

export function AppHeader() {
  const user = useAuthStore((s) => s.user);
  const signout = useSignout();

  if (!user) return null;

  return (
    <header className="shrink-0 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-6">
          <Link
            href="/dashboard"
            className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100"
          >
            <MessagesSquare className="h-4 w-4" aria-hidden />
            Social
          </Link>
          <AppNav role={user.role} className="min-w-0 flex-1" />
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <div className="hidden text-right md:block">
            <p className="max-w-[12rem] truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {user.email}
            </p>
            <div className="mt-0.5 flex justify-end">
              <RoleBadge role={user.role} />
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={() => signout.mutate()}
            disabled={signout.isPending}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">
              {signout.isPending ? "…" : "Sign out"}
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
