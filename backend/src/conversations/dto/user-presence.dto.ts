import { ApiProperty } from '@nestjs/swagger';

export class UserPresenceDto {
  @ApiProperty()
  userId: string;

  @ApiProperty()
  online: boolean;

  @ApiProperty({
    nullable: true,
    description: 'ISO timestamp; set when user goes offline',
  })
  lastSeenAt: string | null;
}
