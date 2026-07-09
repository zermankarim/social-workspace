"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getVisibleNavItems,
  isNavItemActive,
  shouldShowNavDivider,
} from "@/presentation/config/app-navigation";
import { ProfileRole } from "@/core/domain/enums/profile-role.enum";

interface AppNavProps {
  role: ProfileRole;
  className?: string;
}

export function AppNav({ role, className = "" }: AppNavProps) {
  const pathname = usePathname();
  const items = getVisibleNavItems(role);

  return (
    <nav
      className={`flex items-center gap-1 overflow-x-auto ${className}`}
      aria-label="Main navigation"
    >
      {items.map((item, index) => {
        const isActive = isNavItemActive(item, pathname);
        const Icon = item.icon;

        return (
          <div key={item.href} className="flex shrink-0 items-center gap-1">
            {shouldShowNavDivider(items, index) ? (
              <div
                className="mx-1 hidden h-4 w-px bg-zinc-200 sm:block dark:bg-zinc-700"
                aria-hidden
              />
            ) : null}
            <Link
              href={item.href}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors ${
                isActive
                  ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-700 dark:text-white"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {item.label}
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
