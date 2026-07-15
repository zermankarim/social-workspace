import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DevicesService } from '../services/devices.service';
import {
  RegisterDeviceDto,
  UserDevicePublicDto,
  UserDeviceResponseDto,
} from '../dto/device.dto';
import { type RequestWithJwtPayload } from '../../shared/types/request-with-jwt-payload.type';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@ApiTags('Devices')
@Controller('devices')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth('access_token')
@ApiUnauthorizedResponse({
  description: 'Missing or invalid access_token cookie',
})
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register or refresh E2EE device public keys',
  })
  @ApiCreatedResponse({ type: UserDeviceResponseDto })
  @ApiBadRequestResponse()
  register(
    @Req() req: RequestWithJwtPayload,
    @Body() dto: RegisterDeviceDto,
  ): Promise<UserDeviceResponseDto> {
    return this.devicesService.register(req.user.userId, dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'List my registered devices' })
  @ApiOkResponse({ type: [UserDeviceResponseDto] })
  listMine(
    @Req() req: RequestWithJwtPayload,
  ): Promise<UserDeviceResponseDto[]> {
    return this.devicesService.listMine(req.user.userId);
  }

  @Get('by-user/:userId')
  @ApiOperation({
    summary: 'List public device keys for a user (for E2EE handshake)',
  })
  @ApiOkResponse({ type: [UserDevicePublicDto] })
  @ApiNotFoundResponse()
  listPublicByUserId(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<UserDevicePublicDto[]> {
    return this.devicesService.listPublicByUserId(userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove one of my devices' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  remove(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.devicesService.remove(req.user.userId, id);
  }
}
