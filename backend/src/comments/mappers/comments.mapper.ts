import { CommentResponseDto } from '../dto/comment.dto';
import { CommentSelected } from '../comment.select';
import { CommentAttachmentsMapper } from './comment-attachments.mapper';

export class CommentsMapper {
  public static toCommentResponseDto(
    comment: CommentSelected,
  ): CommentResponseDto {
    return {
      id: comment.id,
      textContent: comment.textContent,
      postId: comment.postId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: comment.author,
      attachments: comment.attachments.map((attachment) =>
        CommentAttachmentsMapper.toCommentAttachmentResponseDto(attachment),
      ),
    };
  }
}
