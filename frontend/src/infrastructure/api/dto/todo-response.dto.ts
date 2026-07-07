export interface AttachmentResponseDto {
  id: string;
  url: string;
  fileName: string;
  mimeType: string | null;
  sizeBytes: number | null;
  createdAt: string;
}

export interface TodoResponseDto {
  id: string;
  text: string;
  completed: boolean;
  attachments: AttachmentResponseDto[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTodoRequestDto {
  text: string;
  attachments?: {
    url: string;
    fileName: string;
    mimeType?: string;
    sizeBytes?: number;
  }[];
}

export interface UpdateTodoRequestDto {
  text?: string;
  completed?: boolean;
}

export interface PaginationMetaResponseDto {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedTodosResponseDto {
  data: TodoResponseDto[];
  meta: PaginationMetaResponseDto;
}
