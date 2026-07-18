import { Injectable, NotFoundException } from '@nestjs/common';
import { SavedPostsRepository } from '../repositories/saved-posts.repository';
import { PostResponseDto } from '../../posts/dto/post.dto';
import { PostsMapper } from '../../posts/mappers/posts.mapper';
import { PaginatedResponseDto } from '../../shared/dto/paginated-response.dto';
import { PaginationQueryDto } from '../../shared/dto/pagination-query.dto';
import {
  buildPaginationMeta,
  getPaginationParams,
} from '../../shared/utils/pagination';

@Injectable()
export class SavedPostsService {
  constructor(private readonly savedPostsRepository: SavedPostsRepository) {}

  public async save(userId: string, postId: string): Promise<void> {
    await this.assertPostExists(postId);
    await this.savedPostsRepository.save(userId, postId);
  }

  public async unsave(userId: string, postId: string): Promise<void> {
    await this.savedPostsRepository.unsave(userId, postId);
  }

  public async list(
    userId: string,
    query: PaginationQueryDto,
  ): Promise<PaginatedResponseDto<PostResponseDto>> {
    const { page, limit, skip, take } = getPaginationParams(
      query.page,
      query.limit,
    );

    const [posts, total] = await Promise.all([
      this.savedPostsRepository.findSavedPosts(userId, skip, take),
      this.savedPostsRepository.countSaved(userId),
    ]);

    return {
      data: posts.map((post) => PostsMapper.toPostResponseDto(post)),
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  private async assertPostExists(postId: string): Promise<void> {
    const exists = await this.savedPostsRepository.postExists(postId);
    if (!exists) {
      throw new NotFoundException('Post not found');
    }
  }
}
