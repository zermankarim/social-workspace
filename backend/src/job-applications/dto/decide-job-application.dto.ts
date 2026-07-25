import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export const DECIDABLE_STATUSES = ['ACCEPTED', 'REJECTED'] as const;
export type DecidableStatus = (typeof DECIDABLE_STATUSES)[number];

export class DecideJobApplicationDto {
  @ApiProperty({ enum: DECIDABLE_STATUSES })
  @IsIn(DECIDABLE_STATUSES)
  status: DecidableStatus;

  @ApiPropertyOptional({
    maxLength: 1000,
    description: 'Optional reason shown to the applicant.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  reason?: string;
}
