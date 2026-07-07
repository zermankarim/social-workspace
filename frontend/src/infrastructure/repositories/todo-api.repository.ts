import type { CreateTodoDto } from "@/core/application/dtos/create-todo.dto";
import type { TodoQueryDto } from "@/core/application/dtos/todo-query.dto";
import type { UpdateTodoDto } from "@/core/application/dtos/update-todo.dto";
import type { PaginatedTodos } from "@/core/domain/entities/paginated-todos.entity";
import type { Todo } from "@/core/domain/entities/todo.entity";
import { TodoRepository } from "@/core/domain/repositories/todo.repository";
import type {
  CreateTodoRequestDto,
  PaginatedTodosResponseDto,
  TodoResponseDto,
  UpdateTodoRequestDto,
} from "@/infrastructure/api/dto/todo-response.dto";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { PaginatedTodosMapper } from "@/infrastructure/mappers/paginated-todos.mapper";
import { TodoMapper } from "@/infrastructure/mappers/todo.mapper";

export class TodoApiRepository extends TodoRepository {
  constructor(private readonly httpClient: HttpClient) {
    super();
  }

  async findPaginated(query: TodoQueryDto): Promise<PaginatedTodos> {
    const params = new URLSearchParams({
      page: String(query.page),
      limit: String(query.limit),
      sortBy: query.sortBy,
      orderBy: query.orderBy,
    });

    if (query.search) {
      params.set("search", query.search);
    }

    const response = await this.httpClient.request<PaginatedTodosResponseDto>(
      `/todos?${params.toString()}`,
    );

    return PaginatedTodosMapper.fromApi(response);
  }

  async findById(id: string): Promise<Todo> {
    const response = await this.httpClient.request<TodoResponseDto>(
      `/todos/${id}`,
    );
    return TodoMapper.fromApi(response);
  }

  async create(dto: CreateTodoDto): Promise<Todo> {
    const body: CreateTodoRequestDto = {
      text: dto.text,
      attachments: dto.attachments?.map((attachment) => ({
        url: attachment.url,
        fileName: attachment.fileName,
        mimeType: attachment.mimeType,
        sizeBytes: attachment.sizeBytes,
      })),
    };

    const response = await this.httpClient.request<TodoResponseDto>("/todos", {
      method: "POST",
      body,
    });
    return TodoMapper.fromApi(response);
  }

  async update(id: string, dto: UpdateTodoDto): Promise<Todo> {
    const body: UpdateTodoRequestDto = {
      text: dto.text,
      completed: dto.completed,
    };

    const response = await this.httpClient.request<TodoResponseDto>(
      `/todos/${id}`,
      {
        method: "PATCH",
        body,
      },
    );
    return TodoMapper.fromApi(response);
  }

  async delete(id: string): Promise<void> {
    await this.httpClient.request<void>(`/todos/${id}`, {
      method: "DELETE",
    });
  }
}
