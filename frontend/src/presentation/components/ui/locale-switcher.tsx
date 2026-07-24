"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { changeAppLocale } from "@/i18n/change-app-locale";
import { locales, type AppLocale } from "@/i18n/config";
import { useAuthStore } from "@/presentation/stores/auth.store";

type LocaleSwitcherProps = {
  className?: string;
  /** `compact` — short codes for headers; `full` — translated labels, stretches. */
  variant?: "compact" | "full";
};

export function LocaleSwitcher({
  className = "",
  variant = "compact",
}: LocaleSwitcherProps) {
  const t = useTranslations("locale");
  const tCommon = useTranslations("common");
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);

  const onSelect = (next: AppLocale) => {
    if (next === locale || isPending) return;

    startTransition(async () => {
      try {
        const applied = await changeAppLocale(next, {
          persistToProfile: Boolean(user),
        });
        if (!applied) return;
        if (applied.user) setUser(applied.user);
        if (applied.changed) router.refresh();
      } catch {
        router.refresh();
      }
    });
  };

  const isFull = variant === "full";

  return (
    <div
      role="group"
      aria-label={tCommon("language")}
      className={`inline-flex rounded-lg border border-border bg-surface-muted/60 p-0.5 ${
        isFull ? "w-full" : ""
      } ${className}`}
    >
      {locales.map((code) => {
        const isActive = locale === code;
        return (
          <button
            key={code}
            type="button"
            disabled={isPending}
            aria-pressed={isActive}
            onClick={() => onSelect(code)}
            className={`rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 disabled:opacity-50 ${
              isFull
                ? "h-9 flex-1 px-3 text-sm"
                : "h-9 min-w-11 px-2.5 text-xs tracking-wide"
            } ${
              isActive
                ? "bg-surface text-foreground shadow-sm"
                : "text-muted hover:text-foreground"
            }`}
          >
            {isFull ? t(code) : code.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
