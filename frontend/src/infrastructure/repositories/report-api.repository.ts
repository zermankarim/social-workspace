import type { ReportTargetType } from "@/core/domain/enums/report-target-type.enum";
import { ReportRepository } from "@/core/domain/repositories/report.repository";
import type {
  CreateReportRequestDto,
  ReportResponseDto,
} from "@/infrastructure/api/dto/report-response.dto";
import type { HttpClient } from "@/infrastructure/http/http-client";

export class ReportApiRepository extends ReportRepository {
  constructor(private readonly httpClient: HttpClient) {
    super();
  }

  async create(
    targetType: ReportTargetType,
    targetId: string,
    reason: string,
  ): Promise<void> {
    const body: CreateReportRequestDto = { targetType, targetId, reason };
    await this.httpClient.request<ReportResponseDto>("/reports", {
      method: "POST",
      body,
    });
  }
}
