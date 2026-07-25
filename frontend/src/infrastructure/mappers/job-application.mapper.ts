import {
  JobApplication,
  JobApplicationApplicant,
  JobApplicationJob,
  JobApplicationResume,
} from "@/core/domain/entities/job-application.entity";
import { PaginatedJobApplications } from "@/core/domain/entities/paginated-job-applications.entity";
import { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";
import type {
  JobApplicationApplicantResponseDto,
  JobApplicationJobResponseDto,
  JobApplicationResponseDto,
  JobApplicationResumeResponseDto,
  PaginatedJobApplicationsResponseDto,
} from "@/infrastructure/api/dto/job-application-response.dto";

export class JobApplicationMapper {
  static applicantFromApi(
    dto: JobApplicationApplicantResponseDto,
  ): JobApplicationApplicant {
    return new JobApplicationApplicant(
      dto.id,
      dto.firstName,
      dto.lastName,
      dto.avatarUrl,
      dto.headline,
    );
  }

  static jobFromApi(dto: JobApplicationJobResponseDto): JobApplicationJob {
    return new JobApplicationJob(
      dto.id,
      dto.title,
      dto.companyName,
      dto.companyLogoUrl,
    );
  }

  static resumeFromApi(
    dto: JobApplicationResumeResponseDto,
  ): JobApplicationResume {
    return new JobApplicationResume(dto.id, dto.fileName, dto.fileUrl);
  }

  static fromApi(dto: JobApplicationResponseDto): JobApplication {
    return new JobApplication(
      dto.id,
      dto.status,
      dto.contactEmail,
      dto.contactPhone,
      dto.coverNote,
      dto.decisionReason,
      dto.decidedAt ? new Date(dto.decidedAt) : null,
      this.applicantFromApi(dto.applicant),
      this.jobFromApi(dto.job),
      dto.resume ? this.resumeFromApi(dto.resume) : null,
      new Date(dto.createdAt),
      new Date(dto.updatedAt),
    );
  }

  static paginatedFromApi(
    dto: PaginatedJobApplicationsResponseDto,
  ): PaginatedJobApplications {
    return new PaginatedJobApplications(
      dto.data.map((item) => this.fromApi(item)),
      new PaginationMeta(
        dto.meta.page,
        dto.meta.limit,
        dto.meta.total,
        dto.meta.totalPages,
        dto.meta.hasNextPage,
        dto.meta.hasPrevPage,
      ),
    );
  }
}
