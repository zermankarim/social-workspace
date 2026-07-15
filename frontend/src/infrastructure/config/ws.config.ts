/**
 * Backend origin for Socket.IO (HTTP rewrite does not proxy WS).
 * Example: http://localhost:8000
 */
export class WsConfig {
  static readonly origin =
    process.env.NEXT_PUBLIC_WS_URL?.replace(/\/$/, "") ??
    "http://localhost:8000";

  static readonly namespace = "/ws";
}
