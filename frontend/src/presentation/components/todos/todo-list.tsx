"use client";

import { useEffect, useState } from "react";
import { ApiError } from "@/core/application/errors/api.error";
import { TodoOrderBy } from "@/core/domain/enums/todo-order-by.enum";
import { TodoSortBy } from "@/core/domain/enums/todo-sort-by.enum";
import { ZonePanel } from "@/presentation/components/ui/zone-panel";
import { TodoCreateForm } from "@/presentation/components/todos/todo-create-form";
import { TodoFilterBar } from "@/presentation/components/todos/todo-filter-bar";
import { TodoItem } from "@/presentation/components/todos/todo-item";
import { TodoPagination } from "@/presentation/components/todos/todo-pagination";
import { useDebouncedValue } from "@/presentation/hooks/use-debounced-value";
import {
  DEFAULT_TODO_PAGE_SIZE,
  useTodos,
} from "@/presentation/hooks/use-todos";

export function TodoList() {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState(TodoSortBy.CREATED_AT);
  const [orderBy, setOrderBy] = useState(TodoOrderBy.DESC);
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebouncedValue(searchInput.trim(), 300);

  const { data, isLoading, isFetching, error } = useTodos({
    page,
    limit: DEFAULT_TODO_PAGE_SIZE,
    sortBy,
    orderBy,
    search: debouncedSearch || undefined,
  });

  const todos = data?.data ?? [];
  const meta = data?.meta;
  const isSearching = debouncedSearch.length > 0;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sortBy, orderBy]);

  return (
    <section className="flex min-h-0 flex-1 flex-col rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <div className="space-y-3 border-b border-zinc-100 px-5 py-4 sm:px-6">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Tasks</h2>
          <p className="mt-0.5 text-sm text-zinc-500">
            {meta
              ? isSearching
                ? `${meta.total} match${meta.total === 1 ? "" : "es"} for "${debouncedSearch}"`
                : `${meta.total} task${meta.total === 1 ? "" : "s"} total`
              : "Loading tasks…"}
            {isFetching && !isLoading ? (
              <span className="ml-2 text-xs text-zinc-400">Updating…</span>
            ) : null}
          </p>
        </div>

        <ZonePanel variant="controls" label="Search & sort">
          <TodoFilterBar
            search={searchInput}
            onSearchChange={setSearchInput}
            sortBy={sortBy}
            orderBy={orderBy}
            onSortByChange={setSortBy}
            onOrderByChange={setOrderBy}
            disabled={isLoading && !data}
          />
        </ZonePanel>

        <ZonePanel variant="create" label="Add task">
          <TodoCreateForm onCreated={() => setPage(1)} />
        </ZonePanel>
      </div>

      <ZonePanel
        variant="list"
        label="Task list"
        className="mx-5 mb-0 mt-3 flex min-h-0 flex-1 flex-col border-b-0 sm:mx-6"
      >
        <div className="min-h-0 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-200 border-t-violet-700" />
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
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-violet-200/80 bg-white/50 px-6 py-16 text-center">
              <p className="text-sm font-medium text-zinc-700">
                {isSearching ? "No matching tasks" : "No tasks yet"}
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                {isSearching
                  ? "Try a different search term or clear the filter."
                  : "Add your first task above."}
              </p>
            </div>
          )}
        </div>
      </ZonePanel>

      {meta ? (
        <TodoPagination meta={meta} onPageChange={setPage} />
      ) : null}
    </section>
  );
}
