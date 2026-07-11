"use client";

import type { ReactNode } from "react";
import { AdminBadge } from "@/presentation/components/ui/admin-badge";

type UserNameWithBadgeProps = {
  name: string;
  showAdminBadge?: boolean;
  className?: string;
  nameClassName?: string;
  badgeSize?: "sm" | "md";
  trailing?: ReactNode;
};

export function UserNameWithBadge({
  name,
  showAdminBadge = false,
  className = "",
  nameClassName = "",
  badgeSize = "sm",
  trailing,
}: UserNameWithBadgeProps) {
  return (
    <span
      className={`inline-flex min-w-0 max-w-full items-center gap-1 ${className}`}
    >
      <span className={`truncate ${nameClassName}`}>{name}</span>
      {showAdminBadge ? <AdminBadge size={badgeSize} /> : null}
      {trailing}
    </span>
  );
}
