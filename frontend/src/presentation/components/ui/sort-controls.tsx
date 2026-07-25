"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { SortBy } from "@/core/domain/enums/sort-by.enum";
import { SortOrder } from "@/core/domain/enums/sort-order.enum";

interface SortControlsProps {
  sortBy: SortBy;
  orderBy: SortOrder;
  onSortByChange: (sortBy: SortBy) => void;
  onOrderByChange: (orderBy: SortOrder) => void;
}

const sortOptions: { id: SortBy; label: string }[] = [
  { id: SortBy.CREATED_AT, label: "Created" },
  { id: SortBy.UPDATED_AT, label: "Updated" },
];

function segmentButtonClass(isActive: boolean) {
  return `rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
    isActive
      ? "bg-surface text-foreground shadow-card"
      : "text-muted hover:text-foreground"
  }`;
}

export function SortControls({
  sortBy,
  orderBy,
  onSortByChange,
  onOrderByChange,
}: SortControlsProps) {
  const isDescending = orderBy === SortOrder.DESC;
  const OrderIcon = isDescending ? ArrowDown : ArrowUp;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex rounded-lg border border-border-strong bg-surface-muted p-0.5">
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
          onOrderByChange(isDescending ? SortOrder.ASC : SortOrder.DESC)
        }
        className="inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border-strong bg-surface px-3 text-sm font-medium text-foreground transition-colors hover:bg-surface-muted"
        aria-label={isDescending ? "Sort oldest first" : "Sort newest first"}
      >
        <OrderIcon className="h-4 w-4" aria-hidden />
        {isDescending ? "Newest first" : "Oldest first"}
      </button>
    </div>
  );
}
