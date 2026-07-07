import type { CreateTodoDto } from "@/core/application/dtos/create-todo.dto";
import { UpdateTodoDto } from "@/core/application/dtos/update-todo.dto";
import type { Todo } from "@/core/domain/entities/todo.entity";
import type { TodoRepository } from "@/core/domain/repositories/todo.repository";

export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  getAll(): Promise<Todo[]> {
    return this.todoRepository.findAll();
  }

  getById(id: string): Promise<Todo> {
    return this.todoRepository.findById(id);
  }

  create(dto: CreateTodoDto): Promise<Todo> {
    return this.todoRepository.create(dto);
  }

  update(id: string, dto: UpdateTodoDto): Promise<Todo> {
    return this.todoRepository.update(id, dto);
  }

  delete(id: string): Promise<void> {
    return this.todoRepository.delete(id);
  }

  toggleCompleted(todo: Todo): Promise<Todo> {
    return this.todoRepository.update(
      todo.id,
      new UpdateTodoDto(undefined, !todo.completed),
    );
  }
}
