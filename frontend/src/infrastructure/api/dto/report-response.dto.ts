export interface CreateReportRequestDto {
  targetType: string;
  targetId: string;
  reason: string;
}

export interface ReportResponseDto {
  id: string;
  reporterId: string;
  targetType: string;
  targetId: string;
  reason: string;
  status: string;
  createdAt: string;
  resolvedAt: string | null;
}
