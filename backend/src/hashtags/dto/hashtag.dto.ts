import { ApiProperty } from '@nestjs/swagger';

export class HashtagResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({
    example: 'hiring',
    description: 'Normalized tag without the leading #',
  })
  tag: string;

  @ApiProperty({ example: 42, description: 'Number of posts using this tag' })
  postsCount: number;
}
