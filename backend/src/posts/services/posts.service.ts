import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostsRepository } from '../repositories/posts.repository';
import { PostResponseDto } from '../dto/post.dto';
import { PaginatedPostsByAuthorQueryDto } from '../dto/paginated-posts-by-author-query.dto';
import { PaginatedPostsFeedQueryDto } from '../dto/paginated-posts-feed-query.dto';
import { PostsMapper } from '../mappers/posts.mapper';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import {
  buildPaginationMeta,
  getPaginationParams,
} from '../../shared/utils/pagination';
import { CreatePostDto } from '../dto/create-post.dto';
import { Prisma } from '@prisma/client';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostSelected } from '../post.select';

@Injectable()
export class PostsService {
  constructor(private readonly postsRepository: PostsRepository) {}

  public async getPostById(id: string): Promise<PostResponseDto> {
    const post = await this.postsRepository.findById(id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return PostsMapper.toPostResponseDto(post);
  }

  public async getFeedPaginated(
    query: PaginatedPostsFeedQueryDto,
  ): Promise<PaginatedResponseDto<PostResponseDto>> {
    const { page, limit, skip, take } = getPaginationParams(
      query.page,
      query.limit,
    );

    const [posts, total] = await Promise.all([
      this.postsRepository.findMany({}, skip, take),
      this.postsRepository.count({}),
    ]);

    return {
      data: posts.map((post) => PostsMapper.toPostResponseDto(post)),
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  public async getPostsByAuthorIdPaginated(
    query: PaginatedPostsByAuthorQueryDto,
  ): Promise<PaginatedResponseDto<PostResponseDto>> {
    const { page, limit, skip, take } = getPaginationParams(
      query.page,
      query.limit,
    );

    const [posts, total] = await Promise.all([
      this.postsRepository.findManyByAuthorId(query.authorId, skip, take),
      this.postsRepository.countByAuthorId(query.authorId),
    ]);

    return {
      data: posts.map((post) => PostsMapper.toPostResponseDto(post)),
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  public async createPost(
    authorId: string,
    dto: CreatePostDto,
  ): Promise<PostResponseDto> {
    const data: Prisma.PostCreateInput = {
      author: {
        connect: {
          id: authorId,
        },
      },
      textContent: dto.textContent,
      attachments: dto.attachments?.length
        ? { create: dto.attachments }
        : undefined,
    };
    const post = await this.postsRepository.createPost(data);
    return PostsMapper.toPostResponseDto(post);
  }

  async deletePost(userId: string, postId: string): Promise<void> {
    await this.getOwnedPostOrThrow(userId, postId);
    await this.postsRepository.deletePostById(postId, userId);
  }

  async updatePost(
    userId: string,
    postId: string,
    dto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    const post = await this.getOwnedPostOrThrow(userId, postId);

    const nextTextContent =
      dto.textContent !== undefined ? dto.textContent : post.textContent;
    const nextAttachments =
      dto.attachments !== undefined ? dto.attachments : post.attachments;

    this.assertPostHasContent(nextTextContent, nextAttachments.length);

    const data: Prisma.PostUpdateInput = {
      ...(dto.textContent !== undefined && { textContent: dto.textContent }),
      ...(dto.attachments !== undefined && {
        attachments: {
          deleteMany: {},
          create: dto.attachments,
        },
      }),
    };

    const updatedPost = await this.postsRepository.updatePostById(postId, data);
    return PostsMapper.toPostResponseDto(updatedPost);
  }

  private async getOwnedPostOrThrow(
    userId: string,
    postId: string,
  ): Promise<PostSelected> {
    const post = await this.postsRepository.findById(postId);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    if (post.author.id !== userId) {
      throw new ForbiddenException('You are not the author of this post');
    }
    return post;
  }

  private assertPostHasContent(
    textContent: string | null | undefined,
    attachmentsCount: number,
  ): void {
    const hasText =
      typeof textContent === 'string' && textContent.trim().length > 0;
    if (!hasText && attachmentsCount === 0) {
      throw new BadRequestException(
        'Post must include non-empty textContent or at least one attachment',
      );
    }
  }
}
