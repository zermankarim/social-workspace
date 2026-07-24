import { JobService } from "@/core/application/services/job.service";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { JobApiRepository } from "@/infrastructure/repositories/job-api.repository";

export class JobModule {
  static create(httpClient: HttpClient): JobService {
    return new JobService(new JobApiRepository(httpClient));
  }
}
