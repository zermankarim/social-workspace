import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ConnectionSuggestionDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  userId: string;

  @ApiProperty({ example: 'John' })
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  lastName: string;

  @ApiPropertyOptional({ nullable: true })
  avatarUrl: string | null;

  @ApiPropertyOptional({ nullable: true })
  headline: string | null;

  @ApiProperty({
    example: 3,
    description:
      'Accepted connections you both share. 0 for fallback suggestions when no mutual signal exists yet.',
  })
  mutualConnectionsCount: number;
}
