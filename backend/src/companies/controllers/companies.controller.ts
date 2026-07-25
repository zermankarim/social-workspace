import {
  Body,
  Controller,
  Delete,
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
import type { Request } from 'express';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
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
import { CompaniesService } from '../services/companies.service';
import {
  CompanyResponseDto,
  CompanyServiceResponseDto,
  CompanySummaryDto,
} from '../dto/company.dto';
import { CreateCompanyDto, UpdateCompanyDto } from '../dto/create-company.dto';
import { CreateCompanyServiceDto } from '../dto/company-service.dto';
import { CompanySearchQueryDto } from '../dto/company-search-query.dto';
import { AddCompanyAdminDto } from '../dto/add-company-admin.dto';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import { type RequestWithJwtPayload } from '../../shared/types/request-with-jwt-payload.type';
import { type JwtPayload } from '../../auth/types/jwt-payload';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { OptionalJwtAuthGuard } from '../../auth/guards/optional-jwt.guard';

type RequestWithOptionalJwtPayload = Request & { user?: JwtPayload };

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search registered company pages' })
  @ApiOkResponse({ type: [CompanySummaryDto] })
  searchCompanies(
    @Query() query: CompanySearchQueryDto,
  ): Promise<PaginatedResponseDto<CompanySummaryDto>> {
    return this.companiesService.searchCompanies(query);
  }

  @Post()
  @ApiOperation({
    summary: 'Register a company page',
    description: 'The creator becomes the first OWNER admin.',
  })
  @ApiCreatedResponse({ type: CompanyResponseDto })
  @ApiConflictResponse({ description: 'Name already taken' })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access_token cookie',
  })
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  createCompany(
    @Req() req: RequestWithJwtPayload,
    @Body() body: CreateCompanyDto,
  ): Promise<CompanyResponseDto> {
    return this.companiesService.createCompany(req.user.userId, body);
  }

  @Get(':name')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary: 'Get a company page by name',
    description:
      'Public. When called with a session cookie, `isViewerAdmin` reflects whether the caller manages this page.',
  })
  @ApiOkResponse({ type: CompanyResponseDto })
  @ApiNotFoundResponse({ description: 'Company not found' })
  getCompanyByName(
    @Req() req: RequestWithOptionalJwtPayload,
    @Param('name') name: string,
  ): Promise<CompanyResponseDto> {
    return this.companiesService.getCompanyByName(name, req.user?.userId);
  }

  @Post(':id/follow')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Follow a company page' })
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access_token cookie',
  })
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  followCompany(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.companiesService.followCompany(req.user.userId, id);
  }

  @Delete(':id/follow')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Unfollow a company page' })
  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access_token cookie',
  })
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  unfollowCompany(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.companiesService.unfollowCompany(req.user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a company page (admins only)' })
  @ApiOkResponse({ type: CompanyResponseDto })
  @ApiForbiddenResponse({ description: 'Not an admin of this company' })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access_token cookie',
  })
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  updateCompany(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateCompanyDto,
  ): Promise<CompanyResponseDto> {
    return this.companiesService.updateCompany(req.user.userId, id, body);
  }

  @Post(':id/services')
  @ApiOperation({ summary: 'Add a service to a company page (admins only)' })
  @ApiCreatedResponse({ type: CompanyServiceResponseDto })
  @ApiForbiddenResponse({ description: 'Not an admin of this company' })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access_token cookie',
  })
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  addService(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: CreateCompanyServiceDto,
  ): Promise<CompanyServiceResponseDto> {
    return this.companiesService.addService(req.user.userId, id, body);
  }

  @Delete(':id/services/:serviceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove a service from a company page (admins only)',
  })
  @ApiNoContentResponse()
  @ApiNotFoundResponse({ description: 'Service not found' })
  @ApiForbiddenResponse({ description: 'Not an admin of this company' })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access_token cookie',
  })
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  removeService(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('serviceId', ParseUUIDPipe) serviceId: string,
  ): Promise<void> {
    return this.companiesService.removeService(req.user.userId, id, serviceId);
  }

  @Post(':id/admins')
  @ApiOperation({
    summary: 'Add another admin to a company page (owners only)',
  })
  @ApiNoContentResponse()
  @ApiBadRequestResponse()
  @ApiForbiddenResponse({ description: 'Only an owner can do this' })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access_token cookie',
  })
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  @HttpCode(HttpStatus.NO_CONTENT)
  addAdmin(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: AddCompanyAdminDto,
  ): Promise<void> {
    return this.companiesService.addAdmin(req.user.userId, id, body.userId);
  }

  @Delete(':id/admins/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove an admin from a company page (owners only)',
  })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ description: 'Cannot remove the last owner' })
  @ApiNotFoundResponse({ description: 'Admin not found' })
  @ApiForbiddenResponse({ description: 'Only an owner can do this' })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid access_token cookie',
  })
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  removeAdmin(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<void> {
    return this.companiesService.removeAdmin(req.user.userId, id, userId);
  }
}
