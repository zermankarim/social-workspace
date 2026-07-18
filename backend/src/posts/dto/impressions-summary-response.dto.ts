import { ApiProperty } from '@nestjs/swagger';

export class ImpressionsSummaryResponseDto {
  @ApiProperty({
    example: 128,
    description: 'Total impressions across all posts authored by the user.',
  })
  public impressionsCount: number;
}
