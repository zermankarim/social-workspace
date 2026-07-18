import type { Hashtag } from "@/core/domain/entities/hashtag.entity";
import type { PaginatedHashtags } from "@/core/domain/entities/paginated-hashtags.entity";
import type { PaginatedPosts } from "@/core/domain/entities/paginated-posts.entity";
import { HashtagRepository } from "@/core/domain/repositories/hashtag.repository";
import type {
  HashtagResponseDto,
  PaginatedHashtagsResponseDto,
} from "@/infrastructure/api/dto/hashtag-response.dto";
import type { PaginatedPostsResponseDto } from "@/infrastructure/api/dto/post-response.dto";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { HashtagMapper } from "@/infrastructure/mappers/hashtag.mapper";
import { PaginatedPostsMapper } from "@/infrastructure/mappers/paginated-posts.mapper";

export class HashtagApiRepository extends HashtagRepository {
  constructor(private readonly httpClient: HttpClient) {
    super();
  }

  async getTrending(limit = 5): Promise<Hashtag[]> {
    const params = new URLSearchParams({ limit: String(limit) });
    const response = await this.httpClient.request<HashtagResponseDto[]>(
      `/hashtags/trending?${params.toString()}`,
    );
    return response.map((item) => HashtagMapper.fromApi(item));
  }

  async search(q: string, page = 1, limit = 20): Promise<PaginatedHashtags> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (q.trim()) params.set("q", q.trim());

    const response =
      await this.httpClient.request<PaginatedHashtagsResponseDto>(
        `/hashtags?${params.toString()}`,
      );
    return HashtagMapper.paginatedFromApi(response);
  }

  async getPostsByTag(
    tag: string,
    page = 1,
    limit = 20,
  ): Promise<PaginatedPosts> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    const response = await this.httpClient.request<PaginatedPostsResponseDto>(
      `/hashtags/${encodeURIComponent(tag)}/posts?${params.toString()}`,
    );
    return PaginatedPostsMapper.fromApi(response);
  }
}
