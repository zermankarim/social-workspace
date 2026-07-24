import { Job } from "@/core/domain/entities/job.entity";
import { JobPoster } from "@/core/domain/entities/job-poster.entity";
import { PaginatedJobs } from "@/core/domain/entities/paginated-jobs.entity";
import { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";
import type {
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

  static fromApi(dto: JobResponseDto): Job {
    return new Job(
      dto.id,
      dto.title,
      dto.companyName,
      dto.location,
      dto.description,
      dto.applyUrl,
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
