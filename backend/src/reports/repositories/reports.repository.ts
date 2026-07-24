import { Injectable } from '@nestjs/common';
import { ReportStatus, ReportTargetType } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { reportSelect, ReportSelected } from '../reports.select';

@Injectable()
export class ReportsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async targetExists(
    targetType: ReportTargetType,
    targetId: string,
  ): Promise<boolean> {
    if (targetType === ReportTargetType.USER) {
      const user = await this.prisma.user.findUnique({
        where: { id: targetId },
        select: { id: true },
      });
      return user !== null;
    }
    if (targetType === ReportTargetType.POST) {
      const post = await this.prisma.post.findUnique({
        where: { id: targetId },
        select: { id: true },
      });
      return post !== null;
    }
    const comment = await this.prisma.postComment.findUnique({
      where: { id: targetId },
      select: { id: true },
    });
    return comment !== null;
  }

  create(
    reporterId: string,
    dto: { targetType: ReportTargetType; targetId: string; reason: string },
  ): Promise<ReportSelected> {
    return this.prisma.report.create({
      data: {
        reporterId,
        targetType: dto.targetType,
        targetId: dto.targetId,
        reason: dto.reason,
      },
      select: reportSelect,
    });
  }

  findById(id: string): Promise<ReportSelected | null> {
    return this.prisma.report.findUnique({
      where: { id },
      select: reportSelect,
    });
  }

  findMany(
    status: ReportStatus | undefined,
    skip: number,
    take: number,
  ): Promise<ReportSelected[]> {
    return this.prisma.report.findMany({
      where: status ? { status } : undefined,
      select: reportSelect,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  count(status: ReportStatus | undefined): Promise<number> {
    return this.prisma.report.count({ where: status ? { status } : undefined });
  }

  updateStatus(id: string, status: ReportStatus): Promise<ReportSelected> {
    return this.prisma.report.update({
      where: { id },
      data: { status, resolvedAt: new Date() },
      select: reportSelect,
    });
  }
}
