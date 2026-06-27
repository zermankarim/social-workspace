export type CorsOrigin = string | undefined;
export type CorsCallback = (
  err: Error | null,
  allow?: boolean | string,
) => void;
