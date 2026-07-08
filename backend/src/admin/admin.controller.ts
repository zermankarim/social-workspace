import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto } from '../users/dto/user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ProfileRole } from '@prisma/client';

const GET_USER_BY_ID_PARAMS = {
  name: 'id',
  type: String,
  description: 'User ID',
  example: 'cuid123abc',
};

@Roles(ProfileRole.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ type: UserResponseDto, isArray: true })
  @Get('/users')
  findAllUsers() {
    return this.adminService.findAllUsers();
  }

  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam(GET_USER_BY_ID_PARAMS)
  @ApiResponse({ type: UserResponseDto })
  @Get('/users/:id')
  getUserById(@Param() params: { id: string }) {
    return this.adminService.getUserById(params.id);
  }
}
