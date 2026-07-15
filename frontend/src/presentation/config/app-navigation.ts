import {
  Home,
  Briefcase,
  Bell,
  MessageSquare,
  Users,
  Shield,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ProfileRole } from "@/core/domain/enums/profile-role.enum";

export type NavLabelKey =
  "home" | "network" | "jobs" | "messaging" | "notifications" | "admin";

export interface AppNavItem {
  href: string;
  labelKey: NavLabelKey;
  icon: LucideIcon;
  roles: ProfileRole[];
  /** Defaults to pathname.startsWith(href) */
  isActive?: (pathname: string) => boolean;
  comingSoon?: boolean;
}

export const appNavItems: AppNavItem[] = [
  {
    href: "/feed",
    labelKey: "home",
    icon: Home,
    roles: [ProfileRole.ADMIN, ProfileRole.USER],
    isActive: (pathname) =>
      pathname === "/feed" || pathname.startsWith("/feed/"),
  },
  {
    href: "/network",
    labelKey: "network",
    icon: Users,
    roles: [ProfileRole.ADMIN, ProfileRole.USER],
  },
  {
    href: "/jobs",
    labelKey: "jobs",
    icon: Briefcase,
    roles: [ProfileRole.ADMIN, ProfileRole.USER],
    comingSoon: true,
  },
  {
    href: "/messaging",
    labelKey: "messaging",
    icon: MessageSquare,
    roles: [ProfileRole.ADMIN, ProfileRole.USER],
    isActive: (pathname) =>
      pathname === "/messaging" || pathname.startsWith("/messaging/"),
  },
  {
    href: "/notifications",
    labelKey: "notifications",
    icon: Bell,
    roles: [ProfileRole.ADMIN, ProfileRole.USER],
    comingSoon: true,
  },
  {
    href: "/admin/users",
    labelKey: "admin",
    icon: Shield,
    roles: [ProfileRole.ADMIN],
    isActive: (pathname) => pathname.startsWith("/admin"),
  },
];

export function getVisibleNavItems(role: ProfileRole): AppNavItem[] {
  return appNavItems.filter((item) => item.roles.includes(role));
}

export function isNavItemActive(item: AppNavItem, pathname: string): boolean {
  return item.isActive?.(pathname) ?? pathname.startsWith(item.href);
}

function isAdminNavItem(item: AppNavItem): boolean {
  return item.href.startsWith("/admin");
}

export function shouldShowNavDivider(
  items: AppNavItem[],
  index: number,
): boolean {
  if (index === 0) return false;

  const current = items[index];
  const previous = items[index - 1];
  return isAdminNavItem(current) && !isAdminNavItem(previous);
}
