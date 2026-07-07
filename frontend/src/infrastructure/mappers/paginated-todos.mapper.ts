import { PaginatedTodos } from "@/core/domain/entities/paginated-todos.entity";
import { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";
import type { PaginatedTodosResponseDto } from "@/infrastructure/api/dto/todo-response.dto";
import { TodoMapper } from "@/infrastructure/mappers/todo.mapper";

export class PaginatedTodosMapper {
  static fromApi(dto: PaginatedTodosResponseDto): PaginatedTodos {
    return new PaginatedTodos(
      dto.data.map((todo) => TodoMapper.fromApi(todo)),
      new PaginationMeta(
        dto.meta.page,
        dto.meta.limit,
        dto.meta.total,
        dto.meta.totalPages,
        dto.meta.hasNextPage,
        dto.meta.hasPrevPage,
      ),
    );
  }
}
