import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JobApplicationsService } from '../services/job-applications.service';
import { DecideJobApplicationDto } from '../dto/decide-job-application.dto';
import { JobApplicationResponseDto } from '../dto/job-application.dto';
import { PaginatedJobApplicationsQueryDto } from '../dto/paginated-job-applications-query.dto';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import { type RequestWithJwtPayload } from '../../shared/types/request-with-jwt-payload.type';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@ApiTags('Job Applications')
@Controller('applications')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth('access_token')
@ApiUnauthorizedResponse({
  description: 'Missing or invalid access_token cookie',
})
export class JobApplicationsController {
  constructor(
    private readonly jobApplicationsService: JobApplicationsService,
  ) {}

  @Get('last-contact')
  @ApiOperation({
    summary: 'Contact info entered on my most recent application',
    description: 'Used to prefill the "Easy Apply" contact-info step.',
  })
  @ApiOkResponse({
    schema: {
      type: 'object',
      properties: {
        contactEmail: { type: 'string', nullable: true },
        contactPhone: { type: 'string', nullable: true },
      },
    },
  })
  getLastContactInfo(
    @Req() req: RequestWithJwtPayload,
  ): Promise<{ contactEmail: string | null; contactPhone: string | null }> {
    return this.jobApplicationsService.getLastContactInfo(req.user.userId);
  }

  @Get('me')
  @ApiOperation({ summary: 'Applications I have sent' })
  @ApiOkResponse({ type: [JobApplicationResponseDto] })
  listSent(
    @Req() req: RequestWithJwtPayload,
    @Query() query: PaginatedJobApplicationsQueryDto,
  ): Promise<PaginatedResponseDto<JobApplicationResponseDto>> {
    return this.jobApplicationsService.listSent(req.user.userId, query);
  }

  @Get('received')
  @ApiOperation({
    summary: 'Applications received across every job I can manage',
    description:
      'Includes jobs you personally posted and jobs posted by any company you admin.',
  })
  @ApiOkResponse({ type: [JobApplicationResponseDto] })
  listReceived(
    @Req() req: RequestWithJwtPayload,
    @Query() query: PaginatedJobApplicationsQueryDto,
  ): Promise<PaginatedResponseDto<JobApplicationResponseDto>> {
    return this.jobApplicationsService.listReceived(req.user.userId, query);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Withdraw a pending application' })
  @ApiOkResponse({ type: JobApplicationResponseDto })
  @ApiBadRequestResponse({
    description: 'Only a pending application can be withdrawn',
  })
  @ApiNotFoundResponse({ description: 'Application not found' })
  withdraw(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<JobApplicationResponseDto> {
    return this.jobApplicationsService.withdraw(req.user.userId, id);
  }

  @Patch(':id/decision')
  @ApiOperation({
    summary: 'Accept or reject an application (poster or company admin only)',
  })
  @ApiOkResponse({ type: JobApplicationResponseDto })
  @ApiBadRequestResponse({ description: 'Already decided' })
  @ApiForbiddenResponse({
    description: 'Not allowed to decide on this application',
  })
  @ApiNotFoundResponse({ description: 'Application not found' })
  decide(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: DecideJobApplicationDto,
  ): Promise<JobApplicationResponseDto> {
    return this.jobApplicationsService.decide(req.user.userId, id, body);
  }
}
