export interface JobApplicationApplicantResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  headline: string | null;
}

export interface JobApplicationJobResponseDto {
  id: string;
  title: string;
  companyName: string;
  companyLogoUrl: string | null;
}

export interface JobApplicationResumeResponseDto {
  id: string;
  fileName: string;
  fileUrl: string;
}

export interface JobApplicationResponseDto {
  id: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";
  contactEmail: string | null;
  contactPhone: string | null;
  coverNote: string | null;
  decisionReason: string | null;
  decidedAt: string | null;
  applicant: JobApplicationApplicantResponseDto;
  job: JobApplicationJobResponseDto;
  resume: JobApplicationResumeResponseDto | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedJobApplicationsResponseDto {
  data: JobApplicationResponseDto[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface CreateJobApplicationRequestDto {
  resumeId?: string;
  contactEmail?: string;
  contactPhone?: string;
  coverNote?: string;
}

export interface DecideJobApplicationRequestDto {
  status: "ACCEPTED" | "REJECTED";
  reason?: string;
}

export interface LastContactInfoResponseDto {
  contactEmail: string | null;
  contactPhone: string | null;
}
