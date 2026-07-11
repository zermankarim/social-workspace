import { PostAttachment } from '@prisma/client';
import { PostAttachmentResponseDto } from '../dto/post-attachment.dto';

export class PostAttachmentsMapper {
  public static toPostAttachmentResponseDto(
    postAttachment: PostAttachment,
  ): PostAttachmentResponseDto {
    return {
      id: postAttachment.id,
      url: postAttachment.url,
      fileName: postAttachment.fileName,
      mimeType: postAttachment.mimeType,
      sizeBytes: postAttachment.sizeBytes,
      createdAt: postAttachment.createdAt,
    };
  }
}
