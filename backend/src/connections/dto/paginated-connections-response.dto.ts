import { createPaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import { ConnectionResponseDto } from './connection.dto';

export const PaginatedConnectionsResponseDto = createPaginatedResponseDto(
  ConnectionResponseDto,
  'Connections for the current page',
);
