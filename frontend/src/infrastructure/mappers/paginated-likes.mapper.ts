import { PaginatedLikes } from "@/core/domain/entities/paginated-likes.entity";
import { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";
import type { PaginatedLikesResponseDto } from "@/infrastructure/api/dto/engagement-response.dto";
import { PostMapper } from "@/infrastructure/mappers/post.mapper";

export class PaginatedLikesMapper {
  static fromApi(dto: PaginatedLikesResponseDto): PaginatedLikes {
    return new PaginatedLikes(
      dto.data.map((like) => PostMapper.likeFromApi(like)),
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
