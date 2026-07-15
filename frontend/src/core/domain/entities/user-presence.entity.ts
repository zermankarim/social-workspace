export class UserPresence {
  constructor(
    public readonly userId: string,
    public readonly online: boolean,
    public readonly lastSeenAt: Date | null,
  ) {}
}
