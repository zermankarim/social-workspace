"use client";

import { LayoutDashboard, ListTodo, LogOut, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/presentation/components/ui/button";
import { ThemeToggle } from "@/presentation/components/ui/theme-toggle";
import { RoleBadge } from "@/presentation/components/ui/role-badge";
import { useSignout } from "@/presentation/hooks/use-auth";
import { useAuthStore } from "@/presentation/stores/auth.store";
import { ProfileRole } from "@/core/domain/enums/profile-role.enum";

const navItems: {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: ProfileRole[];
}[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: [ProfileRole.ADMIN, ProfileRole.USER],
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
    roles: [ProfileRole.ADMIN],
  },
];

export function AppHeader() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const signout = useSignout();

  if (!user) return null;

  const visibleNav = navItems.filter((item) =>
    item.roles.includes(user.role),
  );

  return (
    <header className="shrink-0 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100"
          >
            <ListTodo className="h-4 w-4" aria-hidden />
            Todo List
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {visibleNav.map((item) => {
              const isActive = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-700 dark:text-white"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
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
            {signout.isPending ? "…" : "Sign out"}
          </Button>
        </div>
      </div>
    </header>
  );
}
