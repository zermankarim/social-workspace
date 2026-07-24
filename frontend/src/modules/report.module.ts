import { ReportService } from "@/core/application/services/report.service";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { ReportApiRepository } from "@/infrastructure/repositories/report-api.repository";

export class ReportModule {
  static create(httpClient: HttpClient): ReportService {
    return new ReportService(new ReportApiRepository(httpClient));
  }
}
