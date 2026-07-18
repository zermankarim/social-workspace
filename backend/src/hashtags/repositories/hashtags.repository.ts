import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { postSelect, PostSelected } from '../../posts/post.select';

export type HashtagRow = {
  id: string;
  tag: string;
  postsCount: number;
};

@Injectable()
export class HashtagsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findTagsForPost(postId: string): Promise<Array<{ id: string; tag: string }>> {
    return this.prisma.hashtag.findMany({
      where: { posts: { some: { id: postId } } },
      select: { id: true, tag: true },
    });
  }

  async connectTagToPost(postId: string, tag: string): Promise<void> {
    await this.prisma.hashtag.upsert({
      where: { tag },
      create: { tag, postsCount: 1, posts: { connect: { id: postId } } },
      update: {
        postsCount: { increment: 1 },
        posts: { connect: { id: postId } },
      },
    });
  }

  async disconnectTagFromPost(
    hashtagId: string,
    postId: string,
  ): Promise<void> {
    await this.prisma.hashtag.update({
      where: { id: hashtagId },
      data: {
        postsCount: { decrement: 1 },
        posts: { disconnect: { id: postId } },
      },
    });
  }

  findTrending(limit: number): Promise<HashtagRow[]> {
    return this.prisma.hashtag.findMany({
      where: { postsCount: { gt: 0 } },
      select: { id: true, tag: true, postsCount: true },
      orderBy: [{ postsCount: 'desc' }, { updatedAt: 'desc' }],
      take: limit,
    });
  }

  search(
    where: Prisma.HashtagWhereInput,
    skip: number,
    take: number,
  ): Promise<HashtagRow[]> {
    return this.prisma.hashtag.findMany({
      where,
      select: { id: true, tag: true, postsCount: true },
      orderBy: [{ postsCount: 'desc' }, { tag: 'asc' }],
      skip,
      take,
    });
  }

  count(where: Prisma.HashtagWhereInput): Promise<number> {
    return this.prisma.hashtag.count({ where });
  }

  findPostsByTag(
    tag: string,
    skip: number,
    take: number,
  ): Promise<PostSelected[]> {
    return this.prisma.post.findMany({
      where: { hashtags: { some: { tag } } },
      select: postSelect,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  countPostsByTag(tag: string): Promise<number> {
    return this.prisma.post.count({
      where: { hashtags: { some: { tag } } },
    });
  }
}
