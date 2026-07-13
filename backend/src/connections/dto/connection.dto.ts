import { ApiProperty } from '@nestjs/swagger';
import { ConnectionStatus } from '@prisma/client';
import { ConnectionUserDto } from './connection-user.dto';

export class ConnectionResponseDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id: string;

  @ApiProperty({ enum: ConnectionStatus, example: ConnectionStatus.PENDING })
  status: ConnectionStatus;

  @ApiProperty({ type: ConnectionUserDto })
  requester: ConnectionUserDto;

  @ApiProperty({ type: ConnectionUserDto })
  addressee: ConnectionUserDto;

  @ApiProperty({ example: '2026-07-13T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-07-13T12:00:00.000Z' })
  updatedAt: Date;
}
