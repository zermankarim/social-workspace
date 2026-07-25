import type { JobApplication } from "@/core/domain/entities/job-application.entity";
import type { PaginatedJobApplications } from "@/core/domain/entities/paginated-job-applications.entity";

export type ApplyToJobInput = {
  resumeId?: string;
  contactEmail?: string;
  contactPhone?: string;
  coverNote?: string;
};

export type DecideJobApplicationInput = {
  status: "ACCEPTED" | "REJECTED";
  reason?: string;
};

export type LastContactInfo = {
  contactEmail: string | null;
  contactPhone: string | null;
};

export abstract class JobApplicationRepository {
  abstract apply(
    jobId: string,
    input: ApplyToJobInput,
  ): Promise<JobApplication>;
  abstract listForJob(
    jobId: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedJobApplications>;
  abstract listSent(
    page?: number,
    limit?: number,
  ): Promise<PaginatedJobApplications>;
  abstract listReceived(
    page?: number,
    limit?: number,
  ): Promise<PaginatedJobApplications>;
  abstract withdraw(id: string): Promise<JobApplication>;
  abstract decide(
    id: string,
    input: DecideJobApplicationInput,
  ): Promise<JobApplication>;
  abstract getLastContactInfo(): Promise<LastContactInfo>;
}
