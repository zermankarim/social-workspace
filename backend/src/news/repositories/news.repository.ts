import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class NewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findLatest(take: number) {
    return this.prisma.newsStory.findMany({
      orderBy: { createdAt: 'desc' },
      take,
    });
  }

  findById(id: string) {
    return this.prisma.newsStory.findUnique({ where: { id } });
  }

  create(data: Prisma.NewsStoryCreateInput) {
    return this.prisma.newsStory.create({ data });
  }

  /**
   * Increments readersCount at most once per (user, story).
   * Returns the story after the attempt (whether newly counted or not).
   */
  async registerRead(storyId: string, userId: string) {
    try {
      return await this.prisma.$transaction(async (transaction) => {
        await transaction.newsStoryRead.create({
          data: { storyId, userId },
        });
        return transaction.newsStory.update({
          where: { id: storyId },
          data: { readersCount: { increment: 1 } },
        });
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        return this.findById(storyId);
      }
      throw error;
    }
  }
}
