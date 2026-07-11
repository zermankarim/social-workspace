import type { PostLikeType } from "@/core/domain/enums/post-like-type.enum";
import type {
  PostAttachmentResponseDto,
  PostAuthorResponseDto,
} from "@/infrastructure/api/dto/post-response.dto";
import type { PaginationMetaResponseDto } from "@/infrastructure/api/dto/pagination-response.dto";

export interface LikeResponseDto {
  id: string;
  postId: string;
  likeType: PostLikeType;
  createdAt: string;
  author: PostAuthorResponseDto;
}

export interface CommentResponseDto {
  id: string;
  textContent: string | null;
  postId: string;
  createdAt: string;
  updatedAt: string;
  author: PostAuthorResponseDto;
  attachments: PostAttachmentResponseDto[];
}

export interface PaginatedLikesResponseDto {
  data: LikeResponseDto[];
  meta: PaginationMetaResponseDto;
}

export interface PaginatedCommentsResponseDto {
  data: CommentResponseDto[];
  meta: PaginationMetaResponseDto;
}

export interface UpsertLikeRequestDto {
  likeType: PostLikeType;
}

export interface CreateCommentRequestDto {
  textContent?: string;
  attachments?: {
    url: string;
    fileName: string;
    mimeType?: string | null;
    sizeBytes?: number | null;
  }[];
}

export interface UpdateCommentRequestDto {
  textContent?: string;
  attachments?: {
    url: string;
    fileName: string;
    mimeType?: string | null;
    sizeBytes?: number | null;
  }[];
}
