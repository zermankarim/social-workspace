import { PaginatedPosts } from "@/core/domain/entities/paginated-posts.entity";
import { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";
import type { PaginatedPostsResponseDto } from "@/infrastructure/api/dto/post-response.dto";
import { PostMapper } from "@/infrastructure/mappers/post.mapper";

export class PaginatedPostsMapper {
  static fromApi(dto: PaginatedPostsResponseDto): PaginatedPosts {
    return new PaginatedPosts(
      dto.data.map((post) => PostMapper.fromApi(post)),
      new PaginationMeta(
        dto.meta.page,
        dto.meta.limit,
        dto.meta.total,
        dto.meta.totalPages,
        dto.meta.hasNextPage,
        dto.meta.hasPrevPage,
      ),
    );
  }
}
