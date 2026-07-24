import { CommentResponseDto } from '../dto/comment.dto';
import { CommentSelected, CommentReplySelected } from '../comment.select';
import { CommentAttachmentsMapper } from './comment-attachments.mapper';

export class CommentsMapper {
  public static toCommentResponseDto(
    comment: CommentSelected,
  ): CommentResponseDto {
    return {
      id: comment.id,
      textContent: comment.textContent,
      postId: comment.postId,
      parentId: comment.parentId,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: comment.author,
      attachments: comment.attachments.map((attachment) =>
        CommentAttachmentsMapper.toCommentAttachmentResponseDto(attachment),
      ),
      replies: comment.replies.map((reply) =>
        CommentsMapper.toReplyResponseDto(reply),
      ),
    };
  }

  private static toReplyResponseDto(
    reply: CommentReplySelected,
  ): CommentResponseDto {
    return {
      id: reply.id,
      textContent: reply.textContent,
      postId: reply.postId,
      parentId: reply.parentId,
      createdAt: reply.createdAt,
      updatedAt: reply.updatedAt,
      author: reply.author,
      attachments: reply.attachments.map((attachment) =>
        CommentAttachmentsMapper.toCommentAttachmentResponseDto(attachment),
      ),
      replies: [],
    };
  }
}
