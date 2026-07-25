import { Connection } from "@/core/domain/entities/connection.entity";
import { ConnectionUser } from "@/core/domain/entities/connection-user.entity";
import { ConnectionSuggestion } from "@/core/domain/entities/connection-suggestion.entity";
import { ConnectionStatus } from "@/core/domain/enums/connection-status.enum";
import type {
  ConnectionResponseDto,
  ConnectionSuggestionResponseDto,
  ConnectionUserResponseDto,
} from "@/infrastructure/api/dto/connection-response.dto";

function parseStatus(value: string): ConnectionStatus {
  if (
    value === ConnectionStatus.PENDING ||
    value === ConnectionStatus.ACCEPTED ||
    value === ConnectionStatus.REJECTED ||
    value === ConnectionStatus.BLOCKED
  ) {
    return value;
  }
  return ConnectionStatus.PENDING;
}

export class ConnectionMapper {
  static userFromApi(dto: ConnectionUserResponseDto): ConnectionUser {
    return new ConnectionUser(
      dto.id,
      dto.firstName,
      dto.lastName,
      dto.headline,
      dto.avatarUrl,
    );
  }

  static fromApi(dto: ConnectionResponseDto): Connection {
    return new Connection(
      dto.id,
      parseStatus(dto.status),
      this.userFromApi(dto.requester),
      this.userFromApi(dto.addressee),
      new Date(dto.createdAt),
      new Date(dto.updatedAt),
    );
  }

  static suggestionFromApi(
    dto: ConnectionSuggestionResponseDto,
  ): ConnectionSuggestion {
    return new ConnectionSuggestion(
      dto.userId,
      dto.firstName,
      dto.lastName,
      dto.avatarUrl,
      dto.headline,
      dto.mutualConnectionsCount,
    );
  }
}
