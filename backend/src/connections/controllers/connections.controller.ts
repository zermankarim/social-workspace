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
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
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
import { ConnectionsService } from '../services/connections.service';
import { CreateConnectionDto } from '../dto/create-connection.dto';
import { ConnectionResponseDto } from '../dto/connection.dto';
import { PaginatedConnectionsQueryDto } from '../dto/paginated-connections-query.dto';
import { PaginatedConnectionsResponseDto } from '../dto/paginated-connections-response.dto';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import { type RequestWithJwtPayload } from '../../shared/types/request-with-jwt-payload.type';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';

@ApiTags('Connections')
@Controller('connections')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth('access_token')
@ApiUnauthorizedResponse({
  description: 'Missing or invalid access_token cookie',
})
export class ConnectionsController {
  constructor(private readonly connectionsService: ConnectionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Send a connection request',
    description:
      'Creates a pending connection from the current user to addresseeId.',
  })
  @ApiCreatedResponse({ type: ConnectionResponseDto })
  @ApiBadRequestResponse({
    description: 'Invalid body or cannot connect with yourself',
  })
  @ApiNotFoundResponse({ description: 'Addressee not found' })
  @ApiConflictResponse({
    description: 'Already connected, pending, or blocked',
  })
  createConnection(
    @Req() req: RequestWithJwtPayload,
    @Body() dto: CreateConnectionDto,
  ): Promise<ConnectionResponseDto> {
    return this.connectionsService.createConnection(req.user.userId, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List accepted connections (paginated)',
    description: 'Returns ACCEPTED connections for the current user.',
  })
  @ApiOkResponse({ type: PaginatedConnectionsResponseDto })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters (page, limit)',
  })
  getAccepted(
    @Req() req: RequestWithJwtPayload,
    @Query() query: PaginatedConnectionsQueryDto,
  ): Promise<PaginatedResponseDto<ConnectionResponseDto>> {
    return this.connectionsService.getAcceptedByUserId(req.user.userId, query);
  }

  @Get('pending')
  @ApiOperation({
    summary: 'List incoming pending requests (paginated)',
    description:
      'Returns PENDING connections where the current user is the addressee.',
  })
  @ApiOkResponse({ type: PaginatedConnectionsResponseDto })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters (page, limit)',
  })
  getPendingIncoming(
    @Req() req: RequestWithJwtPayload,
    @Query() query: PaginatedConnectionsQueryDto,
  ): Promise<PaginatedResponseDto<ConnectionResponseDto>> {
    return this.connectionsService.getPendingIncomingByUserId(
      req.user.userId,
      query,
    );
  }

  @Get('outgoing')
  @ApiOperation({
    summary: 'List outgoing pending requests (paginated)',
    description:
      'Returns PENDING connections where the current user is the requester.',
  })
  @ApiOkResponse({ type: PaginatedConnectionsResponseDto })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters (page, limit)',
  })
  getPendingOutgoing(
    @Req() req: RequestWithJwtPayload,
    @Query() query: PaginatedConnectionsQueryDto,
  ): Promise<PaginatedResponseDto<ConnectionResponseDto>> {
    return this.connectionsService.getPendingOutgoingByUserId(
      req.user.userId,
      query,
    );
  }

  @Post(':id/accept')
  @ApiOperation({
    summary: 'Accept a connection request',
    description: 'Only the addressee can accept a PENDING request.',
  })
  @ApiOkResponse({ type: ConnectionResponseDto })
  @ApiBadRequestResponse({ description: 'Connection is not pending' })
  @ApiNotFoundResponse({ description: 'Connection not found' })
  @ApiForbiddenResponse({ description: 'Not the connection addressee' })
  acceptConnection(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ConnectionResponseDto> {
    return this.connectionsService.acceptConnection(req.user.userId, id);
  }

  @Post(':id/reject')
  @ApiOperation({
    summary: 'Reject a connection request',
    description: 'Only the addressee can reject a PENDING request.',
  })
  @ApiOkResponse({ type: ConnectionResponseDto })
  @ApiBadRequestResponse({ description: 'Connection is not pending' })
  @ApiNotFoundResponse({ description: 'Connection not found' })
  @ApiForbiddenResponse({ description: 'Not the connection addressee' })
  rejectConnection(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ConnectionResponseDto> {
    return this.connectionsService.rejectConnection(req.user.userId, id);
  }

  @Post('block/:userId')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Block a user',
    description:
      'Replaces any existing connection between the two users with a BLOCKED one. ' +
      'A blocked user cannot send connection requests or message the blocker.',
  })
  @ApiCreatedResponse({ type: ConnectionResponseDto })
  @ApiBadRequestResponse({ description: 'Cannot block yourself' })
  @ApiNotFoundResponse({ description: 'User not found' })
  blockUser(
    @Req() req: RequestWithJwtPayload,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<ConnectionResponseDto> {
    return this.connectionsService.blockUser(req.user.userId, userId);
  }

  @Delete('block/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Unblock a user' })
  @ApiNoContentResponse({ description: 'Unblocked' })
  @ApiNotFoundResponse({ description: 'You have not blocked this user' })
  unblockUser(
    @Req() req: RequestWithJwtPayload,
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<void> {
    return this.connectionsService.unblockUser(req.user.userId, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Remove a connection or withdraw a request',
    description:
      'Deletes an ACCEPTED connection (either side), or withdraws own PENDING request.',
  })
  @ApiNoContentResponse({ description: 'Connection removed' })
  @ApiNotFoundResponse({ description: 'Connection not found' })
  @ApiForbiddenResponse({
    description: 'Not a participant, or cannot withdraw another user request',
  })
  deleteConnection(
    @Req() req: RequestWithJwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    return this.connectionsService.deleteConnection(req.user.userId, id);
  }
}
