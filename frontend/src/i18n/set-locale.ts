"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { isAppLocale, LOCALE_COOKIE_NAME, type AppLocale } from "@/i18n/config";

/**
 * Writes the locale cookie used by next-intl SSR.
 * Returns the applied locale, or null if the value is invalid.
 * `changed` is true when the cookie value actually differed.
 */
export async function setLocale(
  locale: string,
): Promise<{ locale: AppLocale; changed: boolean } | null> {
  if (!isAppLocale(locale)) return null;

  const store = await cookies();
  const previous = store.get(LOCALE_COOKIE_NAME)?.value;
  const changed = previous !== locale;

  if (changed) {
    store.set(LOCALE_COOKIE_NAME, locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    revalidatePath("/", "layout");
  }

  return { locale, changed };
}
