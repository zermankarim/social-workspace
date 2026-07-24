import type { CreateJobDto } from "@/core/application/dtos/create-job.dto";
import type { Job } from "@/core/domain/entities/job.entity";
import type { PaginatedJobs } from "@/core/domain/entities/paginated-jobs.entity";
import { JobRepository } from "@/core/domain/repositories/job.repository";
import type {
  CreateJobRequestDto,
  JobResponseDto,
  PaginatedJobsResponseDto,
} from "@/infrastructure/api/dto/job-response.dto";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { JobMapper } from "@/infrastructure/mappers/job.mapper";

export class JobApiRepository extends JobRepository {
  constructor(private readonly httpClient: HttpClient) {
    super();
  }

  async findFeed(page = 1, limit = 20): Promise<PaginatedJobs> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    const response = await this.httpClient.request<PaginatedJobsResponseDto>(
      `/jobs?${params.toString()}`,
    );
    return JobMapper.paginatedFromApi(response);
  }

  async findById(id: string): Promise<Job> {
    const response = await this.httpClient.request<JobResponseDto>(
      `/jobs/${id}`,
    );
    return JobMapper.fromApi(response);
  }

  async create(dto: CreateJobDto): Promise<Job> {
    const body: CreateJobRequestDto = {
      title: dto.title,
      companyName: dto.companyName,
      location: dto.location,
      description: dto.description,
      applyUrl: dto.applyUrl,
    };
    const response = await this.httpClient.request<JobResponseDto>("/jobs", {
      method: "POST",
      body,
    });
    return JobMapper.fromApi(response);
  }

  async remove(id: string): Promise<void> {
    await this.httpClient.request<void>(`/jobs/${id}`, { method: "DELETE" });
  }
}
