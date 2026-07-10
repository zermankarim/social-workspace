import { ApiProperty } from '@nestjs/swagger';
import { ProfileRole } from '@prisma/client';
import { LocationResponseDto } from './location.dto';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: ProfileRole })
  role: ProfileRole;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  bio: string | null;

  @ApiProperty({ type: LocationResponseDto })
  location: LocationResponseDto | null;

  @ApiProperty({ format: 'uri' })
  avatarUrl: string | null;

  @ApiProperty({ format: 'uri' })
  github: string | null;

  @ApiProperty({ format: 'uri' })
  linkedin: string | null;

  @ApiProperty({ format: 'uri' })
  website: string | null;

  @ApiProperty({ format: 'uri' })
  twitter: string | null;
}
