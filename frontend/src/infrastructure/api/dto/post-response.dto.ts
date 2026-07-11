export interface PostAuthorResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  bio: string | null;
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
  attachments: PostAttachmentResponseDto[];
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
