import type { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";
import type { Todo } from "@/core/domain/entities/todo.entity";

export class PaginatedTodos {
  constructor(
    public readonly data: Todo[],
    public readonly meta: PaginationMeta,
  ) {}
}
