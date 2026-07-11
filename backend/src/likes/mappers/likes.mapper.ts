import { LikeResponseDto } from '../dto/like.dto';
import { LikeSelected } from '../like.select';

export class LikesMapper {
  public static toLikeResponseDto(like: LikeSelected): LikeResponseDto {
    return {
      id: like.id,
      postId: like.postId,
      likeType: like.likeType,
      createdAt: like.createdAt,
      author: like.author,
    };
  }
}
