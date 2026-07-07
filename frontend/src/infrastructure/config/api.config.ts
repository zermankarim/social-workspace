export class ApiConfig {
  static readonly baseUrl =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "/api";
}
