"use client";

import { TodoOrderBy } from "@/core/domain/enums/todo-order-by.enum";
import { TodoSortBy } from "@/core/domain/enums/todo-sort-by.enum";
import { TodoSearchInput } from "@/presentation/components/todos/todo-search-input";
import { TodoSortControls } from "@/presentation/components/todos/todo-sort-controls";

interface TodoFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: TodoSortBy;
  orderBy: TodoOrderBy;
  onSortByChange: (sortBy: TodoSortBy) => void;
  onOrderByChange: (orderBy: TodoOrderBy) => void;
  disabled?: boolean;
}

export function TodoFilterBar({
  search,
  onSearchChange,
  sortBy,
  orderBy,
  onSortByChange,
  onOrderByChange,
  disabled = false,
}: TodoFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="min-w-0 flex-1">
        <TodoSearchInput
          value={search}
          onChange={onSearchChange}
          disabled={disabled}
        />
      </div>
      <TodoSortControls
        sortBy={sortBy}
        orderBy={orderBy}
        onSortByChange={onSortByChange}
        onOrderByChange={onOrderByChange}
      />
    </div>
  );
}
