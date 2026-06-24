import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { ProfileRole } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Get user by id' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'User ID',
    example: 'cuid123abc',
  })
  @ApiResponse({ type: UserResponseDto })
  @Roles(ProfileRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  getUserById(@Param() params: { id: string }) {
    return this.usersService.getUserById(params.id);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ type: UserResponseDto, isArray: true })
  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }
}
