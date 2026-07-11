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
}
