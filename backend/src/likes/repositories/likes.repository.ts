import { Injectable } from '@nestjs/common';
import { PostLikeType } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { likeSelect, LikeSelected } from '../like.select';

@Injectable()
export class LikesRepository {
  constructor(private readonly prisma: PrismaService) {}

  postExists(postId: string): Promise<boolean> {
    return this.prisma.post
      .findUnique({ where: { id: postId }, select: { id: true } })
      .then((post) => post !== null);
  }

  findManyByPostId(
    postId: string,
    skip: number,
    take: number,
  ): Promise<LikeSelected[]> {
    return this.prisma.postLike.findMany({
      where: { postId },
      select: likeSelect,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  countByPostId(postId: string): Promise<number> {
    return this.prisma.postLike.count({ where: { postId } });
  }

  async upsertLike(
    postId: string,
    authorId: string,
    likeType: PostLikeType,
  ): Promise<{ like: LikeSelected; created: boolean }> {
    const existing = await this.prisma.postLike.findUnique({
      where: { postId_authorId: { postId, authorId } },
      select: { id: true },
    });

    if (existing) {
      const like = await this.prisma.postLike.update({
        where: { postId_authorId: { postId, authorId } },
        data: { likeType },
        select: likeSelect,
      });
      return { like, created: false };
    }

    const [like] = await this.prisma.$transaction([
      this.prisma.postLike.create({
        data: {
          post: { connect: { id: postId } },
          author: { connect: { id: authorId } },
          likeType,
        },
        select: likeSelect,
      }),
      this.prisma.post.update({
        where: { id: postId },
        data: { likesCount: { increment: 1 } },
      }),
    ]);

    return { like, created: true };
  }

  async deleteLikeByPostAndAuthor(
    postId: string,
    authorId: string,
  ): Promise<boolean> {
    const existing = await this.prisma.postLike.findUnique({
      where: { postId_authorId: { postId, authorId } },
      select: { id: true },
    });

    if (!existing) {
      return false;
    }

    await this.prisma.$transaction([
      this.prisma.postLike.delete({
        where: { postId_authorId: { postId, authorId } },
      }),
      this.prisma.post.update({
        where: { id: postId },
        data: { likesCount: { decrement: 1 } },
      }),
    ]);

    return true;
  }
}
