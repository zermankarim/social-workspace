import { apiClient } from "@/lib/api/client";
import type { User, UserByIdResponse } from "@/types/api";

export const usersApi = {
  getAll: () => apiClient<User[]>("/users"),

  getById: (id: string) => apiClient<UserByIdResponse>(`/users/${id}`),
};
