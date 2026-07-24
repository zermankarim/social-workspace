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
import { JobsService } from '../services/jobs.service';
import { CreateJobDto } from '../dto/create-job.dto';
import { JobResponseDto } from '../dto/job.dto';
import { PaginatedJobsQueryDto } from '../dto/paginated-jobs-query.dto';
import { PaginatedJobsResponseDto } from '../dto/paginated-jobs-response.dto';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import { type RequestWithJwtPayload } from '../../shared/types/request-with-jwt-payload.type';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@ApiTags('Jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get()
  @ApiOperation({ summary: 'List job postings (paginated, newest first)' })
  @ApiOkResponse({ type: PaginatedJobsResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid query parameters' })
  getFeedPaginated(
    @Query() query: PaginatedJobsQueryDto,
  ): Promise<PaginatedResponseDto<JobResponseDto>> {
    return this.jobsService.getFeedPaginated(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a job posting by id' })
  @ApiOkResponse({ type: JobResponseDto })
  @ApiNotFoundResponse({ description: 'Job not found' })
  getJobById(@Param('id', ParseUUIDPipe) id: string): Promise<JobResponseDto> {
    return this.jobsService.getJobById(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Post a job listing',
    description:
      'Candidates apply via the external `applyUrl` — no in-app applications in v1.',
  })
  @ApiCreatedResponse({ type: JobResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access_token cookie',
  })
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  createJob(
    @Req() req: RequestWithJwtPayload,
    @Body() body: CreateJobDto,
  ): Promise<JobResponseDto> {
    return this.jobsService.createJob(req.user.userId, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a job listing (poster only)' })
  @ApiNoContentResponse({ description: 'Job deleted' })
  @ApiNotFoundResponse({ description: 'Job not found' })
  @ApiForbiddenResponse({ description: 'Not the job poster' })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access_token cookie',
  })
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  deleteJob(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.jobsService.deleteJob(req.user.userId, id);
  }
}
