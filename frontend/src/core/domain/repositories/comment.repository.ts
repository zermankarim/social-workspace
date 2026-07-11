import type { CreateCommentDto } from "@/core/application/dtos/create-comment.dto";
import type { UpdateCommentDto } from "@/core/application/dtos/update-comment.dto";
import type { PaginatedComments } from "@/core/domain/entities/paginated-comments.entity";
import type { PostComment } from "@/core/domain/entities/post-comment.entity";

export abstract class CommentRepository {
  abstract findByPost(
    postId: string,
    page?: number,
    limit?: number,
  ): Promise<PaginatedComments>;
  abstract create(postId: string, dto: CreateCommentDto): Promise<PostComment>;
  abstract update(id: string, dto: UpdateCommentDto): Promise<PostComment>;
  abstract delete(id: string): Promise<void>;
}
