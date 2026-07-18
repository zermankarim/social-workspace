import type { ProfileRole } from "@/core/domain/enums/profile-role.enum";
import type {
  CommentResponseDto,
  LikeResponseDto,
} from "@/infrastructure/api/dto/engagement-response.dto";

export interface PostAuthorResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  headline: string | null;
  role: ProfileRole;
}

export interface PostAttachmentResponseDto {
  id: string;
  url: string;
  fileName: string;
  mimeType: string | null;
  sizeBytes: number | null;
  createdAt: string;
}

export interface PostResponseDto {
  id: string;
  textContent: string | null;
  createdAt: string;
  updatedAt: string;
  author: PostAuthorResponseDto;
  commentsCount: number;
  likesCount: number;
  repostsCount: number;
  impressionsCount?: number;
  repostOf?: PostResponseDto | null;
  attachments: PostAttachmentResponseDto[];
  previewComments?: CommentResponseDto[];
  previewLikes?: LikeResponseDto[];
}

export interface CreateRepostRequestDto {
  textContent?: string;
}

export interface CreatePostAttachmentRequestDto {
  url: string;
  fileName: string;
  mimeType?: string | null;
  sizeBytes?: number | null;
}

export interface CreatePostRequestDto {
  textContent?: string;
  attachments?: CreatePostAttachmentRequestDto[];
}

export interface UpdatePostRequestDto {
  textContent?: string;
  attachments?: CreatePostAttachmentRequestDto[];
}

export interface PaginatedPostsResponseDto {
  data: PostResponseDto[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
