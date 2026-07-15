import { UserPresence } from "@/core/domain/entities/user-presence.entity";
import type { UserPresenceResponseDto } from "@/infrastructure/api/dto/conversation-response.dto";

export class PresenceMapper {
  static fromApi(dto: UserPresenceResponseDto): UserPresence {
    return new UserPresence(
      dto.userId,
      dto.online,
      dto.lastSeenAt ? new Date(dto.lastSeenAt) : null,
    );
  }
}
