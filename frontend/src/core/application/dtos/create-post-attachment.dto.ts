export class CreatePostAttachmentDto {
  constructor(
    public readonly url: string,
    public readonly fileName: string,
    public readonly mimeType?: string | null,
    public readonly sizeBytes?: number | null,
  ) {}
}
