import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ProfileViewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Ensures a (viewer, profile) row exists. Returns whether it was the first
   * time this viewer opened the profile, so the caller can notify only once.
   */
  async recordView(
    viewerId: string,
    profileId: string,
  ): Promise<{ created: boolean }> {
    const existing = await this.prisma.profileView.findUnique({
      where: { viewerId_profileId: { viewerId, profileId } },
      select: { id: true },
    });

    if (existing) {
      await this.prisma.profileView.update({
        where: { viewerId_profileId: { viewerId, profileId } },
        data: { updatedAt: new Date() },
      });
      return { created: false };
    }

    try {
      await this.prisma.profileView.create({ data: { viewerId, profileId } });
      return { created: true };
    } catch (error) {
      // Concurrent first-view race: unique constraint — treat as already viewed.
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return { created: false };
      }
      throw error;
    }
  }

  countViewers(profileId: string): Promise<number> {
    return this.prisma.profileView.count({ where: { profileId } });
  }
}
