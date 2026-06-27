import { Request, Response } from 'express';
import { AppConfigService } from '../../infrastructure/config/services/config.service';

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
  cookiesConfig: AppConfigService['cookies'],
) => {
  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: cookiesConfig.access.secure,
    sameSite: cookiesConfig.access.sameSite,
    maxAge: cookiesConfig.access.maxAgeMs,
  });

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: cookiesConfig.refresh.secure,
    sameSite: cookiesConfig.refresh.sameSite,
    maxAge: cookiesConfig.refresh.maxAgeMs,
  });
};

export const clearAuthCookies = (
  res: Response,
  cookiesConfig: AppConfigService['cookies'],
) => {
  const accessCookieOptions = {
    httpOnly: true,
    secure: cookiesConfig.access.secure,
    sameSite: cookiesConfig.access.sameSite,
  };

  const refreshCookieOptions = {
    httpOnly: true,
    secure: cookiesConfig.refresh.secure,
    sameSite: cookiesConfig.refresh.sameSite,
  };

  res.clearCookie('access_token', accessCookieOptions);
  res.clearCookie('refresh_token', refreshCookieOptions);
};

export const getCookie = (
  req: Request,
  name: 'refresh_token',
): string | undefined => {
  const value: unknown = req.cookies?.[name];

  return typeof value === 'string' ? value : undefined;
};
