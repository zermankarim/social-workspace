import { ApiProperty } from '@nestjs/swagger';

export class ProfileViewsCountResponseDto {
  @ApiProperty({
    example: 12,
    description: 'Number of distinct people who viewed the profile.',
  })
  public count: number;
}
