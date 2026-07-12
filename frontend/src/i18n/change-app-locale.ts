"use client";

import type { User } from "@/core/domain/entities/user.entity";
import { PreferredLocale } from "@/core/domain/enums/preferred-locale.enum";
import { toAppLocale, type AppLocale } from "@/i18n/config";
import { setLocale } from "@/i18n/set-locale";
import { UserMapper } from "@/infrastructure/mappers/user.mapper";
import { appContainer } from "@/modules/app.container";

export function preferredLocaleToAppLocale(
  value: PreferredLocale | string,
): AppLocale {
  return toAppLocale(value);
}

export function appLocaleToPreferredLocale(locale: AppLocale): PreferredLocale {
  return locale === "ru" ? PreferredLocale.RU : PreferredLocale.EN;
}

/** Apply the user's saved preferredLocale to the cookie (SSR cache). */
export async function syncCookieFromUserPreference(
  preferredLocale: PreferredLocale | string,
): Promise<boolean> {
  const result = await setLocale(preferredLocaleToAppLocale(preferredLocale));
  return result?.changed ?? false;
}

export type ChangeAppLocaleResult = {
  locale: AppLocale;
  changed: boolean;
  user: User | null;
};

/**
 * Change UI locale: update cookie always; persist to profile when authenticated.
 */
export async function changeAppLocale(
  next: string,
  options?: { persistToProfile?: boolean },
): Promise<ChangeAppLocaleResult | null> {
  const result = await setLocale(next);
  if (!result) return null;

  let user: User | null = null;
  if (options?.persistToProfile) {
    const profile = await appContainer.profileService.updateMe({
      preferredLocale: appLocaleToPreferredLocale(result.locale),
    });
    user = UserMapper.fromProfile(profile);
  }

  return { locale: result.locale, changed: result.changed, user };
}

export async function applyUserLocaleAfterAuth(
  preferredLocale: PreferredLocale | string,
): Promise<boolean> {
  return syncCookieFromUserPreference(preferredLocale);
}
