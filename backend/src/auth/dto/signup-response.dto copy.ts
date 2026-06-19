import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '../../users/dto/user.dto';

export class SignupResponseDto {
  @ApiProperty()
  user: UserResponseDto;
}
