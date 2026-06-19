import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto/user.dto';

export class SigninResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  user: UserResponseDto;
}
