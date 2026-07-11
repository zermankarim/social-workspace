import { PostCommentAttachment } from '@prisma/client';
import { CommentAttachmentResponseDto } from '../dto/comment-attachment.dto';

export class CommentAttachmentsMapper {
  public static toCommentAttachmentResponseDto(
    attachment: PostCommentAttachment,
  ): CommentAttachmentResponseDto {
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
