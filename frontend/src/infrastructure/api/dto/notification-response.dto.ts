import type { PostAuthorResponseDto } from "@/infrastructure/api/dto/post-response.dto";

export interface NotificationResponseDto {
  id: string;
  type: string;
  read: boolean;
  createdAt: string;
  actor: PostAuthorResponseDto;
  post: { id: string; textContent: string | null } | null;
}

export interface PaginatedNotificationsResponseDto {
  data: NotificationResponseDto[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface UnreadNotificationsCountResponseDto {
  count: number;
}
