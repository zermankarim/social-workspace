import { TodoService } from "@/core/application/services/todo.service";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { TodoApiRepository } from "@/infrastructure/repositories/todo-api.repository";

export class TodoModule {
  static create(httpClient: HttpClient): TodoService {
    const repository = new TodoApiRepository(httpClient);
    return new TodoService(repository);
  }
}
