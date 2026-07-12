/**
 * App locale preference.
 *
 * Source of truth for signed-in users: `User.preferredLocale` on the backend.
 * Cookie `NEXT_LOCALE` is the SSR/local cache (and the only store for guests).
 */

export const locales = ["en", "ru"] as const;

export type AppLocale = (typeof locales)[number];

export const defaultLocale: AppLocale = "en";

export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

export function isAppLocale(
  value: string | undefined | null,
): value is AppLocale {
  return value != null && (locales as readonly string[]).includes(value);
}

export function toAppLocale(value: string | undefined | null): AppLocale {
  return isAppLocale(value) ? value : defaultLocale;
}
