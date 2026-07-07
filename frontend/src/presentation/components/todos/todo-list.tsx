"use client";

import { useMemo, useState } from "react";
import { ApiError } from "@/core/application/errors/api.error";
import { TodoCreateForm } from "@/presentation/components/todos/todo-create-form";
import { TodoItem } from "@/presentation/components/todos/todo-item";
import { useTodos } from "@/presentation/hooks/use-todos";

type TodoFilter = "all" | "active" | "completed";

const filters: { id: TodoFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "completed", label: "Done" },
];

export function TodoList() {
  const { data: todos, isLoading, error } = useTodos();
  const [filter, setFilter] = useState<TodoFilter>("all");

  const stats = useMemo(() => {
    const total = todos?.length ?? 0;
    const completed = todos?.filter((todo) => todo.completed).length ?? 0;
    return {
      total,
      completed,
      active: total - completed,
    };
  }, [todos]);

  const filteredTodos = useMemo(() => {
    if (!todos) return [];
    switch (filter) {
      case "active":
        return todos.filter((todo) => !todo.completed);
      case "completed":
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  return (
    <section className="flex max-h-[calc(100vh-9rem)] min-h-[28rem] flex-col rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="border-b border-zinc-100 px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Tasks</h2>
            <p className="mt-1 text-sm text-zinc-500">
              {stats.total} total · {stats.active} active · {stats.completed}{" "}
              done
            </p>
          </div>

          <div className="flex rounded-lg border border-zinc-200 bg-zinc-50 p-1">
            {filters.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  filter === item.id
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-500 hover:text-zinc-800"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <TodoCreateForm />
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
        ) : filteredTodos.length > 0 ? (
          <ul className="space-y-2">
            {filteredTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 px-6 py-16 text-center">
            <p className="text-sm font-medium text-zinc-700">
              {filter === "all"
                ? "No tasks yet"
                : filter === "active"
                  ? "No active tasks"
                  : "No completed tasks"}
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              {filter === "all"
                ? "Add your first task above."
                : "Try another filter or create a new task."}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
