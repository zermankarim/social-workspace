import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto } from './dto/user.dto';

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
  @UseGuards(JwtAuthGuard)
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
