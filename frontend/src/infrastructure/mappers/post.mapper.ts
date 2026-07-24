import { PostAttachment } from "@/core/domain/entities/post-attachment.entity";
import { PostAuthor } from "@/core/domain/entities/post-author.entity";
import { PostComment } from "@/core/domain/entities/post-comment.entity";
import { PostLike } from "@/core/domain/entities/post-like.entity";
import { Post } from "@/core/domain/entities/post.entity";
import { PostLikeType } from "@/core/domain/enums/post-like-type.enum";
import { PostStatus } from "@/core/domain/enums/post-status.enum";
import { ProfileRole } from "@/core/domain/enums/profile-role.enum";
import type {
  CommentResponseDto,
  LikeResponseDto,
} from "@/infrastructure/api/dto/engagement-response.dto";
import type {
  PostAttachmentResponseDto,
  PostAuthorResponseDto,
  PostResponseDto,
} from "@/infrastructure/api/dto/post-response.dto";

function parseAuthorRole(role: string): ProfileRole {
  if (role === ProfileRole.ADMIN || role === ProfileRole.USER) return role;
  return ProfileRole.USER;
}

function parsePostStatus(status: string): PostStatus {
  return (Object.values(PostStatus) as string[]).includes(status)
    ? (status as PostStatus)
    : PostStatus.PUBLISHED;
}

export class PostMapper {
  static fromApi(dto: PostResponseDto): Post {
    return new Post(
      dto.id,
      dto.textContent,
      this.authorFromApi(dto.author),
      dto.attachments.map((attachment) => this.attachmentFromApi(attachment)),
      dto.likesCount,
      dto.commentsCount,
      dto.repostsCount ?? 0,
      dto.impressionsCount ?? 0,
      (dto.previewLikes ?? []).map((like) => this.likeFromApi(like)),
      (dto.previewComments ?? []).map((comment) =>
        this.commentFromApi(comment),
      ),
      new Date(dto.createdAt),
      new Date(dto.updatedAt),
      dto.repostOf ? this.fromApi(dto.repostOf) : null,
      parsePostStatus(dto.status),
      dto.scheduledFor ? new Date(dto.scheduledFor) : null,
    );
  }

  static authorFromApi(dto: PostAuthorResponseDto): PostAuthor {
    return new PostAuthor(
      dto.id,
      dto.firstName,
      dto.lastName,
      dto.avatarUrl,
      dto.headline,
      parseAuthorRole(dto.role),
    );
  }

  static attachmentFromApi(dto: PostAttachmentResponseDto): PostAttachment {
    return new PostAttachment(
      dto.id,
      dto.url,
      dto.fileName,
      dto.mimeType,
      dto.sizeBytes,
      new Date(dto.createdAt),
    );
  }

  static likeFromApi(dto: LikeResponseDto): PostLike {
    return new PostLike(
      dto.id,
      dto.postId,
      dto.likeType as PostLikeType,
      this.authorFromApi(dto.author),
      new Date(dto.createdAt),
    );
  }

  static commentFromApi(dto: CommentResponseDto): PostComment {
    return new PostComment(
      dto.id,
      dto.postId,
      dto.textContent,
      this.authorFromApi(dto.author),
      dto.attachments.map((attachment) => this.attachmentFromApi(attachment)),
      new Date(dto.createdAt),
      new Date(dto.updatedAt),
      dto.parentId,
      dto.replies.map((reply) => this.commentFromApi(reply)),
    );
  }
}
