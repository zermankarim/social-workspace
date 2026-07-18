export class MessageReaction {
  constructor(
    public readonly id: string,
    public readonly emoji: string,
    public readonly userId: string,
    public readonly createdAt: Date,
  ) {}
}
