import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class AuthDto {
  @ApiProperty({ example: 'someemail@gmail.com' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string;

  @ApiProperty({
    example: '12345678',
    minimum: 8,
    maximum: 20,
    description: 'Password must be betweeen 8 and 20 chars',
  })
  @IsNotEmpty()
  @IsString()
  @Length(8, 20, { message: 'Password must be betweeen 8 and 20 chars' })
  public password: string;
}
