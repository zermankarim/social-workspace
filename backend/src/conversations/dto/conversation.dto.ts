import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MessagingUserDto } from './messaging-user.dto';
import { MessageResponseDto } from './message.dto';

export class ConversationMemberDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  userId: string;

  @ApiProperty({ type: MessagingUserDto })
  user: MessagingUserDto;

  @ApiProperty()
  joinedAt: Date;

  @ApiPropertyOptional({ nullable: true })
  lastReadAt: Date | null;
}

export class ConversationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty({
    description: 'Sorted userAId_userBId for DIRECT chats',
  })
  directKey: string;

  @ApiProperty({ type: [ConversationMemberDto] })
  members: ConversationMemberDto[];

  @ApiProperty({
    description: 'Unread messages for the current viewer',
    example: 3,
  })
  unreadCount: number;

  @ApiPropertyOptional({
    type: MessageResponseDto,
    nullable: true,
    description: 'Latest message (ciphertext; decrypt on client)',
  })
  lastMessage: MessageResponseDto | null;

  @ApiPropertyOptional({
    description: 'Whether the DIRECT peer is currently online',
    example: true,
  })
  peerOnline?: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

export class UnreadTotalResponseDto {
  @ApiProperty({ example: 12 })
  total: number;
}
