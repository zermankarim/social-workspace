import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { postSelect, PostSelected } from '../../posts/post.select';

@Injectable()
export class SavedPostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  postExists(postId: string): Promise<boolean> {
    return this.prisma.post
      .findUnique({ where: { id: postId }, select: { id: true } })
      .then((post) => post !== null);
  }

  async save(userId: string, postId: string): Promise<void> {
    await this.prisma.savedPost.upsert({
      where: { userId_postId: { userId, postId } },
      create: { userId, postId },
      update: {},
    });
  }

  async unsave(userId: string, postId: string): Promise<void> {
    await this.prisma.savedPost.deleteMany({ where: { userId, postId } });
  }

  async findSavedPosts(
    userId: string,
    skip: number,
    take: number,
  ): Promise<PostSelected[]> {
    const rows = await this.prisma.savedPost.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      select: { post: { select: postSelect } },
    });
    return rows.map((row) => row.post);
  }

  countSaved(userId: string): Promise<number> {
    return this.prisma.savedPost.count({ where: { userId } });
  }
}
