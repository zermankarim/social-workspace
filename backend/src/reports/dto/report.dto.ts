import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReportStatus, ReportTargetType } from '@prisma/client';

export class ReportResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty()
  reporterId: string;

  @ApiProperty({ enum: ReportTargetType })
  targetType: ReportTargetType;

  @ApiProperty()
  targetId: string;

  @ApiProperty()
  reason: string;

  @ApiProperty({ enum: ReportStatus, example: ReportStatus.PENDING })
  status: ReportStatus;

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional({ nullable: true })
  resolvedAt: Date | null;
}
