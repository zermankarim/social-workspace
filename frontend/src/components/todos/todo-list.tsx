"use client";

import { TodoCreateForm } from "@/components/todos/todo-create-form";
import { TodoItem } from "@/components/todos/todo-item";
import { useTodos } from "@/hooks/use-todos";
import { ApiError } from "@/types/api";

export function TodoList() {
  const { data: todos, isLoading, error } = useTodos();

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-900">Your todos</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Create, complete, edit, and delete your tasks.
        </p>
      </div>

      <TodoCreateForm />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
        </div>
      ) : error ? (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error instanceof ApiError ? error.message : "Failed to load todos"}
        </p>
      ) : todos && todos.length > 0 ? (
        <ul className="space-y-3">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
          <p className="text-sm text-zinc-500">No todos yet. Add your first one above.</p>
        </div>
      )}
    </section>
  );
}
