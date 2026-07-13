import { ConnectionResponseDto } from '../dto/connection.dto';
import { ConnectionSelected } from '../connections.select';

export class ConnectionsMapper {
  public static toConnectionResponseDto(
    connection: ConnectionSelected,
  ): ConnectionResponseDto {
    return {
      id: connection.id,
      requester: connection.requester,
      addressee: connection.addressee,
      status: connection.status,
      createdAt: connection.createdAt,
      updatedAt: connection.updatedAt,
    };
  }
}
