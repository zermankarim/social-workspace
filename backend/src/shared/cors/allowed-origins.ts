export function buildAllowedOrigins(
  corsEnv: string,
  nodeEnv: string,
  port: number,
): string[] {
  const configured = (corsEnv ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return [
    ...new Set([
      ...configured,
      ...(nodeEnv === 'development'
        ? [`http://localhost:${port}`, `http://127.0.0.1:${port}`]
        : []),
    ]),
  ];
}
