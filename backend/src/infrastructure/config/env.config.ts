import { registerAs } from '@nestjs/config';
import { AppEnv } from './types/env.types';

export const envConfig = registerAs(
  'env',
  (): AppEnv => ({
    app: {
      port: Number(process.env.PORT),
      nodeEnv: process.env.NODE_ENV as string,
      cors: process.env.CORS_ORIGINS as string,
      credentials: process.env.CORS_CREDENTIALS === 'true',
    },

    url: {
      front: process.env.FRONT_URL as string,
    },

    database: {
      url: process.env.DATABASE_URL as string,
    },

    auth: {
      jwtSecret: process.env.JWT_SECRET as string,
      accessTokenExpiresInSec: process.env.JWT_EXPIRE_IN_SECONDS as string,
      refreshJwtSecret: process.env.REFRESH_JWT_SECRET as string,
      refreshTokenExpiresInSec: process.env
        .REFRESH_JWT_EXPIRE_IN_SECONDS as string,
      maxSessions: Number(process.env.MAX_COUNT_SESSIONS),
    },

    cookies: {
      access: {
        maxAgeMs: Number(process.env.ACCESS_COOKIE_MAX_AGE_MS),
        secure: process.env.ACCESS_COOKIE_SECURE === 'true',
        sameSite: process.env.ACCESS_COOKIE_SAMESITE as
          | 'strict'
          | 'lax'
          | 'none',
      },
      refresh: {
        maxAgeMs: Number(process.env.REFRESH_COOKIE_MAX_AGE_MS),
        secure: process.env.REFRESH_COOKIE_SECURE === 'true',
        sameSite: process.env.REFRESH_COOKIE_SAMESITE as
          | 'strict'
          | 'lax'
          | 'none',
      },
    },

    api: {
      prefix: process.env.API_PREFIX as string,
      version: process.env.API_VERSION as string,
    },

    upload: {
      dir: process.env.UPLOAD_DIR as string,
      publicUrl: process.env.PUBLIC_URL as string,
      maxFileSizeBytes: Number(process.env.UPLOAD_MAX_FILE_SIZE_BYTES),
    },
  }),
);
