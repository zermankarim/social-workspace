export class Resume {
  constructor(
    public readonly id: string,
    public readonly fileName: string,
    public readonly fileUrl: string,
    public readonly sizeBytes: number,
    public readonly uploadedAt: Date,
  ) {}

  get sizeLabel(): string {
    const kb = this.sizeBytes / 1024;
    if (kb < 1024) return `${Math.round(kb)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  }
}
