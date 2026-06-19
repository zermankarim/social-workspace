import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import type { Request, Response } from 'express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SignupResponseDto } from './dto/signup-response.dto copy';
import { SigninResponseDto } from './dto/signin-response.dto';
import { SignoutResponseDto } from './dto/signout-response.dto';

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
  signin(@Body() dto: AuthDto, @Req() req: Request, @Res() res: Response) {
    return this.authService.signin(dto, res);
  }

  @ApiOperation({ summary: 'Sign a user out' })
  @ApiResponse({ type: SignoutResponseDto })
  @Get('signout')
  signout(@Res() res: Response) {
    return this.authService.signout(res);
  }
}
