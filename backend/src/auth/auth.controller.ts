import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import type { Request, Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SignupResponseDto } from './dto/signup-response.dto copy';
import { SigninResponseDto } from './dto/signin-response.dto';
import { SignoutResponseDto } from './dto/signout-response.dto';
import { RefreshJwtAuthGuard } from './guards/refresh-jwt.guard';
import { JwtPayload } from './types/jwt-payload';
import { RefreshResponseDto } from './dto/refresh-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign a user up' })
  @ApiResponse({ type: SignupResponseDto })
  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @ApiOperation({ summary: 'Sign a user in' })
  @ApiResponse({ type: SigninResponseDto })
  @Post('signin')
  signin(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.signin(dto, res);
  }

  @ApiOperation({ summary: 'Sign a user out' })
  @ApiResponse({ type: SignoutResponseDto })
  @Get('signout')
  signout(@Res({ passthrough: true }) res: Response) {
    return this.authService.signout(res);
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ type: RefreshResponseDto })
  @Post('refresh')
  @UseGuards(RefreshJwtAuthGuard)
  refresh(
    @Req() req: Request & { user: JwtPayload },
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.refresh(req.user, res);
  }
}
