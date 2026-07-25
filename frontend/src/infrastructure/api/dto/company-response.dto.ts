export interface CompanyEmployeeResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  headline: string | null;
  title: string;
  isCurrent: boolean;
}

export interface CompanyAdminResponseDto {
  userId: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  headline: string | null;
  role: "OWNER" | "ADMIN";
}

export interface CompanyServiceResponseDto {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface CompanySummaryResponseDto {
  id: string;
  name: string;
  logoUrl: string | null;
  industry: string | null;
}

export interface CompanyResponseDto {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  industry: string | null;
  size: string | null;
  foundedYear: number | null;
  websiteUrl: string | null;
  headquarters: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  employeesCount: number;
  currentEmployeesCount: number;
  jobsCount: number;
  employees: CompanyEmployeeResponseDto[];
  services: CompanyServiceResponseDto[];
  admins: CompanyAdminResponseDto[];
  isViewerAdmin: boolean;
  followersCount: number;
  isViewerFollowing: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedCompaniesResponseDto {
  data: CompanySummaryResponseDto[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CreateCompanyRequestDto {
  name: string;
  tagline?: string;
  description?: string;
  industry?: string;
  size?: string;
  foundedYear?: number;
  websiteUrl?: string;
  headquarters?: string;
  logoUrl?: string;
  coverUrl?: string;
}

export type UpdateCompanyRequestDto = Partial<
  Omit<CreateCompanyRequestDto, "name">
>;
