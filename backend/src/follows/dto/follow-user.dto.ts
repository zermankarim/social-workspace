import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProfileRole } from '@prisma/client';

export class FollowUserDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiPropertyOptional({ nullable: true })
  headline: string | null;

  @ApiPropertyOptional({ nullable: true })
  avatarUrl: string | null;

  @ApiProperty({ enum: ProfileRole, example: ProfileRole.USER })
  role: ProfileRole;
}
