"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/presentation/components/ui/button";
import { RoleBadge } from "@/presentation/components/ui/role-badge";
import { useSignout } from "@/presentation/hooks/use-auth";
import { useAuthStore } from "@/presentation/stores/auth.store";
import { ProfileRole } from "@/core/domain/enums/profile-role.enum";

const navItems: { href: string; label: string; roles: ProfileRole[] }[] = [
  { href: "/dashboard", label: "Dashboard", roles: [ProfileRole.ADMIN, ProfileRole.USER] },
  { href: "/admin/users", label: "Users", roles: [ProfileRole.ADMIN] },
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
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-sm font-semibold text-zinc-900">
            Todo List
          </Link>
          <nav className="hidden items-center gap-1 sm:flex">
            {visibleNav.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                    isActive
                      ? "bg-zinc-100 font-medium text-zinc-900"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-zinc-900">{user.email}</p>
            <div className="mt-0.5 flex justify-end">
              <RoleBadge role={user.role} />
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={() => signout.mutate()}
            disabled={signout.isPending}
          >
            {signout.isPending ? "…" : "Sign out"}
          </Button>
        </div>
      </div>
    </header>
  );
}
