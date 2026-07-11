"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("nav");
  const items = getVisibleNavItems(role);

  return (
    <nav
      className={`flex items-stretch justify-center gap-1 overflow-x-auto ${className}`}
      aria-label={t("main")}
    >
      {items.map((item, index) => {
        const isActive = isNavItemActive(item, pathname);
        const Icon = item.icon;

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
            >
              <Icon
                className={`h-5 w-5 ${isActive ? "stroke-[2.25]" : ""}`}
                aria-hidden
              />
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
