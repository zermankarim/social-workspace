import type { JobApplication } from "@/core/domain/entities/job-application.entity";
import type { PaginatedJobApplications } from "@/core/domain/entities/paginated-job-applications.entity";
import type {
  ApplyToJobInput,
  DecideJobApplicationInput,
  JobApplicationRepository,
  LastContactInfo,
} from "@/core/domain/repositories/job-application.repository";

export class JobApplicationService {
  constructor(
    private readonly jobApplicationRepository: JobApplicationRepository,
  ) {}

  apply(jobId: string, input: ApplyToJobInput): Promise<JobApplication> {
    return this.jobApplicationRepository.apply(jobId, input);
  }

  listForJob(
    jobId: string,
    page = 1,
    limit = 20,
  ): Promise<PaginatedJobApplications> {
    return this.jobApplicationRepository.listForJob(jobId, page, limit);
  }

  listSent(page = 1, limit = 20): Promise<PaginatedJobApplications> {
    return this.jobApplicationRepository.listSent(page, limit);
  }

  listReceived(page = 1, limit = 20): Promise<PaginatedJobApplications> {
    return this.jobApplicationRepository.listReceived(page, limit);
  }

  withdraw(id: string): Promise<JobApplication> {
    return this.jobApplicationRepository.withdraw(id);
  }

  decide(
    id: string,
    input: DecideJobApplicationInput,
  ): Promise<JobApplication> {
    return this.jobApplicationRepository.decide(id, input);
  }

  getLastContactInfo(): Promise<LastContactInfo> {
    return this.jobApplicationRepository.getLastContactInfo();
  }
}
