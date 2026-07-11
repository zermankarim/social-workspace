export class PostAttachment {
  constructor(
    public readonly id: string,
    public readonly url: string,
    public readonly fileName: string,
    public readonly mimeType: string | null,
    public readonly sizeBytes: number | null,
    public readonly createdAt: Date,
  ) {}
}
