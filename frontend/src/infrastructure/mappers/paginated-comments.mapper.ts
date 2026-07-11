import { PaginatedComments } from "@/core/domain/entities/paginated-comments.entity";
import { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";
import type { PaginatedCommentsResponseDto } from "@/infrastructure/api/dto/engagement-response.dto";
import { PostMapper } from "@/infrastructure/mappers/post.mapper";

export class PaginatedCommentsMapper {
  static fromApi(dto: PaginatedCommentsResponseDto): PaginatedComments {
    return new PaginatedComments(
      dto.data.map((comment) => PostMapper.commentFromApi(comment)),
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
