import type { CreateTodoDto } from "@/core/application/dtos/create-todo.dto";
import type { UpdateTodoDto } from "@/core/application/dtos/update-todo.dto";
import type { Todo } from "@/core/domain/entities/todo.entity";

export abstract class TodoRepository {
  abstract findAll(): Promise<Todo[]>;
  abstract findById(id: string): Promise<Todo>;
  abstract create(dto: CreateTodoDto): Promise<Todo>;
  abstract update(id: string, dto: UpdateTodoDto): Promise<Todo>;
  abstract delete(id: string): Promise<void>;
}
