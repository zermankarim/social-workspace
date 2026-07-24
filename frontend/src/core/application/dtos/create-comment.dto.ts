import type { CreatePostAttachmentDto } from "@/core/application/dtos/create-post-attachment.dto";

export class CreateCommentDto {
  constructor(
    public readonly textContent?: string,
    public readonly attachments?: CreatePostAttachmentDto[],
    public readonly parentId?: string,
  ) {}
}
