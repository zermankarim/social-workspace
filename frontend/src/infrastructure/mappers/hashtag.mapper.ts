import { Hashtag } from "@/core/domain/entities/hashtag.entity";
import { PaginatedHashtags } from "@/core/domain/entities/paginated-hashtags.entity";
import { PaginationMeta } from "@/core/domain/entities/pagination-meta.entity";
import type {
  HashtagResponseDto,
  PaginatedHashtagsResponseDto,
} from "@/infrastructure/api/dto/hashtag-response.dto";

export class HashtagMapper {
  static fromApi(dto: HashtagResponseDto): Hashtag {
    return new Hashtag(dto.id, dto.tag, dto.postsCount);
  }

  static paginatedFromApi(
    dto: PaginatedHashtagsResponseDto,
  ): PaginatedHashtags {
    return new PaginatedHashtags(
      dto.data.map((item) => HashtagMapper.fromApi(item)),
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
