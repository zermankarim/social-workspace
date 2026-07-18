import type { Hashtag } from "@/core/domain/entities/hashtag.entity";
import type { PaginatedHashtags } from "@/core/domain/entities/paginated-hashtags.entity";
import type { PaginatedPosts } from "@/core/domain/entities/paginated-posts.entity";

export abstract class HashtagRepository {
  abstract getTrending(limit?: number): Promise<Hashtag[]>;
  abstract search(
    q: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedHashtags>;
  abstract getPostsByTag(
    tag: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedPosts>;
}
