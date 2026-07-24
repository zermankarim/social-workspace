import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { LocationInputDto } from '../../users/dto/location.dto';

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
    description: 'Password must be between 8 and 20 chars',
  })
  @IsNotEmpty()
  @IsString()
  @Length(8, 20, { message: 'Password must be between 8 and 20 chars' })
  public password: string;
}

export class SignupDto extends AuthDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  public firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  public lastName: string;

  @ApiPropertyOptional({ example: 'I am a software engineer' })
  @IsOptional()
  @IsString()
  public bio?: string;

  @ApiPropertyOptional({ type: LocationInputDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => LocationInputDto)
  public location?: LocationInputDto;
}

export class MessageResponseDto {
  @ApiProperty()
  public message: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ example: 'someemail@gmail.com' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ description: 'Raw token from the reset-password email link' })
  @IsNotEmpty()
  @IsString()
  public token: string;

  @ApiProperty({
    example: 'newSecurePassword123',
    minimum: 8,
    maximum: 20,
    description: 'Password must be between 8 and 20 chars',
  })
  @IsNotEmpty()
  @IsString()
  @Length(8, 20, { message: 'Password must be between 8 and 20 chars' })
  public newPassword: string;
}
