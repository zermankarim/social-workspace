import { Todo } from "@/core/domain/entities/todo.entity";
import type { TodoResponseDto } from "@/infrastructure/api/dto/todo-response.dto";
import { AttachmentMapper } from "@/infrastructure/mappers/attachment.mapper";

export class TodoMapper {
  static fromApi(dto: TodoResponseDto): Todo {
    return new Todo(
      dto.id,
      dto.text,
      dto.completed,
      dto.attachments.map((attachment) =>
        AttachmentMapper.fromApi(attachment),
      ),
      new Date(dto.createdAt),
      new Date(dto.updatedAt),
    );
  }
}
