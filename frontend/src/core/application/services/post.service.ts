import type { CreatePostDto } from "@/core/application/dtos/create-post.dto";
import type { PostFeedQueryDto } from "@/core/application/dtos/post-feed-query.dto";
import type { PostsByAuthorQueryDto } from "@/core/application/dtos/posts-by-author-query.dto";
import type { UpdatePostDto } from "@/core/application/dtos/update-post.dto";
import type { PaginatedPosts } from "@/core/domain/entities/paginated-posts.entity";
import type { Post } from "@/core/domain/entities/post.entity";
import type { PostRepository } from "@/core/domain/repositories/post.repository";

export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  getFeed(query: PostFeedQueryDto): Promise<PaginatedPosts> {
    return this.postRepository.findFeed(query);
  }

  getByAuthor(query: PostsByAuthorQueryDto): Promise<PaginatedPosts> {
    return this.postRepository.findByAuthor(query);
  }

  getById(id: string): Promise<Post> {
    return this.postRepository.findById(id);
  }

  create(dto: CreatePostDto): Promise<Post> {
    return this.postRepository.create(dto);
  }

  update(id: string, dto: UpdatePostDto): Promise<Post> {
    return this.postRepository.update(id, dto);
  }

  delete(id: string): Promise<void> {
    return this.postRepository.delete(id);
  }

  repost(id: string, textContent?: string): Promise<Post> {
    return this.postRepository.repost(id, textContent);
  }

  save(id: string): Promise<void> {
    return this.postRepository.save(id);
  }

  unsave(id: string): Promise<void> {
    return this.postRepository.unsave(id);
  }

  getSaved(query: PostFeedQueryDto): Promise<PaginatedPosts> {
    return this.postRepository.findSaved(query);
  }

  search(q: string, page = 1, limit = 20): Promise<PaginatedPosts> {
    return this.postRepository.search(q, page, limit);
  }

  registerImpressions(postIds: string[]): Promise<void> {
    if (postIds.length === 0) return Promise.resolve();
    return this.postRepository.registerImpressions(postIds);
  }

  getImpressionsSummary(): Promise<number> {
    return this.postRepository.getImpressionsSummary();
  }
}
