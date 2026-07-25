import type { JobApplication } from "@/core/domain/entities/job-application.entity";
import type { PaginatedJobApplications } from "@/core/domain/entities/paginated-job-applications.entity";
import {
  JobApplicationRepository,
  type ApplyToJobInput,
  type DecideJobApplicationInput,
  type LastContactInfo,
} from "@/core/domain/repositories/job-application.repository";
import type {
  CreateJobApplicationRequestDto,
  DecideJobApplicationRequestDto,
  JobApplicationResponseDto,
  LastContactInfoResponseDto,
  PaginatedJobApplicationsResponseDto,
} from "@/infrastructure/api/dto/job-application-response.dto";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { JobApplicationMapper } from "@/infrastructure/mappers/job-application.mapper";

export class JobApplicationApiRepository extends JobApplicationRepository {
  constructor(private readonly httpClient: HttpClient) {
    super();
  }

  async apply(jobId: string, input: ApplyToJobInput): Promise<JobApplication> {
    const body: CreateJobApplicationRequestDto = input;
    const response = await this.httpClient.request<JobApplicationResponseDto>(
      `/jobs/${jobId}/applications`,
      { method: "POST", body },
    );
    return JobApplicationMapper.fromApi(response);
  }

  async listForJob(
    jobId: string,
    page = 1,
    limit = 20,
  ): Promise<PaginatedJobApplications> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    const response =
      await this.httpClient.request<PaginatedJobApplicationsResponseDto>(
        `/jobs/${jobId}/applications?${params.toString()}`,
      );
    return JobApplicationMapper.paginatedFromApi(response);
  }

  async listSent(page = 1, limit = 20): Promise<PaginatedJobApplications> {
    return this.fetchList("/applications/me", page, limit);
  }

  async listReceived(page = 1, limit = 20): Promise<PaginatedJobApplications> {
    return this.fetchList("/applications/received", page, limit);
  }

  async withdraw(id: string): Promise<JobApplication> {
    const response = await this.httpClient.request<JobApplicationResponseDto>(
      `/applications/${id}`,
      { method: "DELETE" },
    );
    return JobApplicationMapper.fromApi(response);
  }

  async decide(
    id: string,
    input: DecideJobApplicationInput,
  ): Promise<JobApplication> {
    const body: DecideJobApplicationRequestDto = input;
    const response = await this.httpClient.request<JobApplicationResponseDto>(
      `/applications/${id}/decision`,
      { method: "PATCH", body },
    );
    return JobApplicationMapper.fromApi(response);
  }

  async getLastContactInfo(): Promise<LastContactInfo> {
    return this.httpClient.request<LastContactInfoResponseDto>(
      "/applications/last-contact",
    );
  }

  private async fetchList(
    path: string,
    page: number,
    limit: number,
  ): Promise<PaginatedJobApplications> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    const response =
      await this.httpClient.request<PaginatedJobApplicationsResponseDto>(
        `${path}?${params.toString()}`,
      );
    return JobApplicationMapper.paginatedFromApi(response);
  }
}
