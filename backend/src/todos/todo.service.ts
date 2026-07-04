import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTodoDto, TodoResponseDto, UpdateTodoDto } from './dto/todo.dto';
import { TodoMapper } from './todo.mapper';

@Injectable()
export class TodosService {
  private readonly todoInclude = { attachments: true } as const;

  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string): Promise<TodoResponseDto[]> {
    const todos = await this.prisma.todo.findMany({
      where: { userId },
      include: this.todoInclude,
      orderBy: { createdAt: 'desc' },
    });

    return todos.map((todo) => TodoMapper.fromPrismaToResponse(todo));
  }

  async findOne(userId: string, id: string): Promise<TodoResponseDto> {
    const todo = await this.findOwnedTodo(userId, id);
    return TodoMapper.fromPrismaToResponse(todo);
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
