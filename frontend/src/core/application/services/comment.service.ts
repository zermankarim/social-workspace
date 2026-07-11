import type { CreateCommentDto } from "@/core/application/dtos/create-comment.dto";
import type { UpdateCommentDto } from "@/core/application/dtos/update-comment.dto";
import type { PaginatedComments } from "@/core/domain/entities/paginated-comments.entity";
import type { PostComment } from "@/core/domain/entities/post-comment.entity";
import type { CommentRepository } from "@/core/domain/repositories/comment.repository";

export class CommentService {
  constructor(private readonly commentRepository: CommentRepository) {}

  getByPost(postId: string, page = 1, limit = 20): Promise<PaginatedComments> {
    return this.commentRepository.findByPost(postId, page, limit);
  }

  create(postId: string, dto: CreateCommentDto): Promise<PostComment> {
    return this.commentRepository.create(postId, dto);
  }

  update(id: string, dto: UpdateCommentDto): Promise<PostComment> {
    return this.commentRepository.update(id, dto);
  }

  delete(id: string): Promise<void> {
    return this.commentRepository.delete(id);
  }
}
