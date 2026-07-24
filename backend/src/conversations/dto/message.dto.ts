import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { MessagingUserDto } from './messaging-user.dto';

export class MessageAttachmentInputDto {
  @ApiProperty({
    example: 'http://localhost:8000/files/enc-blob.bin',
    description: 'URL of client-encrypted attachment blob',
  })
  @IsNotEmpty()
  @IsUrl({ require_tld: false })
  url: string;

  @ApiPropertyOptional({ example: 245760, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ciphertextSize?: number | null;
}

export class MessageAttachmentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ format: 'uri' })
  url: string;

  @ApiPropertyOptional({ nullable: true })
  ciphertextSize: number | null;

  @ApiProperty()
  createdAt: Date;
}

export class MessageReactionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: '👍' })
  emoji: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;
}

export class MessageRecipientKeyInputDto {
  @ApiProperty({
    description: 'UserDevice.id this copy of the ciphertext is encrypted for',
  })
  @IsUUID()
  deviceId: string;

  @ApiProperty({ description: 'Base64 encrypted payload' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100_000)
  ciphertext: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  nonce: string;

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  keyVersion?: number;
}

export class MessageRecipientKeyResponseDto {
  @ApiProperty()
  deviceId: string;

  @ApiProperty({ description: 'Base64 encrypted payload' })
  ciphertext: string;

  @ApiProperty()
  nonce: string;

  @ApiProperty()
  keyVersion: number;
}

export class MessageResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  conversationId: string;

  @ApiProperty()
  senderId: string;

  @ApiProperty({ type: MessagingUserDto })
  sender: MessagingUserDto;

  @ApiPropertyOptional({ nullable: true })
  senderDeviceId: string | null;

  @ApiPropertyOptional({
    nullable: true,
    description: 'Legacy single-target payload — null on new messages.',
  })
  ciphertext: string | null;

  @ApiPropertyOptional({ nullable: true })
  nonce: string | null;

  @ApiProperty()
  keyVersion: number;

  @ApiProperty({
    type: [MessageRecipientKeyResponseDto],
    description:
      'Per-device encrypted copies. Empty on legacy pre-migration messages.',
  })
  recipientKeys: MessageRecipientKeyResponseDto[];

  @ApiProperty({ type: [MessageAttachmentResponseDto] })
  attachments: MessageAttachmentResponseDto[];

  @ApiProperty({ type: [MessageReactionResponseDto] })
  reactions: MessageReactionResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiPropertyOptional({ nullable: true })
  editedAt: Date | null;

  @ApiPropertyOptional({ nullable: true })
  deletedAt: Date | null;
}

export class SendMessageDto {
  @ApiProperty({
    description: 'UserDevice.id of the sending device (required for E2EE)',
  })
  @IsUUID()
  senderDeviceId: string;

  @ApiProperty({
    type: [MessageRecipientKeyInputDto],
    description:
      'One encrypted copy per target device — every device of both conversation members.',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => MessageRecipientKeyInputDto)
  recipientKeys: MessageRecipientKeyInputDto[];

  @ApiPropertyOptional({ type: [MessageAttachmentInputDto] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => MessageAttachmentInputDto)
  attachments?: MessageAttachmentInputDto[];
}

export class SetMessageReactionDto {
  @ApiProperty({ example: '👍', description: 'Single emoji reaction' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  emoji: string;
}
