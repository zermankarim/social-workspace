import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NewsStoryResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  public id: string;

  @ApiProperty({ example: 'Remote teams rethink office days' })
  public title: string;

  @ApiPropertyOptional({ nullable: true, example: 'A short summary line.' })
  public summary: string | null;

  @ApiPropertyOptional({ nullable: true, example: 'https://example.com/story' })
  public url: string | null;

  @ApiProperty({
    example: 8412,
    description: 'Number of members who opened it',
  })
  public readersCount: number;

  @ApiProperty({ example: '2026-07-17T12:00:00.000Z' })
  public createdAt: Date;
}

export class NewsStoryDetailResponseDto extends NewsStoryResponseDto {
  @ApiPropertyOptional({
    nullable: true,
    example: 'The full editorial story, written as plain text.',
  })
  public body: string | null;
}
