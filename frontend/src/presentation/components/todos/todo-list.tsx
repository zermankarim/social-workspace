"use client";

import { useState } from "react";
import { ApiError } from "@/core/application/errors/api.error";
import { TodoCreateForm } from "@/presentation/components/todos/todo-create-form";
import { TodoItem } from "@/presentation/components/todos/todo-item";
import { TodoPagination } from "@/presentation/components/todos/todo-pagination";
import {
  DEFAULT_TODO_PAGE_SIZE,
  useTodos,
} from "@/presentation/hooks/use-todos";

export function TodoList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, error } = useTodos(
    page,
    DEFAULT_TODO_PAGE_SIZE,
  );

  const todos = data?.data ?? [];
  const meta = data?.meta;

  return (
    <section className="flex min-h-0 flex-1 flex-col rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-100 px-5 py-5 sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Tasks</h2>
            <p className="mt-1 text-sm text-zinc-500">
              {meta
                ? `${meta.total} task${meta.total === 1 ? "" : "s"} total`
                : "Loading tasks…"}
            </p>
          </div>
          {isFetching && !isLoading ? (
            <span className="text-xs text-zinc-400">Updating…</span>
          ) : null}
        </div>

        <div className="mt-5">
          <TodoCreateForm onCreated={() => setPage(1)} />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
          </div>
        ) : error ? (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error instanceof ApiError ? error.message : "Failed to load todos"}
          </p>
        ) : todos.length > 0 ? (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 px-6 py-16 text-center">
            <p className="text-sm font-medium text-zinc-700">No tasks yet</p>
            <p className="mt-1 text-sm text-zinc-500">
              Add your first task above.
            </p>
          </div>
        )}
      </div>

      {meta ? (
        <TodoPagination meta={meta} onPageChange={setPage} />
      ) : null}
    </section>
  );
}
