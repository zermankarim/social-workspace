import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { commentSelect, CommentSelected } from '../comment.select';

@Injectable()
export class CommentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  postExists(postId: string): Promise<boolean> {
    return this.prisma.post
      .findUnique({ where: { id: postId }, select: { id: true } })
      .then((post) => post !== null);
  }

  findById(id: string): Promise<CommentSelected | null> {
    return this.prisma.postComment.findUnique({
      where: { id },
      select: commentSelect,
    });
  }

  findManyByPostId(
    postId: string,
    skip: number,
    take: number,
  ): Promise<CommentSelected[]> {
    return this.prisma.postComment.findMany({
      where: { postId, parentId: null },
      select: commentSelect,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
  }

  countByPostId(postId: string): Promise<number> {
    return this.prisma.postComment.count({ where: { postId, parentId: null } });
  }

  findParentForReply(parentId: string): Promise<{
    id: string;
    postId: string;
    parentId: string | null;
    authorId: string;
  } | null> {
    return this.prisma.postComment.findUnique({
      where: { id: parentId },
      select: { id: true, postId: true, parentId: true, authorId: true },
    });
  }

  async createComment(
    postId: string,
    authorId: string,
    data: {
      textContent?: string | null;
      attachments?: Prisma.PostCommentAttachmentCreateWithoutCommentInput[];
      parentId?: string | null;
    },
  ): Promise<CommentSelected> {
    const [comment] = await this.prisma.$transaction([
      this.prisma.postComment.create({
        data: {
          post: { connect: { id: postId } },
          author: { connect: { id: authorId } },
          textContent: data.textContent,
          attachments: data.attachments?.length
            ? { create: data.attachments }
            : undefined,
          parent: data.parentId
            ? { connect: { id: data.parentId } }
            : undefined,
        },
        select: commentSelect,
      }),
      this.prisma.post.update({
        where: { id: postId },
        data: { commentsCount: { increment: 1 } },
      }),
    ]);

    return comment;
  }

  updateCommentById(
    commentId: string,
    data: Prisma.PostCommentUpdateInput,
  ): Promise<CommentSelected> {
    return this.prisma.postComment.update({
      where: { id: commentId },
      data,
      select: commentSelect,
    });
  }

  async deleteCommentById(commentId: string, postId: string): Promise<void> {
    // Replies cascade-delete in the DB; count them first so commentsCount stays accurate.
    const repliesCount = await this.prisma.postComment.count({
      where: { parentId: commentId },
    });
    await this.prisma.$transaction([
      this.prisma.postComment.delete({ where: { id: commentId } }),
      this.prisma.post.update({
        where: { id: postId },
        data: { commentsCount: { decrement: 1 + repliesCount } },
      }),
    ]);
  }
}
