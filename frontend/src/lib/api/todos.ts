import { apiClient } from "@/lib/api/client";
import type {
  CreateTodoPayload,
  Todo,
  UpdateTodoPayload,
} from "@/types/api";

export const todosApi = {
  getAll: () => apiClient<Todo[]>("/todos"),

  getById: (id: string) => apiClient<Todo>(`/todos/${id}`),

  create: (payload: CreateTodoPayload) =>
    apiClient<Todo>("/todos", {
      method: "POST",
      body: payload,
    }),

  update: (id: string, payload: UpdateTodoPayload) =>
    apiClient<Todo>(`/todos/${id}`, {
      method: "PATCH",
      body: payload,
    }),

  remove: (id: string) =>
    apiClient<void>(`/todos/${id}`, {
      method: "DELETE",
    }),
};
