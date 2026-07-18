import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class TrendingHashtagsQueryDto {
  @ApiPropertyOptional({
    description: 'Maximum number of trending hashtags to return',
    default: 5,
    minimum: 1,
    maximum: 20,
    example: 5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  limit?: number = 5;
}
