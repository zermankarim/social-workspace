export class ConnectionUser {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly headline: string | null,
    public readonly avatarUrl: string | null,
  ) {}

  get displayName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  get initials(): string {
    const fromName = `${this.firstName[0] ?? ""}${this.lastName[0] ?? ""}`;
    return fromName.trim().toUpperCase() || "?";
  }
}
