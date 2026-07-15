export class MessageAttachment {
  constructor(
    public readonly id: string,
    public readonly url: string,
    public readonly ciphertextSize: number | null,
    public readonly createdAt: Date,
  ) {}
}
