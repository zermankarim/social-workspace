import { Attachment, Prisma } from '@prisma/client';
import { TodoResponseDto } from './dto/todo.dto';
import { AttachmentDto } from './dto/attachment.dto';

export type TodoWithAttachments = Prisma.TodoGetPayload<{
  include: { attachments: true };
}>;

export class AttachmentMapper {
  static fromPrismaToResponse(attachment: Attachment): AttachmentDto {
    return {
      id: attachment.id,
      url: attachment.url,
      fileName: attachment.fileName,
      mimeType: attachment.mimeType,
      sizeBytes: attachment.sizeBytes,
      createdAt: attachment.createdAt,
    };
  }
}

export class TodoMapper {
  static fromPrismaToResponse(todo: TodoWithAttachments): TodoResponseDto {
    return {
      id: todo.id,
      text: todo.text,
      completed: todo.completed,
      attachments: todo.attachments.map((attachment) =>
        AttachmentMapper.fromPrismaToResponse(attachment),
      ),
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    };
  }
}
