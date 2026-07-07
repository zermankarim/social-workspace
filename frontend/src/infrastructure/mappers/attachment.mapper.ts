import { Attachment } from "@/core/domain/entities/attachment.entity";
import type { AttachmentResponseDto } from "@/infrastructure/api/dto/todo-response.dto";

export class AttachmentMapper {
  static fromApi(dto: AttachmentResponseDto): Attachment {
    return new Attachment(
      dto.id,
      dto.url,
      dto.fileName,
      dto.mimeType,
      dto.sizeBytes,
      new Date(dto.createdAt),
    );
  }
}
