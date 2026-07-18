import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { HashtagsRepository } from '../repositories/hashtags.repository';
import { HashtagResponseDto } from '../dto/hashtag.dto';
import { HashtagSearchQueryDto } from '../dto/hashtag-search-query.dto';
import { PostResponseDto } from '../../posts/dto/post.dto';
import { PostsMapper } from '../../posts/mappers/posts.mapper';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';
import {
  buildPaginationMeta,
  getPaginationParams,
} from '../../shared/utils/pagination';
import { extractHashtags, normalizeHashtag } from '../utils/hashtags.util';

@Injectable()
export class HashtagsService {
  constructor(private readonly hashtagsRepository: HashtagsRepository) {}

  /**
   * Reconcile the hashtags attached to a post with the tags found in its text.
   * Connects newly added tags (creating catalog rows on demand), disconnects
   * removed ones, and keeps the denormalized `postsCount` in sync.
   */
  public async syncPostHashtags(
    postId: string,
    text: string | null | undefined,
  ): Promise<void> {
    const desired = extractHashtags(text);
    const current = await this.hashtagsRepository.findTagsForPost(postId);
    const currentTags = new Set(current.map((item) => item.tag));
    const desiredTags = new Set(desired);

    const toAdd = desired.filter((tag) => !currentTags.has(tag));
    const toRemove = current.filter((item) => !desiredTags.has(item.tag));

    for (const tag of toAdd) {
      await this.hashtagsRepository.connectTagToPost(postId, tag);
    }
    for (const item of toRemove) {
      await this.hashtagsRepository.disconnectTagFromPost(item.id, postId);
    }
  }

  /** Release all hashtags of a post (used before/at deletion). */
  public async releasePostHashtags(postId: string): Promise<void> {
    const current = await this.hashtagsRepository.findTagsForPost(postId);
    for (const item of current) {
      await this.hashtagsRepository.disconnectTagFromPost(item.id, postId);
    }
  }

  public async getTrending(limit: number): Promise<HashtagResponseDto[]> {
    const items = await this.hashtagsRepository.findTrending(limit);
    return items.map((item) => this.toResponseDto(item));
  }

  public async search(
    query: HashtagSearchQueryDto,
  ): Promise<PaginatedResponseDto<HashtagResponseDto>> {
    const { page, limit, skip, take } = getPaginationParams(
      query.page,
      query.limit,
    );
    const q = normalizeHashtag(query.q ?? '');
    const where: Prisma.HashtagWhereInput = q
      ? { tag: { contains: q, mode: 'insensitive' }, postsCount: { gt: 0 } }
      : { postsCount: { gt: 0 } };

    const [items, total] = await Promise.all([
      this.hashtagsRepository.search(where, skip, take),
      this.hashtagsRepository.count(where),
    ]);

    return {
      data: items.map((item) => this.toResponseDto(item)),
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  public async getPostsByTag(
    rawTag: string,
    query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<PostResponseDto>> {
    const tag = normalizeHashtag(rawTag);
    const { page, limit, skip, take } = getPaginationParams(
      query.page,
      query.limit,
    );

    const [posts, total] = await Promise.all([
      this.hashtagsRepository.findPostsByTag(tag, skip, take),
      this.hashtagsRepository.countPostsByTag(tag),
    ]);

    return {
      data: posts.map((post) => PostsMapper.toPostResponseDto(post)),
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  private toResponseDto(item: {
    id: string;
    tag: string;
    postsCount: number;
  }): HashtagResponseDto {
    return { id: item.id, tag: item.tag, postsCount: item.postsCount };
  }
}
