import type { ReportTargetType } from "@/core/domain/enums/report-target-type.enum";

export abstract class ReportRepository {
  abstract create(
    targetType: ReportTargetType,
    targetId: string,
    reason: string,
  ): Promise<void>;
}
