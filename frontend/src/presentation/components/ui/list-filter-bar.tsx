"use client";

import { SortBy } from "@/core/domain/enums/sort-by.enum";
import { SortOrder } from "@/core/domain/enums/sort-order.enum";
import { SearchInput } from "@/presentation/components/ui/search-input";
import { SortControls } from "@/presentation/components/ui/sort-controls";

interface ListFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sortBy: SortBy;
  orderBy: SortOrder;
  onSortByChange: (sortBy: SortBy) => void;
  onOrderByChange: (orderBy: SortOrder) => void;
  disabled?: boolean;
  searchPlaceholder?: string;
  searchLabel?: string;
}

export function ListFilterBar({
  search,
  onSearchChange,
  sortBy,
  orderBy,
  onSortByChange,
  onOrderByChange,
  disabled = false,
  searchPlaceholder = "Search…",
  searchLabel = "Search",
}: ListFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="min-w-0 flex-1">
        <SearchInput
          value={search}
          onChange={onSearchChange}
          disabled={disabled}
          placeholder={searchPlaceholder}
          label={searchLabel}
        />
      </div>
      <SortControls
        sortBy={sortBy}
        orderBy={orderBy}
        onSortByChange={onSortByChange}
        onOrderByChange={onOrderByChange}
      />
    </div>
  );
}
