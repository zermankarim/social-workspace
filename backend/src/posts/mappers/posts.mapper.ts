import { PostResponseDto } from '../dto/post.dto';
import { PostSelected } from '../post.select';
import { PostAttachmentsMapper } from './post-attachments.mapper';

export class PostsMapper {
  public static toPostResponseDto(post: PostSelected): PostResponseDto {
    return {
      id: post.id,
      textContent: post.textContent,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: post.author,
      commentsCount: post.commentsCount,
      likesCount: post.likesCount,
      attachments: post.attachments.map((attachment) =>
        PostAttachmentsMapper.toPostAttachmentResponseDto(attachment),
      ),
    };
  }
}
