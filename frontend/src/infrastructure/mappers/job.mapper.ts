import { Job, JobCompany } from "@/core/domain/entities/job.entity";
import type { JobExperienceLevel } from "@/core/domain/entities/job.entity";
import { JobPoster } from "@/core/domain/entities/job-poster.entity";
import { PaginatedJobs } from "@/core/domain/entities/paginated-jobs.entity";
import { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";
import type { EmploymentType } from "@/core/domain/enums/employment-type.enum";
import type { WorkplaceType } from "@/core/domain/enums/workplace-type.enum";
import type {
  JobCompanyResponseDto,
  JobPosterResponseDto,
  JobResponseDto,
  PaginatedJobsResponseDto,
} from "@/infrastructure/api/dto/job-response.dto";

export class JobMapper {
  static posterFromApi(dto: JobPosterResponseDto): JobPoster {
    return new JobPoster(
      dto.id,
      dto.firstName,
      dto.lastName,
      dto.avatarUrl,
      dto.headline,
    );
  }

  static companyFromApi(dto: JobCompanyResponseDto): JobCompany {
    return new JobCompany(dto.id, dto.name, dto.logoUrl);
  }

  static fromApi(dto: JobResponseDto): Job {
    return new Job(
      dto.id,
      dto.title,
      dto.companyName,
      dto.company ? this.companyFromApi(dto.company) : null,
      dto.location,
      dto.description,
      dto.applyUrl,
      (dto.employmentType as EmploymentType | null) ?? null,
      (dto.workplaceType as WorkplaceType | null) ?? null,
      (dto.experienceLevel as JobExperienceLevel | null) ?? null,
      dto.applicationsCount,
      this.posterFromApi(dto.poster),
      new Date(dto.createdAt),
      new Date(dto.updatedAt),
    );
  }

  static paginatedFromApi(dto: PaginatedJobsResponseDto): PaginatedJobs {
    return new PaginatedJobs(
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
