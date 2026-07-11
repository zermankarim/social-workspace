"use client";

import { Crown } from "lucide-react";
import { useTranslations } from "next-intl";

type AdminBadgeProps = {
  className?: string;
  size?: "sm" | "md";
};

export function AdminBadge({ className = "", size = "sm" }: AdminBadgeProps) {
  const t = useTranslations("common");
  const iconClass = size === "md" ? "h-3.5 w-3.5" : "h-3 w-3";

  return (
    <span
      title={t("adminBadge")}
      aria-label={t("adminBadge")}
      className={`inline-flex shrink-0 items-center justify-center text-amber-600/70 dark:text-amber-400/55 ${className}`}
    >
      <Crown className={iconClass} strokeWidth={1.75} aria-hidden />
    </span>
  );
}
