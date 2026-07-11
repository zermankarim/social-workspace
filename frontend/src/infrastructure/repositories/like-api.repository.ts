import type { PaginatedLikes } from "@/core/domain/entities/paginated-likes.entity";
import type { PostLike } from "@/core/domain/entities/post-like.entity";
import type { PostLikeType } from "@/core/domain/enums/post-like-type.enum";
import { LikeRepository } from "@/core/domain/repositories/like.repository";
import type {
  LikeResponseDto,
  PaginatedLikesResponseDto,
  UpsertLikeRequestDto,
} from "@/infrastructure/api/dto/engagement-response.dto";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { PaginatedLikesMapper } from "@/infrastructure/mappers/paginated-likes.mapper";
import { PostMapper } from "@/infrastructure/mappers/post.mapper";

export class LikeApiRepository extends LikeRepository {
  constructor(private readonly httpClient: HttpClient) {
    super();
  }

  async findByPost(
    postId: string,
    page = 1,
    limit = 20,
  ): Promise<PaginatedLikes> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    const response = await this.httpClient.request<PaginatedLikesResponseDto>(
      `/posts/${postId}/likes?${params.toString()}`,
    );
    return PaginatedLikesMapper.fromApi(response);
  }

  async upsert(postId: string, likeType: PostLikeType): Promise<PostLike> {
    const body: UpsertLikeRequestDto = { likeType };
    const response = await this.httpClient.request<LikeResponseDto>(
      `/posts/${postId}/likes`,
      { method: "PUT", body },
    );
    return PostMapper.likeFromApi(response);
  }

  async remove(postId: string): Promise<void> {
    await this.httpClient.request<void>(`/posts/${postId}/likes`, {
      method: "DELETE",
    });
  }
}
