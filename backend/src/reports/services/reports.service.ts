import { Injectable, NotFoundException } from '@nestjs/common';
import { ReportStatus } from '@prisma/client';
import { ReportsRepository } from '../repositories/reports.repository';
import { ReportsMapper } from '../mappers/reports.mapper';
import { CreateReportDto } from '../dto/create-report.dto';
import { ReportResponseDto } from '../dto/report.dto';
import { PaginatedReportsQueryDto } from '../dto/paginated-reports-query.dto';
import { ReportSelected } from '../reports.select';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import {
  buildPaginationMeta,
  getPaginationParams,
} from '../../shared/utils/pagination';

@Injectable()
export class ReportsService {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  public async createReport(
    reporterId: string,
    dto: CreateReportDto,
  ): Promise<ReportResponseDto> {
    const exists = await this.reportsRepository.targetExists(
      dto.targetType,
      dto.targetId,
    );
    if (!exists) {
      throw new NotFoundException('Report target not found');
    }
    const created = await this.reportsRepository.create(reporterId, dto);
    return ReportsMapper.toResponseDto(created);
  }

  public async listReports(
    query: PaginatedReportsQueryDto,
  ): Promise<PaginatedResponseDto<ReportResponseDto>> {
    const { page, limit, skip, take } = getPaginationParams(
      query.page,
      query.limit,
    );

    const [items, total] = await Promise.all([
      this.reportsRepository.findMany(query.status, skip, take),
      this.reportsRepository.count(query.status),
    ]);

    return {
      data: items.map((item) => ReportsMapper.toResponseDto(item)),
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  public async resolveReport(id: string): Promise<ReportResponseDto> {
    const report = await this.getOrThrow(id);
    const updated = await this.reportsRepository.updateStatus(
      report.id,
      ReportStatus.RESOLVED,
    );
    return ReportsMapper.toResponseDto(updated);
  }

  public async dismissReport(id: string): Promise<ReportResponseDto> {
    const report = await this.getOrThrow(id);
    const updated = await this.reportsRepository.updateStatus(
      report.id,
      ReportStatus.DISMISSED,
    );
    return ReportsMapper.toResponseDto(updated);
  }

  private async getOrThrow(id: string): Promise<ReportSelected> {
    const report = await this.reportsRepository.findById(id);
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    return report;
  }
}
