import type { CreatePostAttachmentDto } from "@/core/application/dtos/create-post-attachment.dto";

export class UpdateCommentDto {
  constructor(
    public readonly textContent?: string,
    public readonly attachments?: CreatePostAttachmentDto[],
  ) {}
}
