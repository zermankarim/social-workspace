import { ResumeService } from "@/core/application/services/resume.service";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { ResumeApiRepository } from "@/infrastructure/repositories/resume-api.repository";

export class ResumeModule {
  static create(httpClient: HttpClient): ResumeService {
    return new ResumeService(new ResumeApiRepository(httpClient));
  }
}
