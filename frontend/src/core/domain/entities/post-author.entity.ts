import { ProfileRole } from "@/core/domain/enums/profile-role.enum";

export class PostAuthor {
  constructor(
    public readonly id: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly avatarUrl: string | null,
    public readonly bio: string | null,
    public readonly role: ProfileRole,
  ) {}

  get displayName(): string {
    return `${this.firstName} ${this.lastName}`.trim();
  }

  get initials(): string {
    const fromName = `${this.firstName[0] ?? ""}${this.lastName[0] ?? ""}`;
    return fromName.trim().toUpperCase() || "?";
  }

  isAdmin(): boolean {
    return this.role === ProfileRole.ADMIN;
  }
}
