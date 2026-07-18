import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ConversationsService } from '../services/conversations.service';
import { CreateDirectConversationDto } from '../dto/create-direct-conversation.dto';
import {
  ConversationResponseDto,
  UnreadTotalResponseDto,
} from '../dto/conversation.dto';
import {
  MessageResponseDto,
  SendMessageDto,
  SetMessageReactionDto,
} from '../dto/message.dto';
import { PaginatedConversationsQueryDto } from '../dto/paginated-conversations-query.dto';
import { PaginatedConversationsResponseDto } from '../dto/paginated-conversations-response.dto';
import { PaginatedMessagesQueryDto } from '../dto/paginated-messages-query.dto';
import { PaginatedMessagesResponseDto } from '../dto/paginated-messages-response.dto';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import { type RequestWithJwtPayload } from '../../shared/types/request-with-jwt-payload.type';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { PresenceQueryDto } from '../dto/presence-query.dto';
import { PresenceListResponseDto } from '../dto/presence-list-response.dto';

@ApiTags('Conversations')
@Controller('conversations')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth('access_token')
@ApiUnauthorizedResponse({
  description: 'Missing or invalid access_token cookie',
})
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post('direct')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Open or get DIRECT conversation with a connection',
    description:
      'Idempotent: returns existing conversation for the pair if present.',
  })
  @ApiOkResponse({ type: ConversationResponseDto })
  @ApiForbiddenResponse({
    description: 'Not connected or cannot message yourself',
  })
  @ApiBadRequestResponse()
  openDirect(
    @Req() req: RequestWithJwtPayload,
    @Body() dto: CreateDirectConversationDto,
  ): Promise<ConversationResponseDto> {
    return this.conversationsService.openDirect(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List my conversations (paginated)',
    description:
      'Includes unreadCount, lastMessage (ciphertext), and peerOnline.',
  })
  @ApiOkResponse({ type: PaginatedConversationsResponseDto })
  listMine(
    @Req() req: RequestWithJwtPayload,
    @Query() query: PaginatedConversationsQueryDto,
  ): Promise<PaginatedResponseDto<ConversationResponseDto>> {
    return this.conversationsService.listMine(req.user.userId, query);
  }

  @Get('unread-total')
  @ApiOperation({
    summary: 'Total unread messages across all conversations (nav badge)',
  })
  @ApiOkResponse({ type: UnreadTotalResponseDto })
  getUnreadTotal(
    @Req() req: RequestWithJwtPayload,
  ): Promise<UnreadTotalResponseDto> {
    return this.conversationsService.getUnreadTotal(req.user.userId);
  }

  @Get('presence')
  @ApiOperation({
    summary: 'Batch online/offline presence for user ids',
  })
  @ApiOkResponse({ type: PresenceListResponseDto })
  @ApiBadRequestResponse()
  getPresence(@Query() query: PresenceQueryDto): PresenceListResponseDto {
    return { data: this.conversationsService.getPresence(query.userIds) };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get conversation by id' })
  @ApiOkResponse({ type: ConversationResponseDto })
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  getById(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ConversationResponseDto> {
    return this.conversationsService.getById(req.user.userId, id);
  }

  @Post(':id/read')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Mark conversation as read' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  markRead(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.conversationsService.markRead(req.user.userId, id);
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'List messages in a conversation (paginated)' })
  @ApiOkResponse({ type: PaginatedMessagesResponseDto })
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  listMessages(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Query() query: PaginatedMessagesQueryDto,
  ): Promise<PaginatedResponseDto<MessageResponseDto>> {
    return this.conversationsService.listMessages(req.user.userId, id, query);
  }

  @Post(':id/messages')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Send an E2EE message (ciphertext only)',
  })
  @ApiCreatedResponse({ type: MessageResponseDto })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  sendMessage(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SendMessageDto,
  ): Promise<MessageResponseDto> {
    return this.conversationsService.sendMessage(req.user.userId, id, dto);
  }

  @Put(':id/messages/:messageId/reaction')
  @ApiOperation({
    summary: 'Set (or replace) my reaction on a message',
  })
  @ApiOkResponse({ type: MessageResponseDto })
  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  setReaction(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('messageId', ParseUUIDPipe) messageId: string,
    @Body() dto: SetMessageReactionDto,
  ): Promise<MessageResponseDto> {
    return this.conversationsService.setReaction(
      req.user.userId,
      id,
      messageId,
      dto.emoji,
    );
  }

  @Delete(':id/messages/:messageId/reaction')
  @ApiOperation({ summary: 'Remove my reaction from a message' })
  @ApiOkResponse({ type: MessageResponseDto })
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  removeReaction(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('messageId', ParseUUIDPipe) messageId: string,
  ): Promise<MessageResponseDto> {
    return this.conversationsService.removeReaction(
      req.user.userId,
      id,
      messageId,
    );
  }
}
