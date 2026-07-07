import { ApiError } from "@/core/application/errors/api.error";
import { ApiConfig } from "@/infrastructure/config/api.config";
import type { ApiErrorBodyDto } from "@/infrastructure/http/dto/api-error-body.dto";

export type HttpRequestOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  skipRefresh?: boolean;
};

export class HttpClient {
  private refreshPromise: Promise<boolean> | null = null;

  constructor(private readonly baseUrl: string = ApiConfig.baseUrl) {}

  async request<T>(path: string, options: HttpRequestOptions = {}): Promise<T> {
    const { body, skipRefresh, headers, ...rest } = options;

    const response = await fetch(`${this.baseUrl}${path}`, {
      ...rest,
      credentials: "include",
      headers: {
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    if (
      response.status === 401 &&
      !skipRefresh &&
      !path.startsWith("/auth/refresh") &&
      !path.startsWith("/auth/signin") &&
      !path.startsWith("/auth/signup")
    ) {
      const refreshed = await this.refreshSession();
      if (refreshed) {
        return this.request<T>(path, { ...options, skipRefresh: true });
      }
    }

    if (!response.ok) {
      throw new ApiError(
        await this.parseErrorMessage(response),
        response.status,
      );
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  async upload<T>(path: string, file: File): Promise<T> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      throw new ApiError(
        await this.parseErrorMessage(response),
        response.status,
      );
    }

    return response.json() as Promise<T>;
  }

  private async refreshSession(): Promise<boolean> {
    if (!this.refreshPromise) {
      this.refreshPromise = fetch(`${this.baseUrl}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      })
        .then((res) => res.ok)
        .finally(() => {
          this.refreshPromise = null;
        });
    }
    return this.refreshPromise;
  }

  private async parseErrorMessage(response: Response): Promise<string> {
    try {
      const data = (await response.json()) as ApiErrorBodyDto;
      if (Array.isArray(data.message)) return data.message.join(", ");
      if (typeof data.message === "string") return data.message;
    } catch {
      // ignore parse errors
    }
    return response.statusText || "Request failed";
  }
}
