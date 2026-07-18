import { ApiProperty } from '@nestjs/swagger';

export class UnreadNotificationsCountDto {
  @ApiProperty({ example: 3, description: 'Number of unread notifications' })
  count: number;
}
