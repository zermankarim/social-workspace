export type AppEnv = {
  app: { port: number; nodeEnv: string; cors: string; credentials: boolean };
  url: { front: string };
  database: { url: string };
  auth: {
    jwtSecret: string;
    accessTokenExpiresInSec: string;
    refreshJwtSecret: string;
    refreshTokenExpiresInSec: string;
    maxSessions: number;
  };
  api: { prefix: string; version: string };
  cookies: {
    access: {
      maxAgeMs: number;
      secure: boolean;
      sameSite: 'strict' | 'lax' | 'none';
    };
    refresh: {
      maxAgeMs: number;
      secure: boolean;
      sameSite: 'strict' | 'lax' | 'none';
    };
  };
  upload: {
    maxFileSizeBytes: number;
    supabaseUrl: string;
    supabaseServiceRoleKey: string;
    supabaseStorageBucket: string;
  };
  mail: {
    /** Empty when not configured — MailService then logs instead of sending. */
    resendApiKey: string;
    fromAddress: string;
  };
};
