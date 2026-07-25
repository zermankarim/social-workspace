import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JobApplicationsService } from '../services/job-applications.service';
import { CreateJobApplicationDto } from '../dto/create-job-application.dto';
import { JobApplicationResponseDto } from '../dto/job-application.dto';
import { PaginatedJobApplicationsQueryDto } from '../dto/paginated-job-applications-query.dto';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import { type RequestWithJwtPayload } from '../../shared/types/request-with-jwt-payload.type';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@ApiTags('Job Applications')
@Controller('jobs/:jobId/applications')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth('access_token')
@ApiUnauthorizedResponse({
  description: 'Missing or invalid access_token cookie',
})
export class JobApplyController {
  constructor(
    private readonly jobApplicationsService: JobApplicationsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Apply to a job ("Easy Apply")',
    description:
      'Re-applying after a withdrawal or rejection reopens the same application.',
  })
  @ApiCreatedResponse({ type: JobApplicationResponseDto })
  @ApiConflictResponse({ description: 'Already applied' })
  @ApiNotFoundResponse({ description: 'Job not found' })
  apply(
    @Req() req: RequestWithJwtPayload,
    @Param('jobId', ParseUUIDPipe) jobId: string,
    @Body() body: CreateJobApplicationDto,
  ): Promise<JobApplicationResponseDto> {
    return this.jobApplicationsService.apply(req.user.userId, jobId, body);
  }

  @Get()
  @ApiOperation({
    summary: 'Applications received for this specific job (poster/admin only)',
  })
  @ApiOkResponse({ type: [JobApplicationResponseDto] })
  @ApiForbiddenResponse({
    description: 'Not allowed to view these applications',
  })
  listForJob(
    @Req() req: RequestWithJwtPayload,
    @Param('jobId', ParseUUIDPipe) jobId: string,
    @Query() query: PaginatedJobApplicationsQueryDto,
  ): Promise<PaginatedResponseDto<JobApplicationResponseDto>> {
    return this.jobApplicationsService.listReceivedForJob(
      req.user.userId,
      jobId,
      query,
    );
  }
}
