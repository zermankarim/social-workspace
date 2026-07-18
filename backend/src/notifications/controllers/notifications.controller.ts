import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { NotificationsService } from '../services/notifications.service';
import { NotificationResponseDto } from '../dto/notification.dto';
import { PaginatedNotificationsResponseDto } from '../dto/paginated-notifications-response.dto';
import { UnreadNotificationsCountDto } from '../dto/unread-count-response.dto';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import { type RequestWithJwtPayload } from '../../shared/types/request-with-jwt-payload.type';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth('access_token')
@ApiUnauthorizedResponse({ description: 'Missing or invalid access_token' })
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({
    summary: 'List notifications for the current user (paginated)',
    description: 'Newest first. Supports `page` and `limit`.',
  })
  @ApiOkResponse({ type: PaginatedNotificationsResponseDto })
  list(
    @Req() req: RequestWithJwtPayload,
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<NotificationResponseDto>> {
    return this.notificationsService.list(req.user.userId, query);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get the number of unread notifications' })
  @ApiOkResponse({ type: UnreadNotificationsCountDto })
  async getUnreadCount(
    @Req() req: RequestWithJwtPayload,
  ): Promise<UnreadNotificationsCountDto> {
    const count = await this.notificationsService.getUnreadCount(
      req.user.userId,
    );
    return { count };
  }

  @Patch('read-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiNoContentResponse({ description: 'All notifications marked as read' })
  markAllRead(@Req() req: RequestWithJwtPayload): Promise<void> {
    return this.notificationsService.markAllRead(req.user.userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Mark a single notification as read' })
  @ApiOkResponse({ type: NotificationResponseDto })
  @ApiForbiddenResponse({ description: 'Not your notification' })
  markRead(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<NotificationResponseDto> {
    return this.notificationsService.markRead(req.user.userId, id);
  }
}
