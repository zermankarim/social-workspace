export interface JobPosterResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  headline: string | null;
}

export interface JobResponseDto {
  id: string;
  title: string;
  companyName: string;
  location: string | null;
  description: string;
  applyUrl: string;
  poster: JobPosterResponseDto;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedJobsResponseDto {
  data: JobResponseDto[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CreateJobRequestDto {
  title: string;
  companyName: string;
  location?: string;
  description: string;
  applyUrl: string;
}
