import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConnectionStatus } from '@prisma/client';
import { ConnectionsRepository } from '../repositories/connections.repository';
import { CreateConnectionDto } from '../dto/create-connection.dto';
import { ConnectionResponseDto } from '../dto/connection.dto';
import { ConnectionsMapper } from '../mappers/connections.mapper';
import { ConnectionSelected } from '../connections.select';
import { PaginatedConnectionsQueryDto } from '../dto/paginated-connections-query.dto';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import {
  buildPaginationMeta,
  getPaginationParams,
} from '../../shared/utils/pagination';
import { NotificationsService } from '../../notifications/services/notifications.service';

@Injectable()
export class ConnectionsService {
  constructor(
    private readonly connectionsRepository: ConnectionsRepository,
    private readonly notificationsService: NotificationsService,
  ) {}

  public async createConnection(
    requesterId: string,
    dto: CreateConnectionDto,
  ): Promise<ConnectionResponseDto> {
    const { addresseeId } = dto;

    if (requesterId === addresseeId) {
      throw new BadRequestException('Cannot connect with yourself');
    }

    const addresseeExists =
      await this.connectionsRepository.userExists(addresseeId);
    if (!addresseeExists) {
      throw new NotFoundException('User not found');
    }

    const existing = await this.connectionsRepository.findBetweenUsers(
      requesterId,
      addresseeId,
    );

    if (existing) {
      if (existing.status === ConnectionStatus.ACCEPTED) {
        throw new ConflictException('Already connected');
      }

      if (existing.status === ConnectionStatus.BLOCKED) {
        throw new ConflictException('Connection is blocked');
      }

      if (existing.status === ConnectionStatus.PENDING) {
        if (existing.requester.id === requesterId) {
          throw new ConflictException('Connection request already sent');
        }
        throw new ConflictException(
          'Incoming connection request already exists',
        );
      }

      if (
        existing.status === ConnectionStatus.REJECTED &&
        existing.requester.id === requesterId
      ) {
        const reopened = await this.connectionsRepository.updateStatus(
          existing.id,
          ConnectionStatus.PENDING,
        );
        await this.notificationsService.notifyConnectionRequest(
          requesterId,
          addresseeId,
        );
        return ConnectionsMapper.toConnectionResponseDto(reopened);
      }
    }

    const connection = await this.connectionsRepository.create(
      requesterId,
      addresseeId,
    );
    await this.notificationsService.notifyConnectionRequest(
      requesterId,
      addresseeId,
    );
    return ConnectionsMapper.toConnectionResponseDto(connection);
  }

  public countAcceptedByUserId(userId: string): Promise<number> {
    return this.connectionsRepository.countAcceptedByUserId(userId);
  }

  public async areAcceptedConnected(
    userAId: string,
    userBId: string,
  ): Promise<boolean> {
    const connection = await this.connectionsRepository.findBetweenUsers(
      userAId,
      userBId,
    );
    return connection?.status === ConnectionStatus.ACCEPTED;
  }

  public findAcceptedPeerUserIds(userId: string): Promise<string[]> {
    return this.connectionsRepository.findAcceptedPeerUserIds(userId);
  }

  public async getAcceptedByUserId(
    userId: string,
    query: PaginatedConnectionsQueryDto,
  ): Promise<PaginatedResponseDto<ConnectionResponseDto>> {
    const { page, limit, skip, take } = getPaginationParams(
      query.page,
      query.limit,
    );

    const [connections, total] = await Promise.all([
      this.connectionsRepository.findAcceptedByUserId(userId, skip, take),
      this.connectionsRepository.countAcceptedByUserId(userId),
    ]);

    return {
      data: connections.map((connection) =>
        ConnectionsMapper.toConnectionResponseDto(connection),
      ),
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  public async getPendingIncomingByUserId(
    userId: string,
    query: PaginatedConnectionsQueryDto,
  ): Promise<PaginatedResponseDto<ConnectionResponseDto>> {
    const { page, limit, skip, take } = getPaginationParams(
      query.page,
      query.limit,
    );

    const [connections, total] = await Promise.all([
      this.connectionsRepository.findPendingIncomingByUserId(
        userId,
        skip,
        take,
      ),
      this.connectionsRepository.countPendingIncomingByUserId(userId),
    ]);

    return {
      data: connections.map((connection) =>
        ConnectionsMapper.toConnectionResponseDto(connection),
      ),
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  public async getPendingOutgoingByUserId(
    userId: string,
    query: PaginatedConnectionsQueryDto,
  ): Promise<PaginatedResponseDto<ConnectionResponseDto>> {
    const { page, limit, skip, take } = getPaginationParams(
      query.page,
      query.limit,
    );

    const [connections, total] = await Promise.all([
      this.connectionsRepository.findPendingOutgoingByUserId(
        userId,
        skip,
        take,
      ),
      this.connectionsRepository.countPendingOutgoingByUserId(userId),
    ]);

    return {
      data: connections.map((connection) =>
        ConnectionsMapper.toConnectionResponseDto(connection),
      ),
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  public async acceptConnection(
    userId: string,
    connectionId: string,
  ): Promise<ConnectionResponseDto> {
    const connection = await this.getPendingForAddresseeOrThrow(
      userId,
      connectionId,
    );
    const updated = await this.connectionsRepository.updateStatus(
      connection.id,
      ConnectionStatus.ACCEPTED,
    );
    await this.notificationsService.notifyConnectionAccepted(
      userId,
      connection.requester.id,
    );
    return ConnectionsMapper.toConnectionResponseDto(updated);
  }

  public async rejectConnection(
    userId: string,
    connectionId: string,
  ): Promise<ConnectionResponseDto> {
    const connection = await this.getPendingForAddresseeOrThrow(
      userId,
      connectionId,
    );
    const updated = await this.connectionsRepository.updateStatus(
      connection.id,
      ConnectionStatus.REJECTED,
    );
    return ConnectionsMapper.toConnectionResponseDto(updated);
  }

  public async deleteConnection(
    userId: string,
    connectionId: string,
  ): Promise<void> {
    const connection = await this.connectionsRepository.findById(connectionId);
    if (!connection) {
      throw new NotFoundException('Connection not found');
    }

    const isParticipant =
      connection.requester.id === userId || connection.addressee.id === userId;
    if (!isParticipant) {
      throw new ForbiddenException('Not a participant of this connection');
    }

    if (
      connection.status === ConnectionStatus.PENDING &&
      connection.requester.id !== userId
    ) {
      throw new ForbiddenException(
        'Only the requester can withdraw a pending request',
      );
    }

    await this.connectionsRepository.deleteById(connectionId);
  }

  private async getPendingForAddresseeOrThrow(
    userId: string,
    connectionId: string,
  ): Promise<ConnectionSelected> {
    const connection = await this.connectionsRepository.findById(connectionId);
    if (!connection) {
      throw new NotFoundException('Connection not found');
    }
    if (connection.addressee.id !== userId) {
      throw new ForbiddenException('Not the connection addressee');
    }
    if (connection.status !== ConnectionStatus.PENDING) {
      throw new BadRequestException('Connection is not pending');
    }
    return connection;
  }
}
