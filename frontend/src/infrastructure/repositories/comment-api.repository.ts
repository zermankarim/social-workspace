import type { CreateCommentDto } from "@/core/application/dtos/create-comment.dto";
import type { UpdateCommentDto } from "@/core/application/dtos/update-comment.dto";
import type { PaginatedComments } from "@/core/domain/entities/paginated-comments.entity";
import type { PostComment } from "@/core/domain/entities/post-comment.entity";
import { CommentRepository } from "@/core/domain/repositories/comment.repository";
import type {
  CommentResponseDto,
  CreateCommentRequestDto,
  PaginatedCommentsResponseDto,
  UpdateCommentRequestDto,
} from "@/infrastructure/api/dto/engagement-response.dto";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { PaginatedCommentsMapper } from "@/infrastructure/mappers/paginated-comments.mapper";
import { PostMapper } from "@/infrastructure/mappers/post.mapper";

export class CommentApiRepository extends CommentRepository {
  constructor(private readonly httpClient: HttpClient) {
    super();
  }

  async findByPost(
    postId: string,
    page = 1,
    limit = 20,
  ): Promise<PaginatedComments> {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    const response =
      await this.httpClient.request<PaginatedCommentsResponseDto>(
        `/posts/${postId}/comments?${params.toString()}`,
      );
    return PaginatedCommentsMapper.fromApi(response);
  }

  async create(postId: string, dto: CreateCommentDto): Promise<PostComment> {
    const body: CreateCommentRequestDto = {
      textContent: dto.textContent,
      attachments: dto.attachments?.map((attachment) => ({
        url: attachment.url,
        fileName: attachment.fileName,
        mimeType: attachment.mimeType,
        sizeBytes: attachment.sizeBytes,
      })),
      parentId: dto.parentId,
    };
    const response = await this.httpClient.request<CommentResponseDto>(
      `/posts/${postId}/comments`,
      { method: "POST", body },
    );
    return PostMapper.commentFromApi(response);
  }

  async update(id: string, dto: UpdateCommentDto): Promise<PostComment> {
    const body: UpdateCommentRequestDto = {
      textContent: dto.textContent,
      attachments: dto.attachments?.map((attachment) => ({
        url: attachment.url,
        fileName: attachment.fileName,
        mimeType: attachment.mimeType,
        sizeBytes: attachment.sizeBytes,
      })),
    };
    const response = await this.httpClient.request<CommentResponseDto>(
      `/comments/${id}`,
      { method: "PATCH", body },
    );
    return PostMapper.commentFromApi(response);
  }

  async delete(id: string): Promise<void> {
    await this.httpClient.request<void>(`/comments/${id}`, {
      method: "DELETE",
    });
  }
}
