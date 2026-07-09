import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto, TodoResponseDto, UpdateTodoDto } from './dto/todo.dto';
import { TodoMapper } from './todo.mapper';
import { TodoQueryDto } from './dto/todo-query.dto';
import {
  PaginationOrderBy,
  PaginationSortBy,
} from '../shared/enums/pagination.enum';
import { Prisma } from '@prisma/client';
import { TodoRepository } from './todo.repository';
import { PaginatedResponseDto } from '../shared/dto/paginated-response.dto';
import {
  buildPaginationMeta,
  getPaginationParams,
} from '../shared/utils/pagination';

@Injectable()
export class TodosService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async findOne(userId: string, id: string): Promise<TodoResponseDto> {
    const todo = await this.findOwnedTodo(userId, id);
    return TodoMapper.fromPrismaToResponse(todo);
  }

  async findPaginated(
    userId: string,
    query: TodoQueryDto,
  ): Promise<PaginatedResponseDto<TodoResponseDto>> {
    const { page, limit, skip, take } = getPaginationParams(
      query.page,
      query.limit,
    );
    const sortBy = query.sortBy ?? PaginationSortBy.CREATED_AT;
    const orderBy = query.orderBy ?? PaginationOrderBy.DESC;
    const search = query.search ?? '';

    const where: Prisma.TodoWhereInput = {
      userId,
      text: search ? { contains: search, mode: 'insensitive' } : undefined,
    };

    const [todos, total] = await Promise.all([
      this.todoRepository.findMany(where, { [sortBy]: orderBy }, skip, take),
      this.todoRepository.count(where),
    ]);

    return {
      data: todos.map((todo) => TodoMapper.fromPrismaToResponse(todo)),
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  async create(userId: string, dto: CreateTodoDto): Promise<TodoResponseDto> {
    const todo = await this.todoRepository.create(userId, dto);

    return TodoMapper.fromPrismaToResponse(todo);
  }

  async update(userId: string, id: string, dto: UpdateTodoDto) {
    await this.findOwnedTodo(userId, id);
    const todo = await this.todoRepository.update(id, dto);
    return TodoMapper.fromPrismaToResponse(todo);
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.findOwnedTodo(userId, id);
    await this.todoRepository.delete(id);
  }

  private async findOwnedTodo(userId: string, id: string) {
    const todo = await this.todoRepository.findFirstByIdAndUserId(id, userId);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }
    return todo;
  }
}
