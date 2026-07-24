import type { ReportTargetType } from "@/core/domain/enums/report-target-type.enum";
import type { ReportRepository } from "@/core/domain/repositories/report.repository";

export class ReportService {
  constructor(private readonly reportRepository: ReportRepository) {}

  create(
    targetType: ReportTargetType,
    targetId: string,
    reason: string,
  ): Promise<void> {
    return this.reportRepository.create(targetType, targetId, reason);
  }
}
