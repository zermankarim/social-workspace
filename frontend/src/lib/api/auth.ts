import { apiClient } from "@/lib/api/client";
import type {
  AuthCredentials,
  RefreshResponse,
  SigninResponse,
  SignoutResponse,
  SignupResponse,
} from "@/types/api";

export const authApi = {
  signup: (credentials: AuthCredentials) =>
    apiClient<SignupResponse>("/auth/signup", {
      method: "POST",
      body: credentials,
      skipRefresh: true,
    }),

  signin: (credentials: AuthCredentials) =>
    apiClient<SigninResponse>("/auth/signin", {
      method: "POST",
      body: credentials,
      skipRefresh: true,
    }),

  signout: () =>
    apiClient<SignoutResponse>("/auth/signout", {
      method: "POST",
      skipRefresh: true,
    }),

  refresh: () =>
    apiClient<RefreshResponse>("/auth/refresh", {
      method: "POST",
      skipRefresh: true,
    }),
};
