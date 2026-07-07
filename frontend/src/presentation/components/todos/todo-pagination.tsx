import { Button } from "@/presentation/components/ui/button";
import type { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";

interface TodoPaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function TodoPagination({ meta, onPageChange }: TodoPaginationProps) {
  if (meta.total === 0) return null;

  return (
    <div className="flex flex-col gap-3 border-t border-zinc-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p className="text-sm text-zinc-500">
        Page {meta.page} of {meta.totalPages} · {meta.total} task
        {meta.total === 1 ? "" : "s"}
      </p>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={!meta.hasPrevPage}
          onClick={() => onPageChange(meta.page - 1)}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={!meta.hasNextPage}
          onClick={() => onPageChange(meta.page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
