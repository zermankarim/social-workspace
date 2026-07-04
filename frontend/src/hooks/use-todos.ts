"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { todosApi } from "@/lib/api/todos";
import type { CreateTodoPayload, UpdateTodoPayload } from "@/types/api";

export const todosQueryKey = ["todos"] as const;

export function useTodos() {
  return useQuery({
    queryKey: todosQueryKey,
    queryFn: () => todosApi.getAll(),
  });
}

export function useTodo(id: string | null) {
  return useQuery({
    queryKey: [...todosQueryKey, id],
    queryFn: () => todosApi.getById(id!),
    enabled: Boolean(id),
  });
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTodoPayload) => todosApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todosQueryKey });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTodoPayload }) =>
      todosApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todosQueryKey });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => todosApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todosQueryKey });
    },
  });
}
