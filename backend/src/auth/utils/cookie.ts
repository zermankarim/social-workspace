import { Request, Response } from 'express';

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
) => {
  const isProd = process.env.NODE_ENV === 'production';

  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearAuthCookies = (res: Response) => {
  const isProd = process.env.NODE_ENV === 'production';

  const authCookieOptions = {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
  } as const;

  res.clearCookie('access_token', authCookieOptions);
  res.clearCookie('refresh_token', authCookieOptions);
};

export const getCookie = (
  req: Request,
  name: 'refresh_token',
): string | undefined => {
  const value: unknown = req.cookies?.[name];

  return typeof value === 'string' ? value : undefined;
};
