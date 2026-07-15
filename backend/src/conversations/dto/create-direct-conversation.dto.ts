import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateDirectConversationDto {
  @ApiProperty({
    description: 'Other participant user id (must be an accepted connection)',
  })
  @IsUUID()
  peerUserId: string;
}
