import { ApiProperty } from '@nestjs/swagger';
import { ProfileRole } from '@prisma/client';

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
}
