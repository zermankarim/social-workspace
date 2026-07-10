import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthDto, SignupDto } from '../dto/auth.dto';
import type { Request, Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SignupResponseDto } from '../dto/signup-response.dto copy';
import { SigninResponseDto } from '../dto/signin-response.dto';
import { SignoutResponseDto } from '../dto/signout-response.dto';
import { RefreshResponseDto } from '../dto/refresh-response.dto';
import { getCookie } from '../utils/cookie';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Sign a user up' })
  @ApiResponse({ type: SignupResponseDto })
  @Post('signup')
  signup(@Body() dto: SignupDto) {
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
  @Post('signout')
  signout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.signout(getCookie(req, 'refresh_token'), res);
  }

  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ type: RefreshResponseDto })
  @Post('refresh')
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.refresh(getCookie(req, 'refresh_token'), res);
  }
}
