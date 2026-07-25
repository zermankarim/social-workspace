import type { CreateJobDto } from "@/core/application/dtos/create-job.dto";
import type { Job } from "@/core/domain/entities/job.entity";
import type { PaginatedJobs } from "@/core/domain/entities/paginated-jobs.entity";
import type {
  JobFilters,
  JobRepository,
} from "@/core/domain/repositories/job.repository";

export class JobService {
  constructor(private readonly jobRepository: JobRepository) {}

  getFeed(filters?: JobFilters, page = 1, limit = 20): Promise<PaginatedJobs> {
    return this.jobRepository.findFeed(filters, page, limit);
  }

  getById(id: string): Promise<Job> {
    return this.jobRepository.findById(id);
  }

  create(dto: CreateJobDto): Promise<Job> {
    return this.jobRepository.create(dto);
  }

  remove(id: string): Promise<void> {
    return this.jobRepository.remove(id);
  }
}
