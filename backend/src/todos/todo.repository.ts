import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTodoDto, UpdateTodoDto } from './dto/todo.dto';
import { TodoWithAttachments } from './todo.mapper';
import { Prisma } from '@prisma/client';

@Injectable()
export class TodoRepository {
  private readonly todoInclude = { attachments: true } as const;

  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    dto: CreateTodoDto,
  ): Promise<TodoWithAttachments> {
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

    return todo;
  }

  findFirstByIdAndUserId(id: string, userId: string) {
    return this.prisma.todo.findFirst({
      where: { id, userId },
      include: this.todoInclude,
    });
  }

  findMany(
    where: Prisma.TodoWhereInput,
    orderBy: Prisma.TodoOrderByWithRelationInput,
    skip: number,
    take: number,
  ): Promise<TodoWithAttachments[]> {
    return this.prisma.todo.findMany({
      where,
      orderBy,
      skip,
      take,
      include: this.todoInclude,
    });
  }

  count(where: Prisma.TodoWhereInput): Promise<number> {
    return this.prisma.todo.count({ where });
  }

  update(id: string, data: UpdateTodoDto) {
    return this.prisma.todo.update({
      where: { id },
      data,
      include: this.todoInclude,
    });
  }

  delete(id: string) {
    return this.prisma.todo.delete({ where: { id } });
  }
}
