import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class JobPosterDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiPropertyOptional({ nullable: true })
  avatarUrl: string | null;

  @ApiPropertyOptional({ nullable: true })
  headline: string | null;
}

export class JobResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ example: 'Senior Backend Engineer' })
  title: string;

  @ApiProperty({ example: 'Acme Inc.' })
  companyName: string;

  @ApiPropertyOptional({ example: 'Remote', nullable: true })
  location: string | null;

  @ApiProperty({ example: 'We are looking for...' })
  description: string;

  @ApiProperty({ example: 'https://example.com/careers/123' })
  applyUrl: string;

  @ApiProperty({ type: JobPosterDto })
  poster: JobPosterDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
