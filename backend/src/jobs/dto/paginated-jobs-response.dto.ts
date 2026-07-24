import { createPaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import { JobResponseDto } from './job.dto';

export const PaginatedJobsResponseDto = createPaginatedResponseDto(
  JobResponseDto,
  'Jobs for the current page',
);
