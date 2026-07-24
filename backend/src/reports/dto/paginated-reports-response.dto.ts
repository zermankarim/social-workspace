import { createPaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import { ReportResponseDto } from './report.dto';

export const PaginatedReportsResponseDto = createPaginatedResponseDto(
  ReportResponseDto,
  'Reports for the current page',
);
