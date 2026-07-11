import type { CreatePostDto } from "@/core/application/dtos/create-post.dto";
import type { PostFeedQueryDto } from "@/core/application/dtos/post-feed-query.dto";
import type { PostsByAuthorQueryDto } from "@/core/application/dtos/posts-by-author-query.dto";
import type { UpdatePostDto } from "@/core/application/dtos/update-post.dto";
import type { PaginatedPosts } from "@/core/domain/entities/paginated-posts.entity";
import type { Post } from "@/core/domain/entities/post.entity";
import { PostRepository } from "@/core/domain/repositories/post.repository";
import type {
  CreatePostRequestDto,
  PaginatedPostsResponseDto,
  PostResponseDto,
  UpdatePostRequestDto,
} from "@/infrastructure/api/dto/post-response.dto";
import type { HttpClient } from "@/infrastructure/http/http-client";
import { PaginatedPostsMapper } from "@/infrastructure/mappers/paginated-posts.mapper";
import { PostMapper } from "@/infrastructure/mappers/post.mapper";

export class PostApiRepository extends PostRepository {
  constructor(private readonly httpClient: HttpClient) {
    super();
  }

  async findFeed(query: PostFeedQueryDto): Promise<PaginatedPosts> {
    const params = new URLSearchParams({
      page: String(query.page),
      limit: String(query.limit),
    });

    const response = await this.httpClient.request<PaginatedPostsResponseDto>(
      `/posts?${params.toString()}`,
    );

    return PaginatedPostsMapper.fromApi(response);
  }

  async findByAuthor(query: PostsByAuthorQueryDto): Promise<PaginatedPosts> {
    const params = new URLSearchParams({
      authorId: query.authorId,
      page: String(query.page),
      limit: String(query.limit),
    });

    const response = await this.httpClient.request<PaginatedPostsResponseDto>(
      `/posts/by-author?${params.toString()}`,
    );

    return PaginatedPostsMapper.fromApi(response);
  }

  async findById(id: string): Promise<Post> {
    const response = await this.httpClient.request<PostResponseDto>(
      `/posts/${id}`,
    );
    return PostMapper.fromApi(response);
  }

  async create(dto: CreatePostDto): Promise<Post> {
    const body: CreatePostRequestDto = {
      textContent: dto.textContent,
      attachments: dto.attachments?.map((attachment) => ({
        url: attachment.url,
        fileName: attachment.fileName,
        mimeType: attachment.mimeType,
        sizeBytes: attachment.sizeBytes,
      })),
    };

    const response = await this.httpClient.request<PostResponseDto>("/posts", {
      method: "POST",
      body,
    });

    return PostMapper.fromApi(response);
  }

  async update(id: string, dto: UpdatePostDto): Promise<Post> {
    const body: UpdatePostRequestDto = {
      textContent: dto.textContent,
      attachments: dto.attachments?.map((attachment) => ({
        url: attachment.url,
        fileName: attachment.fileName,
        mimeType: attachment.mimeType,
        sizeBytes: attachment.sizeBytes,
      })),
    };

    const response = await this.httpClient.request<PostResponseDto>(
      `/posts/${id}`,
      {
        method: "PATCH",
        body,
      },
    );

    return PostMapper.fromApi(response);
  }

  async delete(id: string): Promise<void> {
    await this.httpClient.request<void>(`/posts/${id}`, {
      method: "DELETE",
    });
  }
}
