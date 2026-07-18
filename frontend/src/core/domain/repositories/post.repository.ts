import type { CreatePostDto } from "@/core/application/dtos/create-post.dto";
import type { PostFeedQueryDto } from "@/core/application/dtos/post-feed-query.dto";
import type { PostsByAuthorQueryDto } from "@/core/application/dtos/posts-by-author-query.dto";
import type { UpdatePostDto } from "@/core/application/dtos/update-post.dto";
import type { PaginatedPosts } from "@/core/domain/entities/paginated-posts.entity";
import type { Post } from "@/core/domain/entities/post.entity";

export abstract class PostRepository {
  abstract findFeed(query: PostFeedQueryDto): Promise<PaginatedPosts>;
  abstract findByAuthor(query: PostsByAuthorQueryDto): Promise<PaginatedPosts>;
  abstract findById(id: string): Promise<Post>;
  abstract create(dto: CreatePostDto): Promise<Post>;
  abstract update(id: string, dto: UpdatePostDto): Promise<Post>;
  abstract delete(id: string): Promise<void>;
  abstract repost(id: string, textContent?: string): Promise<Post>;
  abstract save(id: string): Promise<void>;
  abstract unsave(id: string): Promise<void>;
  abstract findSaved(query: PostFeedQueryDto): Promise<PaginatedPosts>;
  abstract search(
    q: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedPosts>;
  abstract registerImpressions(postIds: string[]): Promise<void>;
  abstract getImpressionsSummary(): Promise<number>;
}
