import type { Hashtag } from "@/core/domain/entities/hashtag.entity";
import type { PaginatedHashtags } from "@/core/domain/entities/paginated-hashtags.entity";
import type { PaginatedPosts } from "@/core/domain/entities/paginated-posts.entity";
import type { HashtagRepository } from "@/core/domain/repositories/hashtag.repository";

export class HashtagService {
  constructor(private readonly hashtagRepository: HashtagRepository) {}

  getTrending(limit = 5): Promise<Hashtag[]> {
    return this.hashtagRepository.getTrending(limit);
  }

  search(q: string, page = 1, limit = 20): Promise<PaginatedHashtags> {
    return this.hashtagRepository.search(q, page, limit);
  }

  getPostsByTag(tag: string, page = 1, limit = 20): Promise<PaginatedPosts> {
    return this.hashtagRepository.getPostsByTag(tag, page, limit);
  }
}
