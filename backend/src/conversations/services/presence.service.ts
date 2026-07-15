import { Injectable } from '@nestjs/common';
import { UserPresenceDto } from '../dto/user-presence.dto';

type PresenceEntry = {
  socketCount: number;
  lastSeenAt: Date | null;
};

/**
 * In-memory socket presence for messaging. Resets on process restart —
 * fine for single-instance MVP; replace with Redis for multi-instance.
 */
@Injectable()
export class PresenceService {
  private readonly byUserId = new Map<string, PresenceEntry>();

  /**
   * @returns true if this was the first socket (user just came online)
   */
  trackConnect(userId: string): boolean {
    const existing = this.byUserId.get(userId);
    if (!existing) {
      this.byUserId.set(userId, { socketCount: 1, lastSeenAt: null });
      return true;
    }
    existing.socketCount += 1;
    existing.lastSeenAt = null;
    return existing.socketCount === 1;
  }

  /**
   * @returns true if this was the last socket (user just went offline)
   */
  trackDisconnect(userId: string): boolean {
    const existing = this.byUserId.get(userId);
    if (!existing) {
      return false;
    }
    existing.socketCount = Math.max(0, existing.socketCount - 1);
    if (existing.socketCount === 0) {
      existing.lastSeenAt = new Date();
      return true;
    }
    return false;
  }

  isOnline(userId: string): boolean {
    const entry = this.byUserId.get(userId);
    return Boolean(entry && entry.socketCount > 0);
  }

  getPresence(userId: string): UserPresenceDto {
    const entry = this.byUserId.get(userId);
    const online = Boolean(entry && entry.socketCount > 0);
    return {
      userId,
      online,
      lastSeenAt:
        !online && entry?.lastSeenAt ? entry.lastSeenAt.toISOString() : null,
    };
  }

  getPresenceMany(userIds: string[]): UserPresenceDto[] {
    const unique = [...new Set(userIds)];
    return unique.map((userId) => this.getPresence(userId));
  }
}
