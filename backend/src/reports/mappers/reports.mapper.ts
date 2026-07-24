import { ReportResponseDto } from '../dto/report.dto';
import { ReportSelected } from '../reports.select';

export class ReportsMapper {
  static toResponseDto(report: ReportSelected): ReportResponseDto {
    return {
      id: report.id,
      reporterId: report.reporterId,
      targetType: report.targetType,
      targetId: report.targetId,
      reason: report.reason,
      status: report.status,
      createdAt: report.createdAt,
      resolvedAt: report.resolvedAt,
    };
  }
}
