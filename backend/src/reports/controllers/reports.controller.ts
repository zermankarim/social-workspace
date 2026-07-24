import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProfileRole } from '@prisma/client';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ReportsService } from '../services/reports.service';
import { CreateReportDto } from '../dto/create-report.dto';
import { ReportResponseDto } from '../dto/report.dto';
import { PaginatedReportsQueryDto } from '../dto/paginated-reports-query.dto';
import { PaginatedReportsResponseDto } from '../dto/paginated-reports-response.dto';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import { type RequestWithJwtPayload } from '../../shared/types/request-with-jwt-payload.type';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth('access_token')
@ApiUnauthorizedResponse({
  description: 'Missing or invalid access_token cookie',
})
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Report a user, post, or comment' })
  @ApiCreatedResponse({ type: ReportResponseDto })
  @ApiBadRequestResponse({ description: 'Invalid body' })
  @ApiNotFoundResponse({ description: 'Report target not found' })
  createReport(
    @Req() req: RequestWithJwtPayload,
    @Body() dto: CreateReportDto,
  ): Promise<ReportResponseDto> {
    return this.reportsService.createReport(req.user.userId, dto);
  }

  @Get()
  @Roles(ProfileRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'List reports (paginated, admin only)',
    description: 'Optionally filter by `status`.',
  })
  @ApiOkResponse({ type: PaginatedReportsResponseDto })
  @ApiForbiddenResponse({ description: 'Admin only' })
  listReports(
    @Query() query: PaginatedReportsQueryDto,
  ): Promise<PaginatedResponseDto<ReportResponseDto>> {
    return this.reportsService.listReports(query);
  }

  @Patch(':id/resolve')
  @Roles(ProfileRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Mark a report resolved (admin only)' })
  @ApiOkResponse({ type: ReportResponseDto })
  @ApiForbiddenResponse({ description: 'Admin only' })
  @ApiNotFoundResponse({ description: 'Report not found' })
  resolveReport(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ReportResponseDto> {
    return this.reportsService.resolveReport(id);
  }

  @Patch(':id/dismiss')
  @Roles(ProfileRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Dismiss a report (admin only)' })
  @ApiOkResponse({ type: ReportResponseDto })
  @ApiForbiddenResponse({ description: 'Admin only' })
  @ApiNotFoundResponse({ description: 'Report not found' })
  dismissReport(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ReportResponseDto> {
    return this.reportsService.dismissReport(id);
  }
}
