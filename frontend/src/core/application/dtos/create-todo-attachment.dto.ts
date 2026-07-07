export class CreateTodoAttachmentDto {
  constructor(
    public readonly url: string,
    public readonly fileName: string,
    public readonly mimeType?: string,
    public readonly sizeBytes?: number,
  ) {}
}
