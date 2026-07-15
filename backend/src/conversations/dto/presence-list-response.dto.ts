import { ApiProperty } from '@nestjs/swagger';
import { UserPresenceDto } from './user-presence.dto';

export class PresenceListResponseDto {
  @ApiProperty({ type: [UserPresenceDto] })
  data: UserPresenceDto[];
}
