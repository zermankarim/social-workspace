"use client";

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
      ? "bg-white text-zinc-900 shadow-sm"
      : "text-zinc-500 hover:text-zinc-800"
  }`;
}

export function TodoSortControls({
  sortBy,
  orderBy,
  onSortByChange,
  onOrderByChange,
}: TodoSortControlsProps) {
  const isDescending = orderBy === TodoOrderBy.DESC;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex rounded-lg border border-sky-200/80 bg-white/70 p-0.5">
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
        className="inline-flex h-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-sky-200/80 bg-white/80 px-3 text-sm font-medium text-sky-950/80 transition-colors hover:bg-white"
        aria-label={isDescending ? "Sort oldest first" : "Sort newest first"}
      >
        {isDescending ? "↓ Newest first" : "↑ Oldest first"}
      </button>
    </div>
  );
}
