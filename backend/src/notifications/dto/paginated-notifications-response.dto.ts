import { createPaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import { NotificationResponseDto } from './notification.dto';

export const PaginatedNotificationsResponseDto = createPaginatedResponseDto(
  NotificationResponseDto,
  'Notifications for the current page',
);
