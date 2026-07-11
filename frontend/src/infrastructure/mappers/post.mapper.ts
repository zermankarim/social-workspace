import { PostAttachment } from "@/core/domain/entities/post-attachment.entity";
import { PostAuthor } from "@/core/domain/entities/post-author.entity";
import { Post } from "@/core/domain/entities/post.entity";
import type {
  PostAttachmentResponseDto,
  PostAuthorResponseDto,
  PostResponseDto,
} from "@/infrastructure/api/dto/post-response.dto";

export class PostMapper {
  static fromApi(dto: PostResponseDto): Post {
    return new Post(
      dto.id,
      dto.textContent,
      this.authorFromApi(dto.author),
      dto.attachments.map((attachment) => this.attachmentFromApi(attachment)),
      dto.likesCount,
      dto.commentsCount,
      new Date(dto.createdAt),
      new Date(dto.updatedAt),
    );
  }

  private static authorFromApi(dto: PostAuthorResponseDto): PostAuthor {
    return new PostAuthor(
      dto.id,
      dto.firstName,
      dto.lastName,
      dto.avatarUrl,
      dto.bio,
    );
  }

  private static attachmentFromApi(
    dto: PostAttachmentResponseDto,
  ): PostAttachment {
    return new PostAttachment(
      dto.id,
      dto.url,
      dto.fileName,
      dto.mimeType,
      dto.sizeBytes,
      new Date(dto.createdAt),
    );
  }
}
