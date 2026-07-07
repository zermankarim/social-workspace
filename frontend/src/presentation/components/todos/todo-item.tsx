"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/presentation/components/ui/button";
import { useDeleteTodo, useUpdateTodo } from "@/presentation/hooks/use-todos";
import {
  updateTodoTextSchema,
  type UpdateTodoTextFormValues,
} from "@/presentation/validations/todo.validation";
import type { Todo } from "@/core/domain/entities/todo.entity";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const updateTodo = useUpdateTodo();
  const deleteTodo = useDeleteTodo();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateTodoTextFormValues>({
    resolver: zodResolver(updateTodoTextSchema),
    defaultValues: { text: todo.text },
  });

  const toggleCompleted = () => {
    updateTodo.mutate({
      id: todo.id,
      completed: !todo.completed,
    });
  };

  const startEditing = () => {
    reset({ text: todo.text });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    reset({ text: todo.text });
    setIsEditing(false);
  };

  const saveEdit = handleSubmit((values) => {
    updateTodo.mutate(
      { id: todo.id, text: values.text },
      { onSuccess: () => setIsEditing(false) },
    );
  });

  const isPending = updateTodo.isPending || deleteTodo.isPending;

  return (
    <li className="rounded-lg border border-zinc-100 bg-zinc-50/50 p-3 transition-colors hover:bg-zinc-50">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={toggleCompleted}
          disabled={isPending}
          className="mt-1 h-4 w-4 cursor-pointer rounded border-zinc-300 text-zinc-900 focus:ring-zinc-400"
          aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
        />

        <div className="min-w-0 flex-1">
          {isEditing ? (
            <form onSubmit={saveEdit} className="space-y-2">
              <input
                className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-200"
                autoFocus
                disabled={isPending}
                {...register("text")}
              />
              {errors.text ? (
                <p className="text-xs text-red-600">{errors.text.message}</p>
              ) : null}
              <div className="flex gap-2">
                <Button type="submit" disabled={isPending}>
                  Save
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={cancelEditing}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <button
              type="button"
              onClick={startEditing}
              disabled={isPending}
              className={`w-full text-left text-sm ${
                todo.completed
                  ? "text-zinc-400 line-through"
                  : "text-zinc-900"
              }`}
            >
              {todo.text}
            </button>
          )}

          {todo.attachments.length > 0 ? (
            <ul className="mt-2 flex flex-wrap gap-2">
              {todo.attachments.map((attachment) => (
                <li key={attachment.id}>
                  {attachment.mimeType?.startsWith("image/") ? (
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block overflow-hidden rounded-md border border-zinc-200"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={attachment.url}
                        alt={attachment.fileName}
                        className="h-20 w-20 object-cover"
                      />
                    </a>
                  ) : (
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-200"
                    >
                      {attachment.fileName}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          ) : null}

          <p className="mt-2 text-xs text-zinc-400">
            {new Date(todo.createdAt).toLocaleString()}
          </p>
        </div>

        {!isEditing ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => deleteTodo.mutate(todo.id)}
            disabled={isPending}
            className="shrink-0 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            Delete
          </Button>
        ) : null}
      </div>
    </li>
  );
}
