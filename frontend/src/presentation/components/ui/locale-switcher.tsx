"use client";

import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { locales, type AppLocale } from "@/i18n/config";
import { setLocale } from "@/i18n/set-locale";

export function LocaleSwitcher({ className = "" }: { className?: string }) {
  const t = useTranslations("locale");
  const tCommon = useTranslations("common");
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const onChange = (next: string) => {
    startTransition(async () => {
      const applied = await setLocale(next);
      if (applied) router.refresh();
    });
  };

  return (
    <label className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="sr-only">{tCommon("language")}</span>
      <select
        value={locale}
        disabled={isPending}
        onChange={(event) => onChange(event.target.value)}
        className="h-8 cursor-pointer rounded-md border border-border-strong bg-surface px-2 text-xs font-medium text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
        aria-label={tCommon("language")}
      >
        {locales.map((code) => (
          <option key={code} value={code}>
            {t(code)}
          </option>
        ))}
      </select>
    </label>
  );
}
