import { HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { postSelect, PostSelected } from '../post.select';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<PostSelected | null> {
    return this.prisma.post.findUnique({
      where: { id },
      select: postSelect,
    });
  }

  findMany(
    where: Prisma.PostWhereInput,
    skip: number,
    take: number,
  ): Promise<PostSelected[]> {
    return this.prisma.post.findMany({
      where,
      select: postSelect,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  count(where: Prisma.PostWhereInput): Promise<number> {
    return this.prisma.post.count({ where });
  }

  findManyByAuthorId(
    authorId: string,
    skip: number,
    take: number,
  ): Promise<PostSelected[]> {
    return this.findMany({ authorId }, skip, take);
  }

  countByAuthorId(authorId: string): Promise<number> {
    return this.count({ authorId });
  }

  createPost(data: Prisma.PostCreateInput): Promise<PostSelected> {
    return this.prisma.post.create({
      data,
      select: postSelect,
    });
  }

  createRepost(
    data: Prisma.PostCreateInput,
    originalId: string,
  ): Promise<PostSelected> {
    return this.prisma.$transaction(async (tx) => {
      const post = await tx.post.create({ data, select: postSelect });
      await tx.post.update({
        where: { id: originalId },
        data: { repostsCount: { increment: 1 } },
      });
      return post;
    });
  }

  async decrementRepostsCount(originalId: string): Promise<void> {
    await this.prisma.post.updateMany({
      where: { id: originalId },
      data: { repostsCount: { decrement: 1 } },
    });
  }

  findRepostTarget(
    postId: string,
  ): Promise<{ id: string; repostOfId: string | null } | null> {
    return this.prisma.post.findUnique({
      where: { id: postId },
      select: { id: true, repostOfId: true },
    });
  }

  async deletePostById(postId: string, authorId: string): Promise<HttpStatus> {
    await this.prisma.post.delete({
      where: {
        id: postId,
        authorId,
      },
    });
    return HttpStatus.NO_CONTENT;
  }

  updatePostById(
    postId: string,
    data: Prisma.PostUpdateInput,
  ): Promise<PostSelected> {
    return this.prisma.post.update({
      where: { id: postId },
      data,
      select: postSelect,
    });
  }

  /**
   * Counts each (viewer, post) pair at most once. Own posts are skipped.
   * Concurrent races are absorbed by the unique constraint.
   */
  async incrementImpressions(
    postIds: string[],
    viewerId: string,
  ): Promise<void> {
    if (postIds.length === 0) return;

    const eligible = await this.prisma.post.findMany({
      where: { id: { in: postIds }, authorId: { not: viewerId } },
      select: { id: true },
    });
    if (eligible.length === 0) return;

    const eligibleIds = eligible.map((post) => post.id);
    const alreadyCounted = await this.prisma.postImpression.findMany({
      where: { viewerId, postId: { in: eligibleIds } },
      select: { postId: true },
    });
    const counted = new Set(alreadyCounted.map((row) => row.postId));
    const freshIds = eligibleIds.filter((id) => !counted.has(id));
    if (freshIds.length === 0) return;

    for (const postId of freshIds) {
      try {
        await this.prisma.postImpression.create({
          data: { postId, viewerId },
        });
        await this.prisma.post.update({
          where: { id: postId },
          data: { impressionsCount: { increment: 1 } },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          continue;
        }
        throw error;
      }
    }
  }

  async sumImpressionsByAuthorId(authorId: string): Promise<number> {
    const result = await this.prisma.post.aggregate({
      where: { authorId },
      _sum: { impressionsCount: true },
    });
    return result._sum.impressionsCount ?? 0;
  }
}
