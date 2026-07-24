import type { CreatePostAttachmentDto } from "@/core/application/dtos/create-post-attachment.dto";
import type { PostStatus } from "@/core/domain/enums/post-status.enum";

export class UpdatePostDto {
  constructor(
    public readonly textContent?: string,
    public readonly attachments?: CreatePostAttachmentDto[],
    public readonly status?: PostStatus,
    public readonly scheduledFor?: string,
  ) {}
}
