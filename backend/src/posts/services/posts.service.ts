import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotificationType, PostStatus, Prisma } from '@prisma/client';
import { PostsRepository } from '../repositories/posts.repository';
import { PostResponseDto } from '../dto/post.dto';
import { PaginatedPostsByAuthorQueryDto } from '../dto/paginated-posts-by-author-query.dto';
import { PaginatedPostsDraftsQueryDto } from '../dto/paginated-posts-drafts-query.dto';
import { PaginatedPostsFeedQueryDto } from '../dto/paginated-posts-feed-query.dto';
import { PostSearchQueryDto } from '../dto/post-search-query.dto';
import { CreateRepostDto } from '../dto/create-repost.dto';
import { PostsMapper } from '../mappers/posts.mapper';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import {
  buildPaginationMeta,
  getPaginationParams,
} from '../../shared/utils/pagination';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostSelected } from '../post.select';
import { HashtagsService } from '../../hashtags/services/hashtags.service';
import { NotificationsService } from '../../notifications/services/notifications.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly hashtagsService: HashtagsService,
    private readonly notificationsService: NotificationsService,
  ) {}

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

    const where: Prisma.PostWhereInput = { status: PostStatus.PUBLISHED };
    const [posts, total] = await Promise.all([
      this.postsRepository.findMany(where, skip, take),
      this.postsRepository.count(where),
    ]);

    return {
      data: posts.map((post) => PostsMapper.toPostResponseDto(post)),
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  public async getMyDraftsPaginated(
    authorId: string,
    query: PaginatedPostsDraftsQueryDto,
  ): Promise<PaginatedResponseDto<PostResponseDto>> {
    const { page, limit, skip, take } = getPaginationParams(
      query.page,
      query.limit,
    );

    const [posts, total] = await Promise.all([
      this.postsRepository.findManyUnpublishedByAuthorId(authorId, skip, take),
      this.postsRepository.countUnpublishedByAuthorId(authorId),
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

  public async searchPosts(
    query: PostSearchQueryDto,
  ): Promise<PaginatedResponseDto<PostResponseDto>> {
    const { page, limit, skip, take } = getPaginationParams(
      query.page,
      query.limit,
    );
    const q = query.q?.trim();
    if (!q) {
      return { data: [], meta: buildPaginationMeta(page, limit, 0) };
    }

    const where: Prisma.PostWhereInput = {
      textContent: { contains: q, mode: 'insensitive' },
      status: PostStatus.PUBLISHED,
    };

    const [posts, total] = await Promise.all([
      this.postsRepository.findMany(where, skip, take),
      this.postsRepository.count(where),
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
    const status = dto.status ?? PostStatus.PUBLISHED;
    const scheduledFor = this.assertValidSchedule(status, dto.scheduledFor);

    const data: Prisma.PostCreateInput = {
      author: { connect: { id: authorId } },
      textContent: dto.textContent,
      status,
      scheduledFor,
      attachments: dto.attachments?.length
        ? { create: dto.attachments }
        : undefined,
    };
    const post = await this.postsRepository.createPost(data);
    // Drafts/scheduled posts don't count toward trending hashtags until published.
    if (status === PostStatus.PUBLISHED) {
      await this.hashtagsService.syncPostHashtags(post.id, post.textContent);
    }
    return PostsMapper.toPostResponseDto(post);
  }

  public async createRepost(
    authorId: string,
    postId: string,
    dto: CreateRepostDto,
  ): Promise<PostResponseDto> {
    const target = await this.postsRepository.findRepostTarget(postId);
    if (!target) {
      throw new NotFoundException('Post not found');
    }

    // Always repost the underlying original, never a repost of a repost.
    const originalId = target.repostOfId ?? target.id;

    const data: Prisma.PostCreateInput = {
      author: { connect: { id: authorId } },
      textContent: dto.textContent?.trim() || null,
      repostOf: { connect: { id: originalId } },
    };

    const post = await this.postsRepository.createRepost(data, originalId);
    await this.hashtagsService.syncPostHashtags(post.id, post.textContent);
    await this.notificationsService.notifyPostInteraction(
      authorId,
      originalId,
      NotificationType.POST_REPOST,
    );
    return PostsMapper.toPostResponseDto(post);
  }

  async deletePost(userId: string, postId: string): Promise<void> {
    const post = await this.getOwnedPostOrThrow(userId, postId);
    await this.hashtagsService.releasePostHashtags(postId);
    await this.postsRepository.deletePostById(postId, userId);

    const originalId = post.repostOf?.id;
    if (originalId) {
      await this.postsRepository.decrementRepostsCount(originalId);
    }
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

    // A repost with an original still counts as having content.
    const hasRepost = post.repostOf !== null;
    if (!hasRepost) {
      this.assertPostHasContent(nextTextContent, nextAttachments.length);
    }

    const wasUnpublished = post.status !== PostStatus.PUBLISHED;
    const nextStatus = dto.status ?? post.status;
    const scheduledFor =
      dto.status !== undefined || dto.scheduledFor !== undefined
        ? this.assertValidSchedule(nextStatus, dto.scheduledFor)
        : undefined;

    const data: Prisma.PostUpdateInput = {
      ...(dto.textContent !== undefined && { textContent: dto.textContent }),
      ...(dto.attachments !== undefined && {
        attachments: {
          deleteMany: {},
          create: dto.attachments,
        },
      }),
      ...(dto.status !== undefined && { status: dto.status }),
      ...(scheduledFor !== undefined && { scheduledFor }),
    };

    const updatedPost = await this.postsRepository.updatePostById(postId, data);
    const justPublished =
      wasUnpublished && updatedPost.status === PostStatus.PUBLISHED;
    if (dto.textContent !== undefined || justPublished) {
      await this.hashtagsService.syncPostHashtags(
        updatedPost.id,
        updatedPost.textContent,
      );
    }
    return PostsMapper.toPostResponseDto(updatedPost);
  }

  /** Runs on a schedule (see PostSchedulerService) — publishes any due SCHEDULED posts. */
  public async publishDuePosts(): Promise<number> {
    const due = await this.postsRepository.findDueScheduledPosts(new Date());
    for (const post of due) {
      const published = await this.postsRepository.publishPost(post.id);
      await this.hashtagsService.syncPostHashtags(
        published.id,
        published.textContent,
      );
    }
    return due.length;
  }

  private assertValidSchedule(
    status: PostStatus,
    scheduledFor: string | undefined,
  ): Date | null {
    if (status !== PostStatus.SCHEDULED) {
      return null;
    }
    if (!scheduledFor) {
      throw new BadRequestException(
        'scheduledFor is required when status is SCHEDULED',
      );
    }
    const when = new Date(scheduledFor);
    if (Number.isNaN(when.getTime()) || when.getTime() <= Date.now()) {
      throw new BadRequestException('scheduledFor must be a future date');
    }
    return when;
  }

  async registerImpressions(
    viewerId: string,
    postIds: string[],
  ): Promise<void> {
    const uniqueIds = Array.from(new Set(postIds)).slice(0, 100);
    await this.postsRepository.incrementImpressions(uniqueIds, viewerId);
  }

  async getImpressionsSummary(userId: string): Promise<number> {
    return this.postsRepository.sumImpressionsByAuthorId(userId);
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
