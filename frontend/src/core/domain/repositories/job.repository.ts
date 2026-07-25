import type { CreateJobDto } from "@/core/application/dtos/create-job.dto";
import type { Job } from "@/core/domain/entities/job.entity";
import type { PaginatedJobs } from "@/core/domain/entities/paginated-jobs.entity";
import type { EmploymentType } from "@/core/domain/enums/employment-type.enum";
import type { WorkplaceType } from "@/core/domain/enums/workplace-type.enum";
import type { JobExperienceLevel } from "@/core/domain/entities/job.entity";

export type JobFilters = {
  q?: string;
  location?: string;
  companyId?: string;
  employmentType?: EmploymentType;
  workplaceType?: WorkplaceType;
  experienceLevel?: JobExperienceLevel;
};

export abstract class JobRepository {
  abstract findFeed(
    filters?: JobFilters,
    page?: number,
    limit?: number,
  ): Promise<PaginatedJobs>;
  abstract findById(id: string): Promise<Job>;
  abstract create(dto: CreateJobDto): Promise<Job>;
  abstract remove(id: string): Promise<void>;
}
