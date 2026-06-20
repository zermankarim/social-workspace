import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto/user.dto';
export class RefreshResponseDto {
  @ApiProperty({ example: 'Tokens refreshed' })
  message: string;
  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}
