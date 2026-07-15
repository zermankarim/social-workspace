import { parse as parseCookie } from 'cookie';

export function getAccessTokenFromHandshake(
  cookieHeader?: string,
): string | null {
  if (!cookieHeader) return null;
  const cookies = parseCookie(cookieHeader);
  return cookies.access_token ?? null;
}
