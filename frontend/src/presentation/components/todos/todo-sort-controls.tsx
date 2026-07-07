"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { TodoOrderBy } from "@/core/domain/enums/todo-order-by.enum";
import { TodoSortBy } from "@/core/domain/enums/todo-sort-by.enum";

interface TodoSortControlsProps {
  sortBy: TodoSortBy;
  orderBy: TodoOrderBy;
  onSortByChange: (sortBy: TodoSortBy) => void;
  onOrderByChange: (orderBy: TodoOrderBy) => void;
}

const sortOptions: { id: TodoSortBy; label: string }[] = [
  { id: TodoSortBy.CREATED_AT, label: "Created" },
  { id: TodoSortBy.UPDATED_AT, label: "Updated" },
];

function segmentButtonClass(isActive: boolean) {
  return `rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive
      ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-zinc-100"
      : "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200"
  }`;
}

export function TodoSortControls({
  sortBy,
  orderBy,
  onSortByChange,
  onOrderByChange,
}: TodoSortControlsProps) {
  const isDescending = orderBy === TodoOrderBy.DESC;
  const OrderIcon = isDescending ? ArrowDown : ArrowUp;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex rounded-lg border border-sky-200/80 bg-white/70 p-0.5 dark:border-sky-800/80 dark:bg-zinc-900/70">
        {sortOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSortByChange(option.id)}
            className={segmentButtonClass(sortBy === option.id)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() =>
          onOrderByChange(isDescending ? TodoOrderBy.ASC : TodoOrderBy.DESC)
        }
        className="inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-sky-200/80 bg-white/80 px-3 text-sm font-medium text-sky-950/80 transition-colors hover:bg-white dark:border-sky-800/80 dark:bg-zinc-900/80 dark:text-sky-200/80 dark:hover:bg-zinc-800"
        aria-label={isDescending ? "Sort oldest first" : "Sort newest first"}
      >
        <OrderIcon className="h-4 w-4" aria-hidden />
        {isDescending ? "Newest first" : "Oldest first"}
      </button>
    </div>
  );
}
