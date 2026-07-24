import Joi from 'joi';

const nodeEnvValues = ['development', 'production', 'test'] as const;

const cookieSameSiteValues = ['strict', 'lax', 'none'] as const;

const customCORSOriginsValidator = (
  value: string,
  helpers: Joi.CustomHelpers,
) => {
  const origins = value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  if (origins.length === 0) {
    return helpers.error('any.custom', {
      message: 'CORS_ORIGINS must contain at least one origin',
    });
  }
  for (const origin of origins) {
    const { error } = Joi.string().uri().validate(origin);
    if (error) {
      return helpers.error('any.custom', {
        message: `Invalid CORS origin: ${origin}`,
      });
    }
  }
  return value;
};

export const validationSchema = Joi.object({
  DATABASE_URL: Joi.string().required().label('Database URL'),
  PORT: Joi.number().port().required().label('Port'),
  NODE_ENV: Joi.string()
    .valid(...nodeEnvValues)
    .required()
    .label('Node Environment'),
  API_PREFIX: Joi.string().required().label('API Prefix'),
  API_VERSION: Joi.string().required().label('API Version'),
  CORS_ORIGINS: Joi.string()
    .custom(customCORSOriginsValidator)
    .required()
    .label('CORS Origins'),
  CORS_CREDENTIALS: Joi.boolean().required().label('CORS Credentials'),
  JWT_SECRET: Joi.string().required().label('JWT Secret'),
  JWT_EXPIRE_IN_SECONDS: Joi.number().required().label('JWT Expire In Seconds'),
  REFRESH_JWT_SECRET: Joi.string().required().label('Refresh JWT Secret'),
  REFRESH_JWT_EXPIRE_IN_SECONDS: Joi.number()
    .required()
    .label('Refresh JWT Expire In Seconds'),
  MAX_COUNT_SESSIONS: Joi.number().required().label('Max Count Sessions'),
  FRONT_URL: Joi.string().uri().required().label('Front URL'),
  ACCESS_COOKIE_SECURE: Joi.boolean().required().label('Access Cookie Secure'),
  ACCESS_COOKIE_SAMESITE: Joi.string()
    .valid(...cookieSameSiteValues)
    .required()
    .label('Access Cookie SameSite'),
  ACCESS_COOKIE_MAX_AGE_MS: Joi.number()
    .positive()
    .integer()
    .required()
    .label('Access Cookie Max Age MS'),
  REFRESH_COOKIE_SECURE: Joi.boolean()
    .required()
    .label('Refresh Cookie Secure'),
  REFRESH_COOKIE_SAMESITE: Joi.string()
    .valid(...cookieSameSiteValues)
    .required()
    .label('Refresh Cookie SameSite'),
  REFRESH_COOKIE_MAX_AGE_MS: Joi.number()
    .positive()
    .integer()
    .required()
    .label('Refresh Cookie Max Age MS'),
  UPLOAD_MAX_FILE_SIZE_BYTES: Joi.number()
    .required()
    .label('Upload Max File Size Bytes'),
  SUPABASE_URL: Joi.string().uri().required().label('Supabase URL'),
  SUPABASE_SERVICE_ROLE_KEY: Joi.string()
    .required()
    .label('Supabase Service Role Key'),
  SUPABASE_STORAGE_BUCKET: Joi.string()
    .required()
    .label('Supabase Storage Bucket'),
  // Optional: password-reset emails are logged instead of sent when unset.
  RESEND_API_KEY: Joi.string()
    .allow('')
    .optional()
    .default('')
    .label('Resend API Key'),
  MAIL_FROM_ADDRESS: Joi.string()
    .optional()
    .default('onboarding@resend.dev')
    .label('Mail From Address'),
});
