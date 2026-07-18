import { PostResponseDto } from '../dto/post.dto';
import { PostSelected, RepostOfSelected } from '../post.select';
import { PostAttachmentsMapper } from './post-attachments.mapper';
import { CommentsMapper } from '../../comments/mappers/comments.mapper';
import { LikesMapper } from '../../likes/mappers/likes.mapper';

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
      repostsCount: post.repostsCount,
      impressionsCount: post.impressionsCount,
      repostOf: post.repostOf
        ? PostsMapper.toRepostOfResponseDto(post.repostOf)
        : null,
      attachments: post.attachments.map((attachment) =>
        PostAttachmentsMapper.toPostAttachmentResponseDto(attachment),
      ),
      previewComments: post.comments.map((comment) =>
        CommentsMapper.toCommentResponseDto(comment),
      ),
      previewLikes: post.postLikes.map((like) =>
        LikesMapper.toLikeResponseDto(like),
      ),
    };
  }

  private static toRepostOfResponseDto(
    post: RepostOfSelected,
  ): PostResponseDto {
    return {
      id: post.id,
      textContent: post.textContent,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: post.author,
      commentsCount: post.commentsCount,
      likesCount: post.likesCount,
      repostsCount: post.repostsCount,
      impressionsCount: post.impressionsCount,
      repostOf: null,
      attachments: post.attachments.map((attachment) =>
        PostAttachmentsMapper.toPostAttachmentResponseDto(attachment),
      ),
      previewComments: [],
      previewLikes: [],
    };
  }
}
