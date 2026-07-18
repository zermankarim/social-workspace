export interface HashtagResponseDto {
  id: string;
  tag: string;
  postsCount: number;
}

export interface PaginatedHashtagsResponseDto {
  data: HashtagResponseDto[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
