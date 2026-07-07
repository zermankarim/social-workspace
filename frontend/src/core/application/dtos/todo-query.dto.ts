import { TodoOrderBy } from "@/core/domain/enums/todo-order-by.enum";
import { TodoSortBy } from "@/core/domain/enums/todo-sort-by.enum";

export class TodoQueryDto {
  constructor(
    public readonly page: number = 1,
    public readonly limit: number = 20,
    public readonly sortBy: TodoSortBy = TodoSortBy.CREATED_AT,
    public readonly orderBy: TodoOrderBy = TodoOrderBy.DESC,
    public readonly search?: string,
  ) {}
}
