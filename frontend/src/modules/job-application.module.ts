import { JobApplicationService } from "@/core/application/services/job-application.service";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { JobApplicationApiRepository } from "@/infrastructure/repositories/job-application-api.repository";

export class JobApplicationModule {
  static create(httpClient: HttpClient): JobApplicationService {
    return new JobApplicationService(
      new JobApplicationApiRepository(httpClient),
    );
  }
}
