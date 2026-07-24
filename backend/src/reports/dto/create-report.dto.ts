import { ApiProperty } from '@nestjs/swagger';
import { ReportTargetType } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateReportDto {
  @ApiProperty({
    enum: ReportTargetType,
    example: ReportTargetType.POST,
    description: 'What kind of thing is being reported',
  })
  @IsEnum(ReportTargetType)
  targetType: ReportTargetType;

  @ApiProperty({ description: 'Id of the user/post/comment being reported' })
  @IsUUID()
  targetId: string;

  @ApiProperty({
    example: 'Spam / scam link',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  reason: string;
}
