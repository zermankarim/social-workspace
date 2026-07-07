"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateTodoAttachmentDto } from "@/core/application/dtos/create-todo-attachment.dto";
import { CreateTodoDto } from "@/core/application/dtos/create-todo.dto";
import { UpdateTodoDto } from "@/core/application/dtos/update-todo.dto";
import { appContainer } from "@/modules/app.container";

export const todosQueryKey = ["todos"] as const;

export function useTodos() {
  return useQuery({
    queryKey: todosQueryKey,
    queryFn: () => appContainer.todoService.getAll(),
  });
}

export function useTodo(id: string | null) {
  return useQuery({
    queryKey: [...todosQueryKey, id],
    queryFn: () => appContainer.todoService.getById(id!),
    enabled: Boolean(id),
  });
}

type CreateTodoInput = {
  text: string;
  attachments?: {
    url: string;
    fileName: string;
    mimeType?: string;
    sizeBytes?: number;
  }[];
};

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTodoInput) =>
      appContainer.todoService.create(
        new CreateTodoDto(
          input.text,
          input.attachments?.map(
            (attachment) =>
              new CreateTodoAttachmentDto(
                attachment.url,
                attachment.fileName,
                attachment.mimeType,
                attachment.sizeBytes,
              ),
          ),
        ),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todosQueryKey });
    },
  });
}

export function useUpdateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      text,
      completed,
    }: {
      id: string;
      text?: string;
      completed?: boolean;
    }) =>
      appContainer.todoService.update(
        id,
        new UpdateTodoDto(text, completed),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todosQueryKey });
    },
  });
}

export function useDeleteTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => appContainer.todoService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: todosQueryKey });
    },
  });
}
