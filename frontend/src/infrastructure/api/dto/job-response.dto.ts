export interface JobPosterResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  headline: string | null;
}

export interface JobCompanyResponseDto {
  id: string;
  name: string;
  logoUrl: string | null;
}

export interface JobResponseDto {
  id: string;
  title: string;
  companyName: string;
  company: JobCompanyResponseDto | null;
  location: string | null;
  description: string;
  applyUrl: string | null;
  employmentType: string | null;
  workplaceType: string | null;
  experienceLevel: string | null;
  applicationsCount: number;
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
  companyId?: string;
  companyName?: string;
  location?: string;
  description: string;
  applyUrl?: string;
  employmentType?: string;
  workplaceType?: string;
  experienceLevel?: string;
}
