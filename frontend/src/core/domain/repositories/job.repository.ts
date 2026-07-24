import type { CreateJobDto } from "@/core/application/dtos/create-job.dto";
import type { Job } from "@/core/domain/entities/job.entity";
import type { PaginatedJobs } from "@/core/domain/entities/paginated-jobs.entity";

export abstract class JobRepository {
  abstract findFeed(page?: number, limit?: number): Promise<PaginatedJobs>;
  abstract findById(id: string): Promise<Job>;
  abstract create(dto: CreateJobDto): Promise<Job>;
  abstract remove(id: string): Promise<void>;
}
