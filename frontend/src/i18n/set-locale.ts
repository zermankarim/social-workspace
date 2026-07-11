"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { isAppLocale, LOCALE_COOKIE_NAME, type AppLocale } from "@/i18n/config";

/**
 * TODO(backend): After login, prefer the locale stored on the user profile
 * and call an API to update it when the user changes language here.
 */
export async function setLocale(locale: string): Promise<AppLocale | null> {
  if (!isAppLocale(locale)) return null;

  const store = await cookies();
  store.set(LOCALE_COOKIE_NAME, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  revalidatePath("/", "layout");
  return locale;
}
