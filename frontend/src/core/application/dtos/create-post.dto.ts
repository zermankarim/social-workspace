import type { CreatePostAttachmentDto } from "@/core/application/dtos/create-post-attachment.dto";

export class CreatePostDto {
  constructor(
    public readonly textContent?: string,
    public readonly attachments?: CreatePostAttachmentDto[],
  ) {}
}
