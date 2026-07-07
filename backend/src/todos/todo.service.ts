import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTodoDto, TodoResponseDto, UpdateTodoDto } from './dto/todo.dto';
import { TodoMapper } from './todo.mapper';
import { OrderBy, SortBy, TodoQueryDto } from './dto/todo-query.dto';
import { PaginatedTodosResponseDto } from './dto/pagination.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TodosService {
  private readonly todoInclude = { attachments: true } as const;

  constructor(private readonly prisma: PrismaService) {}

  async findOne(userId: string, id: string): Promise<TodoResponseDto> {
    const todo = await this.findOwnedTodo(userId, id);
    return TodoMapper.fromPrismaToResponse(todo);
  }

  async findPaginated(
    userId: string,
    query: TodoQueryDto,
  ): Promise<PaginatedTodosResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy ?? SortBy.CREATED_AT;
    const orderBy = query.orderBy ?? OrderBy.DESC;
    const search = query.search ?? '';

    const where: Prisma.TodoWhereInput = {
      userId,
      text: { contains: search, mode: 'insensitive' },
    };

    const [todos, total] = await Promise.all([
      this.prisma.todo.findMany({
        where,
        include: this.todoInclude,
        orderBy: { [sortBy]: orderBy },
        skip,
        take: limit,
      }),
      this.prisma.todo.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(total / limit) || 1;

    return {
      data: todos.map((todo) => TodoMapper.fromPrismaToResponse(todo)),
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async create(userId: string, dto: CreateTodoDto): Promise<TodoResponseDto> {
    const todo = await this.prisma.todo.create({
      data: {
        userId,
        text: dto.text,
        attachments: dto.attachments?.length
          ? { create: dto.attachments }
          : undefined,
      },
      include: this.todoInclude,
    });

    return TodoMapper.fromPrismaToResponse(todo);
  }

  async update(
    userId: string,
    id: string,
    dto: UpdateTodoDto,
  ): Promise<TodoResponseDto> {
    await this.findOwnedTodo(userId, id);

    const todo = await this.prisma.todo.update({
      where: { id },
      data: dto,
      include: this.todoInclude,
    });

    return TodoMapper.fromPrismaToResponse(todo);
  }

  async remove(userId: string, id: string): Promise<void> {
    await this.findOwnedTodo(userId, id);

    await this.prisma.todo.delete({
      where: { id },
    });
  }

  private async findOwnedTodo(userId: string, id: string) {
    const todo = await this.prisma.todo.findFirst({
      where: { id, userId },
      include: this.todoInclude,
    });

    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    return todo;
  }
}
