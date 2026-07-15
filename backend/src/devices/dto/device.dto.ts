import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class RegisterDeviceDto {
  @ApiProperty({
    description: 'Stable client-generated device id',
    example: 'browser-chrome-abc123',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(128)
  deviceId: string;

  @ApiProperty({ description: 'Public identity key (base64)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2048)
  identityKeyPub: string;

  @ApiProperty({ description: 'Public signed pre-key (base64)' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2048)
  signedPreKeyPub: string;

  @ApiProperty({ example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  signedPreKeyId: number;
}

export class UserDeviceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  deviceId: string;

  @ApiProperty()
  identityKeyPub: string;

  @ApiProperty()
  signedPreKeyPub: string;

  @ApiProperty()
  signedPreKeyId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  lastSeenAt: Date;
}

export class UserDevicePublicDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  deviceId: string;

  @ApiProperty()
  identityKeyPub: string;

  @ApiProperty()
  signedPreKeyPub: string;

  @ApiProperty()
  signedPreKeyId: number;
}
