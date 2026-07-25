import type { ConnectionStatus } from "@/core/domain/enums/connection-status.enum";

export interface ConnectionUserResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  headline: string | null;
  avatarUrl: string | null;
}

export interface ConnectionResponseDto {
  id: string;
  status: ConnectionStatus | string;
  requester: ConnectionUserResponseDto;
  addressee: ConnectionUserResponseDto;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedConnectionsResponseDto {
  data: ConnectionResponseDto[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CreateConnectionRequestDto {
  addresseeId: string;
}

export interface ConnectionSuggestionResponseDto {
  userId: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  headline: string | null;
  mutualConnectionsCount: number;
}
