import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import type { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";

interface ListPaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export function ListPagination({
  meta,
  onPageChange,
  itemLabel = "item",
}: ListPaginationProps) {
  if (meta.total === 0) return null;

  return (
    <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-sm text-muted">
        Page {meta.page} of {meta.totalPages} · {meta.total} {itemLabel}
        {meta.total === 1 ? "" : "s"}
      </p>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={!meta.hasPrevPage}
          onClick={() => onPageChange(meta.page - 1)}
          className="gap-1.5"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Previous
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={!meta.hasNextPage}
          onClick={() => onPageChange(meta.page + 1)}
          className="gap-1.5"
        >
          Next
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
