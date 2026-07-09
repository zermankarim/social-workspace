import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserResponseDto } from '../users/dto/user.dto';
import { PaginatedUsersResponseDto } from './dto/paginated-users-response.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ProfileRole } from '@prisma/client';
import { PaginatedUsersQueryDto } from './dto/paginated-users-query.dto';

const GET_USER_BY_ID_PARAMS = {
  name: 'id',
  description: 'User ID',
  example: '550e8400-e29b-41d4-a716-446655440000',
} as const;

@ApiTags('Admin')
@ApiCookieAuth('access_token')
@ApiUnauthorizedResponse({
  description: 'Missing or invalid access_token cookie',
})
@Roles(ProfileRole.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({
    summary: 'List users (paginated)',
    description:
      'Returns a paginated list of all users. Admin only. ' +
      'Supports `page`, `limit`, `sortBy` (`createdAt`, `updatedAt`), `orderBy` (`asc`, `desc`) and `search` (email).',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of users',
    type: PaginatedUsersResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters (page, limit, sortBy, orderBy)',
  })
  @Get('/users')
  findPaginatedUsers(@Query() query: PaginatedUsersQueryDto) {
    return this.adminService.findPaginated(query);
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam(GET_USER_BY_ID_PARAMS)
  @ApiResponse({
    status: 200,
    description: 'User found',
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({ description: 'User not found' })
  @Get('/users/:id')
  getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }
}
