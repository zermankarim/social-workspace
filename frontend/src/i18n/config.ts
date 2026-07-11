/**
 * Client-side locale preference (cookie).
 *
 * TODO(backend): Persist the user's preferred language on the backend
 * (e.g. User.locale / profile settings) and sync it after login/signup
 * instead of relying only on a client cookie. Keep cookie (or similar)
 * as a fast local cache for guests and SSR.
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
